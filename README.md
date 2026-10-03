# Lemur Panel

Türkçe · **[English](README.en.md)**

Home Assistant için hazır, tam ekran ev paneli. Yeni bir pano aç, tek satır yaz; odaların, ışıkların, senaryoların, iklim ve medya kontrollerinin olduğu panel kendiliğinden gelsin. Tabletler için tasarlandı, telefonda da çalışır.

> Geliştirme aşamasında. İlk sürüm henüz yayınlanmadı.

- **Tek satırla kurulum.** Panonun ham yapılandırmasına `strategy: type: custom:lemur-panel` yazman yeterli.
- **Başka eklenti gerekmez.** HACS'tan tek seferde kurulur; ek kart ya da tema şart değil.
- **Her şey yönetim panelinden.** Sekmeler, bölümler, kolon genişlikleri ve hangi cihazın nerede duracağı sol menüdeki "Lemur Panel"den düzenlenir; değişiklik evdeki bütün tabletlere aynı anda gelir.
- **Her ekrana uyar.** Panel ekranın boyutuna göre ölçeklenir, eski tabletlerde de akıcı çalışır.

## Kurulum

1. HACS → sağ üstteki menü → Özel depolar → `https://github.com/mendebur-lemur/lemur-panel`, kategori **Integration**.
2. **Lemur Panel**'i indir, Home Assistant'ı yeniden başlat.
3. Ayarlar → Cihazlar ve hizmetler → Entegrasyon ekle → **Lemur Panel**.
4. Ayarlar → Panolar → Pano ekle → boş pano. Panoyu aç, ⋮ → Düzenle → ⋮ → Ham yapılandırma düzenleyicisi, içeriği şununla değiştir:

```yaml
strategy:
  type: custom:lemur-panel
```

Not: Bu panoda Home Assistant'ın kendi düzenleyicisinde "kontrolü al" dersen pano sabit hâle gelir ve Lemur Panel'den kopar. Düzenlemeyi sol menüdeki Lemur Panel'den yap.

## Lisans

MIT
