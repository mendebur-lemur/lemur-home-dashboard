# Lemur Home Dashboard

Türkçe · **[English](README.en.md)**

Home Assistant için hazır, tam ekran ev panosu. Yeni bir pano aç, tek satır yaz; odaların, ışıkların, senaryoların, iklim ve medya kontrollerinin olduğu pano evindeki cihazlardan kendiliğinden kurulsun. Duvar tabletleri ve kiosk ekranları için tasarlandı, telefonda da çalışır.

![Lemur Home Dashboard kullanımda](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/demo.webp)

**Hızlı kurulum:** [HACS'ta aç](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-home-dashboard&category=integration) → İndir → Home Assistant'ı yeniden başlat → [entegrasyonu ekle](https://my.home-assistant.io/redirect/config_flow_start/?domain=lemur_home_dashboard) → yeni panoya `strategy: type: custom:lemur-home-dashboard` yaz. Adım adım anlatım [aşağıda](#kurulum).

- **Tek satırla kurulum.** Panonun ham yapılandırmasına iki satır yazarsın, gerisi kendiliğinden gelir. Odalar Home Assistant alanlarından, ışıklar, senaryolar, klimalar, petekler, süpürge ve medya cihazları o alanlardan bulunur.
- **Başka eklenti gerekmez.** HACS'tan tek seferde kurulur; mushroom, card-mod, bubble-card ya da başka bir kart veya tema istemez. İklim ve süpürge kartları pakete gömülü gelir.
- **Her şey yönetim panelinden.** Sol menüdeki **Lemur Home Dashboard** sayfasında sekmeleri, bölümleri, kolon genişliklerini ve hangi cihazın nerede duracağını düzenlersin; canlı önizleme gösterir, değişiklik evdeki bütün tabletlere aynı anda gelir. Her adım geri alınabilir.
- **Simge seçici.** Sekme, ışık ve düğme simgelerini listeden seçersin: önce o şeye uygun öneriler, aramada Home Assistant'ın bütün simgeleri. Türkçe de arayabilirsin (lamba, kanepe, tavan...).
- **Kendi simge seti.** Panodaki bütün simgeler pakete gömülü 1305 renkli simgeden çizilir; Home Assistant simgeleri kullanılmaz. Varsayılan **Otomatik** stilde kapalı cihazlar gri, açıklar renkli görünür; istersen hepsi renkli ya da hepsi gri olabilir.
- **Kaydırmalı ışık çubukları.** İstersen ışık bölümü kare karolar yerine yatay çubuklarla görünür: dokununca ışık açılır/kapanır, sağa-sola kaydırınca parlaklık değişir, çubuk parlaklık kadar ışığın renginde dolar. Sadece telefonda çubuk, tablette karo da seçilebilir.
- **Işık penceresi.** Işık karosuna basılı tutunca büyük parlaklık çubuğu, beyaz tonlar, renk çemberi, hazır renkler, efektler ve (varsa) segmentlerle ışık penceresi açılır. İstersen ayarlardan Home Assistant'ın kendi penceresine geçersin.
- **Her ekrana uyar.** Pano ekranın boyutuna göre ölçeklenir; 16:10, 4:3 ve geniş ekranlarda aynı oranla görünür, eski tabletlerde (iOS 12) de akıcı çalışır.
- **Telefonda kendi düzeni.** Oda düğmeleri yana kayar, bölümler alt alta dizilir, düğmeler başparmak boyunda olur.
- **Mevsime göre iklim.** Yazın klimalar, kışın petekler gösterilir; otomatik ya da elle.
- **Işık efektleri (isteğe bağlı).** [Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card) kuruluysa üst şeride Efektler düğmesi gelir, oynayan efekt karolarda görünür.
- Türkçe ve İngilizce arayüz.


## İçindekiler

- [Kurulum](#kurulum)
  - [1. HACS ile indir](#1-hacs-ile-indir)
  - [2. Entegrasyonu ekle](#2-entegrasyonu-ekle)
  - [3. Panoyu oluştur](#3-panoyu-oluştur)
  - [4. Yönetim panelinde düzenle](#4-yönetim-panelinde-düzenle)
- [Pano](#pano)
- [Yönetim paneli](#yönetim-paneli)
  - [Ayarlar](#ayarlar)
- [Işık penceresi](#işık-penceresi)
- [Telefon](#telefon)
- [Işık efektleri (isteğe bağlı)](#işık-efektleri-isteğe-bağlı)
- [Güncelleme](#güncelleme)
- [Sorun giderme](#sorun-giderme)
- [Ekran görüntüleri](#ekran-görüntüleri)
- [Lemur ailesi](#lemur-ailesi)
- [Geliştirme](#geliştirme)

## Kurulum

Gerekenler: Home Assistant 2024.8 ya da daha yeni bir sürüm ve [HACS](https://hacs.xyz/docs/use/). Başka kart, tema ya da eklenti gerekmez.

### 1. HACS ile indir

En kolay yol bu düğme. Home Assistant adresini bir kez sorar, sonra depoyu doğrudan HACS'ta açar:

[![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-home-dashboard&category=integration)

1. Açılan pencerede **Ekle**'ye bas (depo HACS'a eklenir).
2. Sağ alttaki **İndir** düğmesine bas, sürümü seçme penceresinde tekrar **İndir**.
3. **Ayarlar → Sistem → sağ üstteki ⏻ → Home Assistant'ı yeniden başlat**. Ayarlar sayfasında "Yeniden başlatma gerekli" uyarısı da çıkar, oradan da yapabilirsin.

<details>
<summary>Düğme çalışmazsa: elle ekleme</summary>

1. Sol menüden **HACS**'ı aç.
2. Sağ üstteki **⋮** menüsü → **Özel depolar** (*Custom repositories*).
3. **Depo** alanına şu adresi yapıştır:
   `https://github.com/mendebur-lemur/lemur-home-dashboard`
4. **Tür** olarak **Entegrasyon** (*Integration*) seç ve **Ekle**'ye bas. Pencereyi kapat.
5. HACS'ın arama kutusuna **Lemur Home Dashboard** yaz, sonuca tıkla.
6. **İndir** → **İndir**, ardından Home Assistant'ı yeniden başlat.

</details>

### 2. Entegrasyonu ekle

[![Entegrasyonu ekle](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=lemur_home_dashboard)

Düğmeyi kullanmıyorsan: **Ayarlar → Cihazlar ve hizmetler → Entegrasyon ekle** → "Lemur" yaz → **Lemur Home Dashboard** → **Gönder**. Soru sorulmaz. Sol menüye **Lemur Home Dashboard** sayfası eklenir (yalnızca yöneticiler görür).

### 3. Panoyu oluştur

1. **Ayarlar → Panolar → Pano ekle → Sıfırdan yeni pano oluştur**, bir ad ver (örneğin "Tablet") ve **Oluştur**.
2. Yeni panoyu aç, sağ üstteki **✏️ (Düzenle)** düğmesine bas.
3. Sağ üstteki **⋮** menüsü → **Ham yapılandırma düzenleyicisi**. İçindekileri sil, yerine şunu yapıştır ve **Kaydet**:

```yaml
strategy:
  type: custom:lemur-home-dashboard
```

4. Düzenleyiciyi kapat. Pano evindeki alanlardan kendiliğinden kurulur: bir **Ev** sekmesi (bütün evin ışıkları, senaryolar ve kontroller) ve her oda için bir sekme.

Bu panoda Home Assistant'ın kendi düzenleyicisinde **"Kontrolü al"** dersen pano sabit hâle gelir ve Lemur Home Dashboard'dan kopar. Düzenlemeyi her zaman sol menüdeki Lemur Home Dashboard'dan yap.

Tabletinde kiosk gibi kullanacaksan [Ayarlar](#ayarlar)'daki **Üst barı gizle** ve **Yan menüyü gizle** ile Home Assistant'ın başlık çubuğunu ve sol menüsünü sadece bu panoda kapatabilirsin.

### 4. Yönetim panelinde düzenle

Hiçbir şeye dokunmadan da kullanabilirsin. Değiştirmek istersen sol menüden **Lemur Home Dashboard**'u aç. İlk değişiklikte otomatik düzen kaydedilir, sonra her şey buradan düzenlenir:

![Yönetim panelinde düzenleme](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/admin.webp)

## Pano

Üstte oda düğmeleri ve saat, altında kolonlar. Her kolon bir ya da birkaç bölümden oluşur:

| Bölüm | Ne gösterir | Dokununca |
|---|---|---|
| **Işıklar** | Işık, priz, perde ve fan karoları ya da kaydırmalı çubuklar | Aç/kapat; çubukta sağa-sola kaydır: parlaklık (perdede konum, fanda hız); basılı tut: [ışık penceresi](#işık-penceresi) |
| **Senaryolar** | Script, sahne ve otomasyon düğmeleri, her birinin kendi rengi ve simgesi | Çalıştırır |
| **İklim** | Klima ve petek kartları; yazın klimalar, kışın petekler | Aç/kapat, sıcaklık |
| **Süpürge** | Robot süpürge kartı | Başlat, durdur, istasyona gönder |
| **Medya** | TV ve hoparlörler | Cihaz penceresi |

Açık ışıklar kendi renginde çerçeveyle görünür, ulaşılamayan cihazlar soluk durur. Otomatik düzen ışık gruplarının üyelerini, segmentleri, gizli ve ayar varlıklarını, parametre isteyen scriptleri atlar.

## Yönetim paneli

Sol menüdeki **Lemur Home Dashboard** (yalnızca yöneticiler görür). Üstte sekmeler, solda canlı önizleme, sağda seçili sekmenin bölümleri.

- **Sekmeler:** Ad, simge ve alan (oda) seçilir. Bir alan seçilen sekmeye **Alandan yeniden doldur** o odanın cihazlarını yeniden yerleştirir. **+ Sekme** boş sekme ya da odası seçilmiş, dolu gelen bir sekme açar.
- **Kolonlar:** 1 ile 6 arası kolon. Genişlikler önizlemedeki çizgilerden sürüklenerek ayarlanır; **Tablet düzeni** ve **Eşit** hazır oranlardır. Her kolon kendi içinde 1-3 sütuna bölünebilir.
- **Bölümler serbest:** Her bölüm bir kutu ve içine her şey eklenebilir: ışık, priz, perde, senaryo düğmesi, iklim ve süpürge kartı, medya cihazı aynı kutuda olabilir; her öğe kendi türüne göre görünür. **Bölüm ekle**'deki türler (Boş bölüm, Işıklar, Senaryolar, İklim, Süpürge, Medya) sadece başlangıç başlığıdır. Bölümler önizlemede tutamaklarından sürüklenerek kolonlar arasında taşınır; öğeler kendileri sürüklenerek sıralanır ya da başka bir bölüme taşınır.
- **Işık bölümünün görünümü:** **Karo** (kare karolar), **Kaydırmalı** (yatay çubuklar: dokun aç/kapat, sağa-sola kaydır parlaklık) ya da **Telefonda otomatik** (tablette karo, telefonda çubuk). Satırdaki karo ve çubuk sayısı ayrıca seçilir.
- **Ekle:** Seçicide her tür cihaz listelenir; üstteki süzgeçle (Tümü, Işık ve anahtar, Senaryolar, İklim, Süpürge, Medya) daraltılır, birden fazla cihaz tek seferde eklenir. Betik, sahne ve otomasyonlar renkli düğme olur. Işık karosunun adı ve simgesi değiştirilebilir; senaryo düğmesine renk ve simge verilir. İklim kartında sıcaklık ve nem sensörü, dış sıcaklık sensörü, birlikte kontrol edilen ikinci cihaz ve tür (klima/petek) seçilir.
- **Simge seçici:** Simge alanlarının yanındaki düğme. **Simgeler** sekmesinde panonun 1305 simgesi var; önce o şeye uygun olanlar önerilir (oda, ışık ya da senaryo için), arama kutusu Türkçe kelimeleri de tanır. ★ işaretliler panoya özel çizimler. Light Effect Card kuruluysa **Light Effect Card** sekmesinde onun 356 renkli efekt simgesi de seçilebilir. İstersen `mdi:...` adını doğrudan yazarsın; sette yoksa en yakın simge çizilir.
- **Önizleme ekranları:** Tablet 16:10, Tablet 4:3, Geniş 16:9, Telefon ve Bu ekran. Bölüm sığmazsa önizlemede uyarı çıkar.
- **Geri al:** Her değişiklik geri alınabilir (düğme ya da Ctrl+Z). **⋯** menüsündeki **Otomatik düzene dön** her şeyi sıfırlar.

![Simge seçici](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/icon-picker.png)

### Ayarlar

Sağ üstteki **Ayarlar** evdeki bütün tabletlere uygulanır:

- *Dil:* otomatik (Home Assistant'ın dili), Türkçe ya da İngilizce.
- *Mevsim:* iklim bölümünde yazın klimalar, kışın petekler. Otomatik: Mayıs-Eylül yaz.
- *Arka plan:* koyu (varsayılan), siyah, istediğin bir renk, efekt renkleri ya da kendi resmin (`/local/zemin.jpg` gibi bir adres). Efekt renkleri Light Effect Card'ın efekt paletleri (Kutup ışığı, Ateş, Gün batımı, Okyanus, Galaksi ve 25 tane daha): koyu zeminde yumuşak bir renk ışıltısı. Light Effect Card kurulu olmasa da seçilebilir.
- *Simge stili:* Otomatik (varsayılan; kapalı cihazlar ve seçili olmayan odalar gri, açıklar renkli), Renkli (hepsi renkli) ya da Düz (hepsi gri). Simge seti ayrı bir dosyadır; bir kez indirilir, tarayıcı saklar.
- *HA teması:* açılır pencerelerin kullanacağı Home Assistant teması (boş bırakılabilir).
- *Üst barı gizle / Yan menüyü gizle:* yalnızca bu panoda Home Assistant'ın başlık çubuğu ve sol menüsü görünmez.
- *Kanvas:* tasarım genişliği ve referans yüksekliği; pano ekrana bu oranla ölçeklenir.
- *Işığa basılı tutunca:* Işık penceresi (varsayılan), HA penceresi ya da (Light Effect Card kuruluysa) efekt ekranı.
- *Lemur Light Effect Card:* kurulu olup olmadığı ve üst şeritteki Efektler düğmesi.
- *Sürüm.*

## Işık penceresi

Işık karosuna basılı tut. Üstte büyük parlaklık çubuğu (sürükle) ve güç düğmesi, altında sekmeler:

- **Renk:** 2200 K ile 6500 K arası beyaz ton düğmeleri, renk çemberi ve hazır renkler. Işık yalnızca beyaz destekliyorsa sadece beyaz tonlar görünür.
- **Efekt:** Işığın kendi efektleri. Light Effect Card kuruluysa efekt ekranı lambanın odasıyla açılır.
- **Segment:** Segmentleri olan şerit ve lambalarda tek tek segment seçip renk verirsin.

Pencere geri tuşu, Esc ya da ✕ ile kapanır. Ayarlardan Home Assistant'ın kendi cihaz penceresine geçebilirsin.

![Işık penceresi](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/light-window.png)

## Telefon

Ekran 700 pikselden darsa pano telefon düzenine geçer: oda düğmeleri yana kayan bir şerit olur, bölümler tek sütunda alt alta dizilir, senaryolar iki sütunda durur. Işık bölümünü **Telefonda otomatik** yaparsan telefonda ışıklar iki sütun kaydırmalı çubuk olur. Ayrı bir pano gerekmez; aynı pano tablette tablet, telefonda telefon düzeniyle açılır.

<img src="https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/phone.png" alt="Telefon düzeni" width="320">

## Işık efektleri (isteğe bağlı)

[Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card) ayrıca kuruluysa pano onu kendiliğinden tanır, yönetim paneli de ilk açılışta haber verir:

- **Üst şeritte Efektler:** Oda düğmelerinin yanına kendiliğinden gelir; dokununca efekt ekranı o sekmenin odasıyla tam ekran açılır. Ayarlardan kapatılabilir.
- **Efekt ekranı düğmesi:** İstersen senaryo bölümüne de eklenir.
- **Efekt düğmeleri:** Senaryoya düğme eklerken seçicide **Işık efektleri** grubunda odanın efektleri listelenir; seçilen efekt tek dokunuşla başlar. **Efekti durdur** düğmesi de eklenebilir.
- **Oynayan efekt görünür:** Odada efekt oynarken o odanın ışık karoları efektin renkleriyle parlar, efektin düğmesi yanar.
- **Işık penceresinden efekt ekranına:** Işık penceresindeki Efekt sekmesi efekt ekranını lambanın odasıyla açar. İstersen ayarlardan ışığa basılı tutmak doğrudan efekt ekranını açar.

Kurulu değilse bu düğmeler panoda görünmez, başka hiçbir şey değişmez.

![Efektler düğmesi ve oynayan efekt](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/effects.png)

## Güncelleme

1. **HACS → Lemur Home Dashboard → ⋮ → Bilgileri güncelle**, sonra **İndir** (ya da Ayarlar'daki güncelleme bildiriminden **Güncelle**). HACS özel depolara kendiliğinden ancak 48 saatte bir bakar; "Bilgileri güncelle" bunu beklemeden yapar.
2. Home Assistant'ı yeniden başlat.

Pano, tarayıcının ve telefon uygulamasının sakladığı eski sayfa kopyalarını kendisi temizler; eski sürüm bir kez gelirse sayfa bir kez yenilenir. Sekmelerin, bölümlerin ve ayarların güncellemede silinmez.

## Sorun giderme

- **"Timeout waiting for strategy element" ya da pano boş.** Entegrasyonun eklendiğinden ([adım 2](#2-entegrasyonu-ekle)) ve Home Assistant'ın yeniden başlatıldığından emin ol, sonra sayfayı Ctrl+F5 ile yenile. Telefon uygulamasında **Ayarlar → Companion app → Reset frontend cache**.
- **Sol menüde Lemur Home Dashboard yok.** Sayfa yalnızca yönetici kullanıcılara görünür. Pano herkes için çalışır.
- **Bir cihaz panoda yok.** Otomatik düzen cihazları Home Assistant alanlarından bulur; alanı olmayan cihazlar **Diğer** sekmesinde toplanır. Yönetim panelinde istediğin bölüme **Ekle** ile ekleyebilirsin.
- **Pano HA düzenleyicisinde açılıyor ve değişiklikler panele yansımıyor.** Panoda "Kontrolü al" denmiş olabilir. Ham yapılandırma düzenleyicisinde içeriği yine [iki satırlık koda](#3-panoyu-oluştur) çevir.
- **Bölüm sığmıyor.** Yönetim panelindeki önizleme sığmayan bölümü işaretler; öğe sayısını azalt, bölümü başka kolona taşı ya da kolonu genişlet.
- **Hâlâ çözülmedi mi?** [Sorun bildir](https://github.com/mendebur-lemur/lemur-home-dashboard/issues); Home Assistant sürümünü, tarayıcıyı ve cihazı yazarsan hızlı bakarız.

## Ekran görüntüleri

| Ev sekmesi | Oda sekmesi |
|---|---|
| ![Ev sekmesi](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/dashboard.png) | ![Oda sekmesi](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/room.png) |
| **Yönetim paneli** | **Ayarlar** |
| ![Yönetim paneli](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/admin.png) | ![Ayarlar](https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/docs/images/tr/settings.png) |

## Lemur ailesi

Üçü de birbirinden bağımsız kurulur; birlikte kurulunca birbirini tanır.

| | Ne yapar | Kurulum |
|---|---|---|
| **Lemur Home Dashboard** (bu depo) | Tek satırla kurulan, kendi yönetim paneli olan hazır tablet panosu | [![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-home-dashboard&category=integration) |
| **[Lemur Light Effect Card](https://github.com/mendebur-lemur/lemur-light-effect-card)** | Efekt destekleyen bütün ışıkları oda oda yöneten efekt ekranı. Kuruluysa panoda Efektler düğmesi ve efekt düğmeleri açılır. | [![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-light-effect-card&category=integration) |
| **[Lemur Halo Cards](https://github.com/mendebur-lemur/lemur-halo-cards)** | Durumu renkli haleyle anlatan sekiz kart: iklim, sensör, hava, süpürge, enerji, güvenlik... Panodaki iklim ve süpürge kartları bu ailedendir ve pakete gömülü gelir; başka panolarda kullanmak için ayrıca kurabilirsin. | [![HACS'ta aç](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-halo-cards&category=plugin) |

## Geliştirme

```bash
python3 build.py          # src/ klasörünü custom_components/.../frontend/ içine tek dosya olarak paketler
```

Ayarlar `.storage/lemur_home_dashboard` içinde tutulur. Pano `custom:lemur-home-dashboard` stratejisiyle üretilir; her sekme tek bir `custom:lemur-home-dashboard-card` kartı içeren bir görünümdür.

## Lisans

Kod **[GPL-3.0](LICENSE)** lisansıyla ve [NOTICE.md](NOTICE.md) dosyasındaki ek atıf koşuluyla yayınlanır:

- Herkes kullanabilir, değiştirebilir ve paylaşabilir.
- Bu kodu kullanan ya da üzerine geliştiren her proje **kendi kaynak kodunu da aynı lisansla açmak** zorundadır; kapalı kaynak bir ürüne dönüştürülemez.
- Kopyalar ve geliştirilmiş sürümler şu atıf satırını korumak zorundadır: *Based on Lemur Home Dashboard by mendeburlemur — https://github.com/mendebur-lemur/lemur-home-dashboard*

Görseller, videolar ve dokümanlar **[CC BY-NC-SA 4.0](docs/LICENSE.md)** lisansıyla yayınlanır: kaynak göstererek, ticari olmayan amaçla ve aynı lisansla paylaşılabilir.

v0.1.0 ve önceki sürümler MIT lisansıyla yayınlanmıştı; o sürümler için MIT geçerli kalır.
