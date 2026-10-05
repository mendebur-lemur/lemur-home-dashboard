# Lemur Home Dashboard

**[Türkçe](README.md)** · English

A ready-made, full-screen home dashboard for Home Assistant. Create a new dashboard, paste one line, and a dashboard with your rooms, lights, scenes, climate and media controls builds itself from the devices in your home. Designed for wall tablets and kiosk screens, and it works on phones too.

![Lemur Home Dashboard in use](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/demo.webp)

**Quick install:** [Open in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-home-dashboard&category=integration) → Download → restart Home Assistant → [add the integration](https://my.home-assistant.io/redirect/config_flow_start/?domain=lemur_home_dashboard) → put `strategy: type: custom:lemur-home-dashboard` in a new dashboard. Step-by-step guide [below](#installation).

- **One-line setup.** Two lines in the dashboard's raw configuration and the rest arrives on its own. Rooms come from your Home Assistant areas; lights, scenes, air conditioners, radiators, vacuums and media players are found in those areas.
- **No other add-ons needed.** One install from HACS; no mushroom, card-mod, bubble-card or any other card or theme. The Lemur Halo cards (climate, vacuum, sensor, weather, energy, security, room, light) are bundled.
- **Everything from the admin panel.** In the **Lemur Home Dashboard** page in the sidebar you edit tabs, sections, column widths and where each device goes; a live preview shows the result, and changes reach every tablet in the house at once. Every step can be undone. **Simple** mode shows only the basics, **Advanced** mode adds sizes, colours, conditions and cards; complex settings have a **?** help next to them.
- **Icon picker.** Choose tab, light and button icons from a list: suggestions that fit first, all Home Assistant icons when you search.
- **Its own icon set.** Every icon on the dashboard is drawn from 1305 built-in colourful icons; an `mdi:` name that isn't in the set is drawn with Home Assistant's flat icon. In the default **Automatic** style, devices that are off are grey and devices that are on are colourful; you can also make them all colourful or all grey.
- **Slider light bars.** A lights section can show horizontal bars instead of square tiles: tap to toggle, swipe sideways to change brightness, and the bar fills to the brightness in the light's colour. Bars on phones only, tiles on tablets, is an option too.
- **Light window.** Hold a light tile to open a light window with a big brightness slider, white tones, a colour wheel, preset colours, effects and (if the light has them) segments. You can switch to Home Assistant's own dialog in the settings.
- **Instant response.** Tap a light, switch or fan and the tile changes without waiting for the device; turning a light on shows its last colour. If the device reports something else, the real state is shown.
- **Feeding card.** A feeding reminder for a cat, dog, fish...: green on time, red when late; tap "Fed", get a phone notification when late, optionally run an automatic feeder.
- **Card picker.** Pick Halo cards, Home Assistant cards and installed custom cards from a list; they are added with the card's own visual editor and a live preview.
- **Second line and templates.** State, last changed or an attribute under a tile; Home Assistant templates in the name and second line. A button can ask before running.
- **Fits any screen.** The dashboard scales with the screen; it keeps the same proportions on 16:10, 4:3 and wide screens and runs smoothly on old tablets (iOS 12). Phones, phones held sideways and tablets held upright get their own layout.
- **Its own phone layout.** Room buttons scroll sideways, sections stack, buttons are thumb-sized.
- **Seasonal climate.** Air conditioners in summer, radiators in winter; automatic or by hand.
- **Light effects (optional).** If [Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card) is installed, an Effects button appears in the top bar and the playing effect shows on the tiles.
- Turkish and English interface.


## Contents

- [Installation](#installation)
  - [1. Download with HACS](#1-download-with-hacs)
  - [2. Add the integration](#2-add-the-integration)
  - [3. Create the dashboard](#3-create-the-dashboard)
  - [4. Edit in the admin panel](#4-edit-in-the-admin-panel)
- [The dashboard](#the-dashboard)
- [Admin panel](#admin-panel)
  - [Settings](#settings)
- [Light window](#light-window)
- [Phone](#phone)
- [Light effects (optional)](#light-effects-optional)
- [Updating](#updating)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)
- [The Lemur family](#the-lemur-family)
- [Development](#development)

## Installation

Requirements: Home Assistant 2024.8 or newer and [HACS](https://hacs.xyz/docs/use/). No other cards, themes or add-ons.

### 1. Download with HACS

The easiest way is this button. It asks for your Home Assistant address once, then opens the repository directly in HACS:

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-home-dashboard&category=integration)

1. Press **Add** in the window that opens (the repository is added to HACS).
2. Press **Download** at the bottom right, then **Download** again in the version window.
3. **Settings → System → ⏻ at the top right → Restart Home Assistant**. A "Restart required" notice also shows up in Settings; you can restart from there too.

<details>
<summary>If the button doesn't work: add it by hand</summary>

1. Open **HACS** in the sidebar.
2. **⋮** menu at the top right → **Custom repositories**.
3. Paste this address into **Repository**:
   `https://github.com/mendebur-lemur/lemur-home-dashboard`
4. Choose **Integration** as **Type** and press **Add**. Close the window.
5. Type **Lemur Home Dashboard** into the HACS search box and click the result.
6. **Download** → **Download**, then restart Home Assistant.

</details>

### 2. Add the integration

[![Add the integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=lemur_home_dashboard)

Without the button: **Settings → Devices & services → Add integration** → type "Lemur" → **Lemur Home Dashboard** → **Submit**. No questions are asked. A **Lemur Home Dashboard** page is added to the sidebar (visible to administrators only).

### 3. Create the dashboard

1. **Settings → Dashboards → Add dashboard → New dashboard from scratch**, give it a name (for example "Tablet") and press **Create**.
2. Open the new dashboard and press **✏️ (Edit)** at the top right.
3. **⋮** menu at the top right → **Raw configuration editor**. Delete the contents, paste this and press **Save**:

```yaml
strategy:
  type: custom:lemur-home-dashboard
```

4. Close the editor. The dashboard builds itself from your areas: a **Home** tab (lights, scenes and controls for the whole house) and one tab per room.

If you choose **"Take control"** in Home Assistant's own editor on this dashboard, it becomes a fixed dashboard and disconnects from Lemur Home Dashboard. Always edit from Lemur Home Dashboard in the sidebar.

For kiosk use on a tablet, **Hide top bar** and **Hide sidebar** in the [Settings](#settings) turn off Home Assistant's header and sidebar on this dashboard only.

### 4. Edit in the admin panel

You can use it without touching anything. To change things, open **Lemur Home Dashboard** in the sidebar. The automatic layout is saved on your first change, and from then on everything is edited here:

![Editing in the admin panel](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/admin.webp)

## The dashboard

Room buttons and a clock at the top, columns below. Each column holds one or more sections:

| Section | What it shows | On tap |
|---|---|---|
| **Lights** | Light, plug, cover and fan tiles, or slider bars | Toggle (instantly); swipe a bar sideways: brightness (cover position, fan speed); hold: [light window](#light-window) |
| **Scenes** | Script, scene and automation buttons, each with its own colour and icon | Runs it |
| **Climate** | Air conditioner and radiator cards; air conditioners in summer, radiators in winter | On/off, temperature |
| **Vacuum** | Robot vacuum card | Start, stop, send to dock |
| **Media** | TVs and speakers | Device dialog |
| **Values** | Sensors, binary sensors, timers, counters, selects: icon, value + unit and name; a running timer counts down | Device dialog (configurable) |
| **Cards** | Any card added from the card picker or as YAML: Halo cards, Home Assistant cards, installed custom cards | The card itself |
| **Pet** | Feeding card: last feeding, next feeding and a colour for the status | "Fed"; hold: recent feedings |

Lights that are on get a frame in their own colour; unavailable devices are dimmed. A tap does not wait for the device; each light's last colour is remembered in the browser, and if there is no reply within 5 seconds the tile goes back. The automatic layout skips light group members, segments, hidden and config entities, and scripts that need input.

## Admin panel

**Simple / Advanced:** The switch in the top bar. Simple mode (the default) shows only the basics: tabs, sections, adding devices, name, icon, look and what a tap does. Advanced mode also opens sizes, colours, conditional visibility, custom actions, cards and section layout. Switching never deletes settings; those hidden in simple mode keep working. The **?** next to complex settings explains what they do and how to set them up, with an example.

**Lemur Home Dashboard** in the sidebar (administrators only). Tabs at the top, a live preview on the left, the selected tab's sections on the right.

- **Tabs:** Choose a name, icon and area (room). **Refill from area** places that room's devices again on a tab with an area. **+ Tab** opens an empty tab or a tab for a room, already filled.
- **Columns:** 1 to 6 columns. Drag the lines in the preview to set widths; **Tablet layout** and **Equal** are presets. Each column can be split into 1-3 sub-columns.
- **Free sections:** Each section is a box and anything can go into it: lights, plugs, covers, scene buttons, climate and vacuum cards and media players can share one box; each item shows in its own way. The types in **Add section** (Empty section, Lights, Scenes, Climate, Vacuum, Media) are only a starting title. Drag sections by their handle in the preview to move them between columns; drag items themselves to reorder them or move them to another section.
- **Lights section look:** **Tiles** (square tiles), **Sliders** (horizontal bars: tap to toggle, swipe sideways for brightness) or **Auto on phone** (tiles on a tablet, bars on a phone). Tiles and bars per row are set separately.
- **Add:** The picker lists every kind of device; the filter at the top (All, Lights and switches, Scenes, Climate, Vacuum, Media) narrows it, and several devices can be added at once. Scripts, scenes and automations become coloured buttons. A light tile's name and icon can be changed; scene buttons get a colour and icon. For a climate card you choose temperature and humidity sensors, an outdoor temperature sensor, a second device controlled together and the type (air conditioner/radiator).
- **Icon picker:** The button next to icon fields. The **Icons** tab has the dashboard's 1305 icons; icons that fit (for a room, a light or a scene) are suggested first, and the search box understands Turkish words too. Icons marked ★ are dashboard-only drawings. With Light Effect Card installed, its 356 colourful effect icons can be chosen too, in the **Light Effect Card** tab. You can also type an `mdi:...` name directly; if it is not in the set, Home Assistant's flat icon is drawn.
- **Item settings (⚙):** The cog next to each item. Name, icon, icons for on and off (e.g. a connectivity sensor), what happens **On tap** and **On hold** (more info, toggle, call a service, open a card in a window, nothing or YAML), what a scene button does, and **Only show when**: the item shows only while the chosen entity is in a given state; otherwise it is not drawn at all and leaves no gap (it shows faded in the preview).
- **Size and layout:** In item ⚙, a tile's size (1×1, 2×1, 1×2, 2×2, full row) and icon and text size (small / medium / large). In the section editor, **Fill** (fit content, or fill the box: buttons and tiles share the box height evenly) and **Alignment** (top, middle, spread evenly). If content doesn't fit, the box grows; a column taller than the screen scrolls by itself, so nothing is cut off.
- **Look and colour:** Item ⚙ → **Look**: a scene/action button can be a Button, a Tile (in the same grid as the lights) or a Row; a value item a Tile, Button, Row or Halo (numeric values as a Halo sensor card); a light or switch a Tile, Button or Row. **Colours**: icon colour, colour when on, background tint; numeric values can be **coloured by value** (4 limits, 5 colours). Card items and the Halo look can get tap / hold actions too, which then run instead of the card's own tap.
- **Feeding card:** Add a **Pet** to a section: name, kind (cat, dog, fish, bird, rabbit, turtle, other), every N hours or at set times of day, a soon warning and grace time, a notification when late, and an optional automatic feeder. The card is green on time, yellow when due soon, orange when due, red and blinking when late; tap to record "Fed" (tap again within 10 s to undo), hold for recent feedings. Home Assistant gets a feeding sensor (ok, soon, due, late, never) and a "fed" button for every pet, plus the `lemur_home_dashboard.feed` service.
- **Spacing, height, colour:** In the section editor, **Spacing** (0-24 px between items; 12 by default when filling the box). For the Halo look and card items, **Height** (1, 1.5, 2 rows), and icon and text size for Halo. Colours offer the Halo colours in one tap; **Colour by state** maps an entity's state to a colour (works for text values too). A **Subtitle** item puts a small heading inside a section.
- **Second line, templates, confirmation:** Item ⚙ → **Second line** (state, last changed, attribute, text or template); the name and second line accept Home Assistant templates ({{ }} / {% %}). **Ask before running** asks first when the button is pressed.
- **Card picker:** The **Card** button lists Halo cards, Home Assistant cards and installed custom cards; the chosen card opens with its visual editor and a live preview, or as YAML.
- **Card (YAML):** Adds a Home Assistant card to the section; if it can't load, a short warning shows in its place. Give a button **Open a card in a window** and the card opens in the dashboard's own window, like the light window (tap outside, X or the back button closes it).
- **Preview screens:** Tablet 16:10, Tablet 4:3, Wide 16:9, Phone and This screen. A warning shows in the preview when a section doesn't fit.
- **Undo:** Every change can be undone (button or Ctrl+Z). **Back to automatic layout** in the **⋯** menu resets everything.

![Icon picker](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/icon-picker.png)

### Settings

**Settings** at the top right apply to every tablet in the house:

- *Version and updates:* at the top; installed version, what's new and **Check for updates**. A new version is installed from here through HACS, then Home Assistant restarts.
- *Language:* automatic (Home Assistant's language), Turkish or English.
- *Season:* air conditioners in summer, radiators in winter in the climate section. Automatic: May-September is summer.
- *Background:* dark (default), black, any colour, effect colours, or your own image (an address like `/local/background.jpg`). Effect colours are Light Effect Card's effect palettes (Aurora, Fire, Sunset, Ocean, Galaxy and 25 more): a soft colour glow on a dark background. They can be chosen even without Light Effect Card.
- *Icon style:* Automatic (default; devices that are off and rooms that are not selected are grey, the rest colourful), Colourful (all colourful), Flat (all grey) or Single colour (the drawings turn into one tone: devices that are off are grey, devices that are on are in the colour you pick; optionally a light that is on shows the lamp's own colour, and a scene button its own colour). The icon set is a separate file, downloaded once and kept by the browser.
- *HA theme:* the Home Assistant theme used by dialogs (can be left empty).
- *Hide top bar / Hide sidebar:* Home Assistant's header and sidebar are hidden on this dashboard only.
- *Canvas (Advanced):* design width and reference height; the dashboard scales to the screen with this ratio.
- *Holding a light:* Light window (default), HA dialog or (with Light Effect Card) the effect screen.
- *Lemur Light Effect Card:* whether it is installed, and the Effects button in the top bar.
- *Report a problem:* opens a GitHub issue with the version and device details (no room, device or person names).
- *Backup:* tabs, sections, settings and pets in one file; restoring asks first.

## Light window

Hold a light tile. At the top a big brightness slider (drag it) and a power button, below it tabs:

- **Colour:** white tone buttons from 2200 K to 6500 K, a colour wheel and preset colours. If the light only supports white, only the white tones are shown.
- **Effect:** the light's own effects. With Light Effect Card installed, the effect screen opens for the lamp's room.
- **Segment:** on strips and lamps with segments, pick single segments and colour them.

The window closes with the back button, Esc or ✕. You can switch to Home Assistant's own device dialog in the settings.

![Light window](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/light-window.png)

## Phone

When the screen is narrower than 700 pixels, a phone is held sideways (less than 500 pixels high) or a tablet is held upright, the dashboard switches to its phone layout: room buttons become a strip that scrolls sideways, sections stack, scenes sit in two columns and the page scrolls. The number of tiles per row grows with the width (3 on a phone, 6 on an upright tablet). Set a lights section to **Auto on phone** and its lights become two columns of slider bars on a phone. No separate dashboard needed; the same dashboard opens in tablet layout on a tablet and phone layout on a phone.

<img src="https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/phone.png" alt="Phone layout" width="320">

## Light effects (optional)

If [Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card) is installed too, the dashboard recognizes it on its own, and the admin panel tells you on first open:

- **Effects in the top bar:** Appears next to the room buttons on its own; tap it and the effect screen opens full screen for that tab's room. Can be turned off in the settings.
- **Effect screen button:** Can also be added to a scene section.
- **Effect buttons:** When adding a button to a scene section, the room's effects are listed in the **Light effects** group of the picker; the chosen effect starts with one tap. A **Stop effect** button can be added too.
- **The playing effect shows:** While an effect plays in a room, that room's light tiles glow in the effect's colours and the effect's button lights up.
- **From the light window to the effect screen:** The Effect tab in the light window opens the effect screen for the lamp's room. In the settings you can make holding a light open the effect screen directly.

If it isn't installed, these buttons don't show on the dashboard and nothing else changes.

![Effects button and a playing effect](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/effects.png)

## Updating

1. **HACS → Lemur Home Dashboard → ⋮ → Update information**, then **Download** (or **Update** from the update notice in Settings). HACS checks custom repositories on its own only every 48 hours; "Update information" does it right away.
2. Restart Home Assistant.

The dashboard clears the old page copies kept by the browser and the phone app by itself; if the old version shows up once, the page reloads once. Your tabs, sections and settings are kept across updates.

## Troubleshooting

- **"Timeout waiting for strategy element" or an empty dashboard.** Make sure the integration is added ([step 2](#2-add-the-integration)) and Home Assistant was restarted, then reload the page with Ctrl+F5. In the phone app: **Settings → Companion app → Reset frontend cache**.
- **No Lemur Home Dashboard in the sidebar.** The page is visible to administrators only. The dashboard works for everyone.
- **A device is missing.** The automatic layout finds devices through Home Assistant areas; devices without an area are collected in the **Other** tab. In the admin panel you can add any device to any section with **Add**.
- **The dashboard opens in HA's editor and changes don't show up in the panel.** "Take control" was probably used. Turn the contents back into the [two-line code](#3-create-the-dashboard) in the raw configuration editor.
- **A section doesn't fit.** The admin panel's preview marks it; use fewer items, move the section to another column or widen the column.
- **Still stuck?** [Open an issue](https://github.com/mendebur-lemur/lemur-home-dashboard/issues); include your Home Assistant version, browser and device and we'll take a quick look.

## Screenshots

| Home tab | Room tab |
|---|---|
| ![Home tab](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/dashboard.png) | ![Room tab](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/room.png) |
| **Admin panel** | **Settings** |
| ![Admin panel](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/admin.png) | ![Settings](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/settings.png) |

## The Lemur family

Each one installs on its own; installed together, they recognize each other.

| | What it does | Install |
|---|---|---|
| **Lemur Home Dashboard** (this repository) | A ready-made tablet dashboard set up with one line, with its own admin panel | [![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-home-dashboard&category=integration) |
| **[Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card)** | An effect screen that manages every effect-capable light room by room. When installed, the dashboard gets an Effects button and effect buttons. | [![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-light-effect-card&category=integration) |
| **[Lemur Halo Cards](https://github.com/mendebur-lemur/lemur-halo-cards)** | Eight cards that tell the state with a coloured halo: climate, sensor, weather, vacuum, energy, security... All eight are bundled with the dashboard and can be added from the card picker; install it separately to use them on other dashboards. | [![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-halo-cards&category=plugin) |

## Development

```bash
python3 build.py          # bundles src/ into a single file in custom_components/.../frontend/
pip install -r tests/requirements.txt && pytest   # integration tests
node --test tests/*.test.js                       # browser-side safety checks (src/safe.js)
```

**Security:** A pet's feeder service must be in an allowed domain (switch, button, input_button, timer, script, fan, number, select, esphome, notify, input_boolean, light) and the notification target must be `notify.*`. A second "fed" within a minute is not counted. Non-admin users do not see the feeder service or the notification target. Restoring a backup checks the tabs and pets and shows the services that will run in the confirmation.

Settings are kept in `.storage/lemur_home_dashboard`. The dashboard is generated by the `custom:lemur-home-dashboard` strategy; each tab is a view holding a single `custom:lemur-home-dashboard-card`.

## License

The code is licensed under **[GPL-3.0](LICENSE)** with the additional attribution terms in [NOTICE.md](NOTICE.md):

- Anyone can use, change and share it.
- Any project that uses or builds on this code must **release its own source code under the same license**; it cannot be turned into a closed-source product.
- Copies and modified versions must keep this attribution line: *Based on Lemur Home Dashboard by mendeburlemur — https://github.com/mendebur-lemur/lemur-home-dashboard*

Images, videos and documentation are licensed under **[CC BY-NC-SA 4.0](docs/LICENSE.md)**: they can be shared with credit, for non-commercial purposes and under the same license.

v0.1.0 and earlier were released under the MIT license; MIT still applies to those versions.
