"""Category kWh (CategoryEnergySensor._changed): a member counter that drops for a few readings and comes back is not
counted twice; a real reset (the device starts again from 0) is counted in full; the total never goes back."""
import pytest

DOMAIN = "lemur_home_dashboard"
U = {"unit_of_measurement": "kWh"}


async def _cat(hass, hass_ws_client, start="30.0"):
    ws = await hass_ws_client(hass)
    hass.states.async_set("sensor.p_w", "40", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.p_kwh", start, U)
    for i, (k, v) in enumerate((("ecats", [{"id": "k", "name": "K"}]),
                                ("estimates", {"p": {"name": "Priz", "kind": "meas", "sensor": "sensor.p_w", "energy": "sensor.p_kwh", "cat": "k"}})), 1):
        await ws.send_json({"id": i, "type": f"{DOMAIN}/set", "key": k, "value": v})
        assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    seen = []

    async def feed(*vals):
        for v in vals:
            hass.states.async_set("sensor.p_kwh", v, U)
            await hass.async_block_till_done()
            seen.append(float(hass.states.get("sensor.lhd_kat_k_energy").state))
        return seen[-1]
    return feed, seen


def _never_back(seen):
    assert all(b >= a - 1e-9 for a, b in zip(seen, seen[1:])), seen


@pytest.mark.parametrize("vals,want", [
    (("30.7", "0", "30.7"), 0.7),                              # one 0 reading (was already right)
    (("30.7", "0", "0.001", "30.7"), 0.7),                     # the reported case: counted 30.7 kWh twice
    (("30.7", "0", "0.001", "0.002", "0.003", "30.75"), 0.75),  # a few readings near 0, then back (+0.05 real)
    (("30.7", "unavailable", "0", "unavailable", "0.001", "30.7"), 0.7),
    (("30.7", "0", "15", "30.7"), 0.7),                        # comes back in two jumps
    (("30.7", "30.5", "30.7", "30.8"), 0.8),                   # a small dip and back
])
async def test_glitch_is_not_counted(hass, hass_ws_client, setup_lhd, vals, want):
    feed, seen = await _cat(hass, hass_ws_client)
    assert abs(await feed(*vals) - want) < 1e-6, seen
    _never_back(seen)


async def test_real_reset_is_counted_in_full(hass, hass_ws_client, setup_lhd):
    feed, seen = await _cat(hass, hass_ws_client)
    await feed("30.7")
    # the device was reset and counts again from 0: 0.1 kWh per reading
    total = await feed("0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7")
    assert abs(total - (0.7 + 0.7)) < 1e-6, seen
    _never_back(seen)
    # it keeps counting normally afterwards, also past its old value
    total = await feed("31.0", "31.5")
    assert abs(total - (0.7 + 31.5)) < 1e-6, seen


async def test_real_reset_first_reading_not_zero(hass, hass_ws_client, setup_lhd):
    """Reset, and the first reading after it is already 0.2: that 0.2 was used after the reset and is counted too."""
    feed, seen = await _cat(hass, hass_ws_client)
    await feed("30.7")
    total = await feed("0.2", "0.3", "0.4", "0.5", "0.6", "0.7")
    assert abs(total - (0.7 + 0.7)) < 1e-6, seen
    _never_back(seen)


async def test_real_reset_of_a_small_counter(hass, hass_ws_client, setup_lhd):
    """A new plug at 0.05 kWh is reset and climbs past 0.05 in small steps: not taken for a glitch."""
    feed, seen = await _cat(hass, hass_ws_client, start="0.0")
    await feed("0.05")
    total = await feed("0", "0.02", "0.04", "0.06", "0.08", "0.10", "0.12")
    assert abs(total - (0.05 + 0.12)) < 1e-6, seen
    _never_back(seen)


async def test_reset_with_a_big_first_rise(hass, hass_ws_client, setup_lhd):
    feed, seen = await _cat(hass, hass_ws_client)
    await feed("30.7")
    total = await feed("0", "0.5", "0.6", "0.7", "0.8", "0.9")
    assert abs(total - (0.7 + 0.9)) < 1e-6, seen
    _never_back(seen)
