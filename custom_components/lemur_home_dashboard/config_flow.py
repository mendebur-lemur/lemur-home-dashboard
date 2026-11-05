"""Config flow: a single entry. Optionally the dashboard itself is created for the user (2026-11-05).

The dashboard cannot be created from Python: Home Assistant keeps its dashboard collection private and only offers
it over the websocket API. So the entry stores the wish, and the first admin browser that loads after setup
creates the dashboard through lovelace/dashboards/create (src/autodash.js) and reports back here.
"""
from __future__ import annotations

import voluptuous as vol

from homeassistant import config_entries

from .const import DOMAIN


class LemurHomeDashboardFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the setup flow."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        tr = (self.hass.config.language or "").lower().startswith("tr")
        default_title = "Ev" if tr else "Home"
        if user_input is not None:
            title = str(user_input.get("dashboard_title") or "").strip()[:40] or default_title
            return self.async_create_entry(
                title="Lemur Home Dashboard",
                data={"create_dashboard": bool(user_input.get("create_dashboard", True)), "dashboard_title": title, "dashboard_done": False},
            )
        schema = vol.Schema({
            vol.Optional("create_dashboard", default=True): bool,
            vol.Optional("dashboard_title", default=default_title): str,
        })
        return self.async_show_form(step_id="user", data_schema=schema)
