"""Enerji → Öğren: learning a device's real power with a plug that measures, moved from device to device.

LightLearn  runs inside Home Assistant (the tablet may be closed): standby, a short probe (white, red, green, blue
            at 100%) that sets the plan, then every white tone and color at every brightness step, then each of the
            light's own effects (averaged over a while, they keep changing) and a brightness curve for effects from three
            of them. Each step waits until the plug's reading settles. The light goes back to how it was at the end,
            on pause and on cancel. The effect part can be skipped; what was measured is kept.
StateLearn  listens: the plug's watts and the device's state together, a time-weighted average per state.
AvgLearn    an always-on device (fridge, router): only the start is kept (across restarts); the average comes from
            Home Assistant's own records of the plug.
A light run is saved after every step (the plan, what was measured, the next step) and goes on after a restart
from where it was: standby and the probe are not repeated.
None writes the device record: the admin page saves the result. A plug serves one run at a time. Lights on the
same bridge or MQTT can learn at once: a step sends a command every few seconds, and each light has its own plug.
"""
from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from homeassistant.util import dt as dt_util

from . import estimates as EST
from . import lut as LUT

_LOGGER = logging.getLogger(__name__)
MAX_LIGHT_RUNS = 3      # lights measured at once (each sends a command every few seconds)
MAX_EFFECTS = 150
FX_CURVE = [75, 50, 25, 10]
NO_FX = ("", "none", "None", "off", "Off", "solid", "Solid")
ACTIVE = ("start", "standby", "probe", "run", "fx", "paused", "listen")
SETTLE_PCT = 0.03       # three readings within 3% (or 0.15 W) count as settled
SETTLE_ABS = 0.15


class _Base:
    kind = ""

    def __init__(self, hass: HomeAssistant, rid: str, entity: str, plug: str) -> None:
        self.hass, self.id, self.entity, self.plug = hass, rid, entity, plug
        self.phase = "start"
        self.msg = ""
        self.started = time.time()

    def status(self) -> dict:
        return {"id": self.id, "kind": self.kind, "entity": self.entity, "plug": self.plug, "phase": self.phase, "msg": self.msg, "started": self.started}


class LightLearn(_Base):
    kind = "light"
    first_wait: float | None = None   # timing (tests make it short)
    quiet: float | None = None
    poll = 0.5
    fx_window: float | None = None    # seconds an effect is listened to (default: 30 s or 6 plug readings)
    ready_wait = 5.0    # after a restart: seconds to let the light settle once it answers
    ready_poll = 1.0
    late_wait = 10.0    # a light that looks off after a step: look again after this

    def __init__(self, hass: HomeAssistant, rid: str, entity: str, plug: str, interval: float = 2.0) -> None:
        super().__init__(hass, rid, entity, plug)
        self.interval = max(0.5, min(60.0, float(interval or 2.0)))
        self.prev: dict | None = None
        self.steps: list[dict] = []
        self.i = 0
        self.cur: dict | None = None
        self.last_w: float | None = None
        self.standby: float | None = None
        self.probe: list[dict] = []
        self.plan: dict = {}
        self.res: dict = {}
        self.repeats = 0
        self.settle_s: list[float] = []
        self._go = asyncio.Event()
        self._go.set()
        self._task: asyncio.Task | None = None
        self.result: dict | None = None
        self._pauses = 0
        self.fx_names: list[str] = []
        self.skip_fx = False
        self.bridge: str | None = None
        self.on_step = None   # called after every step (the run is saved)
        self.resumed = False
        self.started_steps = 0
        self.t_steps = 0.0   # seconds spent on measured steps since start/resume (for the time left)

    # ---- control ----
    def start(self) -> None:
        self._task = self.hass.async_create_background_task(self._run(), f"lhd_learn_{self.id}")

    async def pause(self) -> None:
        if self.phase in ("run", "probe", "standby", "fx"):
            self._pauses += 1
            self._go.clear()
            self.phase_before = self.phase
            self.phase = "paused"
            self.msg = "paused"
            await self._restore()

    def resume(self) -> None:
        if self.phase == "paused":
            self.phase = getattr(self, "phase_before", "run")
            self.msg = ""
            self._go.set()

    async def cancel(self) -> None:
        if self._task and not self._task.done():
            self._task.cancel()
        self.phase = "stopped"
        await self._restore()

    def status(self) -> dict:
        st = super().status()
        n = len(self.steps) + (len(FX_CURVE) * 3 if self.fx_names and not any(q["t"] == "fxb" for q in self.steps) and not self.skip_fx else 0)
        left = n - self.i
        fxw = self._fxw()
        eta = sum((fxw + 3) if q["t"] in ("fx", "fxb") else (self.interval * 3 + 2) for q in self.steps[self.i:]) + (n - len(self.steps)) * (fxw + 3)
        # kalan süre: ölçülen adımların gerçek ortalamasıyla (yeterince adım varsa), renkler ve efektler ayrı
        rest = self.steps[self.i:]
        n_col = sum(1 for q in rest if q["t"] not in ("fx", "fxb"))
        n_fx = sum(1 for q in rest if q["t"] in ("fx", "fxb")) + (n - len(self.steps))
        done = self.i - self.started_steps
        per = self.t_steps / done if done >= 5 and self.t_steps > 0 else None
        eta_col = n_col * (per if per and self.phase != "fx" else self.interval * 3 + 2)
        eta_fx = n_fx * (fxw + 3)
        st.update(i=self.i, n=n, cur=self.cur, w=self.last_w, standby=self.standby, probe=self.probe, plan=self.plan, res=self.res,
                  repeats=self.repeats, eta=round(eta_col + eta_fx if left > 0 else 0), eta_col=round(eta_col), eta_fx=round(eta_fx), n_col=n_col, n_fx=n_fx,
                  every=self._interval_seen(), resumed=self.resumed, result=self.result, fx_n=len(self.fx_names), skip_fx=self.skip_fx)
        return st

    # ---- saved form (goes on after a restart) ----
    KEEP = ("interval", "prev", "steps", "i", "standby", "probe", "plan", "res", "repeats", "settle_s", "fx_names", "skip_fx", "bridge", "started")

    def to_dict(self) -> dict:
        d = {k: getattr(self, k) for k in self.KEEP}
        d.update(kind="light", entity=self.entity, plug=self.plug)
        return d

    @classmethod
    def from_dict(cls, hass: HomeAssistant, rid: str, d: dict) -> "LightLearn":
        r = cls(hass, rid, str(d.get("entity") or ""), str(d.get("plug") or ""), float(d.get("interval") or 2.0))
        for k in cls.KEEP:
            if k in d and k != "interval":
                setattr(r, k, d[k])
        r.res = r.res or {}
        r.resumed = bool(r.steps)
        return r

    def _interval_seen(self) -> float | None:
        """How often the plug sends a new reading (from the settle times), shown on the page."""
        v = [x for x in self.settle_s[-20:] if x > 0]
        return round(sorted(v)[len(v) // 2] / 3, 1) if v else None

    # ---- light and plug ----
    def _attrs(self) -> dict:
        st = self.hass.states.get(self.entity)
        return dict(st.attributes) if st else {}

    async def _light(self, on: bool, **data: Any) -> None:
        await self._go.wait()
        svc = "turn_on" if on else "turn_off"
        await self.hass.services.async_call("light", svc, {"entity_id": self.entity, **data}, blocking=True, context=Context())

    def _reading(self) -> tuple[float | None, Any]:
        st = self.hass.states.get(self.plug)
        if st is None:
            return None, None
        return EST.watts_of(st), getattr(st, "last_reported", None) or st.last_updated

    async def _settle(self) -> float:
        """Wait until the plug's watts settle after a change and return them."""
        await asyncio.sleep(self.first_wait if self.first_wait is not None else min(3.0, 1.0 + self.interval / 2))
        t0 = time.monotonic()
        vals: list[float] = []
        seen = None
        last_new = t0
        quiet = self.quiet if self.quiet is not None else max(8.0, self.interval * 3)
        limit = max(quiet * 2, max(60.0, self.interval * 8) if self.quiet is None else quiet * 4)
        while True:
            await self._go.wait()
            w, ts = self._reading()
            now = time.monotonic()
            if w is not None and ts != seen:
                seen = ts
                if not vals or abs(w - vals[-1]) > 1e-9:
                    last_new = now
                vals.append(w)
            if len(vals) >= 3:
                tail = vals[-3:]
                m = sum(tail) / 3
                if max(tail) - min(tail) <= max(SETTLE_ABS, m * SETTLE_PCT):
                    self.settle_s.append(now - t0)
                    return round(sorted(tail)[1], 2)
            if vals and now - last_new >= quiet:     # a plug that only reports changes: the same value for long
                self.settle_s.append(now - t0)
                return round(vals[-1], 2)
            if now - t0 >= limit:
                self.repeats += 1
                if vals:
                    return round(vals[-1], 2)
                raise RuntimeError("plug_silent")
            await asyncio.sleep(self.poll)

    def _fxw(self) -> float:
        return self.fx_window if self.fx_window is not None else max(30.0, self.interval * 6)

    async def _average(self, seconds: float) -> float:
        """Time-weighted average of the plug over a while (effects keep changing)."""
        await asyncio.sleep(self.first_wait if self.first_wait is not None else min(3.0, 1.0 + self.interval / 2))
        t_end = time.monotonic() + seconds
        acc = tim = 0.0
        last_t, last_w = time.monotonic(), self._reading()[0]
        while time.monotonic() < t_end:
            await self._go.wait()
            await asyncio.sleep(self.poll)
            now = time.monotonic()
            if last_w is not None:
                acc += last_w * (now - last_t)
                tim += now - last_t
            last_t, last_w = now, self._reading()[0]
        if tim <= 0:
            raise RuntimeError("plug_silent")
        return round(acc / tim, 2)

    async def _restore(self) -> None:
        p = self.prev
        if not p:
            return
        try:
            if p["state"] != "on":
                await self.hass.services.async_call("light", "turn_off", {"entity_id": self.entity}, blocking=True)
                return
            data: dict = {"entity_id": self.entity}
            if p.get("brightness") is not None:
                data["brightness"] = p["brightness"]
            if p.get("effect") not in (None, "", "None", "off"):
                data["effect"] = p["effect"]
            elif p.get("color_mode") == "color_temp" and p.get("color_temp_kelvin"):
                data["color_temp_kelvin"] = p["color_temp_kelvin"]
            elif p.get("color_mode") in LUT.HS_MODES and p.get("hs_color"):
                data["hs_color"] = p["hs_color"]
            await self.hass.services.async_call("light", "turn_on", data, blocking=True)
        except Exception as err:  # noqa: BLE001 - the light may be gone; nothing else to do
            _LOGGER.debug("Light %s could not be restored: %s", self.entity, err)

    # ---- the run ----
    def _make_plan(self, diff: float) -> None:
        a = self._attrs()
        modes = set(a.get("supported_color_modes") or [])
        plan: dict = {"b": LUT.BRI}
        if "color_temp" in modes:
            lo = int(a.get("min_color_temp_kelvin") or 2200)
            hi = int(a.get("max_color_temp_kelvin") or 6500)
            ks = sorted({max(lo, min(hi, k)) for k in LUT.KS} | {lo, hi})
            plan["k"] = ks if len(ks) <= 7 else [ks[0]] + ks[1:-1:max(1, (len(ks) - 2) // 5)][:5] + [ks[-1]]
        if modes & set(LUT.HS_MODES):
            plan["h"] = LUT.HUES if diff >= 0.10 else LUT.HUES6     # colors that change the power a lot: a finer grid
            plan["s"] = LUT.SATS if diff >= 0.10 else [100]
        if "k" not in plan and "h" not in plan:
            plan["br"] = True
        self.fx_names = [str(e)[:60] for e in (a.get("effect_list") or []) if str(e) not in NO_FX][:MAX_EFFECTS]
        if self.fx_names:
            plan["fx"] = len(self.fx_names)
        self.plan = plan
        steps = []
        for k in plan.get("k", []):
            steps += [{"t": "ct", "k": k, "b": b} for b in LUT.BRI]
        for s in plan.get("s", []):
            for h in plan.get("h", []):
                steps += [{"t": "hs", "h": h, "s": s, "b": b} for b in LUT.BRI]
        if plan.get("br"):
            steps += [{"t": "br", "b": b} for b in LUT.BRI]
        steps += [{"t": "fx", "e": e, "b": 100} for e in self.fx_names]
        self.steps = steps
        if self.fx_names:
            self.res["fxl"] = {}
            self.res["fxc"] = {}
        if "k" in plan:
            self.res["ct"] = {"k": plan["k"], "b": LUT.BRI, "w": [[None] * len(LUT.BRI) for _ in plan["k"]]}
        if "h" in plan:
            self.res["hs"] = {"h": plan["h"], "s": plan["s"], "b": LUT.BRI, "w": [[[None] * len(LUT.BRI) for _ in plan["h"]] for _ in plan["s"]]}
        if plan.get("br"):
            self.res["br"] = {"b": LUT.BRI, "w": [None] * len(LUT.BRI)}

    def _put(self, q: dict, w: float) -> None:
        if q["t"] == "fx":
            self.res["fxl"][q["e"]] = w
            return
        if q["t"] == "fxb":
            self.res["fxc"].setdefault(q["e"], {})[str(q["b"])] = w
            return
        bi = LUT.BRI.index(q["b"])
        if q["t"] == "ct":
            self.res["ct"]["w"][self.plan["k"].index(q["k"])][bi] = w
        elif q["t"] == "hs":
            self.res["hs"]["w"][self.plan["s"].index(q["s"])][self.plan["h"].index(q["h"])][bi] = w
        else:
            self.res["br"]["w"][bi] = w

    async def _step(self, q: dict) -> float:
        data: dict = {"brightness_pct": q["b"]}
        if q["t"] == "ct":
            data["color_temp_kelvin"] = q["k"]
        elif q["t"] == "hs":
            data["hs_color"] = [q["h"], q["s"]]
        elif q["t"] in ("fx", "fxb"):
            data["effect"] = q["e"]
        p0 = self._pauses
        await self._light(True, **data)
        w = await (self._average(self._fxw()) if q["t"] in ("fx", "fxb") else self._settle())
        if self._pauses != p0:   # paused in between: the light was put back, measure this step again
            return await self._step(q)
        st = self.hass.states.get(self.entity)
        if st is None or st.state != "on":   # turned off from elsewhere: stop and ask
            self.msg = "external"
            raise RuntimeError("external")
        return w

    def _ready(self) -> bool:
        """The light answers (not unavailable) and the plug sends a number."""
        st = self.hass.states.get(self.entity)
        return st is not None and st.state not in ("unavailable", "unknown") and EST.watts_of(self.hass.states.get(self.plug)) is not None

    async def _wait_ready(self, secs: int = 600) -> bool:
        """After a restart the light and the plug come up later (a light behind a bridge or MQTT can take minutes).
        A restored state of "unavailable" does not count as up."""
        for _ in range(int(secs / self.ready_poll)):
            if self._ready():
                await asyncio.sleep(self.ready_wait)   # let the light settle before the first step
                return self._ready()
            await asyncio.sleep(self.ready_poll)
        return False

    async def _step_safe(self, q: dict) -> float:
        """A step that rides out a short outage: the light or plug dropping away, or a light that reports late.
        Tried up to three times; only then the run stops (and can go on from this step later)."""
        for n in range(3):
            try:
                return await self._step(q)
            except asyncio.CancelledError:
                raise
            except Exception:  # noqa: BLE001 - retried below
                if n == 2:
                    raise
                if self.msg == "external":
                    # turned off from elsewhere, or the light reported "on" late: look again in a moment
                    await asyncio.sleep(self.late_wait)
                    st = self.hass.states.get(self.entity)
                    if st is not None and st.state == "off" and self._ready():
                        raise
                    self.msg = ""
                if not await self._wait_ready(600):
                    raise
        raise RuntimeError("step")

    async def _run(self) -> None:
        if self.resumed and not await self._wait_ready():
            self.phase, self.msg = "error", "no_light"
            return
        st = self.hass.states.get(self.entity)
        if st is None:
            self.phase, self.msg = "error", "no_light"
            return
        a = dict(st.attributes)
        if self.resumed:
            await self._loop()
            return
        self.prev = {"state": st.state, "brightness": a.get("brightness"), "color_mode": a.get("color_mode"), "color_temp_kelvin": a.get("color_temp_kelvin"),
                     "hs_color": list(a.get("hs_color")) if a.get("hs_color") else None, "effect": a.get("effect")}
        try:
            self.phase = "standby"
            await self._light(False)
            self.standby = await self._settle()
            self.last_w = self.standby
            self.phase = "probe"
            modes = set(a.get("supported_color_modes") or [])
            probe = [("white", {"color_temp_kelvin": 4000} if "color_temp" in modes else {})]
            if modes & set(LUT.HS_MODES):
                probe += [("red", {"hs_color": [0, 100]}), ("green", {"hs_color": [120, 100]}), ("blue", {"hs_color": [240, 100]})]
            for name, extra in probe:
                self.cur = {"t": "probe", "c": name}
                await self._light(True, brightness_pct=100, **extra)
                w = await self._settle()
                self.last_w = w
                self.probe.append({"c": name, "w": w})
            ws = [p["w"] for p in self.probe]
            diff = (max(ws) - min(ws)) / max(ws) if ws and max(ws) > 0 else 0.0
            self._make_plan(diff)
            self.plan["diff"] = round(diff, 3)
        except asyncio.CancelledError:
            self.phase = "stopped"
            await self._restore()
            raise
        except Exception as err:  # noqa: BLE001 - shown on the page; the light goes back
            self.phase = "error"
            self.msg = self.msg or str(err)[:80]
            _LOGGER.info("Learning %s stopped: %s", self.entity, err)
            await self._restore()
            return
        if self.on_step:
            self.on_step()
        await self._loop()

    async def _loop(self) -> None:
        """Every step of the plan from self.i on (also after a restart)."""
        self.started_steps = self.i
        try:
            self.phase = "run"
            while self.i < len(self.steps):
                q = self.steps[self.i]
                if q["t"] in ("fx", "fxb"):
                    if self.skip_fx:
                        break
                    self.phase = "fx"
                self.cur = q
                t0 = time.monotonic()
                w = await self._step_safe(q)
                if q["t"] not in ("fx", "fxb"):
                    self.t_steps += time.monotonic() - t0
                self.last_w = w
                self._put(q, w)
                self.i += 1
                if self.on_step:
                    self.on_step()
                if self.i == len(self.steps) and self.res.get("fxl") and not any(x["t"] == "fxb" for x in self.steps) and not self.skip_fx:
                    # brightness curve of effects: the strongest, the weakest and the middle one at 75 / 50 / 25 / 10%
                    order = sorted(self.res["fxl"], key=lambda e: self.res["fxl"][e])
                    pick = list(dict.fromkeys([order[-1], order[0], order[len(order) // 2]]))
                    self.steps += [{"t": "fxb", "e": e, "b": b} for e in pick for b in FX_CURVE]
            table = {k: v for k, v in self.res.items() if k in ("ct", "hs", "br")}
            fx = self._fx_table()
            if fx:
                table["fx"] = fx
            tb = LUT.valid_lut(table)
            lo, hi = LUT.span(tb)
            self.result = {"lut": tb, "standby": self.standby, "min": round(lo, 2), "max": round(hi, 2), "n": LUT.count(tb),
                           "settle": round(sum(self.settle_s) / len(self.settle_s), 1) if self.settle_s else None, "repeats": self.repeats}
            self.phase = "done"
            self.cur = None
        except asyncio.CancelledError:
            self.phase = "stopped"
            raise
        except Exception as err:  # noqa: BLE001 - shown on the page; the light goes back
            self.phase = "error"
            self.msg = self.msg or str(err)[:80]
            _LOGGER.info("Learning %s stopped: %s", self.entity, err)
        finally:
            if self.phase != "paused":
                await self._restore()
            if self.on_step and self.phase in ("done", "error"):
                self.on_step()   # bitti: kayıttan düşer


    def _fx_table(self) -> dict | None:
        e = dict(self.res.get("fxl") or {})
        if not e:
            return None
        out: dict = {"e": e, "avg": round(sum(e.values()) / len(e), 2)}
        curves = self.res.get("fxc") or {}
        rows = []
        for name, pts in curves.items():
            top = e.get(name)
            if top and top > 0 and all(str(b) in pts for b in FX_CURVE):
                rows.append({b: pts[str(b)] / top for b in FX_CURVE})
        if rows:
            med = lambda v: sorted(v)[len(v) // 2]  # noqa: E731
            out["b"] = [float(b) for b in sorted(FX_CURVE)] + [100.0]
            out["r"] = [round(min(5.0, med([r[b] for r in rows])), 3) for b in sorted(FX_CURVE)] + [1.0]
        return out


class StateLearn(_Base):
    kind = "states"

    def __init__(self, hass: HomeAssistant, rid: str, entity: str, plug: str) -> None:
        super().__init__(hass, rid, entity, plug)
        self.acc: dict[str, list[float]] = {}   # state → [seconds, watt-seconds]
        self._t: float | None = None
        self._state: str | None = None
        self._w: float | None = None
        self._unsubs: list = []

    def start(self) -> None:
        self.phase = "run"
        self._read()
        self._t = time.monotonic()
        self._unsubs.append(async_track_state_change_event(self.hass, [self.entity, self.plug], self._changed))
        from datetime import timedelta
        self._unsubs.append(async_track_time_interval(self.hass, lambda _n: self._tick(), timedelta(seconds=10)))

    def _read(self) -> None:
        st = self.hass.states.get(self.entity)
        self._state = st.state if st else None
        self._w = EST.watts_of(self.hass.states.get(self.plug))

    @callback
    def _tick(self) -> None:
        now = time.monotonic()
        if self._t is not None and self._state and self._state not in ("unavailable", "unknown") and self._w is not None:
            dt = now - self._t
            a = self.acc.setdefault(self._state, [0.0, 0.0])
            a[0] += dt
            a[1] += max(0.0, self._w) * dt
        self._t = now

    @callback
    def _changed(self, _event) -> None:
        self._tick()
        self._read()

    async def cancel(self) -> None:
        self.stop()
        self.phase = "stopped"

    def stop(self) -> None:
        if self.phase == "run":
            self._tick()
        for u in self._unsubs:
            u()
        self._unsubs = []
        if self.phase == "run":
            self.phase = "done"

    async def pause(self) -> None:
        return None

    def resume(self) -> None:
        return None

    def status(self) -> dict:
        st = super().status()
        st.update(cur=self._state, w=self._w, states={k: {"sec": round(v[0]), "avg": round(v[1] / v[0], 2) if v[0] > 0 else None} for k, v in self.acc.items()},
                  sec=round(sum(v[0] for v in self.acc.values())))
        return st


class AvgLearn(_Base):
    """An always-on device: the average of the plug since the start, from Home Assistant's records."""
    kind = "avg"

    def __init__(self, hass: HomeAssistant, rid: str, entity: str, plug: str, started: float | None = None) -> None:
        super().__init__(hass, rid, entity, plug)
        if started:
            self.started = started
        self.phase = "listen"
        self._cache: tuple[float, dict] | None = None

    def start(self) -> None:
        return None

    async def pause(self) -> None:
        return None

    def resume(self) -> None:
        return None

    async def cancel(self) -> None:
        self.phase = "stopped"

    def stop(self) -> None:
        self.phase = "done"

    async def async_stats(self) -> dict:
        if self._cache and time.time() - self._cache[0] < 60:
            return self._cache[1]
        out = await average_since(self.hass, self.plug, self.started)
        self._cache = (time.time(), out)
        return out

    def status(self) -> dict:
        st = super().status()
        st.update((self._cache[1] if self._cache else {}), w=EST.watts_of(self.hass.states.get(self.plug)), sec=round(time.time() - self.started))
        return st


async def average_since(hass: HomeAssistant, plug: str, started: float) -> dict:
    """{avg, hours, kwh, avg24, days: [{d, avg}], settled} of a power sensor since a moment (5-minute statistics,
    or its history when it keeps none)."""
    start = dt_util.utc_from_timestamp(started)
    means: list[tuple[float, float, float]] = []   # (start ts, W, seconds)
    try:
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import statistics_during_period
        rows = await get_instance(hass).async_add_executor_job(statistics_during_period, hass, start, None, {plug}, "5minute", {"power": "W"}, {"mean"})
        for r in rows.get(plug) or []:
            if r.get("mean") is not None:
                t = r["start"] if isinstance(r["start"], (int, float)) else r["start"].timestamp()
                means.append((float(t), float(r["mean"]), 300.0))
    except Exception as err:  # noqa: BLE001 - no recorder or no statistics: the history below
        _LOGGER.debug("No statistics for %s: %s", plug, err)
    if not means:
        try:
            from homeassistant.components.recorder import get_instance
            from homeassistant.components.recorder.history import state_changes_during_period
            hist = await get_instance(hass).async_add_executor_job(state_changes_during_period, hass, start, None, plug, False, False, None, True)
            pts = [(s.last_updated.timestamp(), EST.watts_of(s)) for s in hist.get(plug, [])]
            pts = [(t, w) for t, w in pts if w is not None]
            now = time.time()
            for i, (t, w) in enumerate(pts):   # time-weighted, cut into 5-minute pieces
                t_end = pts[i + 1][0] if i + 1 < len(pts) else now
                x = max(t, started)
                while x < t_end:
                    y = min(t_end, x + 300)
                    means.append((x, w, y - x))
                    x = y
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("No history for %s: %s", plug, err)
    if not means:
        return {"avg": None, "hours": 0, "kwh": 0, "avg24": None, "days": [], "settled": False}
    def wavg(rows):
        sec = sum(d for _t, _w, d in rows)
        return (sum(w * d for _t, w, d in rows) / sec) if sec > 0 else None
    sec_all = sum(d for _t, _w, d in means)
    if sec_all <= 0:
        return {"avg": None, "hours": 0, "kwh": 0, "avg24": None, "days": [], "settled": False}
    hours = sec_all / 3600
    avg = wavg(means)
    now = time.time()
    avg24 = wavg([m for m in means if m[0] >= now - 86400])
    days: dict[str, list] = {}
    for m in means:
        days.setdefault(dt_util.as_local(dt_util.utc_from_timestamp(m[0])).date().isoformat(), []).append(m)
    settled = bool(hours >= 24 and avg24 is not None and avg > 0 and abs(avg24 - avg) / avg <= 0.03)
    return {"avg": round(avg, 2), "hours": round(hours, 1), "kwh": round(avg * hours / 1000, 3), "avg24": round(avg24, 2) if avg24 is not None else None,
            "days": [{"d": d, "avg": round(wavg(v) or 0, 2)} for d, v in sorted(days.items())][-14:], "settled": settled}


class Learning:
    """The runs of this Home Assistant (by device id). Long averages are kept across restarts (save)."""

    def __init__(self, hass: HomeAssistant, saved: dict | None = None, save=None) -> None:
        self.hass = hass
        self.runs: dict[str, _Base] = {}
        self._save = save
        self._resume: list[LightLearn] = []
        for rid, v in (saved or {}).items():
            if not isinstance(v, dict) or not v.get("plug"):
                continue
            if v.get("kind") == "light":   # a light run cut by a restart goes on (started once Home Assistant is up)
                try:
                    r = LightLearn.from_dict(hass, rid, v)
                except (TypeError, ValueError):
                    continue
                r.on_step = self._persist
                r.phase = "start"
                self.runs[rid] = r
                self._resume.append(r)
            else:
                self.runs[rid] = AvgLearn(hass, rid, str(v.get("entity") or ""), str(v["plug"]), float(v.get("started") or time.time()))

    def resume_saved(self) -> None:
        """Start the light runs that were cut by a restart."""
        for r in self._resume:
            r.start()
        self._resume = []

    def _persist(self) -> None:
        if self._save:
            out = {k: {"plug": r.plug, "entity": r.entity, "started": r.started} for k, r in self.runs.items() if isinstance(r, AvgLearn) and r.phase == "listen"}
            # a light run with steps left is kept also when it stopped or failed: it goes on from that step (after a restart, or with "go on")
            out.update({k: r.to_dict() for k, r in self.runs.items() if isinstance(r, LightLearn) and r.steps and r.i < len(r.steps) and r.phase in ACTIVE + ("error", "stopped")})
            self._save(out)

    def _bridge(self, entity: str) -> str | None:
        e = er.async_get(self.hass).async_get(entity)
        return e.config_entry_id if e else None

    def start(self, rid: str, kind: str, entity: str, plug: str, interval: float = 2.0) -> _Base:
        old = self.runs.get(rid)
        if old is not None and old.phase in ACTIVE:
            raise ValueError("busy")
        if self.hass.states.get(plug) is None or EST.watts_of(self.hass.states.get(plug)) is None:
            raise ValueError("plug")
        for k, r in self.runs.items():   # a plug measures one device at a time
            if k != rid and r.plug == plug and r.phase in ACTIVE:
                raise ValueError("plug_busy")
        if kind != "avg" and self.hass.states.get(entity) is None:
            raise ValueError("entity")
        if kind == "light":
            if not entity.startswith("light."):
                raise ValueError("entity")
            lights = [r for r in self.runs.values() if isinstance(r, LightLearn) and r.phase in ACTIVE]
            if len(lights) >= MAX_LIGHT_RUNS:
                raise ValueError("too_many")
            run: _Base = LightLearn(self.hass, rid, entity, plug, interval)
            run.bridge = self._bridge(entity)
            run.on_step = self._persist
        elif kind == "avg":
            run = AvgLearn(self.hass, rid, entity, plug)
        else:
            run = StateLearn(self.hass, rid, entity, plug)
        self.runs[rid] = run
        run.start()
        self._persist()
        return run

    async def control(self, rid: str, action: str) -> None:
        r = self.runs.get(rid)
        if r is None:
            raise ValueError("unknown")
        if action == "pause":
            await r.pause()
        elif action == "resume":
            r.resume()
        elif action == "skipfx" and isinstance(r, LightLearn):
            r.skip_fx = True
        elif action == "continue" and isinstance(r, LightLearn):
            # a stopped or failed light run goes on from the step it was at
            if r.phase in ACTIVE:
                raise ValueError("busy")
            if not r.steps or r.i >= len(r.steps):
                raise ValueError("nothing")
            r.resumed = True
            r.msg = ""
            r.phase = "start"
            r.on_step = self._persist
            r.start()
        elif action == "cancel":
            await r.cancel()
            self.runs.pop(rid, None)
        elif action == "stop" and isinstance(r, (StateLearn, AvgLearn)):
            if isinstance(r, AvgLearn):
                await r.async_stats()
            r.stop()
        elif action == "clear":
            if r.phase in ACTIVE:
                await r.cancel()
            self.runs.pop(rid, None)
        self._persist()

    def status(self) -> dict:
        return {k: r.status() for k, r in self.runs.items()}

    async def async_status(self) -> dict:
        for r in self.runs.values():
            if isinstance(r, AvgLearn) and r.phase == "listen":
                try:
                    await r.async_stats()
                except Exception as err:  # noqa: BLE001
                    _LOGGER.debug("Average of %s failed: %s", r.plug, err)
        return self.status()

    async def async_stop(self) -> None:
        for r in list(self.runs.values()):
            if isinstance(r, AvgLearn):
                continue   # kept: it goes on after a restart
            try:
                await r.cancel()
            except Exception:  # noqa: BLE001
                pass
