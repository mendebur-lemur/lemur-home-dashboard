# Lemur Home Dashboard

**[Türkçe](README.md)** · English

A ready-made, full-screen home dashboard for Home Assistant. Create a dashboard, add one line, and get rooms, lights, scenes, climate and media controls laid out for you. Designed for wall tablets and kiosk screens, works on phones too.

> In development. No release yet.

- **One-line setup.** Put `strategy: type: custom:lemur-home-dashboard` in the dashboard's raw configuration.
- **No other add-ons needed.** One install from HACS.
- **Edited from its own admin panel.** Tabs, sections, column widths and device placement are edited under "Lemur Home Dashboard" in the sidebar; changes reach every tablet at once.
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

## License

MIT
