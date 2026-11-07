# Ortak ışık ölçümleri / Shared light measurements

Panelin **Enerji → Cihazlar → Öğren** ile ölçülen ışıkların tabloları. Panel bir ışığı eklerken önce burada modeline bakar; varsa ölçmeden kullanılabilir.

- `library.json`: panelin okuduğu dosya. Her model kabul edilen ölçümlerin orta değeri (medyan). Şerit LED'ler metre başına (`per_m`), adaptör sınırı `cap_w`.
- `models/`: kabul edilen ölçümler, her model bir dosya.
- `tools/check.py`: her gönderimin biçim kontrolü (GitHub Actions). Hiçbir şeyi havuza eklemez.
- `tools/review.py`: haftalık inceleme. Sonuç bir pull request olarak gelir; birleştirilmeden havuza bir şey girmez.

Gönderimde yalnız marka, model, ışığın özellikleri, ölçüm tablosu, ölçen prizin modeli, şebeke gerilimi ve şeritlerde uzunluk ile adaptör gücü bulunur. Ev, oda ve cihaz adları, konum ya da başka bir Home Assistant verisi gönderilmez.

---

Tables of lights measured with the dashboard's **Energy → Devices → Learn**. When a light is added, the dashboard looks for its model here first. `library.json` holds the median of the reviewed submissions per model (strips per meter, with the adapter limit). Submissions are format-checked automatically and reviewed weekly; nothing joins the pool until the review is merged.
