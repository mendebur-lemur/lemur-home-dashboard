"""Constants for Lemur Home Dashboard."""

DOMAIN = "lemur_home_dashboard"
VERSION = "0.28.9"
STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1
SIGNAL_UPDATE = f"{DOMAIN}_update"
SIGNAL_PETS = f"{DOMAIN}_pets"
SIGNAL_TICK = f"{DOMAIN}_tick"
SIGNAL_EST = f"{DOMAIN}_estimates"
URL_BASE = "/lemur_home_dashboard"
JS_FILE = "lemur-home-dashboard.js"
LOADER_FILE = "lemur-home-dashboard-loader.js"
PANEL_URL = "lemur-home-dashboard"
PANEL_ELEMENT = "lemur-home-dashboard-admin"
MAX_CONFIG_BYTES = 1024 * 1024
