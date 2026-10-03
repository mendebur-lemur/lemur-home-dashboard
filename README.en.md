# Lemur Panel

**[Türkçe](README.md)** · English

A ready-made, full-screen home panel for Home Assistant. Create a dashboard, add one line, and get a panel with rooms, lights, scenes, climate and media controls. Designed for wall tablets, works on phones too.

> In development. No release yet.

- **One-line setup.** Put `strategy: type: custom:lemur-panel` in the dashboard's raw configuration.
- **No other add-ons needed.** One install from HACS.
- **Edited from its own admin panel.** Tabs, sections, column widths and device placement are edited under "Lemur Panel" in the sidebar; changes reach every tablet at once.
- **Fits any screen.** The panel scales to the screen and stays smooth on older tablets.

## Installation

1. HACS → top-right menu → Custom repositories → `https://github.com/mendebur-lemur/lemur-panel`, category **Integration**.
2. Download **Lemur Panel** and restart Home Assistant.
3. Settings → Devices & services → Add integration → **Lemur Panel**.
4. Settings → Dashboards → Add dashboard → blank. Open it, ⋮ → Edit → ⋮ → Raw configuration editor, replace everything with:

```yaml
strategy:
  type: custom:lemur-panel
```

Note: if you "take control" of this dashboard in Home Assistant's own editor, it becomes static and disconnects from Lemur Panel. Edit from Lemur Panel in the sidebar instead.

## License

MIT
