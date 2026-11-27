"""PR #35 tarayıcı turu: kopya profil (kendi sekmeleri olan) anada telefon ayarı yokken boş telefon ayarıyla saklanır
(src/admin.js _profNew). Sunucu bu boş ayarı silmemeli; silerse anada sonradan yapılan telefon düzeni kopyaya geçer."""
from custom_components.lemur_home_dashboard import _check


def test_copy_profile_keeps_empty_phone_setting():
    tabs = [{"id": "home", "sections": []}]
    out = _check("profiles", {"duvar": {"name": "Duvar", "tabs": tabs, "settings": {"phone": {}}}})
    assert out["duvar"]["settings"] == {"phone": {}}


def test_linked_profile_empty_phone_is_harmless():
    out = _check("profiles", {"bagli": {"name": "Bağlı", "settings": {"phone": {}}}})
    assert out["bagli"].get("settings", {}).get("phone", {}) == {}
