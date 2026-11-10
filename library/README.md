# Ortak ışık ölçümleri / Shared light measurements

Panelin **Enerji → Cihazlar → Öğren** ile ölçülen ışıkların tabloları. Panel bir ışığı eklerken önce havuzda modeline bakar; varsa ölçmeden kullanılabilir.

Güncel havuz `havuz` dalında durur (gönderim kontrolü oraya ekler). Bu klasör main'de kodla gelen ilk kopyadır.

- `library.json`: panelin okuduğu dosya. Her model kabul edilen ölçümlerin orta değeri (medyan). Şerit LED'ler metre başına (`per_m`), adaptör sınırı `cap_w`.
- `models/`: kabul edilen ölçümler, her model bir dosya. Gönderenin hesap adı tutulmaz, yalnız kısa bir kod (`by`).
- `plugs.json`: her priz modelinin geçen ve reddedilen gönderim sayısı; sürekli hatalı ölçüm verenler `block` listesinde.
- `tools/check.py`: her gönderimin kontrolü (GitHub Actions). Priz modeline değil ölçümün kendisine bakar: 0 W hücre, takılan satır, parlaklıkla düşen güç, yavaş priz (adım başına 15 sn'den uzun), prizin okuyamadığı düşük güçler (%60'tan fazla). Geçen ölçüm, modelin havuzdaki ölçümüyle ya da başka bir hesabın aynı model ölçümüyle tutarlıysa (en yüksek güç %15 içinde) kendiliğinden eklenir; değilse proje sahibini bekler. Proje sahibinin ölçümleri hemen eklenir.
- `tools/review.py`: bekleyenlerin elle incelenmesi ve onayı (`--accept`).

Gönderimde yalnız marka, model, ışığın özellikleri, ölçüm tablosu, ölçen prizin modeli, şebeke gerilimi ve şeritlerde uzunluk ile adaptör gücü bulunur. Ev, oda ve cihaz adları, konum ya da başka bir Home Assistant verisi gönderilmez.

---

Tables of lights measured with the dashboard's **Energy → Devices → Learn**. The live pool is on the `havuz` branch. Every submission is checked automatically on the measurement itself, not the plug model: 0 W cells, stuck rows, power falling with brightness, a slow plug, too many low powers the plug could not read. A submission that agrees with the pool's measurement of the model, or with another account's, joins by itself; otherwise it waits for the owner. Plug models that keep failing are blocked (`plugs.json`).
