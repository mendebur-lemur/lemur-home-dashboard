# Lemur Home Dashboard

**[Türkçe](README.md)** · English

A ready-made, full-screen home dashboard for Home Assistant. Create a dashboard, add one line, and get rooms, lights, scenes, climate and media controls laid out for you. Designed for wall tablets and kiosk screens, works on phones too.

> In development. No release yet.

- **One-line setup.** Put `strategy: type: custom:lemur-home-dashboard` in the dashboard's raw configuration.
- **No other add-ons needed.** One install from HACS.
- **Edited from its own admin panel.** Tabs, sections, column widths and device placement are edited under "Lemur Home Dashboard" in the sidebar; changes reach every tablet at once.
- **Light window.** Holding a light tile opens a light window with a brightness slider, colour temperature buttons, a colour wheel, effects and (where available) segments. You can switch to Home Assistant's own dialog in settings.
- **Fits any screen.** The dashboard scales to the screen and stays smooth on older tablets.

## Installation

1. HACS → top-right menu → Custom repositories → `https://github.com/mendebur-lemur/lemur-home-dashboard`, category **Integration**.
2. Download **Lemur Home Dashboard** and restart Home Assistant.
3. Settings → Devices & services → Add integration → **Lemur Home Dashboard**.
4. Settings → Dashboards → Add dashboard → blank. Open it, ⋮ → Edit → ⋮ → Raw configuration editor, replace everything with:

```yaml
strategy:
  type: custom:lemur-home-dashboard
```

Note: if you "take control" of this dashboard in Home Assistant's own editor, it becomes static and disconnects from Lemur Home Dashboard. Edit from Lemur Home Dashboard in the sidebar instead.

## Light effects (optional)

If [Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card) is also installed, the dashboard picks it up on its own:

- **Effects in the top bar:** appears next to the room buttons on its own; tapping it opens the effect screen full screen for that tab's room. Can be turned off in settings.
- **Effect screen button:** can also be added to a scene section.
- **Effect buttons:** when adding a button to a scene section, the device picker also lists the room's effects; the chosen effect starts with one tap. A "Stop effect" button can be added too.
- **The playing effect shows:** while an effect plays in a room, that room's light tiles glow in the effect's colors and the effect's button lights up.
- **From the light window to the effect screen:** the Effect tab in the light window opens the effect screen for that light's room. Settings can also make holding a light open the effect screen directly.

If it is not installed these buttons stay hidden and nothing else changes.

## License

MIT
