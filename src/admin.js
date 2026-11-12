// lemur-home-dashboard-admin: sol menüdeki yönetim paneli.
// Düzen Light Effect Card'ın kontrol paneliyle aynı aile: üstte sekme şeridi (seçili sekmenin ayarları altında birleşik),
// solda panonun canlı önizlemesi (tıklayınca bölüm seçilir), sağda bölüm düzenleyici. Her değişiklik anında kaydedilir,
// açık bütün tabletler canlı güncellenir; "Geri al" (Ctrl+Z) son değişiklikleri geri alır.
// Ayar yokken pano otomatik düzendedir; ilk değişiklikte o düzen kopyalanıp kaydedilir.

const ADM = {
  tr: {
    title: 'Lemur Home Dashboard', auto: 'Otomatik düzen', autoT: 'Pano şu an evin alanlarından kendiliğinden kuruluyor. İlk değişiklikte bu düzen kaydedilir, sonra her şey buradan düzenlenir.',
    undo: 'Geri al', undoK: 'Geri al (Ctrl+Z)', redoK: 'İleri al (Ctrl+Y)', redone: 'İleri alındı', settings: 'Ayarlar', more: 'Diğer işlemler', saved: 'Kaydedildi', undone: 'Geri alındı', err: 'Kaydedilemedi: {e}', errConflict: 'Bu ayar başka bir ekrandan değiştirildi; güncel hâli yüklendi. Değişikliğini yeniden yap.',
    layout: 'Düzen', layCols: 'Sütunlar', layGrid: 'Serbest ızgara', layGridT: 'Kutuyu ⠿ ile taşı, sağ alt köşesinden büyüt; ötekiler yer açar. Dikey ekranda düzen kendiliğinden 6 sütuna iner; orada değiştirirsen o ekranın kendi düzeni olur.', gFit: 'Ekrana sığdır', gScr: 'Kaydırılabilir', gmAuto: 'Dikey düzeni otomatiğe döndür', gPos: '{w}×{h}', gFill: 'Boşlukları doldur', gFillT: 'Kutular sağa ve aşağı uzayıp boş hücreleri kapatır', gRowsT: 'Ekranın kaç satıra bölüneceği: çok kutu varsa artır', gmAutoT: 'Dikey ekrandaki elle yapılan düzen silinir, geniş düzenden yeniden türetilir', tabName: 'Sekme adı', icon: 'Simge', area: 'Alan', noArea: 'Alan yok', cols: 'Kolonlar', colAdd: 'Kolon ekle', colDel: 'Son kolonu kaldır', tabBg: 'Odanın arka planı', tabBgOwn: 'bu odaya özel', tabBgSame: 'Genel', tabBgT: 'Genel: Stil seç\'teki arka plan. Bir renk ya da efekt seçersen yalnız bu sekmede o görünür. Telefona özel zemin seçtiysen telefonda o geçerli.', scr_custom: 'Özel', scrCustT: 'Cihazının çözünürlüğü (genişlik × yükseklik). Tablette oran önemli, çözünürlüğü olduğu gibi yazabilirsin (ör. 2560 × 1600). Telefonda tarayıcının gördüğü genişliği yaz (ör. 412 × 915).', colTab: 'Tablet düzeni', colEq: 'Eşit', colHint: 'Genişliği önizlemede kolonların arasındaki çizgiyi sürükleyerek ayarla.', delTab: 'Sekmeyi sil', sure: 'Emin misin?',
    refill: 'Alandan yeniden doldur', refillT: 'Bu sekmenin bölümleri seçili alanın cihazlarıyla baştan kurulur.', addTab: 'Sekme', newTab: 'Yeni sekme', emptyTab: 'Boş sekme', fromArea: 'Alandan sekme',
    preview: 'Önizleme', pvFolds: 'Grupları göster', pvFoldsT: 'Katlanır grupları telefondaki gibi göster. Kapalıyken gruptaki öğeler yerinde görünür; sıralamak için kapat.', pvHint: 'Kutuyu ⠿ tutamağından, öğeyi kendisinden sürükle · çizgilerden boyutlandır', splits: 'Kolon içi sütun', splitsT: 'Bir kolonu eşit genişlikte 2-3 sütuna böler (ör. yan yana iki senaryo bölümü). Kolon dar ise yer açmak için kendiliğinden genişler.', splitNarrow: 'Bu kadar sütun ekrana sığmaz: önce kolon sayısını azalt', sub: 'Sütun', sections: 'Bölümler', addSec: 'Bölüm ekle', noSec: 'Bu sekmede bölüm yok.',
    secTitle: 'Başlık', column: 'Kolon', colL: 'Sol', colM: 'Orta', colR: 'Sağ', tileCols: 'Satırdaki karo', look: 'Görünüm', lookTile: 'Karo', lookBar: 'Kaydırmalı', lookPhone: 'Telefonda otomatik', lookTileT: 'Kare karolar: dokun aç/kapat, basılı tut pencere', lookBarT: 'Yatay çubuklar: dokun aç/kapat, sağa-sola kaydır parlaklık, basılı tut pencere', lookPhoneT: 'Tablette karo, telefonda kaydırmalı çubuk', barCols: 'Satırdaki çubuk', delSec: 'Bölümü sil',
    d_camera: 'Kamera görüntüleri', t_values: 'Değerler', t_cards: 'Kartlar', t_subs: 'Alt başlık', t_free: 'Boş bölüm', t_lights: 'Işıklar', t_scenes: 'Senaryolar', t_climate: 'İklim', t_vacuum: 'Süpürge', t_media: 'Medya', t_camera: 'Kameralar', camTab: 'Kameralar sekmesi', edMode: 'Düzenlenen', edTab: 'Tablet', edPh: 'Telefon', phBanner: 'Telefon düzenleniyor: buradaki değişiklikler yalnız telefonda geçerli, tablet aynı kalır.', phShown: 'Telefonda görünür', phHidden: 'Telefonda gizli', phOwn: 'telefona özel', phReset: 'Tablettekine dön', phOrderT: 'Sürükleyerek telefondaki sırayı değiştir; tabletteki yerleri aynı kalır.', phLook: 'Telefonda görünüm', phLookSame: 'Tabletteki gibi', phLookTiles: 'Karo', phLookRows: 'Tek sıra', phCols: 'Telefonda satırdaki karo', phColsAuto: 'Oto', phItems: 'Telefonda görünen öğeler', phItemsT: 'Dokun: telefonda gizle ya da göster. Tablette hepsi kalır.', phLookRows2: 'İkili sıra', phFolds: 'Katlanır gruplar', phFoldsT: 'Bazı öğeleri telefonda tek bir satırda topla; satıra dokununca açılır (ör. RGB Işıklar). Grup bölümün sonunda durur.', phFoldAdd: 'Katlanır grup ekle', phFoldPh: 'Grubun adı (ör. RGB Işıklar)', phFoldDel: 'Grubu sil', phFoldN: '{n}. grup', phFoldPick: 'Gruptakiler ({n}) · dokunarak seç', phFlat: 'Bölümler', phFlat0: 'Çerçeveli', phFlat1: 'Çerçevesiz', phFlatT: 'Çerçevesiz: telefonda bölüm kutuları çizilmez, başlıklar küçük etiket olur; ışıklara ve düğmelere daha çok yer kalır. Tablet etkilenmez.', phShared: 'Bölümün adı, kolonu ve içindeki cihazlar tabletle ortak; bunları değiştirmek için üstten Tablet\'e geç.', phHiddenSec: 'Bu bölüm telefonda gizli. Göstermek için listede "Telefonda gizli"ye dokun.', phResetAll: 'Telefona özel ayarları sıfırla', phResetAllT: 'Bütün bölümlerin telefon ayarları ve telefondaki sıraları silinir; telefon yeniden tabletin düzenini izler.', phSecsT: 'Bölümleri telefonda gizlemek, sıralamak ya da görünümlerini değiştirmek için yönetim panelinde üstteki Düzenlenen: Telefon\'u seç.', phNoItemDrag: 'Telefonda öğelerin sırası tabletle ortak; tuttuğun öğenin bölümü taşınır.', phCount: '{n} telefona özel ayar', phLookT: 'Telefon görünümü', phLookS: 'Gezinme, ışıklar, simge stili, iklim kartları, zemin', phSame: 'Telefonu tabletle aynı yap', phSameT: 'Telefona özel bütün ayarlar silinir: oda düğmeleri, bölümler, öğe sıraları, simge stili, iklim kartları, zemin. Işıklar Bölümdeki gibi olur. Geri al ile dönülebilir.', phSameAsk: 'Emin misin? Telefona özel her şey silinecek', phSameNone: 'Telefon şu an tabletle aynı', phSameGo: 'Aynı yap', phSameYes: 'Evet, sil', phSameNo: 'Vazgeç', phStSame: 'Tabletteki gibi', phBg: 'Zemin', phIcons: 'Simge stili', phClim: 'İklim ve süpürge kartları', phTabName: 'Telefonda adı', phTabIcon: 'Telefonda simgesi', phTabShow: 'Oda düğmesi telefonda', phTabHidden: 'Bu sekmenin düğmesi telefonda gizli; sekme telefonda yine doğrudan açılabilir.', phTabNote: 'Alan, kolonlar ve sekmeyi silmek tabletle ortak; bunlar için Tablet\'e geç. Oda düğmelerinin telefondaki sırası yukarıdaki şeritte sürüklenerek değişir.', phItemsDrag: 'Telefondaki sırayı değiştirmek için önizlemede öğeyi sürükle.', phDark: 'Koyu', phBlack: 'Siyah', camTabT: 'Bütün kameralar tek sekmede, alt alta', camCols: 'Satırda kaç kamera', camAuto: 'Oto', camColsT: 'Oto: kutuya sığdığı kadar yan yana (her biri en az 240 piksel). Telefonda en fazla 2.', camRef: 'Görüntü yenileme', camRefT: 'Karodaki anlık görüntü bu aralıkla yenilenir; dokununca canlı görüntü açılır', camRefOff: 'Yavaş', picksB: 'Önerilen ürünler', picksS: 'Evimde kullandığım, panelle denenmiş ürünler', pkAd: 'Tanıtım', pkCat_all: 'Hepsi', pkCat_light: 'Işıklar', pkCat_plug: 'Priz ve röle', pkCat_switch: 'Anahtar ve panel', pkCat_remote: 'Kumanda', pkCat_sensor: 'Sensör', pkCat_climate: 'İklim', pkCat_hub: 'Ağ ve hub', pkCat_other: 'Diğer', pkSearch: 'Ürün ara', pkReady: 'Ölçümü hazır', pkReadyT: 'Yalnız panelde gücü hazır olanlar: ölçüm tablosu olan ya da gücünü kendisi ölçen ürünler', pkProto: 'Bağlantı: hepsi', pkE_lut: 'Ölçüm tablosu hazır', pkE_self: 'Kendisi ölçüyor', pkE_wait: 'Ölçülüyor', pkE_none: 'Ölçüm gerekmez', pkNote: 'Amazon Ortağı olarak uygun alışverişlerden kazanç sağlıyorum.', pkEmpty: 'Bu süzgeçte ürün yok.', pkInfo: 'Ayrıntılar', pkWhy: 'Neden', pkPros: 'Artıları', pkCons: 'Eksileri', pkApp: '{s} uygulamasında aç', pkSend: 'Telefonuma gönder', pkQr: 'ya da kamerayla okut', pkHere: 'Bu bilgisayarda aç', pkSent: '{s} telefonuna gönderildi', pkSendErr: 'Telefona gönderilemedi', pkWhich: 'Hangi telefona?', picksSet: 'Önerilen ürünler', picksSetT: 'Üst şeritteki Önerilen ürünler düğmesi', pkShow: 'Göster', pkHide: 'Gizle', pkLocal: 'Yerel', starB: 'Yıldız ver', starT: 'Beğendiysen GitHub\'da yıldız ver', starNews: 'Panoyu beğendiysen GitHub\'da bir yıldız vermen geliştirmeye destek olur.', starGh: 'GitHub\'da yıldız ver', covTiltE: 'Kanat açısı motoru (isteğe bağlı)', covTiltET: 'Kanatları ayrı bir motor döndürüyorsa onun perde varlığını seç; penceredeki Kanat açısı sırası onu sürer. Boş bırakılırsa perdenin kendi kanat ayarı kullanılır.', guideT: 'Rehber', guideOpts: 'Seçenekler', guideS: 'Panonun yapabildiği her şey, adım adım ve görselli', guidePrev: 'Önceki', guideNext: 'Sonraki', guideDone: 'Bitir', guideGh: 'GitHub\'da aç', guideStep: '{n} / {m}', guideNoImg: 'Görsel yüklenemedi (internet yok ya da GitHub\'a ulaşılamıyor).', covL: 'Perde penceresi', covAuto: 'Oto', cov_center: 'Ortadan açılan', cov_side: 'Tek yönden', cov_shutter: 'Panjur', cov_shade: 'Stor', cov_blind: 'Jaluzi', cov_vert: 'Dikey stor', covDir: 'Toplanma yönü', covDl: 'Sola', covDr: 'Sağa', covDc: 'İki yana', covT: 'Basılı tutunca açılan pencerenin çizimi ve düğmeleri buna göre değişir. Oto: cihazın türünden seçilir.', camRefS: 'Görüntü yenileme', camRefST: 'Bu bölümdeki bütün kameralar için. Tek bir kamera kendi ⚙ ayarından ayrıca değiştirilebilir.', d_free: 'Başlıksız boş kutu', secFree: 'Bölüm türü sadece başlangıç: her bölüme her şey eklenebilir, her öğe kendi türüne göre görünür.', pfAll: 'Tümü', pfTile: 'Işık ve anahtar', titleOpt: 'Başlık (isteğe bağlı)',
    d_lights: 'Işık, priz, perde karoları', d_scenes: 'Script, sahne ve otomasyon düğmeleri', d_climate: 'Klima ve petek kartları (Yaz/Kış)', d_vacuum: 'Robot süpürge kartları', d_media: 'TV ve hoparlörler',
    n_items: '{n} öğe', addDev: 'Ekle', addPh: 'Boş karo', addScene: 'Düğme ekle', name: 'Ad', target: 'Çalıştırılacak', noItems: 'Henüz öğe yok.',
    tSensor: 'Sıcaklık sensörü', hSensor: 'Nem sensörü', fromDevice: 'Cihazdan', noOutdoor: 'Dış sıcaklık yok', noLink: 'Birlikte kontrol yok', linkT: 'Birlikte kontrol edilen cihaz (ör. aynı odadaki ikinci petek)', outdoorT: 'Dış sıcaklık sensörü (petek kartı ısıtma ihtiyacını gösterir)', addScPh: 'Boş düğme', kind: 'Tür', k_auto: 'Otomatik', k_ac: 'Klima', k_radiator: 'Petek',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Geniş 16:9', scr_tabp: 'Büyük dikey', scr_phone: 'Telefon', scr_here: 'Bu ekran',
    pickT: 'Ekle', search: 'Ara: ad, alan ya da varlık kimliği', cancel: 'Vazgeç', addN: 'Ekle ({n})', added: 'Ekli', noArea2: 'Alanı olmayanlar', nothing: 'Eşleşen cihaz yok.',
    sHelp: 'Yardım', repT: 'Sorun bildir', repS: 'Sürüm ve cihaz bilgisiyle GitHub\'da kayıt açar; ne olduğunu yazman yeter', repQ: 'Ne oldu?', repPh: 'Ne yaptın, ne bekliyordun, ne oldu? Örnek: Salon sekmesinde ışık çubuğunu kaydırınca parlaklık değişmiyor.', repInfo: 'Kayda eklenecek bilgiler', repInfoS: 'Kişisel bilgi yok: oda, cihaz ve kişi adları, adresin ya da hesabın eklenmez.', repNoGh: 'GitHub hesabın yoksa metni kopyalayıp geliştiriciye ilet.', repCopy: 'Metni kopyala', repCopied: 'Kopyalandı', repGh: 'GitHub\'da aç', rWhat: 'Ne oldu?', rInfoH: 'Bilgiler', rPanel: 'Pano', rInt: 'entegrasyon', rHa: 'Home Assistant', rBrowser: 'Tarayıcı', rApp: 'HA uygulaması', rScreen: 'Ekran', rTouch: 'dokunmatik', rNoTouch: 'dokunmatik değil', rCanvas: 'kanvas', rLang: 'Dil', rLayout: 'Düzen', rAuto: 'otomatik', rTabs: 'sekme', rSecs: 'bölüm', rItems: 'öğe', rKinds: 'Öğe türleri', rLook: 'Görünüm', rLec: 'Light Effect Card', rErr: 'Son hatalar', rNoErr: 'yok', sBackup: 'Yedek', sjVer: 'Sürüm', akHoldPopT: 'Panelin penceresi: parlaklık, renk, beyaz ton', akHoldHaT: 'Home Assistant\'ın kendi penceresi', akHoldLecT: 'Işık efektleri ekranı', sjLight: 'Efektler', sjWalls: 'Anahtarlar', bkDown: 'Yedeği indir', bkDownS: 'Sekmeler, bölümler ve ayarlar tek dosyada', bkUp: 'Yedekten geri yükle', bkUpS: 'Bir yedek dosyası seç; önce onay sorulur, şu anki düzenin yerine geçer', bkQ: 'Yedek geri yüklensin mi?', bkW: '{d} tarihli yedek (v{v}): {n} sekme, {s} bölüm. Şu anki sekmeler, bölümler ve ayarlar bu yedekle değiştirilir. Geri al ile dönebilirsin.', bkVer: 'Yedek v{v} ile alınmış; yine de yüklenebilir.', bkSvc: 'Bu yedekteki hayvanlar şu servisleri kendiliğinden çalıştırır:', twinL: 'Yedek kontrol', twinNone: 'Yok', twinT: 'Lamba cevap vermezse komut buradan da gönderilir', sWalls: 'Duvar anahtarları', wallsT: 'Röle yalnız sinyal veriyorsa elle basınca seçilen lamba açılır/kapanır', wallSw: 'Anahtar', wallLight: 'Lamba', wallBr: 'Parlaklık %', wallK: 'Kelvin', wallAdd: 'Anahtar ekle', wallDel: 'Kaldır', wallPick: 'Seç…', wallNone: 'Henüz duvar anahtarı yok.', wallAuto: 'Bu anahtar için HA\'da ayrıca bir otomasyon varsa kapat: {n}', bkYes: 'Geri yükle', bkSaved: 'Yedek indirildi', bkOk: 'Yedek geri yüklendi', bkErr: 'Bu dosya bir pano yedeği değil', newsT: 'Yenilikler', newsV: 'v{v} ile gelenler', newsOld: 'Önceki sürümler', newsAll: 'Bütün notlar GitHub\'da', newsOk: 'Tamam', newsLink: 'Yenilikler', sVer: 'Sürüm ve güncelleme', updT: 'Sürüm', updInst: 'Yüklü: v{v}', updCheck: 'Güncellemeleri denetle', updChecking: 'Denetleniyor…', updOk: 'güncel', updAt: 'son kontrol {t}', updNew: 'v{v} hazır', updNotes: 'Yenilikler', updNoHacs: 'HACS ya da Marketplace ile kurulmadığı için buradan yüklenemiyor', updGo: 'Güncelle', updGh: 'GitHub’da aç', updIng: 'v{v} indiriliyor…', updDone: 'v{v} indirildi. Home Assistant yeniden başlayınca devreye girer.', updRestart: 'Yeniden başlat', updAsk: 'Home Assistant yeniden başlasın mı? Bir iki dakika ışık kontrolü ve otomasyonlar durur.', updYes: 'Evet, yeniden başlat', updRest: 'Yeniden başlatılıyor… Açılınca sayfa kendiliğinden yenilenir.', updErr: 'Denetlenemedi: {e}', updAgain: 'Tekrar denetle', s_board: 'Pano', s_look: 'Görünüm', s_screen: 'Ekran', s_info: 'Işık efektleri',
    lang: 'Dil', lAuto: 'Otomatik', season: 'Mevsim', seasonT: 'İklim bölümünde Yaz klimaları, Kış petekleri gösterir. Otomatik: Mayıs-Eylül yaz.', sAuto: 'Otomatik', sSum: 'Yaz', sWin: 'Kış',
    bg: 'Arka plan', bgT: 'Koyu: tablet panosundaki zemin. Renk: istediğin düz renk. Efekt (varsayılan, Meditasyon): Light Effect Card\'ın efekt renkleriyle yumuşak ışıltı. Resim: /local/zemin.jpg gibi bir adres.', bgDark: 'Koyu', bgBlack: 'Siyah', bgColor: 'Renk', bgFx: 'Efekt', bgImg: 'Resim', bgUrl: 'Resim adresi', bgBad: 'Bu adreste resim açılmadı: dosyayı HA\'nın config/www klasörüne koy, adresi /local/dosya.jpg diye yaz.',
    theme: 'HA teması', themeT: 'Boş bırakılabilir; açılır pencereler bu temayla gelir.', kHeader: 'Üst barı gizle', kHeaderT: 'Bu panoda HA\'nın başlık çubuğu görünmez.',
    bb: 'Saatte parlaklık', bbT: 'Üst şeritte saatin olduğu alanı sağa sola kaydırınca o sekmenin odasında açık olan bütün ışıkların parlaklığı birlikte değişir. En sola çekince kapanırlar; hepsi kapalıyken kaydırınca en son kapatılanlar yeniden açılır.', bbPh: 'Telefonda ve dikey tablette de', bbPhT: 'Bu ekranlarda üstte saat ayrı bir kutuda değil: sayfa adı ile saatin olduğu satır sağa sola kaydırılır. Kapatırsan bu satır kaydırılamaz.', bbLook: 'Görünüm', bbLookT: 'Gizli: yalnız saat görünür, kaydırınca belirir. Kutu: oda düğmeleri gibi bir kutu.', bbHidden: 'Gizli', bbBox: 'Kutu', bbIcon: 'Simge', bbIconT: 'Solda ampul simgesi', bbVal: 'Parlaklık göstergesi', bbValT: 'Kaydırırken: dolgu ve yüzde yalnız kaydırırken görünür. Hep: açık ışık varken hep görünür.', bbDrag: 'Kaydırırken', bbAlways: 'Hep',
    kSide: 'Yan menüyü gizle', kSideT: 'Bu panoda HA\'nın sol menüsü görünmez. Bilgisayarda fareyi ekranın sol kenarına götürünce açılır; telefonda ve tablette sağa kaydırınca.', kNo: 'Gizleme', kTouch: 'Telefon ve tablette', kAll: 'Her yerde', canvas: 'Kanvas', canvasT: 'Tasarım genişliği ve referans yüksekliği (px). Pano ekrana bu oranla ölçeklenir.',
    navAl: 'Oda düğmelerini kolona hizala', navAlT: 'Üst şeritteki oda düğmeleri seçilen kolonun sağ kenarında biter ve aradaki alanı eşit paylaşır. Her ekran boyutunda aynı hizada kalır.', navNo: 'Kapalı', navCol: '{n}. kolon', navFx: 'Efektler de hizalı alanda', navFxT: 'Açıkken Efektler düğmesi oda düğmeleriyle birlikte hizalanır; kapalıyken saatin yanında durur.', navSz: 'Oda düğmelerinin boyutu', navSzT: 'Genişlik ve yükseklik (piksel). Boş bırakılırsa 235 × 155.', navSzA: 'Yükseklik (piksel). Kolona hizalıyken genişlik kendiliğinden ayarlanır. Boş bırakılırsa 155.', navW: 'Genişlik', navH: 'Yükseklik', clSt: 'İklim ve süpürge kartları', clStT: 'Halo: büyük, halkalı kartlar. Sade: tek satır; iklimde durum, sıcaklık ve hedef, süpürgede durum, pil, başlat ve istasyon. Karta dokununca genişler: hedef − +, aç/kapat, mod, fan, salınım ya da durdur, bul, emiş gücü (cihaz destekliyorsa).', clHalo: 'Halo', clRows: 'Sade', s_phone: 'Telefon', phNav: 'Gezinme', phNavT: 'Altta kategoriler (önerilen): altta Işıklar, İklim, Senaryolar; ışıklarda odalar arasında sağa sola kaydırarak geçilir. Altta odalar: oda düğmeleri ekranın altında, uygulama gibi. Üstte odalar: eski düzen, oda düğmeleri üstte.', phTop: 'Üstte odalar', phRooms: 'Altta odalar', phCats: 'Altta kategoriler', phLights: 'Işıklar', phLightsT: 'Bölüm ayarındaki gibi, hep karo ya da tek sıra (her ışık bir satır; dokun aç/kapat, sağa sola kaydır parlaklık).', phLAuto: 'Bölümdeki gibi', phLTiles: 'Karo', phLRows: 'Tek sıra', phSheet: 'Işık penceresi alttan', phSheetT: 'Basılı tutunca açılan pencere ekranın altından gelir; aşağı çekince kapanır. Tablet etkilenmez.', akT: 'Otomatik kur', akHint: 'Pano HA\'daki alanlardan ve cihazlardan kurulur. Seç, aşağıda sonucu gör, Uygula.', akRooms: 'Odalar (her biri bir sekme)', akHome: 'Ev sekmesi', akHomeT: 'Bütün evin özeti: odalardan sırayla ışıklar, senaryolar, iklim', akOther: 'Diğer sekmesi', akOtherT: 'Seçilmeyen odaların ve alanı olmayan cihazların sekmesi', akWhat: 'Neler dahil olsun', akL: 'Işıklar', akS: 'Senaryolar', akC: 'İklim', akV: 'Süpürge', akM: 'Medya', akK: 'Kameralar', akLook: 'Görünüm', akLights: 'Işıklar', akTiles: 'Karo', akBars: 'Kaydırmalı çubuk', akPhoneBars: 'Telefonda çubuk', akRes: 'Sonuç · {n} sekme', akSum: '{l} ışık · {s} senaryo · {c} kart', akNone: 'Seçimle hiç sekme oluşmuyor.', akWarn: 'Uygula mevcut sekmelerin yerine geçer. Beğenmezsen üstteki geri al ile dönebilirsin; ayarların kalır.', akGo: 'Uygula', akOk: 'Pano otomatik kuruldu', akNoAreas: 'HA\'da henüz alan (oda) yok. Ayarlar → Alanlar\'dan oda ekleyince burada çıkar.', akRoomsT: 'Senin evindeki alanlar; seçilenler birer sekme olur. Önizleme hayali bir evden.', akTabs: 'Sekmeler', akTilesT: 'Kare karolar, tablet gibi', akBarsT: 'Dokun aç/kapat, kaydır parlaklık', akPhoneBarsT: 'Tablette karo, telefonda çubuk', akHaloT: 'Büyük, halkalı kartlar', akRowsT: 'Tek satır, dokununca açılır', akBgZen: 'Meditasyon', akBgAur: 'Kutup ışığı', akBgSun: 'Gün batımı', akBgOce: 'Okyanus', akPhone: 'Telefon', akPhoneT: 'Önizlemede Telefon\'a geçince görünür', akCatsT: 'Altta Işıklar, İklim, Senaryolar', akRoomsBT: 'Oda düğmeleri altta', akTopT: 'Oda düğmeleri üstte', akPvTab: 'Tablet', akPvPh: 'Telefon', akPvNote: 'Hayali bir ev: senin panon seçtiğin odalarla, kendi cihazlarından kurulur. Önizlemeye dokunup deneyebilirsin.', akTablet: 'Tablet', akTabletT: 'Önizleme tablete geçer', akPLSame: 'Tabletteki gibi', akPLSameT: 'Bölümün ayarı geçerli', akSheetOn: 'Alttan açılsın', akSheetOnT: 'Aşağı çekince kapanır', akSheetOff: 'Ortada açılsın', akSheetOffT: 'Tabletteki gibi pencere', akBgKeep: 'Seçmezsen şimdiki arka planın kalır', akLec: 'Işık efektleri', akLecT: 'Lemur Light Effect Card ile · sende kurulu değil', akLecTOk: 'Lemur Light Effect Card sende kurulu: Efektler düğmesini açıp kapatabilirsin. Kurulu olmayanlar burada kartın ne işe yaradığını ve nasıl kurulduğunu görür.', akLecOn: 'Efektler açık', akLecOnT: 'Üst şeritte Efektler düğmesi; ışık penceresinde Efekt sekmesi', akLecOff: 'Efektler gizli', akLecWhy: 'Işıklarına hareketli efektler: ateş, kutup ışığı, gökkuşağı ve onlarcası', akLecHow: 'İsteğe bağlı. Marketplace\'ten (eski sürümlerde HACS\'tan) Lemur Light Effect Card\'ı indir, Ayarlar → Cihazlar ve servisler\'den entegrasyonu ekle, HA\'yı yeniden başlat. Pano onu kendisi tanır, ayar gerekmez: Efektler düğmesi, ışık penceresindeki Efekt sekmesi ve senaryolardaki efekt düğmeleri kendiliğinden açılır. Kaldırırsan bunlar gizlenir, pano bozulmaz.', akLecGet: 'Marketplace\'te aç', akST: 'Stil seç', akSHint: 'Sekmelerine dokunulmaz; görünüm ayarları topluca değişir. Önizlemede dene, beğenirsen Uygula.', akSrcMine: 'Benim evim', akSrcDemo: 'Örnek ev', akPvMine: 'Kendi panon. Önizlemede dokunuşlar cihazlarına gitmez.', akResS: 'Sekmelerin aynı kalır', akWarnS: 'Işık görünümü, iklim kartları, arka plan, telefon ve efekt ayarları değişir. Beğenmezsen geri al ile dönebilirsin.', akOkS: 'Stil uygulandı', stlT: 'Arka plan, ışık ve iklim görünümü, ışığa basılı tutunca açılan pencere, telefon düzeni ve Efektler düğmesi burada. Önizlemede dene, beğenirsen tek dokunuşla uygula.', stlGo: 'Stil seç', akImgT: 'HA\'nın www klasöründeki bir resim (/local/...) ya da bir internet adresi.', akPop: 'Işık penceresi', version: 'Sürüm', lec: 'Lemur Light Effect Card', lecOn: 'Kurulu ({v}). Efekt ekranı üst şeritten, ışık penceresinden ve senaryo düğmelerinden açılır.', lecOff: 'Kurulu değil. Işık efektleri için isteğe bağlı olarak kurulabilir; kurulunca Efektler düğmesi Stil seç\'ten açılıp kapanır.', lecNav: 'Üst şeritte Efektler', lecNavT: 'Panonun üst şeridinde, oda düğmelerinin yanında efekt ekranını açan düğme', lecInfoT: 'Lemur Light Effect Card kurulu', lecInfo: 'Panonun üst şeridine Efektler düğmesi eklendi: dokununca efekt ekranı o sekmenin odasıyla açılır. Senaryo bölümlerine tek tek efekt düğmesi de ekleyebilirsin (bölümü seç → Düğme ekle → Işık efektleri). Işık penceresindeki Efekt sekmesi de efekt ekranını açar.', ok: 'Tamam', iconPick: 'Simge seç', iconSug: 'Önerilen', iconAll: 'Arama sonuçları', iconSearch: 'Ara (ör. lamba, sofa, tavan)', iconMore: 'İlk {n} sonuç gösteriliyor, aramayı daralt', iconNone: 'Bulunamadı. Simgenin adını mdi:... diye yazabilirsin.', iconLoading: 'Simgeler yükleniyor…', icCol: 'Simgeler', iconEvery: 'Tüm simgeler', icColNone: 'Simgeler yüklenemedi.', icStyle: 'Simge stili', icStyleT: 'Otomatik: kapalı cihazlar gri, açıklar renkli. Renkli: hepsi renkli. Düz: hepsi gri. Tek renk: çizgiler tek tonda; kapalılar gri, açıklar seçtiğin renkte.', icAuto: 'Otomatik', icFlat: 'Düz', icColor: 'Renkli', icTint: 'Tek renk', icTintC: 'Renk seç', icTintL: 'Işıkta ışığın rengi', icTintLT: 'Tek renk stilinde açık ışığın simgesi lambanın kendi renginde görünür.', icLec: 'Efekt simgeleri', icLecNone: 'Efekt simgeleri yüklenemedi.', hold: 'Işığa basılı tutunca', holdT: 'Işık karosuna basılı tutunca açılan pencere', hPop: 'Işık penceresi', hHa: 'HA penceresi', hLec: 'Efekt ekranı', lecOpen: 'Efekt ekranı', lecStop: 'Efekti durdur', lecGroup: 'Işık efektleri · {r}', lecLoading: 'Efektler yükleniyor…', tOpen: 'Efekt ekranı · {r}', tPlay: 'Efekt: {e} · {r}', tStop: 'Efekti durdur · {r}', roomByTab: 'sekmenin odası', lecNa: 'Lemur Light Effect Card kurulu değil: bu düğme panoda görünmez',
    resetAll: 'Otomatik düzene dön', resetQ: 'Bütün sekme ve bölümler silinir, pano yeniden evin alanlarından kurulur. Ayarlar kalır.', resetOk: 'Otomatik düzene dönüldü',
    secL: 'İkinci satır', sc_none: 'Yok', sc_state: 'Durum', sc_lc: 'Son değişim', sc_attr: 'Öznitelik', sc_tpl: 'Yazı ya da şablon', swapL: 'Ad üstte, değer altta', cfmL: 'Dokununca onay iste', cfmT: 'Yanlışlıkla dokunmaya karşı: önce "çalıştırılsın mı?" diye sorar', cfmText: 'Soru (boşsa "<ad> çalıştırılsın mı?")', nameTplT: 'Ad ve ikinci satırda Home Assistant şablonu yazılabilir: {{ ... }}',
    cpT: 'Kart ekle', cpSearch: 'Kart ara', cpHalo: 'Halo kartları', cpHa: 'Home Assistant kartları', cpCustom: 'Kurulu özel kartlar', cpYaml: 'YAML ile yaz', ceT: 'Kartı düzenle', cePv: 'Önizleme', ceVisual: 'Görsel', ceYaml: 'YAML', ceNoEd: 'Bu kartın görsel düzenleyicisi yok; YAML ile düzenle.', ceLoad: 'Düzenleyici yükleniyor…', ceEdit: 'Görsel düzenle', ceBack: 'Geri',
    modeSimple: 'Basit', modeAdv: 'Gelişmiş', modeT: 'Basit modda yalnız temel ayarlar görünür; gelişmiş ayarlar silinmez, çalışmaya devam eder.', advHas: 'Bu öğede gelişmiş ayarlar var (boyut, renk, koşul ya da özel eylem). Basit modda gizli ama çalışıyor.', advTag: 'gelişmiş', helpT: 'Yardım',
    gapL: 'Aralık', gapAuto: 'Otomatik', heightL: 'Yükseklik', h_rows: '{n} satır', addSub: 'Alt başlık', addSubT: 'Bölümün içinde küçük bir ara başlık (ör. karoların altında BAĞLANTI)', subItem: 'Alt başlık', subText: 'Yazı',
    scL: 'Duruma göre renk', scT: 'Bir varlığın durumuna göre renk (ör. yem durumu: aktif → yeşil, acil → kırmızı). Metin değerlerde de çalışır.', scE: 'Varlık (boşsa öğenin kendisi)', scState: 'Durum', scAdd: 'Satır ekle', cFixed: 'Sabit renk',
    addPet: 'Evcil hayvan', addPetT: 'Besleme kartı: kedi, köpek, balık... için besleme hatırlatıcısı', t_pets: 'Besleme', petItem: 'Besleme kartı', petKind: 'Tür',
    pk_cat: 'Kedi', pk_dog: 'Köpek', pk_fish: 'Balık', pk_bird: 'Kuş', pk_rabbit: 'Tavşan', pk_turtle: 'Kaplumbağa', pk_other: 'Diğer',
    petSched: 'Ne zaman beslenir', pm_interval: 'Her N saatte bir', pm_times: 'Günün belli saatlerinde', petEvery: 'Kaç saatte bir', petTimes: 'Saatler (virgülle)',
    petSoon: 'Yaklaşıyor uyarısı (dk önce)', petGrace: 'Gecikme payı (dk)', petNotify: 'Gecikince bildirim', petNoNotify: 'Bildirim yok', petFeeder: 'Otomatik yemlik (isteğe bağlı)', petFeederT: 'Besledim deyince bu servis de çalışır (ör. button.press)',
    petEnt: 'Home Assistant\'ta "{n} besleme" durumu ve "{n} besledim" düğmesi oluşur; otomasyonlarda kullanılabilir.', petNeedName: 'Hayvanın adını yaz', petFeederBad: 'Yemlik servisi şu alanlardan biri olmalı: {d}',
    lookL: 'Görünüm', lk_tile: 'Karo', lk_button: 'Düğme', lk_row: 'Satır', lk_halo: 'Halo', colorsL: 'Renkler', cIcon: 'Simge', cOn: 'Açıkken', cBg: 'Arka plan', cNone: 'Yok',
    zonesL: 'Değere göre renk', zonesT: '4 sınır, 5 renk: değer bir sınıra eşit ya da büyükse bir sonraki renge geçer (Halo kartlarındaki bölgeler gibi). Çerçeve, değer ve simge bu renkte.', zLim: 'Sınır {n}',
    cardTapT: 'Verilmezse kartın kendi dokunma davranışı', a_defCard: 'Varsayılan: kartın kendisi',
    fillL: 'Doldurma', fillC: 'İçeriğe göre', fillF: 'Kutuyu doldur', fillT: 'Kutuyu doldur: düğmeler ve karolar kutunun yüksekliğine eşit dağılır', alignL: 'Hizalama', alTop: 'Üst', alCenter: 'Orta', alSpread: 'Eşit dağıt',
    sizeL: 'Boyut', sz_row: 'Satır boyu', icSizeL: 'Simge boyutu', txSizeL: 'Yazı boyutu', sz_auto: 'Otomatik', sz_s: 'Küçük', sz_m: 'Orta', sz_l: 'Büyük',
    tPop: 'Pencerede açar: {t}', imT: 'Öğe ayarları', imSave: 'Kaydet', iconOn: 'Açıkken simge', iconOff: 'Kapalıyken simge', tapL: 'Dokununca', holdL: 'Basılı tutunca', actL: 'Ne yapar',
    a_defMore: 'Varsayılan: cihaz penceresi', a_defTog: 'Varsayılan: aç / kapat', a_defHold: 'Varsayılan: ışık ya da cihaz penceresi', a_defRun: 'Varsayılan: seçili hedefi çalıştır', a_more: 'Cihaz penceresi', a_tog: 'Aç / kapat', a_none: 'Hiçbir şey',
    a_svc: 'Servis çalıştır', a_pop: 'Pencerede kart aç', a_yaml: 'Gelişmiş (YAML)', svc: 'Servis', tgt: 'Hedef varlık', svcData: 'Veri (YAML, isteğe bağlı)', popTitle: 'Pencere başlığı', cardY: 'Kart (YAML)', actY: 'Eylem (YAML)',
    visL: 'Sadece şu durumda göster', visT: 'Koşul sağlanmazsa öğe panoda hiç çizilmez, yerinde boşluk kalmaz. Önizlemede soluk görünür.', visE: 'Varlık', v_eq: 'şuna eşitse', v_in: 'şunlardan biriyse', v_not: 'şunlar değilse', visV: 'Durum (birden çoksa virgülle)', visNow: 'Şu an: {s}',
    yamlErr: 'YAML okunamadı: {e}', yamlErrL: 'YAML okunamadı: {n}. satırda girinti ya da yazım hatası var', cardNoType: 'Kartta "type:" satırı yok', addCard: 'Kart', addCardT: 'Halo kartı, Home Assistant kartı ya da kurulu bir özel kart ekle; listeden seç, görsel ayarla', cond: 'koşullu', cardItem: 'Kart', svcNeed: 'Servis "alan.servis" biçiminde olmalı (ör. timer.start)',
    close: 'Kapat', notLoaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.', editNote: 'Not: Bu panoda HA\'nın kendi düzenleyicisinde "kontrolü al" dersen pano bu panelden kopar.',
    t_energy: 'Enerji', d_energy: 'Evin gücü, kategoriler, grafikler', addEn: 'Enerji kartı', addEnT: 'Evin anlık gücü, kategoriler, en çok çekenler, günlük tüketim, son 24 saat ya da bekleme', enItem: 'Enerji kartı',
    enTab: 'Enerji sekmesi', enTabT: 'Evin gücü, kategoriler, en çok çekenler ve grafikler hazır bir sekmede', akE: 'Enerji', akET: 'Sonda bir Enerji sekmesi',
    sEnergy: 'Enerji', enSrc: 'Veri nereden gelir', enSrcT: 'Home Assistant\'ın Enerji ayarlarındaki "Cihaz tüketimi" listesinden. Bir gruba bağlı olmayanlar kategori, altındakiler cihaz olur.', enSrcGo: 'Enerji ayarlarını aç',
    enPrice: 'kWh fiyatı', enPriceT: 'Yazılırsa kartlarda para karşılığı da görünür (HA\'nın para birimiyle)', enTotal: 'Evin toplam gücü', enTotalT: 'Bir güç sensörü seçilirse Halo onu gösterir; seçilmezse kategorilerin toplamı',
    enAuto: 'Kategorilerin toplamı', enSb: 'Bekleme gücü', enSbT: 'Seçilmezse son 24 saatin en düşük toplam gücü', enSbAuto: 'Son 24 saatin en düşüğü', enLim: 'Halo renk sınırları (W)', enLimT: 'Yeşil, sarı, turuncu; üstü kırmızı',
    enBadge: 'Işık karosunda watt', enBadgeT: 'Güç ölçen ışık ve prizlerin karosunun köşesinde anlık watt', enB_off: 'Kapalı', enB_on: 'Açıkken', enB_always: 'Hep',
    enCols: 'Sütun', enChart: 'Küçük grafik', enC24: '24 saat', enC7: '7 gün', enChNone: 'Yok', enCount: 'Kaç cihaz', enCat: 'Kategori', enAll: 'Hepsi', enIdle: 'Beklemedekileri gizle', enIdleT: '2 W altındaki cihazlar listede görünmez',
    pfEnergy: 'Enerji', addEnPick: 'Eklenecek kartı seç; görünümünü sonra kartın ayarından değiştirirsin', addEnVals: 'Bölüme uyan değerler', addEnValsT: 'Bu bölümde {l} olarak eklenir, öteki öğelerle aynı boyda', addEnCards: 'Büyük kartlar', lrLeftCol: 'Renkler ve beyaz tonlar ({n} adım)', lrLeftFx: 'Efektler ({n} adım)', lrEvery: 'Prizin yeni değer gönderme sıklığı', lrEveryV: '~{s} sn', lrResumed: 'Yeniden başlatmadan sonra kaldığı yerden sürüyor', enLook: 'Görünüm', enSort: 'Sıra', enSortFix: 'Kategoriler\'deki sıra', enSortW: 'Çok çekene göre', enLoose: 'Kategorisiz karosu', enLooseT: 'Kategoriye konmamış cihazların toplamı', enDays: 'Gün', enUnit: 'Birim', enKwh: 'kWh', enCost: 'Para', enCostT: 'Para için Enerji sayfasında fiyat girilmeli', enMode: 'Çizgiler', enModeCats: 'Kategoriler', enModeTot: 'Toplam', enChips: 'Altındaki bilgiler', enChipsT: 'Bugünkü kWh, para ve bu hızla aylık tüketim', enKind: 'Kart',
    enPage: 'Enerji ayarları', enBtn: 'Enerji', enOpenT: 'Cihazlar, kategoriler, güneş, fiyat, faturalar ve ipuçları kendi sayfasında', en_sum: 'Özet', en_src: 'Veri kaynağı', en_tariff: 'Fiyat ve tarife', en_bill: 'Faturalar', en_est: 'Tahmini cihazlar', en_look: 'Görünüm ve veri',
    enSumT: 'Ayarların bugün ne sonuç verdiği. Bir satıra dokununca ilgili bölüm açılır.', enSMonth: 'Bu ay', enSYear: 'Bu yıl', enSBill: 'Son fatura', enSEst: 'Tahmini cihazlar', enNoBill: 'Fatura girilmedi', enNoData: 'Enerji verisi henüz yok', enCats: '{n} kategori, {d} cihaz', enUnt: '%{p} ölçülmüyor', enEstN: '{n} cihaz · şu an ~{w}', enNone: 'Yok', enLoading: 'Yükleniyor…', enPriceNone: 'Fiyat yok',
    enPrMode: 'Fiyat', enPrBill: 'Faturadan', enPrSingle: 'Tek fiyat', enPrTier: 'Kademeli', enPrBillT: 'Son fatura: {k} kWh, {t} → 1 kWh {u}. Yeni fatura girildikçe güncellenir.', enPrBillNo: 'Faturalar bölümüne bir fatura girince birim fiyat ondan hesaplanır (vergiler ve sabit bedeller dahil).',
    enLow: 'Düşük kademe', enHigh: 'Yüksek kademe', enDaily: 'Günlük sınır', enMonthLim: 'Bu ayın sınırı ({d} gün × {k} kWh)', enLowL: 'Düşük kademe: {k} kWh', enHighL: 'Yüksek kademe: {k} kWh', enMonthSo: 'Bu ay şimdiye kadar ({k} kWh)', enTierT: 'Günlük ortalama sınırın altı düşük, üstü yüksek fiyattan. Fiyatları faturadaki vergiler dahil birim fiyattan yaz.',
    en_meter: 'Ev sayacı', enMeterT: 'Evin tamamını ölçen cihaz (Shelly Pro EM gibi, sigorta kutusuna takılır). Seçince panel evin gerçek tüketimini, ölçülmeyen payı ve yılın toplamını bundan bulur; Home Assistant\'ın Enerji ayarlarına şebeke kaynağı olarak da kendisi ekler.', enMeterFound: 'Bulunan sayaçlar ({n})', enMeterUse: 'Evin sayacı yap', enMeterNone: 'Evin tamamını ölçen bir cihaz bulunamadı. Cihazı önce Home Assistant\'a ekle; burada kendiliğinden görünür.', enMeterManual: 'Listede yok, kendim seçeyim', enMeterDel: 'Kaldır', enMPow: 'Anlık güç', enMPowT: 'Evin şu an çektiği (W)', enMIn: 'Şebekeden gelen enerji', enMInT: 'Toplam kWh sayacı; yılın toplamı bundan', enMOut: 'Şebekeye verilen enerji', enMOutT: 'Güneş fazlası varsa', enMVolt: 'Gerilim', enMVoltT: 'Kesintiyi anlamak için (V)', enMInvT: 'Eve gelen eksi görünüyorsa aç', enMNow: 'Ev şu an', enMPanel: 'Paneldeki cihazlar', enMUnt: 'Ölçülmeyen', enMToday: 'Bugün', enMYear: '{y} toplamı', enMYearEst: 'kayıt {d} tarihinden', enMNoE: 'Enerji (kWh) sensörü seçilmedi: yılın toplamı ve şebeke kaynağı için gerekli.', enMWhat: 'Ne değişti?', enMW1: 'Anlık güç artık sayaçtan: ev tahmin değil, ölçülen değer.', enMW2: 'Ölçülmeyen pay = sayaç − paneldeki cihazlar; fatura gerekmez.', enMW3: 'Yılın toplamı ve kademe hesabı sayacın kWh kaydından.', enMW4: 'Home Assistant\'ın Enerji ayarlarına şebeke kaynağı olarak eklendi; kaldırınca geri alınır.', enSolT2: 'Evinde hangisi varsa onu aç; yalnızca onun ayarları görünür.', enSunOn: 'Güneş enerjisi var', enSunOnT: 'Panel ya da inverter', enBatOn: 'Batarya var', enBatOnT: 'Güneşli ya da güneşsiz', enSolNone: 'İkisi de kapalı. Evinde güneş paneli ya da batarya varsa yukarıdan aç.', enBgCh: '{d} tarihinden beri şarj', enBgDis: 'Deşarj', enBgLoss: 'Kayıp', enBgGain: 'Bataryanın kazandırdığı', enBgCost: 'Bataryanın maliyeti', enBgNoTou: 'Kazanç üç zamanlı tarifede hesaplanır (1 kWh her saat aynı fiyatsa batarya para kazandırmaz)', enBgNone: 'Batarya kaydı henüz yok; Home Assistant birkaç saat sonra toplar.', enGridFromMeter: 'Şebeke ev sayacından geliyor: {n}.', enGridNoMeter: 'Ev sayacı yoksa', enFOut: 'Şebeke', enFOutT: 'Kesinti', enBatN: 'batarya {p}', enBatOnly: 'batarya', enChTou: 'Üç zamanlı', enChTouT: 'Gündüz, puant, gece ayrı fiyat.', enTouExp: 'Kademe yok; fiyat saate göre: gündüz 06-17, puant 17-22, gece 22-06. Resmi fiyatlar vergiler dahil; faturan farklıysa düzelt.', enTouD: 'Gündüz (06-17)', enTouP: 'Puant (17-22)', enTouN: 'Gece (22-06)', enFillTou: 'Resmi fiyatları doldur', enFillTouT: 'EPDK, mesken, vergiler dahil', enTouSum: 'Bu dönem tüketimin: gündüz %{d}, puant %{p}, gece %{n} · 1 kWh ortalama {u}', enTouSumEst: 'Saatlik kayıt yok; tipik bir ev gibi hesaplanıyor (gündüz %50, puant %25, gece %25).', enTouCmp: 'Kademeli tarifede bu dönem ~{a}, üç zamanlıda ~{b}.', enTarLead2: 'Kartlardaki TL hesapları buradan. Üç adım; fatura girmen gerekmiyor, yılın toplamı Home Assistant\'ın kayıtlarından gelir.', enTarQ1: 'Faturanda hangi tarife var?', enChTier: 'Kademeli', enChTierT: 'Çoğu ev. Günde 8 kWh\'e kadar ucuz.', enChSktt: 'Son kaynak', enChSkttT: 'Yıllık sınırı geçtiysen.', enChBill: 'Bilmiyorum', enChBillT: 'Faturadan hesaplansın.', enChSingle: 'Sabit fiyat', enChSingleT: 'Kademesiz ya da anlaşmalı.', enTarQ2: '1 kWh kaça geliyor?', enTierExp2: 'Fatura döneminde günde ortalama {k} kWh\'e kadar olan tüketim ucuz, üstü pahalı. Resmi fiyatlar vergiler dahil; faturan farklıysa düzelt.', enPerSum: 'Bu dönem ({a} – {b}): şimdiye kadar {k} kWh, dönemin sınırı {l} kWh · dönem sonunda ~{e} kWh, ~{t}', enSkttExp: 'Son kaynakta kademe yok: her kWh aynı fiyattan, ama fiyat her ay değişir. Faturandaki 1 kWh\'e düşen tutarı yaz (vergiler dahil).', enGoBills: 'Faturalara git', enTarQ3: 'Yılın nasıl gidiyor?', enYNoData3: 'Home Assistant\'ta bu yılın enerji kaydı bulunamadı. Enerji ayarlarına şebeke sayacını ekle ya da panele güç ölçen cihaz ekle; istersen aşağıya faturalarındaki toplamı yaz.', enV_short: 'Home Assistant\'ta {d} günlük kayıt var; yıl sonu tahmini için en az {n} gün gerekiyor. Faturanı ya da yılın kWh\'ını girersen hemen hesaplanır.', enV_ok: 'Bu hızla yılı ~{p} kWh ile bitirirsin, sınırın {d} kWh altında. Fiyat değişmez.', enV_cross: 'Bu hızla {c} civarında sınırı geçersin. <b>{s}</b> tarihinden itibaren elektrik son kaynak fiyatından gelir, {y} sonuna kadar sürer.', enV_now: 'Sınırı geçtin: <b>{s}</b> tarihinden beri son kaynak fiyatı geçerli. 1. adımda "Son kaynak"ı seç ki hesaplar doğru olsun.', enV_nowOn: 'Sınırı geçtin: <b>{s}</b> tarihinden beri son kaynak fiyatındasın. Hesaplar bu fiyatla yapılıyor.', enV_prev: 'Geçen yıl {p} kWh ile sınırın ({l}) üstündeydin: bu yıl son kaynak tarifesindesin. 1. adımda "Son kaynak"ı seç.', enV_prevOn: 'Geçen yıl {p} kWh ile sınırın ({l}) üstündeydin: bu yıl son kaynak tarifesindesin. Hesaplar bu fiyatla yapılıyor.', enRowTot: '{y} toplamı', enSrc_grid: 'Home Assistant\'taki şebeke sayacından · fatura gerekmiyor', enSrc_panel: 'Panelin ölçtüklerinden · ölçülmeyen cihazlar yok, gerçeği daha fazla', enSrc_bills: 'Girdiğin faturalardan', enSrc_manual: 'Yazdığın toplamdan', enSrc_none: '', enSrcTail: 'son faturadan sonrası Home Assistant\'tan', enSrcEst: 'kayıt {d} tarihinden başlıyor, öncesi ortalamayla tamamlandı', enRowAvg: 'Günlük ortalama', enRowAvgT: '1 Ocak\'tan bu yana', enRowProj: 'Bu hızla yıl sonu', enRowProjT: 'Sınır {l} kWh', enRowCross: 'Sınırı geçeceğin gün', enRowCrossT: 'Bu hız sürerse', enRowStart: 'Son kaynak fiyatı başlar', enRowStartT: 'Geçtiğin ayı izleyen 3. ayın 1\'i', enRowPrev: '{y} toplamı', enRowPrevT: 'Bu yılın sınırı {l} kWh', enRowSktt: 'Son kaynakta 1 kWh', enRowSkttT: 'Her ay değişir; geçince faturandakini yaz', enHow: 'Nasıl işliyor?', enMoreExact: 'Daha kesin olsun (isteğe bağlı)', enMoreExactT: 'Faturalarındaki kWh\'lerin toplamı. Boş bırakırsan Home Assistant\'ın kayıtları kullanılır.',
    enTarLead: 'Kartlardaki TL hesapları buradan gelir. Faturandaki gibi doldur; emin değilsen "Faturadan" seç, birim fiyat girdiğin faturadan hesaplanır.', enTarQ: 'Elektriği hangi fiyattan alıyorsun?', enPrTier2: 'Kademeli (çoğu ev)', enTierExp: 'Evlerin normal tarifesi. Fatura döneminde günde ortalama {k} kWh\'e kadar olan tüketim ucuz, üstü pahalı fiyattan: 30 günlük dönemde ilk {m} kWh ucuz. Fiyatları vergiler dahil yaz (faturada 1 kWh\'ye düşen tutar).', enLow2: 'Günde {k} kWh\'e kadar', enHigh2: 'Üstü', enFill: 'Resmi fiyatları yaz', enFillT: 'EPDK 4 Nisan 2026 tarifesi: 3,24 ve 4,88 TL (enerji, dağıtım, %5 tüketim vergisi, %1 enerji fonu ve %10 KDV dahil). Tarife değişince güncellemen gerekir.', enTierMore: 'Günlük sınırı değiştir', enDailyT: 'Mesken için 8 kWh. Dönemin sınırı gün sayısı × bu değer.', enSingleExp: 'Kademe yoksa ya da ikili anlaşmayla sabit fiyattan alıyorsan: her kWh bu fiyattan.', enYTitle: 'Yıllık sınır: {n} kWh', enYR1: 'Bir takvim yılında (1 Ocak – 31 Aralık) evin tüketimi {n} kWh\'i geçerse elektrik kademeli fiyattan değil, her ay değişen ve daha pahalı "son kaynak" fiyatından gelir.', enYR2: 'Geçtiğin ay değil, ondan sonraki 3. ayın 1\'inde başlar: ekimde geçersen 1 Ocak\'tan, aralıkta geçersen 1 Mart\'tan.', enYR3: 'O yılın sonuna kadar sürer. Bir yılın toplamı sınırın altında kalırsa ertesi yıl normal fiyata dönersin.', enYR4: '2026 tüketimi de 3.000 kWh ile sayılıyor (EPDK 30 Ekim 2026 kararı; önce 4.000\'di). Tek bir ayın yüksek olması tek başına bir şey değiştirmez, önemli olan yılın toplamı.', enYThis: '{y} toplamı (sayaç)', enYAvg: 'Günlük ortalama', enYProj: 'Bu hızla yıl sonunda', enYVOk: 'Bu hızla yılı ~{p} kWh ile bitirirsin, sınırın {d} kWh altında. Fiyat değişmez.', enYVCross: 'Bu hızla sınırı {c} civarında geçersin. Son kaynak fiyatı {s} tarihinden itibaren başlar.', enYVPast: 'Bu yıl sınırı geçtin. Son kaynak fiyatı {s} tarihinden itibaren (ya da çoktan) geçerli; fiyatını aşağıya yaz ve "Şu an son kaynak tarifesindeyim"i aç.', enYVPrev: 'Geçen yıl {p} kWh ile sınırın üstündeydin: bu yıl son kaynak tarifesindesin. Fiyatını aşağıya yaz ve "Şu an son kaynak tarifesindeyim"i aç.', enYNoData2: 'Bu yılın tüketimini görmek için aşağıya 1 Ocak\'tan son faturaya kadarki toplamı yaz ya da Faturalar bölümüne bu yılın faturalarını gir. Son faturadan sonrasını panel kendisi ekler.', enYtd: '1 Ocak\'tan son faturanın sonuna kadar (kWh)', enYtdT: 'Bu yılın faturalarındaki kWh\'lerin toplamı. Boşsa girdiğin faturalardan toplanır; son faturadan sonrasını panel ekler.', enPrev: '{y} toplamı (kWh)', enSktt2: 'Son kaynak fiyatı', enSkttT2: 'Vergiler dahil, 1 kWh. Her ay değişir: (piyasa fiyatı + YEKDEM) × 1,05 + dağıtım + vergiler. Bu tarifedeysen faturandaki değeri yaz.', enFillS: 'Yaklaşık değer yaz', enFillST: '~7 TL: ekim 2026 piyasa fiyatlarıyla örnek hesap, kesin değil.', enSkttOn: 'Şu an son kaynak tarifesindeyim', enSkttOnT: 'Açıkken bütün hesaplar kademesiz, son kaynak fiyatıyla yapılır.', enYMore: 'Sınırı elle değiştir', enYLimT: 'Ticarethane ya da farklı bir sınır için.', enTarSrc: 'Kaynak: EPDK tarife tabloları (4 Nisan 2026) ve son kaynak tedarik tarifesi kararı (30 Ekim 2026). Kesin tutar için faturan esastır.',
    enYear: 'Yıllık sınır', enYearT: 'Bir yılda bu sınır aşılırsa daha yüksek tarifeye geçilir (aşıldığı ayı izleyen 3. ayın başında). 2026 için 4.000, 2027\'den itibaren 3.000 kWh.', enYAuto: 'Yıla göre ({n})', enYMan: 'Elle', enYLim: 'Sınır (kWh/yıl)', enSktt: 'Sınır aşılınca fiyat', enSkttT: 'Tahmin için; boş bırakılabilir', enYNow: 'Son 12 ay', enYEnd: 'Sınıra kalan', enYOver: 'Sınır aşıldı', enYNoData: 'Faturalar bölümüne son 12 ayın tüketimi ya da faturalar girilince hesaplanır.',
    enBillT: 'Fatura girmek üç şey sağlar: gerçek birim fiyat, panelin ölçmediği pay ve yıllık sınır için geriye dönük toplam.', enBFrom: 'Dönem başı', enBTo: 'Dönem sonu', enBKwh: 'Tüketim (kWh)', enBTl: 'Toplam tutar', enBAdd: 'Fatura ekle', enBPer: 'Dönem', enBPanel: 'Panel ölçtü', enBUnt: 'Ölçülmeyen', enBUnit: 'kWh başına', enBBad: 'Dönem tarihlerini, kWh\'yi ve tutarı yaz', enBAdding: 'Panelin o dönemdeki toplamı hesaplanıyor…', enBNone: 'Henüz fatura yok.',
    enL12: 'Son 12 ayın tüketimi (kWh)', enL12T: 'Faturanın arkasındaki grafikte yazar; yıllık sınır takibi bununla başlar.', enUntT: 'Son dönemde sayaç {a} kWh, panel {b} kWh. Aradaki {c} kWh (%{p}) hiçbir sensörde görünmüyor; kategori karolarında gri "Ölçülmeyen" karosu olarak çıkar. Buzdolabı, fırın, çamaşır makinesi için tahmini değer girersen bu pay küçülür.',
    enEstT: 'Güç ölçmeyen cihazlar için tahmini değer. Her biri için Home Assistant\'ta bir güç ve bir enerji sensörü oluşur ve Enerji ayarlarına seçtiğin kategorinin içine eklenir. Kartlarda "~" ile görünür.', enEAdd: 'Cihaz ekle', enENew: 'Yeni cihaz', enEName: 'Ad', enEKind: 'Tür', enENone: 'Henüz tahmini cihaz yok.',
    ek_light: 'Işık', ek_lightT: 'Bekleme ve en çok W, parlaklıkla', ek_onoff: 'Aç / kapa', ek_onoffT: 'Kapalıyken ve açıkken W', ek_fixed: 'Sabit', ek_fixedT: 'Hep aynı W', ek_year: 'Yıllık tüketim', ek_yearT: 'Etiketteki kWh/yıl', ek_cycle: 'Çevrim', ek_cycleT: 'kWh/100 çevrim, haftada kaç kez',
    enEIdle: 'Kapalıyken (bekleme) W', enEMax: '%100 parlaklıkta W', enEOff: 'Kapalıyken W', enEOn: 'Açıkken W', enEW: 'Güç (W)', enEYear: 'Etiketteki yıllık tüketim (kWh)', enEK100: 'Etiketteki tüketim (kWh/100 çevrim)', enEWeek: 'Haftada kaç çevrim', enEEnt: 'Durumunu okuyan cihaz', enECat: 'Kategori', enECatNone: 'Kendi kategorisi',
    enENow: 'Şu an', enEAvg: 'Ortalama', enEDay: 'günde {k} kWh, yılda {y} kWh', enEBri: '%{p} parlaklıkta', enEYearT: 'Kompresörlü cihazlar anlık 0 ile 120 W arasında gider gelir; ortalama yıllık toplamda doğru çıkar.', enEEnts: 'Home Assistant\'ta oluşur: {p} ve {e}', enESave: 'Kaydet', enEDel: 'Sil',
    enESaved: 'Kaydedildi', enEDeleted: 'Silindi', enEPrefErr: 'Kaydedildi ama Enerji ayarları değiştirilemedi: {e}', enENeed: 'Ad yaz', enEDirty: 'Yazdıkların kaydedilmedi. Kapatmak için yeniden dokun ya da Kaydet\'e bas.', enENaN: 'Buraya sayı yaz', enENeg: 'Değer eksi olamaz', enEBig: 'Değer çok büyük (en çok {n})', enEOnOff: 'Açıkken çektiği güç kapalıyken çektiğinden küçük olamaz', enEMaxMin: 'En yüksek güç, en düşük ve bekleme gücünden küçük olamaz', enEDup: 'Bu adda bir cihaz zaten var', enBLong: 'Fatura dönemi en çok 100 gün olabilir; tarihleri kontrol et', enBUpd: 'Aynı dönemin faturası güncellendi', enTierOrder: 'Düşük kademe fiyatı yüksek kademeden pahalı görünüyor; kontrol et', enENeedEnt: 'Durumunu okuyan cihazı seç', enEDelQ: 'Emin misin? Sil',
    enTilde: 'Tahmini değerleri ayır', enTildeT: 'Tahmini watt kartlarda "~" ile ve morla yazılır', enUntL: 'Ölçülmeyen karo', enUntLT: 'Son faturaya göre ölçülmeyen pay kategori karolarında', enBars: 'Kademe ve yıllık sınır çubukları', enBarsT: 'Halo\'nun altında, ayarlandıysa',
    en_dev: 'Cihazlar', en_cat: 'Kategoriler', en_solar: 'Güneş ve batarya', en_tips: 'İpuçları', en_imp: 'Aktar',
    enDevT: 'Panelin takip ettiği cihazlar. Güç ölçen cihazlar doğrudan eklenir; ölçmeyenler için sanal ölçüm kurulur ve Home Assistant\'ta güç ve enerji sensörü oluşur. Hepsi Enerji ayarlarına seçtiğin kategorinin içinde eklenir.',
    enFMeas: 'Ölçen', enFVirt: 'Sanal', enNoCat: 'Kategorisiz', enDNoF: 'Bu filtrede cihaz yok.', enFound: 'Güç ölçen {n} cihaz bulundu', enFoundT: 'Home Assistant\'ta güç sensörü olan ama panelde olmayan cihazlar', enAddAll: 'Hepsini ekle ({n})', enAdd1: 'Ekle', enShowAll: 'Hepsini göster ({n})', enDAdded: '{n} cihaz eklendi',
    enEEdit: 'Cihazı düzenle', ek_meas: 'Ölçen', ek_measT: 'Kendi güç sensörü var', ek_states: 'Duruma göre', ek_statesT: 'Her durum için ayrı W',
    enInT: 'Bu prize bağlı cihazlar', enInTag: '{n} cihaz bağlı', enInH: 'Prizde başka takip edilen cihazlar da varsa (ör. masadaki şerit LED) işaretle: güçleri prizin değerinden çıkar, kalan pay ayrı satır olur, hiçbiri iki kez sayılmaz.', enInNone: 'Bağlanabilecek başka cihaz yok. Önce prizdeki ışıkları ya da öteki cihazları ekle.', enInRest: 'Kalan payın adı (isteğe bağlı)', enInRestT: 'Kartlarda ve kategorilerde bu adla görünür; boş bırakırsan prizin adıyla. İki prizin kalanına aynı adı verme, kartta ayırt edilemez.', enInRestPh: 'Prizdeki öteki cihazlar', enInPlug: 'Prizin ölçtüğü', enInDevs: 'İşaretli {n} cihaz', enInHint: 'Kartlarda ve Home Assistant\'ın Enerji sayfasında prizin toplamı yerine kalan pay ve işaretli cihazlar ayrı ayrı görünür. Kalan pay bu cihazın kategorisine girer.', enMSensor: 'Güç sensörü (W)', enMEnergy: 'Enerji sensörü (kWh)', enPick: 'Seç', enMCalc: 'Panel hesaplasın', enMCalcT: 'Enerji sensörü seçilmezse panel güçten kWh hesaplar: {e}', enEMin: 'En düşük parlaklıkta W', enPick1: 'Panelden seç', enPick1N: 'Paneldeki cihazlar ({n})', enPickOther: 'Diğer cihazlar', enLibBusy: 'Ölçüm kütüphanesine bakılıyor…', enLibOk: 'Değerler ölçülmüş tablodan geldi: {n}', enLibStrip: 'Bu şerit havuzda metre başına; aşağıda uzunluğunu girince uyarlanır.', enSbUnm: 'ölçülemedi, {w} W sayılır', enSbUnmT: 'Bekleme prizin okuyabildiğinden düşük çıktı (0 W); ışık kapalıyken ağdaysa {w} W sayılıyor. Gerçek değeri biliyorsan Kapalıyken alanına yaz.', enSr: 'LED şerit', enSrT: 'Şeridin gücü uzunluğuyla değişir. Uzunluğu değiştirince tablo ve değerler ona göre ölçeklenir.', enSrLen: 'Uzunluk (m)', enSrCap: 'Adaptör gücü (W)', enSrCapPh: 'boş: sınır yok', enSrRef: 'Tablo kaç metrede ölçüldü', enSrRefT: 'Bu ışığın tablosu hangi uzunluktaki şeritte ölçüldüyse o. Boş bırakırsan tablo zaten bu uzunluğa göre sayılır.', enSrRefPh: 'boş: aynı', enSrNew: 'Kaydedince: {a} m → {b} m, en yüksek {w}.', enSrM: '{m} m şerit', enLibNone: 'Bu model kütüphanede yok: değerleri gir ya da prizle öğret.', enMinPh: 'boş: bekleme',
    enNewCat: '+ Yeni kategori', enNewCatN: 'Yeni kategorinin adı', enStT: 'Durumlara göre güç', enStH: 'Boş bırakılan durum "Diğer durumlar" değerini alır', enStOther: 'Diğer durumlar', enStPick: 'Önce durumunu okuyan cihazı seç; alabileceği durumlar burada listelenir.',
    enMNeed: 'Güç sensörünü seç', enCNeed: 'Kategoriye ad yaz',
    enCatT: 'Kategoriler kartlardaki karolardır. Her biri için Home Assistant\'ta toplam güç ve kWh sensörü oluşur ve Enerji ayarlarına eklenir; içindeki cihazlar onun altında görünür.', enCDevs: '{n} cihaz', enCNone: 'Henüz kategori yok. Kategorisiz cihazlar kartlarda "Kategorisiz" karosunda toplanır.', enCAdd: 'Kategori ekle', enCEdit: 'Kategoriyi düzenle', enCColor: 'Renk', enCMem: 'İçindeki cihazlar ({n})',
    enSolT: 'Güneş paneli, şebeke ve batarya sensörlerini seç. Akış ve batarya kartları bunlarla dolar; üretim Home Assistant Enerji ayarlarına güneş kaynağı olarak eklenir.', enSolOn: 'Güneş enerjisi var', enSolOnT: 'Açınca üretim, şebeke ve batarya ayarları görünür',
    enSolProd: 'Üretim', enSolP: 'Üretim gücü (W)', enSolPT: 'İnverterin anlık üretimi', enSolPE: 'Üretim enerjisi (kWh)', enSolPET: 'Seçilmezse panel güçten hesaplar',
    enSolGrid: 'Şebeke', enSolGM: 'Şebeke ölçümü', enGNet: 'Tek sensör', enGTwo: 'Alınan ve verilen ayrı', enGNone: 'Yok', enGNetS: 'Şebeke gücü (W)', enGNetST: 'Artı: şebekeden alınan, eksi: şebekeye verilen', enGIn: 'Şebekeden alınan (W)', enGOut: 'Şebekeye verilen (W)', enExp: 'Satış fiyatı', enExpT: 'Şebekeye verilen 1 kWh için; boş bırakılabilir',
    enSolBat: 'Batarya', enSolBatT: 'Varsa', enBP: 'Batarya gücü (W)', enBPT: 'Artı: şarj, eksi: boşalma', enBInv: 'İşaret ters', enBInvT: 'Sensör şarjı eksi gösteriyorsa aç', enBSoc: 'Doluluk (%)', enBCap: 'Kapasite', enBCapT: 'Kalan süre ve kWh için',
    enFProd: 'Üretim şu an', enFExp: 'Şebekeye veriliyor', enFImp: 'Şebekeden alınıyor', enFCh: 'Batarya şarj oluyor', enFDis: 'Batarya boşalıyor', enFHome: 'Evin tüketimi',
    enSolCard: 'Akış kartını Enerji sekmesine ekle', enSolNoTab: 'Önce Enerji sekmesi ekle (+ Sekme → Enerji)', enSolHas: 'Akış kartı zaten var', enSolAdded: 'Akış kartı "{t}" sekmesine eklendi',
    enTipsT: 'Bildirim yok. İpuçları Halo\'nun altında tek satırda sırayla döner, ilgili cihazın satırının kenarı turuncu olur. Satıra dokununca cihaz açılır, basılı tutunca o ipucu o cihazda bir daha görünmez.', enTOn: 'İpuçları', enTOnT: 'Kapatınca hiçbiri görünmez',
    enTNow: 'Şu an {n} ipucu', enTHide: 'Gösterme', enTNone: 'Şu an ipucu yok.', enTLeft: 'Uzun süre açık kalan', enTLeftT: 'Bu güçten fazlasını bu süreden uzun çeken cihaz', enHrs: 'sa', enTSb: 'Gece bekleme', enTSbT: 'Gece 02-05 arası evin en düşük gücü bunu aşarsa',
    enTDay: 'Günlük hedef', enTDayT: 'Bugünkü tüketim hedefi geçerse', enTYear: 'Yıllık sınıra yaklaşma', enTYearT: 'Son 12 ay sınırın %85\'ine gelince', enTSun: 'Güneş fazlası', enTSunT: 'Şebekeye 500 W\'tan fazla verilirken', enTDot: 'Sekmede nokta', enTDotT: 'İpucu varken Enerji sekmesinin düğmesinde küçük turuncu nokta', enTReset: 'Gizlenenleri geri getir ({n})',
    enImpT: 'Daha önce başka bir eklentiyle kurduğun sanal güç cihazlarını ve gruplarını panele aktarır: cihazlar adlarıyla gelir, gruplar kategori olur. Önce ne olacağı gösterilir; o eklentide hiçbir şey değişmez, kontrol ettikten sonra onu kendin kaldırabilirsin.',
    enImpScan: 'Tara', enImpDone: '{n} cihaz ve {c} kategori aktarıldı', enImpOld: 'Eski toplam şu an', enImpNew: 'Panelin hesabı', enImpAfter: 'Birkaç dakika iki tarafın değerlerini karşılaştır. Uyuşuyorsa eski eklentiyi Home Assistant\'tan kaldırabilirsin.', enImpNone: 'Aktarılacak bir tanım bulunamadı.',
    enImpCats: 'Kategori', enImpDevs: 'Cihaz', enImpSkip: 'Zaten panelde olan', enImpChk: '{n} cihazın değeri ölçüm tablosundan şu anki güce göre çıkarıldı; aktardıktan sonra Cihazlar\'dan kontrol et.', enImpChkP: 'kontrol et',
    enImpWhat: 'Aktarınca Enerji ayarlarındaki {n} eski giriş çıkarılır, panelin sensörleri eklenir.', enImpAgain: 'Yeniden tara', enImpGo: '{n} cihazı aktar', enImpGoQ: 'Emin misin? Aktar',
    enDevN: '{n} cihaz ({m} ölçen, {v} tahmini) · şu an ~{w}', enFoundP: '+{n} bulundu', enCatN: '{n} kategori · {u} kategorisiz', enSolN: 'Üretim şu an {w}', enSolNoS: 'Sensör seçilmedi', enOff: 'Kapalı',
    enSyncOn: 'Enerji ayarlarıyla eşleniyor', enSyncOff: 'Eşleme kapalı', enSrcT2: 'Kartlar panelin cihaz ve kategorilerinden dolar. Panel bunları Home Assistant Enerji ayarlarına da ekler; senin eklediğin diğer girişlere dokunmaz.', enSync: 'Enerji ayarlarıyla eşle', enSyncT: 'Cihazlar, kategoriler ve güneş üretimi Home Assistant\'ın Enerji panosunda da görünsün',
    enDvN: 'Takip edilen', enDvW: 'Şu an toplam', enDvMT: 'Ölçülen / tahmini', enDvC: 'Kontrol edilecek', enDvQ: 'Cihaz ara', enDvGR: 'Odaya göre', enDvGC: 'Kategoriye göre', enDvAddL: 'Işık ekle', enDvNoL: 'Eklenmemiş ışık yok', enDvAddM: 'Ölçen cihaz ekle', enDvNoM: 'Bulunan yeni ölçen cihaz yok', enDvAddO: 'Başka cihaz', enDvFL: 'Işıklar', enDvFE: 'Tahminiler', enDvFC: 'Kontrol et', enDvFR: 'Odası yok', enDvNoRoom: 'Odası seçilmemiş', enTgM: 'Ölçülüyor', enTgR: 'Öğreniliyor', enTgO: 'Öğrenildi', enTgL: 'Hazır tablo', enTgE: 'Tahmini', enTgC: 'Kontrol et', enDvInPlug: 'prizin içinde', enDvGN: '{n} cihaz', enDvNone: 'Bu süzgece uyan cihaz yok.', enDvEmpty: 'Henüz cihaz yok. Işık ekle ya da ölçen cihaz ekle ile başla.', enDvRoomT: 'Oda, Home Assistant\'ta cihaza seçilen alandan gelir. Odası seçilmeyen cihazlar oda toplamlarına girmez; alanı HA\'nın cihaz sayfasından seçebilirsin.', enDvAddLT: 'Panelin takip etmediği {n} ışık, odalarına göre', enDvAddMT: 'Güç ölçen ama eklenmemiş {n} cihaz, odalarına göre', enDvSelAll: 'Hepsini seç', enDvSelNone: 'Hiçbirini seçme', enDvAddLH: 'Işıklar Işıklar kategorisine eklenir. "Hazır tablo" olanlar önceden ölçülmüş değerle gelir; "Tahmini" olanları sonra bir ölçüm prizine takıp öğretebilirsin.', enDvAddMH: 'Kendi güç sensörüyle eklenir, enerji sensörü bulunursa o da. Kategorisini sonra seçersin.', enDvAddN: '{n} cihazı ekle', enDvLCat: 'Işıklar', enWSens: 'Güç sensörü yanıt vermiyor', enWSensT: 'Sensör Home Assistant\'ta yok ya da kullanılamıyor; cihaz 0 W sayılıyor. Prizin bağlantısını kontrol et ya da aşağıdan başka sensör seç.', enWNoEntT: 'Bağlı cihaz Home Assistant\'ta bulunamadı; cihaz tahmini değeriyle sayılıyor.', enDsWhat: 'Bu ne?', enDsRoom: 'Oda', enDsRoomT: 'Oda, HA\'da bu cihaza seçilen alandan gelir.', enDsHow: 'Gücünü nereden biliyoruz?', enDsRec: 'Önerilen', enDsVals: 'Değerler', enDsLutOwn: 'Bu ışık prizle ölçüldü; renk, beyaz ton ve efektlere göre ölçülen tablo kullanılıyor. Aşağıdaki değerler tablo yoksa kullanılır.', enDsLutLib: 'Bu ışık için önceden ölçülmüş hazır tablo kullanılıyor. Aşağıdaki değerler tablo yoksa kullanılır.', enDsAdv: 'Home Assistant sensörleri', enDsOwnE: 'Enerji kendi sensöründen: {e}', ekL_meas: 'Kendi ölçüyor', ekD_meas: 'Cihazın ya da prizin kendi güç sensörü var. En doğrusu.', ekL_light: 'Işık: parlaklığa göre', ekD_light: 'Parlaklık ve renge göre. Ölçülmüş tablo varsa o, yoksa en düşük ve en yüksek değerle.', ekL_states: 'Duruma göre', ekD_states: 'Oynatıyor, beklemede, soğutuyor gibi her durum için ayrı watt.', ekL_onoff: 'Açık / kapalı', ekD_onoff: 'Açıkken bir değer, kapalıyken bir değer.', ekL_fixed: 'Hep aynı', ekD_fixed: 'Hep aynı çeker (modem, kamera gibi).', ekL_year: 'Yıllık etiket', ekD_year: 'Etiketteki yıllık kWh, ortalama olarak (buzdolabı gibi).', ekL_cycle: 'Çevrimle', ekD_cycle: '100 çevrimde kWh ve haftada kaç kez (çamaşır, bulaşık makinesi).',
    enWNoEnt: 'Bu cihaz Home Assistant\'ta bulunamadı; adını kontrol et.', enWZero: 'Hiçbir duruma W yazılmadı; cihaz 0 W sayılır.', enCSame: 'Bu adla bir kategori zaten var', enMUsed: 'Bu güç sensörü başka bir cihazda kullanılıyor', enAddAllQ: 'Emin misin? {n} cihaz eklenecek',
    enImpToDev: 'Cihazlara git', enGInv: 'İşaret ters', enGInvT: 'Sayaç şebekeye vermeyi artı gösteriyorsa aç',
    lrNoEnt: 'Önce durumunu okuyan cihazı seç ve kaydet', lrH: '{h} sa {m} dk', lrM: '{m} dk', lrTestOk: 'Prizde {a} → {b} değişti. Cihaz bu prizde.', lrTestNo: 'Prizin değeri değişmedi ({a}). Cihaz bu prize takılı mı?',
    lrErr_busy: 'Bu cihaz zaten ölçülüyor', lrErr_too_many: 'Aynı anda en çok 3 ölçüm olabilir', lrErr_plug: 'Priz değer göndermiyor', lrErr_entity: 'Cihaz bulunamadı', lrErr_x: 'Başlatılamadı', lrSaved: 'Kaydedildi',
    lrTitle: 'Öğren · {n}', lrSubL: 'Bütün renk ve parlaklıklarda gerçek güç', lrSubS: 'Her durumun gerçek gücü', lrS_pool: 'Havuz', lrS_prep: 'Hazırlık', lrS_probe: 'Yoklama', lrS_full: 'Tam ölçüm', lrS_res: 'Sonuç', lrS_listen: 'Dinleme',
    lrPoolLook: 'Ortak havuzda aranıyor', lrNoModel: 'Home Assistant bu cihazın modelini bildirmiyor', lrPoolNoModel: 'Model bilinmiyor', lrPoolErr: 'Havuza ulaşılamadı', lrPoolNone: 'Bu model havuzda yok', lrPoolNoneT: 'Güç ölçen bir prizle kendin ölçebilirsin.', lrOwn: 'Kendim ölçeyim',
    lrSrcPool: 'Bu modelin hazır tablosu var', lrVerified: 'doğrulandı', lrSrcLib: 'Açık ölçüm kütüphanesinde var', lrPoolVals: 'Bekleme {s}, en düşük {a}, en yüksek {b} · {n} nokta.', lrV: 'Ölçüm {v} V şebekede yapılmış.', lrUse: 'Hazır ölçümü kullan',
    lrPoolNote: 'Hazır ölçüm kartlarda "~" ile görünür. Kendi ölçümün her zaman havuzdakinin önüne geçer.', lrPlug: 'Ölçen priz',
    lrC1: 'Priz değer gönderiyor', lrC1ok: '{s} saniyede bir · şu an {w}', lrC1wait: 'Şu an {w} · aralık ölçülüyor', lrC1T: 'Güç ölçen prizi seç',
    lrC2: 'Prizde yalnız bu cihaz var', lrC2T: 'Başka bir şey bağlıysa ölçüm yanlış çıkar', lrC2Ts: 'Soundbar ya da TV kutusu da bağlıysa onları başka prize al', lrC3: 'Cihaz bu prizde', lrC3T: 'Dene ile cihaz bir kez açılıp kapanır; prizin değiştiği görülür', lrTest: 'Dene',
    lrWarn: 'Tam ölçüm: {n} adım, yaklaşık {e}. Bu sürede ışık renk renk yanıp söner; evde kimse yokken ya da gece başlatmak iyi olur. Ölçüm arka planda sürer.', lrStHow: 'Cihazı her zamanki gibi kullan. Panel prizi ve cihazın durumunu birlikte dinler, her durumun ortalamasını tutar. Bir durumda 2 dakika veri olunca yeşil olur.',
    lrStartL: 'Ölçmeye başla', lrNeedPlug: 'Başlamak için güç ölçen prizi seç.', lrNeedOnly: 'Başlamak için "Prizde yalnız bu cihaz var"ı işaretle.', lrNeedTest: 'Başlamak için Dene\'ye bas; prizin değiştiği görülmeli.', lrStartS: 'Öğrenmeye başla', lrWhite: 'Beyaz tonlar', lrColor: 'Renkler · doygunluk %{s}', lrBri: 'Parlaklık',
    enWLrn: 'Öğrenim yarıda kaldı ({i}/{n} adım); kaldığı yerden sürdürebilirsin', lrCont: 'Kaldığı yerden devam et', lrAgainZero: 'Baştan başlat', lrContT: '{n} adımın {i} tanesi ölçüldü. Kaldığı yerden devam edersen ölçülenler korunur.',
    lrErrRun_external: 'Işık başka bir yerden değiştirildi; ölçüm durdu. Yeniden başlatabilirsin.', lrErrRun_plug_silent: 'Priz bir süredir değer göndermiyor; ölçüm durdu.', lrErrRun_no_light: 'Işık bulunamadı.', lrErrRun_x: 'Ölçüm durdu ({e}).', lrAgain: 'Yeniden ölç',
    lrNowSb: 'Işık kapalı, bekleme okunuyor', lrNowProbe: 'Yoklama: {c} %100', lrC_white: 'Beyaz', lrC_red: 'Kırmızı', lrC_green: 'Yeşil', lrC_blue: 'Mavi', lrNowCt: '{k} K, %{b}', lrNowHs: '{h}° renk, doygunluk %{s}, %{b}', lrNowBr: 'Parlaklık %{b}',
    lrPlan: 'Renk farkı %{d}; plan: {n} ölçüm.', lrPaused: 'Duraklatıldı; ışık eski durumunda. Devam edince kaldığı yerden sürer.', lrDone: 'Ölçülen', lrLeft: 'Kalan', lrStandby: 'Bekleme', lrRepeats: 'Tekrarlanan adım', lrRecheck: 'Yeniden ölçülen', lrFloor: 'Prizin okuyamadığı',
    lrBgNote: 'Pencereyi kapatsan da ölçüm sürer; cihaz satırında ilerleme görünür. Işık başka yerden değiştirilirse ölçüm durur.', lrCancel: 'Vazgeç', lrResume: 'Devam et', lrPause: 'Duraklat', lrBg: 'Arka planda sürsün',
    lrV100w: '%100 soğuk beyaz', lrV50w: '%50 sıcak beyaz', lrV100r: '%100 kırmızı', lrV100b: '%100 mavi', lrV100: '%100', lrPoints: 'Nokta',
    lrSame: 'Aynı modeldeki {n} ışığa da uygula', lrShare: 'Ölçümü ortak havuza gönder', lrShareT: 'İsteğe bağlı. Kaydedince GitHub\'da hazır doldurulmuş bir gönderim sayfası açılır. Otomatik kontrol edilir; model havuzdaysa ve ölçümün tutarlıysa kendiliğinden girer, bir modelin ilk ölçümü onay bekler.', lrShareSlow: 'Priz değerini yavaş gönderiyor (adım başına {s} sn); havuz için en çok 30 sn olmalı. Ölçüm kendi panonda kullanılır.', lrShareFloor: 'Priz bu ışığın düşük güçlerinin çoğunu okuyamadı; havuz için daha hassas bir ölçer gerekir. Ölçüm kendi panonda kullanılır.', lrShareNo: 'Home Assistant bu ışığın marka ve modelini bildirmediği için gönderilemez.',
    lrSent: 'Gönderilen', lrSent1: 'Marka ve model ({m})', lrSent2: 'Işığın özellikleri: entegrasyon, renk modları, sıcaklık aralığı, efekt sayısı, yazılım sürümü', lrSent3: 'Ölçüm tablosu ({n} nokta) ve bekleme', lrSent4: 'Ölçüm özeti ve ölçen prizin modeli', lrSent5: 'Şebeke gerilimi ({v} V)',
    lrNotSent: 'Gönderilmeyen', lrNot1: 'Ev, oda ve cihaz adları', lrNot2: 'Konum, IP ve kullanıcı bilgisi', lrNot3: 'Başka hiçbir Home Assistant verisi', lrBack: 'Işık eski durumuna döndü. Prizi başka cihaza takabilirsin.', lrSaveShare: 'Kaydet ve gönder',
    lrNowState: 'Şu an: {s}', lrState: 'Durum', lrGot: 'Toplanan', lrAvg: 'Ortalama', lrStHint: 'Görülmeyen durumlar "Diğer durumlar" değerini alır. En az 1 dakika verisi olan durumlar kaydedilir.', lrFinish: 'Bitir ve kaydet',
    lrPillDone: 'Ölçüm bitti · kaydet', lrPillErr: 'Ölçüm durdu', lrPillSt: 'Öğreniyor · {t}', lrPillL: 'Ölçülüyor · %{p}',
    lrBoxDone: 'Ölçüm bitti; sonucu görüp kaydet.', lrBoxSt: 'Öğreniyor: {t} veri toplandı. Cihazı normal kullan.', lrBoxRun: 'Ölçülüyor: %{p}, kalan ~{e}. Arka planda sürer.',
    lrBoxOwnL: 'Kendi ölçümün kullanılıyor ({n} nokta).', lrBoxOwnS: 'Öğrenilen {n} durum kullanılıyor.', lrBoxPool: 'Hazır ölçüm kullanılıyor. İstersen kendin ölçebilirsin.',
    lrBoxL: 'Bu ışık şu an tahmin. Önce ortak havuza bakılır; yoksa güç ölçen bir prizle bütün renk ve parlaklıklarda ölçülür.', lrBoxS: 'Bu cihaz şu an tahmin. Güç ölçen bir prize takıp birkaç saat normal kullan; her durumun ortalaması kendiliğinden dolar.',
    lrBoxTL: 'Prizle ölç', lrBoxTS: 'Prizle öğren', lrSee: 'İlerlemeyi gör', lrRe: 'Yeniden öğren', lrGo: 'Öğren', lrSaveFirst: 'Önce cihazı kaydet', lrOwnTag: 'ölçüldü', lrTblTag: 'tablo',
    lrStrip: 'Şerit LED', lrStripT: 'Şeritte tüketim uzunlukla değişir. Uzunluğu yazarsan havuza metre başına girer; başkası kendi uzunluğuna göre kullanır.', lrLenMine: 'Bu şeridin uzunluğu', lrLenQ: 'Senin şeridinin uzunluğu', lrSameStrip: 'Uzunluğu farklıysa her biri için yaz; tablo uzunluğa göre uyarlanır.', lrSameOwn: 'kendi ölçümü var; işaretlersen bu ölçümle değişir', lrSameNew: 'panoda yok; işaretlersen eklenir',
    lrShareLen: 'Şerit LED için önce uzunluğu yaz.', lrSent6: 'Şerit uzunluğu ({m} m)', lrPoolValsM: 'Metre başına: bekleme {s}, en yüksek {b} · {n} nokta.', lrPoolLen: '{m} m şeritte ölçülmüş.', lrLenUnknown: 'Ölçülen uzunluk bilinmiyor; şeritte kendin ölçmen daha doğru olur.',
    lrPoolNoteStrip: 'Bekleme (kumanda kutusu) aynı kalır, üstü uzunluğa göre ölçeklenir ama adaptörün gücünü geçmez. Kendi ölçümün her zaman havuzdakinin önüne geçer.',
    lrCapQ: 'Adaptörün gücü', lrCapMine: 'Adaptörün gücü (isteğe bağlı)', lrCapT: 'Adaptörün etiketinde yazar (ör. 24 V × 1 A = 24 W). Şerit uzasa da toplam güç bunu geçmez; uzatmalı şeritlerde parlaklık bu sınıra göre kısılır.', lrSent7: 'adaptör {w} W',
    lrSubA: 'Uzun süreli ortalama', lrErr_plug_busy: 'Bu priz şu an başka bir cihazı öğreniyor', lrErr_bridge_busy: 'Aynı köprüdeki bir ışık şu an ölçülüyor; bitince başlat', lrPlugBusy: 'şu an {n} öğreniyor',
    lrAvgHow: 'Panel başlangıç zamanını not eder; ortalamayı Home Assistant\'ın priz kayıtlarından hesaplar. Arka planda sürer; Home Assistant yeniden başlasa da devam eder. En az 1 gün, en iyisi 1 hafta.',
    lrWarnFx: 'Tam ölçüm: {n} adım, yaklaşık {e}; bunun {f} adımı ışığın kendi efektleri (her biri yarım dakika dinlenir, istersen atlarsın). Bu sürede ışık renk renk yanıp söner; evde kimse yokken ya da gece başlatmak iyi olur. Ölçüm arka planda sürer.',
    lrNowFx: 'Efekt: {e}, %100 · ortalama alınıyor', lrNowFxb: 'Efekt: {e}, %{b} · parlaklık eğrisi', lrSkipFx: 'Efektleri atla', lrSkipFxT: 'Ölçülen efektler kalır, kalanlar ortalamayla hesaplanır', lrFxT: 'Efektler · {i} / {n}', lrFxAvg: 'Efektlerin ortalaması ({n})', lrFx50: 'Efektte %50 parlaklık',
    lrAvgSince: '{t} boyunca ortalama', lrQ_early: 'Henüz erken', lrQ_earlyT: 'İlk gün dolmadı; buzdolabı gibi cihazlarda gece-gündüz ve kompresör döngüleri henüz oturmadı.', lrQ_mid: 'Kabaca doğru', lrQ_midT: 'Bir günü geçti. Birkaç gün daha beklersen değer oturur; bir hafta en doğrusu.', lrQ_ok: 'Oturdu', lrQ_okT: 'Son 24 saatin ortalaması toplam ortalamadan %3\'ten az sapıyor. İstersen şimdi bitirebilirsin.',
    lrAvgKwh: 'Bu sürede', lrAvgDay: 'Günde', lrAvgYear: 'Yılda', lrAvg24: 'Son 24 saat', lrAvgNow: 'Şu an', lrAvgNote: 'Bitirince cihaz ölçülen ortalama watt ile "Sabit" türüne geçer.',
    lrPillAvg: 'Öğreniyor · {t} · ~{w}', lrBoxA: 'Bu cihaz şu an etiket değeri ya da tahmin. Güç ölçen bir prize takıp birkaç gün bekle; gerçek ortalaması kaydedilir.', lrBoxAvgRun: 'Öğreniyor: {t}, şu ana kadar ortalama ~{w}.', lrBoxOwnA: 'Ölçülen ortalama kullanılıyor ({w}).', lrSaveGo: 'Kaydet ve öğren', lrNameFirst: 'Önce ad yaz'
  },
  en: {
    title: 'Lemur Home Dashboard', auto: 'Automatic layout', autoT: 'The dashboard is currently built from your areas. Your first change saves this layout, then everything is edited here.',
    undo: 'Undo', undoK: 'Undo (Ctrl+Z)', redoK: 'Redo (Ctrl+Y)', redone: 'Redone', settings: 'Settings', more: 'More', saved: 'Saved', undone: 'Undone', err: 'Could not save: {e}', errConflict: 'This was changed from another screen; the current version was loaded. Please make your change again.',
    layout: 'Layout', layCols: 'Columns', layGrid: 'Free grid', layGridT: 'Move a box by its ⠿ handle, resize it from its lower right corner; the others make room. In portrait the layout drops to 6 columns by itself; change it there and that screen gets its own layout.', gFit: 'Fit the screen', gScr: 'Scrollable', gmAuto: 'Reset portrait layout', gPos: '{w}×{h}', gFill: 'Fill gaps', gFillT: 'Boxes grow right and down to close empty cells', gRowsT: 'How many rows the screen is split into: raise it for many boxes', gmAutoT: 'Drops the hand-made portrait layout and derives it from the wide one again', tabName: 'Tab name', icon: 'Icon', area: 'Area', noArea: 'No area', cols: 'Columns', colAdd: 'Add column', colDel: 'Remove last column', tabBg: 'Room background', tabBgOwn: 'this room only', tabBgSame: 'General', tabBgT: 'General: the background from Choose a style. Pick a colour or effect and only this tab shows it. If you set a phone-only background, phones use that.', scr_custom: 'Custom', scrCustT: 'Your device resolution (width × height). On tablets only the ratio matters, so the resolution as is works (e.g. 2560 × 1600). On phones type the width the browser sees (e.g. 412 × 915).', colTab: 'Tablet layout', colEq: 'Equal', colHint: 'Set widths by dragging the line between columns in the preview.', delTab: 'Delete tab', sure: 'Sure?',
    refill: 'Refill from area', refillT: 'Rebuilds this tab\'s sections from the devices of the chosen area.', addTab: 'Tab', newTab: 'New tab', emptyTab: 'Empty tab', fromArea: 'Tab from area',
    preview: 'Preview', pvFolds: 'Show groups', pvFoldsT: 'Show collapsible groups as on the phone. When off, grouped items show in place; turn it off to reorder them.', pvHint: 'Drag boxes by their ⠿ handle, items by themselves · drag lines to resize', splits: 'Columns inside', splitsT: 'Splits a column into 2-3 equal sub-columns (e.g. two scene sections side by side).', splitNarrow: 'This many sub-columns will not fit: use fewer columns first', sub: 'Sub-column', sections: 'Sections', addSec: 'Add section', noSec: 'This tab has no sections.',
    secTitle: 'Title', column: 'Column', colL: 'Left', colM: 'Middle', colR: 'Right', tileCols: 'Tiles per row', look: 'Look', lookTile: 'Tiles', lookBar: 'Sliders', lookPhone: 'Auto on phone', lookTileT: 'Square tiles: tap to toggle, hold for the window', lookBarT: 'Horizontal bars: tap to toggle, swipe sideways for brightness, hold for the window', lookPhoneT: 'Tiles on a tablet, slider bars on a phone', barCols: 'Sliders per row', delSec: 'Delete section',
    d_camera: 'Camera feeds', t_values: 'Values', t_cards: 'Cards', t_subs: 'Subtitle', t_free: 'Empty section', t_lights: 'Lights', t_scenes: 'Scenes', t_climate: 'Climate', t_vacuum: 'Vacuum', t_media: 'Media', t_camera: 'Cameras', camTab: 'Cameras tab', edMode: 'Editing', edTab: 'Tablet', edPh: 'Phone', phBanner: 'Editing the phone: changes here apply to phones only, the tablet stays the same.', phShown: 'Shown on phones', phHidden: 'Hidden on phones', phOwn: 'phone only', phReset: 'Back to tablet', phOrderT: 'Drag to change the order on phones; the tablet layout stays the same.', phLook: 'Look on phones', phLookSame: 'Same as tablet', phLookTiles: 'Tiles', phLookRows: 'One per row', phCols: 'Tiles per row on phones', phColsAuto: 'Auto', phItems: 'Items shown on phones', phItemsT: 'Tap to hide or show on phones. The tablet keeps all of them.', phLookRows2: 'Two per row', phFolds: 'Collapsible groups', phFoldsT: 'Gather some items into one row on phones; tap the row to open it (e.g. RGB lights). The group sits at the end of the section.', phFoldAdd: 'Add collapsible group', phFoldPh: 'Group name (e.g. RGB lights)', phFoldDel: 'Delete group', phFoldN: 'Group {n}', phFoldPick: 'In the group ({n}) · tap to choose', phFlat: 'Sections', phFlat0: 'Framed', phFlat1: 'Frameless', phFlatT: 'Frameless: on phones the section boxes are not drawn and titles become small labels, leaving more room for lights and buttons. Tablets are not affected.', phShared: 'The section name, column and its devices are shared with the tablet; switch to Tablet at the top to change them.', phHiddenSec: 'This section is hidden on phones. Tap "Hidden on phones" in the list to show it.', phResetAll: 'Reset phone-only settings', phResetAllT: 'Removes the phone settings and phone order of every section; phones follow the tablet layout again.', phSecsT: 'To hide, reorder or change the look of sections on phones, choose Editing: Phone at the top of the admin panel.', phNoItemDrag: 'Item order is shared with the tablet on phones; the section of the item you hold moves.', phCount: '{n} phone-only settings', phLookT: 'Phone look', phLookS: 'Navigation, lights, icon style, climate cards, background', phSame: 'Make the phone match the tablet', phSameT: 'Removes every phone-only setting: room buttons, sections, item order, icon style, climate cards, background. Lights go back to As in the section. Undo brings it back.', phSameAsk: 'Sure? Everything phone-only will be removed', phSameNone: 'The phone matches the tablet right now', phSameGo: 'Match', phSameYes: 'Yes, remove', phSameNo: 'Cancel', phStSame: 'Same as tablet', phBg: 'Background', phIcons: 'Icon style', phClim: 'Climate and vacuum cards', phTabName: 'Name on phones', phTabIcon: 'Icon on phones', phTabShow: 'Room button on phones', phTabHidden: 'This tab\'s button is hidden on phones; the tab can still be opened directly.', phTabNote: 'Area, columns and deleting the tab are shared with the tablet; switch to Tablet for those. Drag the room buttons in the strip above to change their order on phones.', phItemsDrag: 'Drag an item in the preview to change its order on phones.', phDark: 'Dark', phBlack: 'Black', camTabT: 'All cameras in one tab, one below the other', camCols: 'Cameras per row', camAuto: 'Auto', camColsT: 'Auto: as many side by side as fit the box (each at least 240 pixels). At most 2 on phones.', camRef: 'Picture refresh', camRefT: 'The snapshot on the tile refreshes at this interval; tap it for the live view', camRefOff: 'Slow', picksB: 'Recommended', picksS: 'Products I use at home, tried with the dashboard', pkAd: 'Promoted', pkCat_all: 'All', pkCat_light: 'Lights', pkCat_plug: 'Plugs and relays', pkCat_switch: 'Switches and panels', pkCat_remote: 'Remotes', pkCat_sensor: 'Sensors', pkCat_climate: 'Climate', pkCat_hub: 'Network and hubs', pkCat_other: 'Other', pkSearch: 'Search products', pkReady: 'Measurement ready', pkReadyT: 'Only products whose power the dashboard already knows: a measured table or a device that measures itself', pkProto: 'Connection: all', pkE_lut: 'Measured table ready', pkE_self: 'Measures itself', pkE_wait: 'Being measured', pkE_none: 'No measuring needed', pkNote: 'As an Amazon Associate I earn from qualifying purchases.', pkEmpty: 'No products for this filter.', pkInfo: 'Details', pkWhy: 'Why', pkPros: 'Pros', pkCons: 'Cons', pkApp: 'Open in the {s} app', pkSend: 'Send to my phone', pkQr: 'or scan with the camera', pkHere: 'Open on this computer', pkSent: '{s} sent to your phone', pkSendErr: 'Could not send to the phone', pkWhich: 'Which phone?', picksSet: 'Recommended products', picksSetT: 'The Recommended button in the top bar', pkShow: 'Show', pkHide: 'Hide', pkLocal: 'Local', starB: 'Star', starT: 'Like it? Give it a star on GitHub', starNews: 'If you like the dashboard, a star on GitHub helps its development.', starGh: 'Star on GitHub', covTiltE: 'Slat angle motor (optional)', covTiltET: 'If a separate motor turns the slats, pick its cover entity; the Slat angle row in the window drives it. Leave empty to use the cover\'s own slat control.', guideT: 'Guide', guideOpts: 'Options', guideS: 'Everything the dashboard can do, step by step with pictures', guidePrev: 'Previous', guideNext: 'Next', guideDone: 'Done', guideGh: 'Open on GitHub', guideStep: '{n} / {m}', guideNoImg: 'The picture could not load (no internet or GitHub is out of reach).', covL: 'Cover window', covAuto: 'Auto', cov_center: 'Center opening', cov_side: 'One side', cov_shutter: 'Shutter', cov_shade: 'Roller shade', cov_blind: 'Venetian blind', cov_vert: 'Vertical blind', covDir: 'Gathers to', covDl: 'Left', covDr: 'Right', covDc: 'Both sides', covT: 'The drawing and buttons of the window that opens on long press follow this. Auto: picked from the device type.', camRefS: 'Picture refresh', camRefST: 'For all cameras in this section. A single camera can be set separately in its ⚙.', d_free: 'An empty box without a title', secFree: 'The section type is only a start: anything can go into any section, and each item shows in its own way.', pfAll: 'All', pfTile: 'Lights and switches', titleOpt: 'Title (optional)',
    d_lights: 'Light, plug and cover tiles', d_scenes: 'Script, scene and automation buttons', d_climate: 'Air conditioner and radiator cards (summer/winter)', d_vacuum: 'Robot vacuum cards', d_media: 'TVs and speakers',
    n_items: '{n} items', addDev: 'Add', addPh: 'Empty tile', addScene: 'Add button', name: 'Name', target: 'Runs', noItems: 'No items yet.',
    tSensor: 'Temperature sensor', hSensor: 'Humidity sensor', fromDevice: 'From device', noOutdoor: 'No outdoor temperature', noLink: 'No linked device', linkT: 'Device controlled together (e.g. a second radiator in the same room)', outdoorT: 'Outdoor temperature sensor (radiator card shows heating demand)', addScPh: 'Empty button', kind: 'Type', k_auto: 'Automatic', k_ac: 'Air conditioner', k_radiator: 'Radiator',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Wide 16:9', scr_tabp: 'Large portrait', scr_phone: 'Phone', scr_here: 'This screen',
    pickT: 'Add', search: 'Search: name, area or entity id', cancel: 'Cancel', addN: 'Add ({n})', added: 'Added', noArea2: 'No area', nothing: 'No matching device.',
    sHelp: 'Help', repT: 'Report a problem', repS: 'Opens a GitHub issue with the version and device details; you only write what happened', repQ: 'What happened?', repPh: 'What did you do, what did you expect, what happened? Example: swiping a light bar on the Living room tab does not change the brightness.', repInfo: 'Details added to the issue', repInfoS: 'Nothing personal: no room, device or person names, address or account.', repNoGh: 'No GitHub account? Copy the text and send it to the developer.', repCopy: 'Copy text', repCopied: 'Copied', repGh: 'Open on GitHub', rWhat: 'What happened?', rInfoH: 'Details', rPanel: 'Dashboard', rInt: 'integration', rHa: 'Home Assistant', rBrowser: 'Browser', rApp: 'HA app', rScreen: 'Screen', rTouch: 'touch', rNoTouch: 'no touch', rCanvas: 'canvas', rLang: 'Language', rLayout: 'Layout', rAuto: 'automatic', rTabs: 'tabs', rSecs: 'sections', rItems: 'items', rKinds: 'Item kinds', rLook: 'Look', rLec: 'Light Effect Card', rErr: 'Recent errors', rNoErr: 'none', sBackup: 'Backup', sjVer: 'Version', akHoldPopT: 'The dashboard\'s window: brightness, colour, white tone', akHoldHaT: 'Home Assistant\'s own window', akHoldLecT: 'The light effects screen', sjLight: 'Effects', sjWalls: 'Switches', bkDown: 'Download backup', bkDownS: 'Tabs, sections and settings in one file', bkUp: 'Restore a backup', bkUpS: 'Pick a backup file; you are asked first, then it replaces the current layout', bkQ: 'Restore this backup?', bkW: 'Backup from {d} (v{v}): {n} tabs, {s} sections. The current tabs, sections and settings are replaced by it. Undo brings them back.', bkVer: 'The backup was made with v{v}; it can still be restored.', bkSvc: 'The pets in this backup run these services on their own:', twinL: 'Backup control', twinNone: 'None', twinT: 'If the lamp does not answer, the command is also sent through this', sWalls: 'Wall switches', wallsT: 'If the relay only gives a signal, pressing it by hand toggles the chosen lamp', wallSw: 'Switch', wallLight: 'Lamp', wallBr: 'Brightness %', wallK: 'Kelvin', wallAdd: 'Add switch', wallDel: 'Remove', wallPick: 'Pick…', wallNone: 'No wall switches yet.', wallAuto: 'If HA also has an automation for this switch, turn it off: {n}', bkYes: 'Restore', bkSaved: 'Backup downloaded', bkOk: 'Backup restored', bkErr: 'This file is not a dashboard backup', newsT: 'What\'s new', newsV: 'New in v{v}', newsOld: 'Earlier versions', newsAll: 'All notes on GitHub', newsOk: 'OK', newsLink: 'What\'s new', sVer: 'Version and updates', updT: 'Version', updInst: 'Installed: v{v}', updCheck: 'Check for updates', updChecking: 'Checking…', updOk: 'up to date', updAt: 'checked {t}', updNew: 'v{v} is ready', updNotes: 'What’s new', updNoHacs: 'Not installed with HACS or Marketplace, so it cannot be installed from here', updGo: 'Update', updGh: 'Open on GitHub', updIng: 'Downloading v{v}…', updDone: 'v{v} is downloaded. It takes effect when Home Assistant restarts.', updRestart: 'Restart', updAsk: 'Restart Home Assistant? Light control and automations stop for a minute or two.', updYes: 'Yes, restart', updRest: 'Restarting… The page reloads by itself when it is back.', updErr: 'Could not check: {e}', updAgain: 'Check again', s_board: 'Dashboard', s_look: 'Appearance', s_screen: 'Screen', s_info: 'Light effects',
    lang: 'Language', lAuto: 'Automatic', season: 'Season', seasonT: 'The climate section shows air conditioners in summer, radiators in winter. Automatic: May-September is summer.', sAuto: 'Automatic', sSum: 'Summer', sWin: 'Winter',
    bg: 'Background', bgT: 'Dark: the tablet dashboard background. Colour: any solid colour. Effect (default, Meditation): a soft glow in the effect colours of Light Effect Card. Image: an address like /local/background.jpg.', bgDark: 'Dark', bgBlack: 'Black', bgColor: 'Colour', bgFx: 'Effect', bgImg: 'Image', bgUrl: 'Image address', bgBad: 'No image opens at this address: put the file in HA\'s config/www folder and write /local/file.jpg.',
    theme: 'HA theme', themeT: 'Optional; dialogs open with this theme.', kHeader: 'Hide the top bar', kHeaderT: 'Home Assistant\'s header is hidden on this dashboard.',
    bb: 'Brightness on the clock', bbT: 'Swipe left or right across the clock area in the top bar to change the brightness of every light that is on in that tab\'s room together. Swipe all the way left to turn them off; when all are off, swiping turns the last ones you turned off back on.', bbPh: 'On phones and upright tablets too', bbPhT: 'These screens have no separate clock box: swipe the row with the page name and the clock. Turn it off and that row cannot be swiped.', bbLook: 'Look', bbLookT: 'Hidden: only the clock shows; the bar appears while you swipe. Box: a box like the room buttons.', bbHidden: 'Hidden', bbBox: 'Box', bbIcon: 'Icon', bbIconT: 'A bulb icon on the left', bbVal: 'Brightness indicator', bbValT: 'While swiping: the fill and percentage only show while you swipe. Always: shown whenever a light is on.', bbDrag: 'While swiping', bbAlways: 'Always',
    kSide: 'Hide the sidebar', kSideT: 'Home Assistant\'s sidebar is hidden on this dashboard. On a computer it opens when the mouse reaches the left edge of the screen; on a phone or tablet, swipe right.', kNo: 'Don\'t hide', kTouch: 'Phone and tablet', kAll: 'Everywhere', canvas: 'Canvas', canvasT: 'Design width and reference height (px). The dashboard scales to the screen with this ratio.',
    navAl: 'Align room buttons to a column', navAlT: 'The room buttons in the top bar end at the right edge of the chosen column and share the space evenly. They stay aligned on every screen size.', navNo: 'Off', navCol: 'Column {n}', navFx: 'Effects inside the aligned area', navFxT: 'When on, the Effects button is aligned together with the room buttons; when off it sits next to the clock.', navSz: 'Room button size', navSzT: 'Width and height (pixels). Empty means 235 × 155.', navSzA: 'Height (pixels). While aligned to a column the width is set automatically. Empty means 155.', navW: 'Width', navH: 'Height', clSt: 'Climate and vacuum cards', clStT: 'Halo: the large cards with a ring. Simple: one row; for climate the status, temperature and target, for vacuums the status, battery, start and dock. Tap the card to expand it: target − +, power, mode, fan, swing or stop, locate, suction (when the device supports them).', clHalo: 'Halo', clRows: 'Simple', s_phone: 'Phone', phNav: 'Navigation', phNavT: 'Categories at the bottom (recommended): Lights, Climate, Scenes at the bottom; in lights, swipe left and right to move between rooms. Rooms at the bottom: room buttons at the bottom of the screen, like an app. Rooms on top: the old layout with room buttons on top.', phTop: 'Rooms on top', phRooms: 'Rooms at the bottom', phCats: 'Categories at the bottom', phLights: 'Lights', phLightsT: 'As set in the section, always tiles, or one per row (each light a row; tap to toggle, swipe for brightness).', phLAuto: 'As in the section', phLTiles: 'Tiles', phLRows: 'One per row', phSheet: 'Light window from the bottom', phSheetT: 'The window opened by holding a light slides up from the bottom; pull it down to close. Tablets are not affected.', akT: 'Auto setup', akHint: 'The dashboard is built from your HA areas and devices. Choose, see the result below, Apply.', akRooms: 'Rooms (one tab each)', akHome: 'Home tab', akHomeT: 'A summary of the whole home: lights, scenes and climate taken from the rooms in turn', akOther: 'Other tab', akOtherT: 'A tab for rooms you did not pick and devices without an area', akWhat: 'What to include', akL: 'Lights', akS: 'Scenes', akC: 'Climate', akV: 'Vacuum', akM: 'Media', akK: 'Cameras', akLook: 'Look', akLights: 'Lights', akTiles: 'Tiles', akBars: 'Slider bars', akPhoneBars: 'Bars on phones', akRes: 'Result · {n} tabs', akSum: '{l} lights · {s} scenes · {c} cards', akNone: 'This selection gives no tabs.', akWarn: 'Apply replaces your current tabs. If you don\'t like it, use undo at the top; your settings stay.', akGo: 'Apply', akOk: 'Dashboard set up automatically', akNoAreas: 'There are no areas (rooms) in HA yet. Add rooms in Settings → Areas and they show up here.', akRoomsT: 'The areas in your home; each one you pick becomes a tab. The preview is a made-up home.', akTabs: 'Tabs', akTilesT: 'Square tiles, like a tablet', akBarsT: 'Tap to toggle, swipe for brightness', akPhoneBarsT: 'Tiles on tablets, bars on phones', akHaloT: 'Large cards with a ring', akRowsT: 'One row, opens on tap', akBgZen: 'Meditation', akBgAur: 'Aurora', akBgSun: 'Sunset', akBgOce: 'Ocean', akPhone: 'Phone', akPhoneT: 'Switch the preview to Phone to see it', akCatsT: 'Lights, Climate, Scenes at the bottom', akRoomsBT: 'Room buttons at the bottom', akTopT: 'Room buttons on top', akPvTab: 'Tablet', akPvPh: 'Phone', akPvNote: 'A made-up home: your dashboard is built from your own devices in the rooms you pick. Tap the preview to try it.', akTablet: 'Tablet', akTabletT: 'The preview switches to tablet', akPLSame: 'Same as tablet', akPLSameT: 'The section setting applies', akSheetOn: 'From the bottom', akSheetOnT: 'Pull down to close', akSheetOff: 'In the middle', akSheetOffT: 'A window, like on tablets', akBgKeep: 'If you pick none, your current background stays', akLec: 'Light effects', akLecT: 'With Lemur Light Effect Card · not installed', akLecTOk: 'Lemur Light Effect Card is installed: you can turn the Effects button on or off. Without it, this step explains what the card does and how to install it.', akLecOn: 'Effects on', akLecOnT: 'Effects button in the top bar; Effect tab in the light window', akLecOff: 'Effects hidden', akLecWhy: 'Moving effects for your lights: fire, aurora, rainbow and dozens more', akLecHow: 'Optional. Download Lemur Light Effect Card from the Marketplace (HACS on older versions), add the integration in Settings → Devices & services and restart HA. The dashboard detects it on its own, no setup needed: the Effects button, the Effect tab in the light window and effect buttons in scenes appear by themselves. If you remove it they are hidden and the dashboard keeps working.', akLecGet: 'Open in the Marketplace', akST: 'Choose a style', akSHint: 'Your tabs stay as they are; only the look changes, all at once. Try it in the preview and Apply if you like it.', akSrcMine: 'My home', akSrcDemo: 'Example home', akPvMine: 'Your own dashboard. Taps in the preview do not reach your devices.', akResS: 'Your tabs stay the same', akWarnS: 'Light look, climate cards, background, phone and effect settings change. If you don\'t like it, use undo to go back.', akOkS: 'Style applied', stlT: 'Background, light and climate look, the window a long press on a light opens, phone layout and the Effects button live here. Try them in the preview and apply with one tap.', stlGo: 'Choose a style', akImgT: 'An image in HA\'s www folder (/local/...) or a web address.', akPop: 'Light window', version: 'Version', lec: 'Lemur Light Effect Card', lecOn: 'Installed ({v}). The effect screen opens from the top bar, the light window and scene buttons.', lecOff: 'Not installed. Optional, for light effects; once it is installed, the Effects button is turned on or off in Choose a style.', lecNav: 'Effects in the top bar', lecNavT: 'A button next to the room buttons at the top that opens the effect screen', lecInfoT: 'Lemur Light Effect Card is installed', lecInfo: 'An Effects button was added to the top bar of the dashboard: it opens the effect screen for that tab\'s room. You can also add single effect buttons to scene sections (select the section → Add button → Light effects). The Effect tab in the light window opens the effect screen too.', ok: 'OK', iconPick: 'Choose icon', iconSug: 'Suggested', iconAll: 'Search results', iconSearch: 'Search (e.g. lamp, sofa, ceiling)', iconMore: 'Showing the first {n} results, narrow the search', iconNone: 'Nothing found. You can type the icon name as mdi:...', iconLoading: 'Loading icons…', icCol: 'Icons', iconEvery: 'All icons', icColNone: 'Could not load the icons.', icStyle: 'Icon style', icStyleT: 'Automatic: devices that are off are grey, devices that are on are colourful. Colourful: all colourful. Flat: all grey. Single colour: one tone; devices that are off are grey, devices that are on are in the colour you pick.', icAuto: 'Automatic', icFlat: 'Flat', icColor: 'Colourful', icTint: 'Single colour', icTintC: 'Pick a colour', icTintL: 'Light colour on lights', icTintLT: 'In single colour style, a light that is on shows its icon in the lamp\'s own colour.', icLec: 'Effect icons', icLecNone: 'Could not load the effect icons.', hold: 'Holding a light', holdT: 'What opens when you hold a light tile', hPop: 'Light window', hHa: 'HA dialog', hLec: 'Effect screen', lecOpen: 'Effect screen', lecStop: 'Stop effect', lecGroup: 'Light effects · {r}', lecLoading: 'Loading effects…', tOpen: 'Effect screen · {r}', tPlay: 'Effect: {e} · {r}', tStop: 'Stop effect · {r}', roomByTab: 'the tab\'s room', lecNa: 'Lemur Light Effect Card is not installed: this button is hidden on the dashboard',
    resetAll: 'Back to automatic layout', resetQ: 'Every tab and section is deleted and the dashboard is rebuilt from your areas. Settings stay.', resetOk: 'Back to automatic layout',
    secL: 'Second line', sc_none: 'None', sc_state: 'State', sc_lc: 'Last changed', sc_attr: 'Attribute', sc_tpl: 'Text or template', swapL: 'Name on top, value below', cfmL: 'Ask before running', cfmT: 'Against accidental taps: asks "run it?" first', cfmText: 'Question (empty: "Run <name>?")', nameTplT: 'Name and second line accept a Home Assistant template: {{ ... }}',
    cpT: 'Add a card', cpSearch: 'Search cards', cpHalo: 'Halo cards', cpHa: 'Home Assistant cards', cpCustom: 'Installed custom cards', cpYaml: 'Write YAML', ceT: 'Edit card', cePv: 'Preview', ceVisual: 'Visual', ceYaml: 'YAML', ceNoEd: 'This card has no visual editor; edit it as YAML.', ceLoad: 'Loading the editor…', ceEdit: 'Visual edit', ceBack: 'Back',
    modeSimple: 'Simple', modeAdv: 'Advanced', modeT: 'Simple mode shows only the basic settings; advanced settings are kept and keep working.', advHas: 'This item has advanced settings (size, colour, condition or a custom action). They are hidden in simple mode but still work.', advTag: 'advanced', helpT: 'Help',
    gapL: 'Spacing', gapAuto: 'Auto', heightL: 'Height', h_rows: '{n} rows', addSub: 'Subtitle', addSubT: 'A small heading inside the section (e.g. CONNECTION under the tiles)', subItem: 'Subtitle', subText: 'Text',
    scL: 'Colour by state', scT: 'Colour by an entity\'s state (e.g. feeding status: active → green, urgent → red). Works for text values too.', scE: 'Entity (empty: the item itself)', scState: 'State', scAdd: 'Add row', cFixed: 'Fixed colour',
    addPet: 'Pet', addPetT: 'Feeding card: a feeding reminder for a cat, dog, fish...', t_pets: 'Feeding', petItem: 'Feeding card', petKind: 'Kind',
    pk_cat: 'Cat', pk_dog: 'Dog', pk_fish: 'Fish', pk_bird: 'Bird', pk_rabbit: 'Rabbit', pk_turtle: 'Turtle', pk_other: 'Other',
    petSched: 'When to feed', pm_interval: 'Every N hours', pm_times: 'At set times of day', petEvery: 'Every how many hours', petTimes: 'Times (comma separated)',
    petSoon: 'Soon warning (min before)', petGrace: 'Grace time (min)', petNotify: 'Notify when late', petNoNotify: 'No notification', petFeederT: 'Also runs this service on "fed" (e.g. button.press)', petFeeder: 'Automatic feeder (optional)',
    petEnt: 'Home Assistant gets a "{n} feeding" status and a "{n} fed" button, usable in automations.', petNeedName: 'Write the pet\'s name', petFeederBad: 'The feeder service must be in one of these domains: {d}',
    lookL: 'Look', lk_tile: 'Tile', lk_button: 'Button', lk_row: 'Row', lk_halo: 'Halo', colorsL: 'Colours', cIcon: 'Icon', cOn: 'When on', cBg: 'Background', cNone: 'None',
    zonesL: 'Colour by value', zonesT: '4 limits, 5 colours: when the value reaches a limit it moves to the next colour (like the zones in Halo cards). The frame, value and icon take this colour.', zLim: 'Limit {n}',
    cardTapT: 'If not set, the card handles taps itself', a_defCard: 'Default: the card itself',
    fillL: 'Fill', fillC: 'Fit content', fillF: 'Fill the box', fillT: 'Fill the box: buttons and tiles share the box height evenly', alignL: 'Alignment', alTop: 'Top', alCenter: 'Middle', alSpread: 'Spread evenly',
    sizeL: 'Size', sz_row: 'Full row', icSizeL: 'Icon size', txSizeL: 'Text size', sz_auto: 'Auto', sz_s: 'Small', sz_m: 'Medium', sz_l: 'Large',
    tPop: 'Opens in a window: {t}', imT: 'Item settings', imSave: 'Save', iconOn: 'Icon when on', iconOff: 'Icon when off', tapL: 'On tap', holdL: 'On hold', actL: 'Action',
    a_defMore: 'Default: more info', a_defTog: 'Default: toggle', a_defHold: 'Default: light or more-info window', a_defRun: 'Default: run the chosen target', a_more: 'More info', a_tog: 'Toggle', a_none: 'Nothing',
    a_svc: 'Call a service', a_pop: 'Open a card in a window', a_yaml: 'Advanced (YAML)', svc: 'Service', tgt: 'Target entity', svcData: 'Data (YAML, optional)', popTitle: 'Window title', cardY: 'Card (YAML)', actY: 'Action (YAML)',
    visL: 'Only show when', visT: 'If the condition is not met the item is not drawn at all and leaves no gap. It shows faded in the preview.', visE: 'Entity', v_eq: 'equals', v_in: 'is one of', v_not: 'is none of', visV: 'State (comma for several)', visNow: 'Now: {s}',
    yamlErr: 'Could not read the YAML: {e}', yamlErrL: 'Could not read the YAML: indentation or syntax error on line {n}', cardNoType: 'The card has no "type:" line', addCard: 'Card', addCardT: 'Add a Halo card, a Home Assistant card or an installed custom card; pick from the list, set it up visually', cond: 'conditional', cardItem: 'Card', svcNeed: 'The service must look like "domain.service" (e.g. timer.start)',
    close: 'Close', notLoaded: 'The Lemur Home Dashboard integration is not loaded.', editNote: 'Note: if you "take control" of this dashboard in Home Assistant\'s own editor, it disconnects from this panel.',
    t_energy: 'Energy', d_energy: 'Home power, categories, charts', addEn: 'Energy card', addEnT: 'Home power now, categories, top consumers, daily usage, last 24 hours or standby', enItem: 'Energy card',
    enTab: 'Energy tab', enTabT: 'Home power, categories, top consumers and charts in a ready tab', akE: 'Energy', akET: 'An Energy tab at the end',
    sEnergy: 'Energy', enSrc: 'Where the data comes from', enSrcT: 'From "Individual devices" in Home Assistant\'s Energy settings. Entries not inside another one become categories, the ones inside become devices.', enSrcGo: 'Open energy settings',
    enPrice: 'Price per kWh', enPriceT: 'If set, the cards also show the cost (in Home Assistant\'s currency)', enTotal: 'Total home power', enTotalT: 'If a power sensor is picked, Halo shows it; otherwise the sum of the categories',
    enAuto: 'Sum of categories', enSb: 'Standby power', enSbT: 'If none is picked, the lowest total power of the last 24 hours', enSbAuto: 'Lowest of the last 24 hours', enLim: 'Halo colour limits (W)', enLimT: 'Green, yellow, orange; above is red',
    enBadge: 'Watts on light tiles', enBadgeT: 'Live watts in the corner of light and plug tiles that measure power', enB_off: 'Off', enB_on: 'When on', enB_always: 'Always',
    enCols: 'Columns', enChart: 'Small chart', enC24: '24 hours', enC7: '7 days', enChNone: 'None', enCount: 'How many devices', enCat: 'Category', enAll: 'All', enIdle: 'Hide idle devices', enIdleT: 'Devices under 2 W are not listed',
    pfEnergy: 'Energy', addEnPick: 'Pick the card to add; change its look later in the card settings', addEnVals: 'Values that fit this section', addEnValsT: 'Added here as a {l}, the same size as the other items', addEnCards: 'Large cards', lrLeftCol: 'Colors and white tones ({n} steps)', lrLeftFx: 'Effects ({n} steps)', lrEvery: 'How often the plug sends a reading', lrEveryV: '~{s} s', lrResumed: 'Going on from where it was after a restart', enLook: 'Look', enSort: 'Order', enSortFix: 'Order in Categories', enSortW: 'Highest first', enLoose: 'Uncategorized tile', enLooseT: 'The total of devices without a category', enDays: 'Days', enUnit: 'Unit', enKwh: 'kWh', enCost: 'Money', enCostT: 'For money, set a price on the Energy page', enMode: 'Lines', enModeCats: 'Categories', enModeTot: 'Total', enChips: 'Details below', enChipsT: 'Today\'s kWh, cost and monthly usage at this rate', enKind: 'Card',
    enPage: 'Energy settings', enBtn: 'Energy', enOpenT: 'Devices, categories, solar, price, bills and tips on their own page', en_sum: 'Summary', en_src: 'Data source', en_tariff: 'Price and tariff', en_bill: 'Bills', en_est: 'Estimated devices', en_look: 'Look and data',
    enSumT: 'What the settings give today. Tap a row to open that part.', enSMonth: 'This month', enSYear: 'This year', enSBill: 'Last bill', enSEst: 'Estimated devices', enNoBill: 'No bill entered', enNoData: 'No energy data yet', enCats: '{n} categories, {d} devices', enUnt: '{p}% not measured', enEstN: '{n} devices · ~{w} now', enNone: 'None', enLoading: 'Loading…', enPriceNone: 'No price',
    enPrMode: 'Price', enPrBill: 'From the bill', enPrSingle: 'One price', enPrTier: 'Tiered', enPrBillT: 'Last bill: {k} kWh, {t} → {u} per kWh. Updated with every new bill.', enPrBillNo: 'Enter a bill under Bills and the unit price comes from it (taxes and fixed charges included).',
    enLow: 'Lower tier', enHigh: 'Upper tier', enDaily: 'Daily limit', enMonthLim: 'This month\'s limit ({d} days × {k} kWh)', enLowL: 'Lower tier: {k} kWh', enHighL: 'Upper tier: {k} kWh', enMonthSo: 'This month so far ({k} kWh)', enTierT: 'Usage under the daily average limit costs the lower price, the rest the upper price. Enter prices per kWh with taxes, as on the bill.',
    en_meter: 'Home meter', enMeterT: 'A device that measures the whole home (like a Shelly Pro EM, fitted in the fuse box). Once picked, the dashboard takes the real usage, the untracked share and the year\'s total from it, and adds it to Home Assistant\'s Energy settings as the grid source itself.', enMeterFound: 'Meters found ({n})', enMeterUse: 'Use as home meter', enMeterNone: 'No device measuring the whole home was found. Add it to Home Assistant first; it shows up here by itself.', enMeterManual: 'Not listed, let me pick', enMeterDel: 'Remove', enMPow: 'Power now', enMPowT: 'What the home draws now (W)', enMIn: 'Energy from the grid', enMInT: 'Total kWh counter; the year\'s total comes from this', enMOut: 'Energy to the grid', enMOutT: 'If you export solar', enMVolt: 'Voltage', enMVoltT: 'To spot an outage (V)', enMInvT: 'Turn on if import shows negative', enMNow: 'Home now', enMPanel: 'Devices on the dashboard', enMUnt: 'Untracked', enMToday: 'Today', enMYear: '{y} total', enMYearEst: 'records from {d}', enMNoE: 'No energy (kWh) sensor picked: needed for the year\'s total and the grid source.', enMWhat: 'What changed?', enMW1: 'Power now comes from the meter: measured, not estimated.', enMW2: 'Untracked share = meter − dashboard devices; no bills needed.', enMW3: 'The year\'s total and the tier check use the meter\'s kWh records.', enMW4: 'Added to Home Assistant\'s Energy settings as the grid source; removing it undoes that.', enSolT2: 'Turn on what your home has; only its settings show.', enSunOn: 'I have solar', enSunOnT: 'Panels or an inverter', enBatOn: 'I have a battery', enBatOnT: 'With or without solar', enSolNone: 'Both are off. Turn one on above if your home has solar panels or a battery.', enBgCh: 'Charged since {d}', enBgDis: 'Discharged', enBgLoss: 'Lost', enBgGain: 'Battery saved you', enBgCost: 'Battery cost you', enBgNoTou: 'Savings are worked out on a time-of-use tariff (if 1 kWh costs the same at every hour, a battery saves no money)', enBgNone: 'No battery records yet; Home Assistant collects them over a few hours.', enGridFromMeter: 'The grid comes from the home meter: {n}.', enGridNoMeter: 'If there is no home meter', enFOut: 'Grid', enFOutT: 'Outage', enBatN: 'battery {p}', enBatOnly: 'battery', enChTou: 'Time of use', enChTouT: 'Day, peak and night prices.', enTouExp: 'No tiers; the price depends on the hour: day 06-17, peak 17-22, night 22-06. Official prices with taxes; correct them if your bill differs.', enTouD: 'Day (06-17)', enTouP: 'Peak (17-22)', enTouN: 'Night (22-06)', enFillTou: 'Fill in official prices', enFillTouT: 'EPDK, household, with taxes', enTouSum: 'Your use this period: day {d}%, peak {p}%, night {n}% · 1 kWh averages {u}', enTouSumEst: 'No hourly records; worked out like a typical home (day 50%, peak 25%, night 25%).', enTouCmp: 'On the tiered tariff this period ~{a}, on time of use ~{b}.', enTarLead2: 'The money figures on the cards come from here. Three steps; no bills needed, the year\'s total comes from Home Assistant\'s records.', enTarQ1: 'Which tariff is on your bill?', enChTier: 'Tiered', enChTierT: 'Most homes. Cheaper up to 8 kWh a day.', enChSktt: 'Last resort', enChSkttT: 'If you passed the yearly limit.', enChBill: 'Not sure', enChBillT: 'Work it out from a bill.', enChSingle: 'Fixed price', enChSingleT: 'No tiers or a contract.', enTarQ2: 'What does 1 kWh cost?', enTierExp2: 'Usage up to an average {k} kWh a day in the billing period is cheaper, the rest dearer. Official prices with taxes; correct them if your bill differs.', enPerSum: 'This period ({a} – {b}): {k} kWh so far, period limit {l} kWh · ~{e} kWh by the end, ~{t}', enSkttExp: 'No tiers on the last-resort tariff: every kWh costs the same, but the price changes monthly. Enter what 1 kWh costs on your bill (with taxes).', enGoBills: 'Go to bills', enTarQ3: 'How is the year going?', enYNoData3: 'No energy records for this year in Home Assistant. Add the grid meter in the Energy settings or add devices that measure power; you can also enter the total from your bills below.', enV_short: 'Home Assistant has {d} days of records; the year-end estimate needs at least {n}. Enter a bill or the year\'s kWh and it is worked out at once.', enV_ok: 'At this rate you end the year at ~{p} kWh, {d} kWh under the limit. The price stays.', enV_cross: 'At this rate you cross the limit around {c}. From <b>{s}</b> electricity comes at the last-resort price until the end of {y}.', enV_now: 'You crossed the limit: the last-resort price applies since <b>{s}</b>. Pick "Last resort" in step 1 so the figures are right.', enV_nowOn: 'You crossed the limit: you are on the last-resort price since <b>{s}</b>. Figures use that price.', enV_prev: 'Last year you were over the limit ({l}) with {p} kWh: this year you are on the last-resort tariff. Pick "Last resort" in step 1.', enV_prevOn: 'Last year you were over the limit ({l}) with {p} kWh: this year you are on the last-resort tariff. Figures use that price.', enRowTot: '{y} total', enSrc_grid: 'From the grid meter in Home Assistant · no bills needed', enSrc_panel: 'From what the dashboard measures · devices it does not measure are missing, the real figure is higher', enSrc_bills: 'From the bills you entered', enSrc_manual: 'From the total you entered', enSrc_none: '', enSrcTail: 'after the last bill from Home Assistant', enSrcEst: 'records start on {d}, the part before is filled in with the average', enRowAvg: 'Daily average', enRowAvgT: 'Since 1 January', enRowProj: 'At this rate by year end', enRowProjT: 'Limit {l} kWh', enRowCross: 'Day you cross the limit', enRowCrossT: 'If this rate holds', enRowStart: 'Last-resort price starts', enRowStartT: 'The 1st of the third month after crossing', enRowPrev: '{y} total', enRowPrevT: 'This year\'s limit {l} kWh', enRowSktt: '1 kWh on the last-resort tariff', enRowSkttT: 'Changes monthly; enter your bill\'s value once there', enHow: 'How does it work?', enMoreExact: 'More exact (optional)', enMoreExactT: 'The sum of kWh on your bills. Leave empty to use Home Assistant\'s records.',
    enTarLead: 'The money figures on the cards come from here. Fill it in as on your bill; if unsure, pick "From bill" and the unit price is worked out from the bill you enter.', enTarQ: 'Which price do you pay?', enPrTier2: 'Tiered (most homes)', enTierExp: 'The usual home tariff. Usage up to an average {k} kWh a day in the billing period is cheaper, the rest is dearer: in a 30-day period the first {m} kWh. Enter prices with taxes (what 1 kWh costs on the bill).', enLow2: 'Up to {k} kWh a day', enHigh2: 'Above', enFill: 'Fill in official prices', enFillT: 'EPDK tariff of 4 April 2026: 3.24 and 4.88 TL (energy, distribution, 5% consumption tax, 1% energy fund and 10% VAT included). Update them when the tariff changes.', enTierMore: 'Change the daily limit', enDailyT: '8 kWh for homes. The period limit is days × this value.', enSingleExp: 'Without tiers, or with a fixed price from a supplier contract: every kWh at this price.', enYTitle: 'Yearly limit: {n} kWh', enYR1: 'If the home uses more than {n} kWh in a calendar year (1 January – 31 December), electricity no longer comes at the tiered price but at the dearer "last resort" price that changes every month.', enYR2: 'It starts not in the month you cross but on the 1st of the third month after it: cross in October and it starts on 1 January, in December on 1 March.', enYR3: 'It lasts until the end of that year. If a year\'s total stays under the limit, the normal price comes back the next year.', enYR4: '2026 usage is also counted against 3,000 kWh (EPDK decision of 30 October 2026; it used to be 4,000). One high month alone changes nothing; the year\'s total is what counts.', enYThis: '{y} total (meter)', enYAvg: 'Daily average', enYProj: 'At this rate by year end', enYVOk: 'At this rate you end the year at ~{p} kWh, {d} kWh under the limit. The price stays.', enYVCross: 'At this rate you cross the limit around {c}. The last-resort price starts on {s}.', enYVPast: 'You crossed the limit this year. The last-resort price applies from {s} (or already does); enter it below and turn on "I am on the last-resort tariff".', enYVPrev: 'Last year you were over the limit with {p} kWh: this year you are on the last-resort tariff. Enter its price below and turn on "I am on the last-resort tariff".', enYNoData2: 'To see this year\'s usage, enter the total from 1 January to the end of your last bill below, or add this year\'s bills in Bills. The dashboard adds what came after the last bill.', enYtd: '1 January to the end of the last bill (kWh)', enYtdT: 'The sum of kWh on this year\'s bills. If empty, it is added up from the bills you entered; the dashboard adds what came after the last bill.', enPrev: '{y} total (kWh)', enSktt2: 'Last-resort price', enSkttT2: 'With taxes, per kWh. Changes monthly: (market price + YEKDEM) × 1.05 + distribution + taxes. If you are on it, enter the value from your bill.', enFillS: 'Fill in an estimate', enFillST: '~7 TL: an example with October 2026 market prices, not exact.', enSkttOn: 'I am on the last-resort tariff', enSkttOnT: 'When on, everything is worked out without tiers at the last-resort price.', enYMore: 'Change the limit by hand', enYLimT: 'For a business or a different limit.', enTarSrc: 'Source: EPDK tariff tables (4 April 2026) and the last-resort tariff decision (30 October 2026). Your bill is what counts.',
    enYear: 'Yearly limit', enYearT: 'Above this yearly usage a higher tariff applies (from the start of the third month after the one it was crossed in). 4,000 kWh for 2026, 3,000 kWh from 2027.', enYAuto: 'By year ({n})', enYMan: 'Manual', enYLim: 'Limit (kWh/year)', enSktt: 'Price above the limit', enSkttT: 'For estimates; optional', enYNow: 'Last 12 months', enYEnd: 'Left to the limit', enYOver: 'Limit crossed', enYNoData: 'Calculated once the last 12 months or bills are entered under Bills.',
    enBillT: 'Bills give three things: the real unit price, the share the dashboard does not measure and a past total for the yearly limit.', enBFrom: 'Period start', enBTo: 'Period end', enBKwh: 'Usage (kWh)', enBTl: 'Total amount', enBAdd: 'Add bill', enBPer: 'Period', enBPanel: 'Measured', enBUnt: 'Not measured', enBUnit: 'Per kWh', enBBad: 'Enter the period dates, kWh and amount', enBAdding: 'Adding up the dashboard\'s total for that period…', enBNone: 'No bills yet.',
    enL12: 'Usage of the last 12 months (kWh)', enL12T: 'Shown on the chart on the back of the bill; the yearly limit tracking starts from it.', enUntT: 'Last period: meter {a} kWh, dashboard {b} kWh. The {c} kWh between ({p}%) is not on any sensor; it shows as a grey "Not measured" category tile. Add estimates for the fridge, oven or washing machine to make it smaller.',
    enEstT: 'Estimated values for devices that do not measure power. Each gets a power and an energy sensor in Home Assistant and is added to the Energy settings inside the chosen category. Cards show them with "~".', enEAdd: 'Add device', enENew: 'New device', enEName: 'Name', enEKind: 'Kind', enENone: 'No estimated devices yet.',
    ek_light: 'Light', ek_lightT: 'Standby and max W, by brightness', ek_onoff: 'On / off', ek_onoffT: 'W when off and when on', ek_fixed: 'Fixed', ek_fixedT: 'Always the same W', ek_year: 'Yearly usage', ek_yearT: 'The label\'s kWh/year', ek_cycle: 'Cycles', ek_cycleT: 'kWh/100 cycles, cycles per week',
    enEIdle: 'Off (standby) W', enEMax: 'At 100% brightness W', enEOff: 'Off W', enEOn: 'On W', enEW: 'Power (W)', enEYear: 'Yearly usage on the label (kWh)', enEK100: 'Usage on the label (kWh/100 cycles)', enEWeek: 'Cycles per week', enEEnt: 'Device that gives the state', enECat: 'Category', enECatNone: 'Its own category',
    enENow: 'Now', enEAvg: 'Average', enEDay: '{k} kWh a day, {y} kWh a year', enEBri: 'at {p}% brightness', enEYearT: 'Appliances with a compressor swing between 0 and 120 W; the average adds up right over a year.', enEEnts: 'Home Assistant gets: {p} and {e}', enESave: 'Save', enEDel: 'Delete',
    enESaved: 'Saved', enEDeleted: 'Deleted', enEPrefErr: 'Saved, but the Energy settings could not be changed: {e}', enENeed: 'Enter a name', enEDirty: 'What you typed is not saved. Tap again to close, or press Save.', enENaN: 'Enter a number here', enENeg: 'The value cannot be negative', enEBig: 'The value is too large (at most {n})', enEOnOff: 'Power when on cannot be lower than power when off', enEMaxMin: 'The highest power cannot be below the lowest or the standby power', enEDup: 'A device with this name already exists', enBLong: 'A billing period can be at most 100 days; check the dates', enBUpd: 'The bill for this period was updated', enTierOrder: 'The low tier price looks higher than the high tier; please check', enENeedEnt: 'Pick the device that gives the state', enEDelQ: 'Sure? Delete',
    enTilde: 'Mark estimated values', enTildeT: 'Estimated watts show with "~" in purple on the cards', enUntL: 'Not measured tile', enUntLT: 'The share not measured, from the last bill, as a category tile', enBars: 'Tier and yearly limit bars', enBarsT: 'Under the Halo, when set up',
    en_dev: 'Devices', en_cat: 'Categories', en_solar: 'Solar and battery', en_tips: 'Tips', en_imp: 'Import',
    enDevT: 'The devices the dashboard tracks. Devices that measure power are added as they are; for the others a virtual measurement is set up and Home Assistant gets a power and an energy sensor. All are added to the Energy settings inside the category you pick.',
    enFMeas: 'Measured', enFVirt: 'Virtual', enNoCat: 'Uncategorized', enDNoF: 'No devices in this filter.', enFound: '{n} devices that measure power found', enFoundT: 'Devices with a power sensor in Home Assistant that are not on the dashboard yet', enAddAll: 'Add all ({n})', enAdd1: 'Add', enShowAll: 'Show all ({n})', enDAdded: '{n} devices added',
    enEEdit: 'Edit device', ek_meas: 'Measured', ek_measT: 'Has its own power sensor', ek_states: 'By state', ek_statesT: 'A W value for each state',
    enInT: 'Devices on this plug', enInTag: '{n} devices on it', enInH: 'If other tracked devices are on this plug too (e.g. an LED strip on the desk), tick them: their power is taken off the plug, what is left gets a row of its own and nothing is counted twice.', enInNone: 'No other device to link. Add the lights or other devices on the plug first.', enInRest: 'Name of what is left (optional)', enInRestT: 'Shown with this name on the cards and in the categories; left empty, the plug\'s name is used. Do not give two plugs the same name, the card cannot tell them apart.', enInRestPh: 'Other devices on the plug', enInPlug: 'The plug measures', enInDevs: '{n} ticked devices', enInHint: 'On the cards and in Home Assistant\'s Energy page, the rest and the ticked devices show separately instead of the plug\'s total. The rest goes in this device\'s category.', enMSensor: 'Power sensor (W)', enMEnergy: 'Energy sensor (kWh)', enPick: 'Pick', enMCalc: 'Let the dashboard count', enMCalcT: 'Without an energy sensor the dashboard counts kWh from the power: {e}', enEMin: 'W at lowest brightness', enPick1: 'Pick from the dashboard', enPick1N: 'Devices on the dashboard ({n})', enPickOther: 'Other devices', enLibBusy: 'Checking the measurement library…', enLibOk: 'Values come from a measured table: {n}', enLibStrip: 'This strip is kept per meter in the pool; it is scaled once you enter its length below.', enSbUnm: 'not readable, counted as {w} W', enSbUnmT: 'Standby was below what the plug can read (0 W); while the light is off and on the network it counts as {w} W. If you know the real value, enter it in Off.', enSr: 'LED strip', enSrT: 'A strip\'s power changes with its length. When you change the length, the table and values are scaled to it.', enSrLen: 'Length (m)', enSrCap: 'Adapter power (W)', enSrCapPh: 'empty: no limit', enSrRef: 'Table measured on (m)', enSrRefT: 'The length of the strip this light\'s table was measured on. Left empty, the table is taken as already fitting this length.', enSrRefPh: 'empty: same', enSrNew: 'On save: {a} m → {b} m, highest {w}.', enSrM: '{m} m strip', enLibNone: 'This model is not in the library: enter values or learn them with a plug.', enMinPh: 'empty: standby',
    enNewCat: '+ New category', enNewCatN: 'Name of the new category', enStT: 'Power by state', enStH: 'An empty state takes the "Other states" value', enStOther: 'Other states', enStPick: 'Pick the device that gives the state first; its states are listed here.',
    enMNeed: 'Pick the power sensor', enCNeed: 'Enter a category name',
    enCatT: 'Categories are the tiles on the cards. Each gets a total power and kWh sensor in Home Assistant and is added to the Energy settings, with its devices under it.', enCDevs: '{n} devices', enCNone: 'No categories yet. Devices without one are grouped in an "Uncategorized" tile.', enCAdd: 'Add category', enCEdit: 'Edit category', enCColor: 'Color', enCMem: 'Devices in it ({n})',
    enSolT: 'Pick the solar, grid and battery sensors. The flow and battery cards fill from them; production is added to Home Assistant\'s Energy settings as a solar source.', enSolOn: 'Home has solar', enSolOnT: 'Shows the production, grid and battery settings',
    enSolProd: 'Production', enSolP: 'Production power (W)', enSolPT: 'The inverter\'s live output', enSolPE: 'Production energy (kWh)', enSolPET: 'If none, the dashboard counts it from the power',
    enSolGrid: 'Grid', enSolGM: 'Grid metering', enGNet: 'One sensor', enGTwo: 'Import and export apart', enGNone: 'None', enGNetS: 'Grid power (W)', enGNetST: 'Plus: taken from the grid, minus: sent to it', enGIn: 'From the grid (W)', enGOut: 'To the grid (W)', enExp: 'Export price', enExpT: 'Per kWh sent to the grid; optional',
    enSolBat: 'Battery', enSolBatT: 'If there is one', enBP: 'Battery power (W)', enBPT: 'Plus: charging, minus: discharging', enBInv: 'Reversed sign', enBInvT: 'Turn on if the sensor shows charging as minus', enBSoc: 'Charge (%)', enBCap: 'Capacity', enBCapT: 'For time left and kWh',
    enFProd: 'Production now', enFExp: 'Sending to the grid', enFImp: 'Taking from the grid', enFCh: 'Battery charging', enFDis: 'Battery discharging', enFHome: 'Home usage',
    enSolCard: 'Add the flow card to the Energy tab', enSolNoTab: 'Add an Energy tab first (+ Tab → Energy)', enSolHas: 'The flow card is already there', enSolAdded: 'Flow card added to "{t}"',
    enTipsT: 'No notifications. Tips rotate in one line under the Halo and the related device\'s row gets an orange edge. Tap a tip to open the device; hold it and it won\'t show again on that screen.', enTOn: 'Tips', enTOnT: 'Off: none are shown',
    enTNow: '{n} tips now', enTHide: 'Hide', enTNone: 'No tips right now.', enTLeft: 'Left on for long', enTLeftT: 'A device drawing more than this for longer than this', enHrs: 'h', enTSb: 'Night standby', enTSbT: 'When the home\'s lowest power between 02 and 05 is above this',
    enTDay: 'Daily goal', enTDayT: 'When today\'s usage passes the goal', enTYear: 'Near the yearly limit', enTYearT: 'When the last 12 months reach 85% of the limit', enTSun: 'Solar surplus', enTSunT: 'While more than 500 W goes to the grid', enTDot: 'Dot on the tab', enTDotT: 'A small orange dot on the Energy tab button while there are tips', enTReset: 'Bring back hidden tips ({n})',
    enImpT: 'Brings the virtual power devices and groups you set up with another add-on into the dashboard: devices keep their names, groups become categories. You see what will happen first; nothing in that add-on changes, and you can remove it yourself after checking.',
    enImpScan: 'Scan', enImpDone: '{n} devices and {c} categories imported', enImpOld: 'Old total now', enImpNew: 'Dashboard\'s figure', enImpAfter: 'Compare both sides for a few minutes. If they match, you can remove the old add-on from Home Assistant.', enImpNone: 'Nothing to import was found.',
    enImpCats: 'Categories', enImpDevs: 'Devices', enImpSkip: 'Already on the dashboard', enImpChk: 'For {n} devices the value was taken from a lookup table at today\'s power; check them under Devices after importing.', enImpChkP: 'check',
    enImpWhat: 'Importing takes {n} old entries out of the Energy settings and adds the dashboard\'s sensors.', enImpAgain: 'Scan again', enImpGo: 'Import {n} devices', enImpGoQ: 'Sure? Import',
    enDevN: '{n} devices ({m} measured, {v} estimated) · ~{w} now', enFoundP: '+{n} found', enCatN: '{n} categories · {u} uncategorized', enSolN: 'Producing {w} now', enSolNoS: 'No sensor picked', enOff: 'Off',
    enSyncOn: 'Kept in step with the Energy settings', enSyncOff: 'Sync off', enSrcT2: 'The cards fill from the dashboard\'s devices and categories. The dashboard also adds them to Home Assistant\'s Energy settings and leaves your other entries alone.', enSync: 'Sync with the Energy settings', enSyncT: 'Devices, categories and solar production also show on Home Assistant\'s Energy dashboard',
    enDvN: 'Tracked', enDvW: 'Now in total', enDvMT: 'Measured / estimated', enDvC: 'To check', enDvQ: 'Search devices', enDvGR: 'By room', enDvGC: 'By category', enDvAddL: 'Add lights', enDvNoL: 'No lights left to add', enDvAddM: 'Add measuring devices', enDvNoM: 'No new measuring device found', enDvAddO: 'Other device', enDvFL: 'Lights', enDvFE: 'Estimated', enDvFC: 'To check', enDvFR: 'No room', enDvNoRoom: 'No room set', enTgM: 'Measured', enTgR: 'Learning', enTgO: 'Learned', enTgL: 'Ready table', enTgE: 'Estimated', enTgC: 'Check', enDvInPlug: 'on the plug', enDvGN: '{n} devices', enDvNone: 'No device matches this filter.', enDvEmpty: 'No devices yet. Start with Add lights or Add measuring devices.', enDvRoomT: 'The room comes from the area set for the device in Home Assistant. Devices without one are left out of the room totals; set it on HA\'s device page.', enDvAddLT: '{n} lights the dashboard does not track, by room', enDvAddMT: '{n} devices that measure power but are not added, by room', enDvSelAll: 'Select all', enDvSelNone: 'Select none', enDvAddLH: 'Lights go in the Lights category. "Ready table" ones come with values measured beforehand; "Estimated" ones you can teach later with a measuring plug.', enDvAddMH: 'Added with their own power sensor, and their energy sensor if one is found. Pick the category later.', enDvAddN: 'Add {n} devices', enDvLCat: 'Lights', enWSens: 'The power sensor does not respond', enWSensT: 'The sensor is missing or unavailable in Home Assistant; the device counts as 0 W. Check the plug or pick another sensor below.', enWNoEntT: 'The linked device was not found in Home Assistant; it counts with its estimate.', enDsWhat: 'What is it?', enDsRoom: 'Room', enDsRoomT: 'The room comes from the area set for this device in HA.', enDsHow: 'Where does its power come from?', enDsRec: 'Suggested', enDsVals: 'Values', enDsLutOwn: 'This light was measured with a plug; the table for colours, white tones and effects is used. The values below are used only without a table.', enDsLutLib: 'A ready table measured beforehand is used for this light. The values below are used only without a table.', enDsAdv: 'Home Assistant sensors', enDsOwnE: 'Energy from its own sensor: {e}', ekL_meas: 'Measures itself', ekD_meas: 'The device or its plug has its own power sensor. The most accurate.', ekL_light: 'Light: by brightness', ekD_light: 'By brightness and colour. A measured table if there is one, otherwise the lowest and highest values.', ekL_states: 'By state', ekD_states: 'A watt value for each state, like playing, idle or cooling.', ekL_onoff: 'On / off', ekD_onoff: 'One value when on, one when off.', ekL_fixed: 'Always the same', ekD_fixed: 'Always draws the same (a modem, a camera).', ekL_year: 'Yearly label', ekD_year: 'The label\'s kWh per year, as an average (a fridge).', ekL_cycle: 'By cycles', ekD_cycle: 'kWh per 100 cycles and cycles per week (a washer, a dishwasher).',
    enWNoEnt: 'This device was not found in Home Assistant; check its id.', enWZero: 'No state has a W value; the device counts as 0 W.', enCSame: 'A category with this name already exists', enMUsed: 'This power sensor is already used by another device', enAddAllQ: 'Sure? {n} devices will be added',
    enImpToDev: 'Go to devices', enGInv: 'Reversed sign', enGInvT: 'Turn on if the meter shows sending to the grid as plus',
    lrNoEnt: 'Pick the device that gives the state and save first', lrH: '{h} h {m} min', lrM: '{m} min', lrTestOk: 'The plug went {a} → {b}. The device is on this plug.', lrTestNo: 'The plug did not change ({a}). Is the device plugged into it?',
    lrErr_busy: 'This device is already being measured', lrErr_too_many: 'At most 3 measurements at a time', lrErr_plug: 'The plug sends no value', lrErr_entity: 'Device not found', lrErr_x: 'Could not start', lrSaved: 'Saved',
    lrTitle: 'Learn · {n}', lrSubL: 'Real power in every color and brightness', lrSubS: 'Real power in each state', lrS_pool: 'Pool', lrS_prep: 'Prepare', lrS_probe: 'Probe', lrS_full: 'Full measure', lrS_res: 'Result', lrS_listen: 'Listening',
    lrPoolLook: 'Looking in the shared pool', lrNoModel: 'Home Assistant does not report this device\'s model', lrPoolNoModel: 'Model unknown', lrPoolErr: 'The pool could not be reached', lrPoolNone: 'This model is not in the pool', lrPoolNoneT: 'Measure it yourself with a plug that measures power.', lrOwn: 'I\'ll measure it',
    lrSrcPool: 'A ready table exists for this model', lrVerified: 'verified', lrSrcLib: 'In the open measurement library', lrPoolVals: 'Standby {s}, lowest {a}, highest {b} · {n} points.', lrV: 'Measured on {v} V mains.', lrUse: 'Use this measurement',
    lrPoolNote: 'A ready measurement shows with "~" on the cards. Your own measurement always comes first.', lrPlug: 'Measuring plug',
    lrC1: 'The plug sends values', lrC1ok: 'every {s} s · now {w}', lrC1wait: 'Now {w} · measuring the interval', lrC1T: 'Pick the plug that measures power',
    lrC2: 'Only this device is on the plug', lrC2T: 'Anything else plugged in makes the measurement wrong', lrC2Ts: 'If a soundbar or TV box is on it too, move them to another plug', lrC3: 'The device is on this plug', lrC3T: 'Try turns the device on and off once and checks that the plug changes', lrTest: 'Try',
    lrWarn: 'Full measure: {n} steps, about {e}. Meanwhile the light flashes through the colors; best started at night or when nobody is home. It runs in the background.', lrStHow: 'Use the device as usual. The dashboard listens to the plug and the device\'s state together and keeps an average per state. A state turns green with 2 minutes of data.',
    lrStartL: 'Start measuring', lrNeedPlug: 'To start, pick the plug that measures power.', lrNeedOnly: 'To start, tick "Only this device is on the plug".', lrNeedTest: 'To start, press Try; the plug has to change.', lrStartS: 'Start learning', lrWhite: 'White tones', lrColor: 'Colors · saturation {s}%', lrBri: 'Brightness',
    enWLrn: 'Learning stopped halfway ({i}/{n} steps); you can go on from there', lrCont: 'Go on from where it stopped', lrAgainZero: 'Start over', lrContT: '{i} of {n} steps are measured. Going on keeps them.',
    lrErrRun_external: 'The light was changed from elsewhere; measuring stopped. You can start again.', lrErrRun_plug_silent: 'The plug has not sent a value for a while; measuring stopped.', lrErrRun_no_light: 'Light not found.', lrErrRun_x: 'Measuring stopped ({e}).', lrAgain: 'Measure again',
    lrNowSb: 'Light off, reading standby', lrNowProbe: 'Probe: {c} 100%', lrC_white: 'White', lrC_red: 'Red', lrC_green: 'Green', lrC_blue: 'Blue', lrNowCt: '{k} K, {b}%', lrNowHs: '{h}° color, saturation {s}%, {b}%', lrNowBr: 'Brightness {b}%',
    lrPlan: 'Color difference {d}%; plan: {n} measurements.', lrPaused: 'Paused; the light is back as it was. Resuming continues where it stopped.', lrDone: 'Measured', lrLeft: 'Left', lrStandby: 'Standby', lrRepeats: 'Repeated steps', lrRecheck: 'Measured again', lrFloor: 'Below the plug',
    lrBgNote: 'Measuring continues if you close this window; the device row shows the progress. It stops if the light is changed from elsewhere.', lrCancel: 'Cancel', lrResume: 'Resume', lrPause: 'Pause', lrBg: 'Keep going in the background',
    lrV100w: '100% cool white', lrV50w: '50% warm white', lrV100r: '100% red', lrV100b: '100% blue', lrV100: '100%', lrPoints: 'Points',
    lrSame: 'Also apply to {n} lights of the same model', lrShare: 'Send the measurement to the shared pool', lrShareT: 'Optional. Saving opens a pre-filled submission page on GitHub. It is checked automatically; if the model is in the pool and yours agrees it joins by itself, a model\'s first measurement waits for approval.', lrShareSlow: 'The plug reports slowly ({s} s per step); the pool needs at most 30 s. The measurement is used on your own dashboard.', lrShareFloor: 'The plug could not read most of this light\'s low powers; the pool needs a more sensitive meter. The measurement is used on your own dashboard.', lrShareNo: 'Home Assistant does not report this light\'s brand and model, so it cannot be sent.',
    lrSent: 'Sent', lrSent1: 'Brand and model ({m})', lrSent2: 'The light\'s features: integration, color modes, temperature range, effect count, firmware', lrSent3: 'The table ({n} points) and standby', lrSent4: 'A measurement summary and the plug\'s model', lrSent5: 'Mains voltage ({v} V)',
    lrNotSent: 'Not sent', lrNot1: 'Home, room and device names', lrNot2: 'Location, IP and user details', lrNot3: 'Any other Home Assistant data', lrBack: 'The light is back as it was. You can move the plug to another device.', lrSaveShare: 'Save and send',
    lrNowState: 'Now: {s}', lrState: 'State', lrGot: 'Collected', lrAvg: 'Average', lrStHint: 'States not seen take the "Other states" value. States with at least a minute of data are saved.', lrFinish: 'Finish and save',
    lrPillDone: 'Measured · save', lrPillErr: 'Measuring stopped', lrPillSt: 'Learning · {t}', lrPillL: 'Measuring · {p}%',
    lrBoxDone: 'Measuring finished; review and save the result.', lrBoxSt: 'Learning: {t} of data so far. Use the device as usual.', lrBoxRun: 'Measuring: {p}%, about {e} left. It runs in the background.',
    lrBoxOwnL: 'Your own measurement is in use ({n} points).', lrBoxOwnS: '{n} learned states are in use.', lrBoxPool: 'A ready measurement is in use. You can measure it yourself.',
    lrBoxL: 'This light is an estimate. The shared pool is checked first; otherwise a plug that measures power measures it in every color and brightness.', lrBoxS: 'This device is an estimate. Plug it into a plug that measures power and use it as usual for a few hours; each state\'s average fills in by itself.',
    lrBoxTL: 'Measure with a plug', lrBoxTS: 'Learn with a plug', lrSee: 'See progress', lrRe: 'Learn again', lrGo: 'Learn', lrSaveFirst: 'Save the device first', lrOwnTag: 'measured', lrTblTag: 'table',
    lrStrip: 'LED strip', lrStripT: 'A strip\'s power changes with its length. With the length, it goes into the pool per meter and others scale it to theirs.', lrLenMine: 'This strip\'s length', lrLenQ: 'Your strip\'s length', lrSameStrip: 'If their lengths differ, enter each; the table is scaled to the length.', lrSameOwn: 'has its own measurement; ticking replaces it with this one', lrSameNew: 'not on the dashboard; ticking adds it',
    lrShareLen: 'Enter the length first for an LED strip.', lrSent6: 'Strip length ({m} m)', lrPoolValsM: 'Per meter: standby {s}, highest {b} · {n} points.', lrPoolLen: 'Measured on a {m} m strip.', lrLenUnknown: 'The measured length is unknown; measuring your strip yourself is more accurate.',
    lrPoolNoteStrip: 'Standby (the controller) stays the same; the rest scales with the length but never above the adapter\'s power. Your own measurement always comes first.',
    lrCapQ: 'Adapter power', lrCapMine: 'Adapter power (optional)', lrCapT: 'Printed on the adapter (e.g. 24 V × 1 A = 24 W). However long the strip, the total stays under it; extended strips get dimmed to that limit.', lrSent7: 'adapter {w} W',
    lrSubA: 'Long average', lrErr_plug_busy: 'This plug is learning another device right now', lrErr_bridge_busy: 'A light on the same bridge is being measured; start when it finishes', lrPlugBusy: 'learning {n} now',
    lrAvgHow: 'The dashboard notes the start and works out the average from Home Assistant\'s records of the plug. It runs in the background, through restarts too. At least a day, ideally a week.',
    lrWarnFx: 'Full measure: {n} steps, about {e}; {f} of them are the light\'s own effects (each listened to for half a minute; you can skip them). Meanwhile the light flashes through the colors; best started at night or when nobody is home. It runs in the background.',
    lrNowFx: 'Effect: {e}, 100% · averaging', lrNowFxb: 'Effect: {e}, {b}% · brightness curve', lrSkipFx: 'Skip effects', lrSkipFxT: 'Measured effects are kept; the rest use the average', lrFxT: 'Effects · {i} / {n}', lrFxAvg: 'Effects on average ({n})', lrFx50: 'Effects at 50% brightness',
    lrAvgSince: 'average over {t}', lrQ_early: 'Too early', lrQ_earlyT: 'Less than a day; day and night and compressor cycles have not evened out yet.', lrQ_mid: 'Roughly right', lrQ_midT: 'Past a day. A few more days make it settle; a week is best.', lrQ_ok: 'Settled', lrQ_okT: 'The last 24 hours are within 3% of the overall average. You can finish now.',
    lrAvgKwh: 'So far', lrAvgDay: 'Per day', lrAvgYear: 'Per year', lrAvg24: 'Last 24 hours', lrAvgNow: 'Now', lrAvgNote: 'When finished, the device becomes "Fixed" with the measured average watts.',
    lrPillAvg: 'Learning · {t} · ~{w}', lrBoxA: 'This device uses a label value or a guess. Plug it into a plug that measures power for a few days; its real average is saved.', lrBoxAvgRun: 'Learning: {t}, average so far ~{w}.', lrBoxOwnA: 'The measured average is in use ({w}).', lrSaveGo: 'Save and learn', lrNameFirst: 'Enter a name first'
  }
};
// Bölüm türleri sadece başlangıç (başlık ve simge); her bölüme her şey eklenebilir. domains: seçicideki süzgeç
const LHD_TYPES = {
  free: { icon: 'mdi:view-grid-plus-outline', domains: null, col: 0 },
  lights: { icon: 'mdi:lightbulb-group-outline', domains: ['light', 'switch', 'cover', 'fan', 'input_boolean'], col: 0 },
  scenes: { icon: 'mdi:gesture-tap-button', domains: ['script', 'scene', 'automation'], col: 1 },
  climate: { icon: 'mdi:thermostat', domains: ['climate'], col: 2 },
  vacuum: { icon: 'mdi:robot-vacuum', domains: ['vacuum'], col: 2 },
  media: { icon: 'mdi:television', domains: ['media_player'], col: 2 },
  camera: { icon: 'mdi:cctv', domains: ['camera'], col: 0 },
  energy: { icon: 'mdi:lightning-bolt', domains: ['sensor'], col: 0 }
};
// Renk zemini için hazır koyu tonlar (açık renkler de seçilebilir ama yazılar beyaz)
const LHD_TINT_COLORS = ['#FFC24A', '#E6ECF5', '#5B8DEF', '#4FD1C5', '#7BD83A', '#FF7AB0', '#B07CFF', '#FF8A4A'];
const LHD_BG_COLORS = ['#0b0e15', '#0e1726', '#101418', '#0f1a14', '#1a1024', '#1d0f12', '#1a160e', '#0d1b1e'];
const LHD_ALL_DOMAINS = ['light', 'switch', 'cover', 'fan', 'input_boolean', 'lock', 'script', 'scene', 'automation', 'button', 'input_button', 'climate', 'vacuum', 'media_player', 'camera'].concat(LHD_VALUE_DOMAINS);
// Kart seçicideki listeler. Halo: [tür, ad tr, ad en, açıklama tr, açıklama en, simge]; HA: [tür, ad tr, ad en, simge]
const LHD_HALO_CARDS = [
  ['sensor', 'Sensör', 'Sensor', 'Değere göre renk alan haleli değer', 'A value with a halo coloured by the value', 'mdi:thermometer'],
  ['climate', 'İklim', 'Climate', 'Klima ve petek', 'Air conditioner and radiator', 'mdi:thermostat'],
  ['air', 'Hava temizleyici', 'Air purifier', 'Fan ve hava kalitesi', 'Fan and air quality', 'mdi:air-purifier'],
  ['vacuum', 'Süpürge', 'Vacuum', 'Robot süpürge', 'Robot vacuum', 'mdi:robot-vacuum'],
  ['energy', 'Enerji', 'Energy', 'Güç ve tüketim', 'Power and consumption', 'mdi:lightning-bolt'],
  ['security', 'Güvenlik', 'Security', 'Alarm, kapı, pencere', 'Alarm, doors, windows', 'mdi:shield-home'],
  ['room', 'Oda', 'Room', 'Odanın özeti', 'Room summary', 'mdi:sofa-outline'],
  ['light', 'Işık', 'Light', 'Işık ve parlaklık', 'Light and brightness', 'mdi:lightbulb']
];
const LHD_HA_CARDS = [
  ['tile', 'Karo', 'Tile', 'mdi:square-rounded-outline'], ['entities', 'Varlıklar', 'Entities', 'mdi:format-list-bulleted'], ['button', 'Düğme', 'Button', 'mdi:gesture-tap-button'],
  ['glance', 'Bakış', 'Glance', 'mdi:view-module-outline'], ['markdown', 'Yazı (Markdown)', 'Markdown', 'mdi:language-markdown-outline'], ['history-graph', 'Geçmiş grafiği', 'History graph', 'mdi:chart-line'],
  ['statistics-graph', 'İstatistik grafiği', 'Statistics graph', 'mdi:chart-bar'], ['gauge', 'Gösterge', 'Gauge', 'mdi:gauge'], ['sensor', 'Sensör', 'Sensor', 'mdi:eye-outline'],
  ['thermostat', 'Termostat', 'Thermostat', 'mdi:thermostat'], ['weather-forecast', 'Hava durumu', 'Weather forecast', 'mdi:weather-partly-cloudy'], ['media-control', 'Medya', 'Media control', 'mdi:play-box-outline'],
  ['light', 'Işık', 'Light', 'mdi:lightbulb-outline'], ['picture-entity', 'Resimli varlık', 'Picture entity', 'mdi:image-outline'], ['map', 'Harita', 'Map', 'mdi:map-outline'],
  ['calendar', 'Takvim', 'Calendar', 'mdi:calendar'], ['todo-list', 'Yapılacaklar', 'To-do list', 'mdi:clipboard-list-outline'], ['alarm-panel', 'Alarm paneli', 'Alarm panel', 'mdi:shield-home-outline'],
  ['area', 'Alan', 'Area', 'mdi:texture-box'], ['logbook', 'Kayıt defteri', 'Logbook', 'mdi:format-list-text'], ['iframe', 'Web sayfası', 'Webpage', 'mdi:web']
];
const LHD_SC_DEF = ['#28BE64', '#FFCD28', '#FF8C1E', '#FF3737'];
const LHD_ZONE_DEF = { t: [20, 40, 60, 80], c: ['#78D7FF', '#008CFF', '#28BE64', '#FFCD28', '#FF3737'] };
const LHD_KIND_KEY = { tile: 't_lights', scene: 't_scenes', climate: 't_climate', vacuum: 't_vacuum', media: 't_media', camera: 't_camera', value: 't_values', card: 't_cards', pet: 't_pets', sub: 't_subs', energy: 't_energy' };
// Önizleme ekranları: pano gerçekte ekranın oranına göre ölçeklenir (scale.js); önizleme seçilen ekranı aynı hesapla taklit eder.
// Ortak havuza gönderim (v0.32 yeniden açık): priz modeli değil ölçümün kendisi denetlenir (library/tools/common.py ile aynı sınırlar).
// Prizi yavaş olan ya da düşük güçleri okuyamayan ölçümde gönder seçeneği kapalı, nedeni yazılı.
const LHD_POOL_OPEN = true;
const LHD_POOL_SETTLE = 30, LHD_POOL_FLOOR = 0.75;
function lhdPoolWhy(r) {
  if (!r) return '';
  if (r.settle > LHD_POOL_SETTLE) return 'lrShareSlow';
  let n = 0;
  const L = r.lut || {};
  if (L.ct) L.ct.w.forEach((row) => { n += row.length; });
  if (L.hs) L.hs.w.forEach((sat) => sat.forEach((row) => { n += row.length; }));
  if (L.br) n += L.br.w.length;
  if (n && (r.floor || 0) / n > LHD_POOL_FLOOR) return 'lrShareFloor';
  return '';
}
function lhdPoolShare() { if (LHD_POOL_OPEN) return true; try { return localStorage.getItem('lhd-pool-share') === '1'; } catch (e) { return false; } }
const LHD_SCREENS = [['tab16', 1600, 1000], ['tab43', 1024, 768], ['wide', 1920, 1080], ['tabp', 800, 1280], ['phone', 390, 844], ['custom', 0, 0], ['here', 0, 0]];
// Özel ekran (v0.29.1): kullanıcının girdiği çözünürlük (localStorage lhd-preview-custom = 'GxY'). Tablette yalnız oran önemli,
// telefon kuralı lpPhoneScreen ile aynı (dar, alçak ya da dikey ve 1100'den dar)
function lhdCustomScr() { let v = ''; try { v = localStorage.getItem('lhd-preview-custom') || ''; } catch (e) {} const m = /^(\d{3,5})x(\d{3,5})$/.exec(v); return m ? [+m[1], +m[2]] : [1280, 800]; }
function lhdScrIsPh(w, h) { return w < 700 || (h < 500 && w < 1100) || (h > w && w < 1100); }
const LHD_MAXCOLS = 6;
const LHD_COLORS = ['#5B8DEF', '#8E7CFF', '#4FD1C5', '#FF6FAE', '#6BC46B', '#E5484D', '#F2B33D', '#FFB86B'];
const lhdClone = (x) => JSON.parse(JSON.stringify(x));
// Simge seçici: önce bağlama göre önerilenler, aramada HA'nın kendi MDI listesi (/static/mdi/iconList.json, ad + İngilizce anahtar kelimeler).
// Türkçe aramalar için küçük bir sözlük; liste açılamazsa (eski HA) sadece önerilenler ve elle yazılan ad.
const LHD_ICON_SUGGEST = {
  room: ['home-outline', 'sofa-outline', 'sofa', 'bed-outline', 'bed-king-outline', 'bed-double-outline', 'silverware-fork-knife', 'stove', 'fridge-outline', 'shower', 'bathtub-outline', 'toilet',
    'desk', 'desktop-tower-monitor', 'laptop', 'teddy-bear', 'baby-carriage', 'door', 'door-open', 'stairs', 'stairs-up', 'garage', 'flower-outline', 'tree-outline', 'balcony', 'washing-machine',
    'television', 'gamepad-variant-outline', 'dumbbell', 'book-open-variant', 'coffee-outline', 'wardrobe-outline', 'home-floor-1', 'home-floor-2', 'home-roof', 'office-building-outline', 'dots-horizontal-circle-outline'],
  light: ['lightbulb', 'lightbulb-outline', 'lightbulb-group', 'ceiling-light', 'ceiling-light-outline', 'ceiling-light-multiple', 'chandelier', 'floor-lamp', 'floor-lamp-outline', 'floor-lamp-torchiere',
    'desk-lamp', 'lamp', 'lamp-outline', 'wall-sconce', 'wall-sconce-round', 'wall-sconce-round-outline', 'wall-sconce-flat-outline', 'track-light', 'spotlight', 'spotlight-beam', 'led-strip', 'led-strip-variant',
    'string-lights', 'lava-lamp', 'outdoor-lamp', 'coach-lamp', 'light-recessed', 'television', 'television-ambient-light', 'monitor', 'bed-outline', 'sofa-outline', 'curtains-closed', 'blinds', 'door',
    'stairs', 'toilet', 'mirror', 'cupboard-outline', 'countertop-outline', 'power-socket-eu', 'fan', 'palette-outline'],
  scene: ['play-circle-outline', 'white-balance-sunny', 'weather-night', 'lightbulb-night', 'lightbulb-group', 'movie-open', 'music-note', 'party-popper', 'creation', 'book-open-variant', 'sofa',
    'bed-outline', 'coffee-outline', 'silverware-fork-knife', 'home-export-outline', 'home-import-outline', 'power', 'shield-home-outline', 'robot-vacuum', 'fire', 'snowflake', 'palette-outline',
    'candle', 'heart-outline', 'star-outline', 'run', 'airplane', 'sleep', 'alarm', 'gesture-tap']
};
const LHD_ICON_TR = { salon: 'sofa living couch', oturma: 'sofa couch', kanepe: 'sofa couch', koltuk: 'sofa seat chair', sandalye: 'chair', yatak: 'bed',  mutfak: 'kitchen silverware stove fridge', banyo: 'shower bath', tuvalet: 'toilet', wc: 'toilet',
  çocuk: 'teddy baby', cocuk: 'teddy baby', ofis: 'desk office monitor', çalışma: 'desk', calisma: 'desk', kapı: 'door', kapi: 'door', giriş: 'door', giris: 'door', merdiven: 'stairs', balkon: 'balcony',
  bahçe: 'flower tree garden', bahce: 'flower tree garden', garaj: 'garage car', ev: 'home house', kat: 'floor', ışık: 'lightbulb light lamp', isik: 'lightbulb light lamp', lamba: 'lamp lightbulb',
  ampul: 'lightbulb', tavan: 'ceiling', avize: 'chandelier', abajur: 'lamp', aplik: 'sconce', şerit: 'strip', serit: 'strip', spot: 'spot track', lambader: 'floor-lamp', masa: 'desk table',
  perde: 'curtains blinds', panjur: 'blinds shutter', pencere: 'window', cam: 'window', tv: 'television', televizyon: 'television', ekran: 'monitor', klima: 'air-conditioner', petek: 'radiator',
  ısıtma: 'heat radiator fire', soğutma: 'snowflake', süpürge: 'vacuum', supurge: 'vacuum', müzik: 'music', muzik: 'music', film: 'movie', sinema: 'movie', gece: 'night moon', gündüz: 'sun', gunduz: 'sun',
  güneş: 'sun', gunes: 'sun', parti: 'party', kitap: 'book', okuma: 'book', uyku: 'sleep', kahve: 'coffee', yemek: 'silverware food', kapat: 'power', güç: 'power', guc: 'power', priz: 'socket',
  fan: 'fan', vantilatör: 'fan', dolap: 'wardrobe cupboard', ayna: 'mirror', efekt: 'creation magic', renk: 'palette', yangın: 'fire', ateş: 'fire', kar: 'snowflake', kalp: 'heart', yıldız: 'star',
  havuz: 'pool', sulama: 'sprinkler irrigation garden-tap rain', çim: 'lawn', cim: 'lawn', akvaryum: 'aquarium fish', balık: 'fish aquarium', balik: 'fish aquarium',
  bebek: 'baby', kedi: 'cat', köpek: 'dog', kopek: 'dog', hamster: 'hamster', tavuk: 'chicken', kümes: 'chicken', sigorta: 'fuse circuit-breaker residual', kaçak: 'residual',
  elektrik: 'power grid fuse energy', enerji: 'energy power-station', şarj: 'charger battery power-station', sarj: 'charger battery power-station', pil: 'battery', akü: 'battery power-station',
  araba: 'car garage', araç: 'car', motor: 'motorbike', bisiklet: 'bike', modem: 'modem', wifi: 'wifi mesh access-point', internet: 'modem mesh wifi cloud', kamera: 'camera peephole nvr',
  güvenlik: 'panic lock camera beam fire-extinguisher', guvenlik: 'panic lock camera beam fire-extinguisher', kilit: 'lock keyfob', kumanda: 'remote keyfob',
  çay: 'tea samovar', cay: 'tea samovar', semaver: 'samovar', su: 'water tap well', pompa: 'pump', tank: 'tank', sauna: 'steam sauna', duş: 'shower', dus: 'shower', buhar: 'steam',
  ütü: 'garment-steamer', utu: 'garment-steamer', çamaşır: 'laundry clothes', camasir: 'laundry clothes', kurutma: 'clothes-airer dehydrator', oyun: 'gaming foosball pinball pool-table dartboard table-tennis playroom',
  piyano: 'piano', gitar: 'guitar', davul: 'drum', ramazan: 'ramadan', yılbaşı: 'new-year', yilbasi: 'new-year', doğum: 'birthday', dogum: 'birthday', romantik: 'romantic', rahat: 'relax',
  meditasyon: 'meditation', spor: 'workout steps', fırtına: 'storm lightning', firtina: 'storm lightning', şimşek: 'lightning', tatil: 'vacation', odak: 'focus', sağlık: 'heart blood-pressure thermometer-body first-aid medicine',
  saglik: 'heart blood-pressure thermometer-body first-aid medicine', ilaç: 'medicine', ilac: 'medicine', nabız: 'heart-rate', nabiz: 'heart-rate', tansiyon: 'blood-pressure', şömine: 'fireplace', somine: 'fireplace',
  mangal: 'fire-pit pizza-oven', pirinç: 'rice', meyve: 'juicer', blender: 'blender', bulaşık: 'dishwasher', bulasik: 'dishwasher', çöp: 'trash recycling', cop: 'trash recycling', hamak: 'hammock',
  şemsiye: 'umbrella', semsiye: 'umbrella', salıncak: 'swing', salincak: 'swing', şarap: 'wine', sarap: 'wine', atölye: 'workshop', atolye: 'workshop', veranda: 'porch sunroom', teras: 'terrace',
  çatı: 'roof', cati: 'roof', uydu: 'satellite', anten: 'antenna', radyo: 'radio', hoparlör: 'audio speaker', hoparlor: 'audio speaker', ses: 'audio voice', güncelleme: 'update', guncelleme: 'update',
  bağlantı: 'offline wifi mesh', baglanti: 'offline wifi mesh', raf: 'shelf bookshelf', niş: 'niche', nis: 'niche', süpürgelik: 'skirting', supurgelik: 'skirting', tezgah: 'counter vanity toe-kick',
  saç: 'hair', sac: 'hair', tıraş: 'shaver', tiras: 'shaver', vitrin: 'display-cabinet', alarm: 'alarm panic' };
const LHD_ICONS = { list: null, loading: null };
function lhdIconList() {
  if (LHD_ICONS.list) return Promise.resolve(LHD_ICONS.list);
  if (!LHD_ICONS.loading) LHD_ICONS.loading = fetch('/static/mdi/iconList.json').then((r) => (r.ok ? r.json() : [])).catch(() => [])
    .then((l) => { LHD_ICONS.list = (l || []).map((x) => ({ n: x.name, k: (x.keywords || []).join(' ').toLowerCase() })); return LHD_ICONS.list; });
  return LHD_ICONS.loading;
}
// Kolon içi sütun en az bu kadar geniş olabilir (kanvas pikseli): kutunun 40 px iç boşluğu + bir karo
const LHD_MINSUB = 150;
const lhdColPx = (T, i, cw) => { const w = lpWeights(T), sum = w.reduce((a, b) => a + b, 0); return (cw - 8 - 20 * w.length) * w[i] / sum; };
const lhdMaxSplit = (T, i, cw) => Math.max(1, Math.min(3, Math.floor(lhdColPx(T, i, cw) / LHD_MINSUB + 0.02)));
// sütun sayısı seçilebilir mi: diğer kolonlar en dar hallerine inse bile bu kolon k sütuna yetecek kadar genişleyebiliyor mu
const lhdCanSplit = (T, i, k, cw) => { const n = lpWeights(T).length, sp = lpSplits(T, n); let need = LHD_MINSUB * k; for (let j = 0; j < n; j++) if (j !== i) need += LHD_MINSUB * sp[j]; return need <= cw - 8 - 20 * n; };
// Kolon en az LHD_MINSUB × sütun sayısı geniş kalsın: dar kalanlar o genişliğe çekilir, fark geniş kolonlardan oranla alınır
function lhdFitCols(T, cw) {
  const w = lpWeights(T), n = w.length, sum = w.reduce((a, b) => a + b, 0), avail = cw - 8 - 20 * n, sp = lpSplits(T, n);
  const minF = sp.map((k) => Math.min(1 / n, LHD_MINSUB * k / avail));
  let fr = w.map((x) => x / sum);
  for (let it = 0; it < n; it++) {
    const fixed = fr.map((f, i) => f < minF[i] - 1e-9);
    if (!fixed.some(Boolean)) break;
    const fs = fr.reduce((a, f, i) => a + (fixed[i] ? minF[i] : 0), 0), rs = fr.reduce((a, f, i) => a + (fixed[i] ? 0 : f), 0);
    fr = fr.map((f, i) => (fixed[i] ? minF[i] : f * (1 - fs) / rs));
  }
  T.columns = fr.map((f) => Math.round(f * sum * 100) / 100);
}
// kolonlar değişince sığmayan sütunları azalt; o sütundaki bölümler kalan son sütuna geçer
function lhdFitSplits(T, cw) {
  if (!T.splits) return;
  const n = lpWeights(T).length, sp = lpSplits(T, n);
  for (let i = 0; i < n; i++) {
    const mx = lhdMaxSplit(T, i, cw);
    if (sp[i] > mx) { sp[i] = mx; (T.sections || []).forEach((s) => { if ((s.col || 0) === i && (s.sub || 0) > mx - 1) { if (mx > 1) s.sub = mx - 1; else delete s.sub; } }); }
  }
  T.splits = sp;
}
let lhdSeq = 0;
const lhdId = (p) => p + Date.now().toString(36) + (lhdSeq++).toString(36);
// yedek kontrol ve duvar anahtarı için izinli alanlar (custom_components/.../twins.py ile aynı)
const LHD_TWIN_DOMAINS = ['light', 'switch', 'fan', 'input_boolean'];
const LHD_WALL_DOMAINS = ['switch', 'input_boolean', 'binary_sensor', 'light'];
// lambanın adından "govee", "matter", parantez içi gibi ekleri at: iki kopyayı eşleştirmek için
const lhdTwinKey = (s) => String(s || '').toLocaleLowerCase('tr').replace(/\([^)]*\)/g, ' ').replace(/\b(govee|matter|mqtt|lan|zigbee|wifi|wi-fi|esp|light|lamba|ışık)\b/g, ' ').replace(/[^a-z0-9çğıöşü]+/g, ' ').trim();
const LHD_REPO = 'https://github.com/mendebur-lemur/lemur-home-dashboard';
const LHD_REPO_URL = /^https:\/\/github\.com\/mendebur-lemur\/lemur-home-dashboard(\/[^\s"'<>]*)?$/;
const lhdSlug = (x) => String(x || '').replace(/İ/g, 'i').toLowerCase().replace(/[çćč]/g, 'c').replace(/ğ/g, 'g').replace(/[ıîí]/g, 'i').replace(/[öô]/g, 'o').replace(/ş/g, 's').replace(/[üû]/g, 'u')
  .replace(/[âáà]/g, 'a').replace(/[éè]/g, 'e').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
const lhdMove = (arr, from, to) => { const x = arr.splice(from, 1)[0]; arr.splice(to, 0, x); };

class LemurHomeDashboardAdmin extends HTMLElement {
  constructor() {
    super();
    this._tab = null; this._sec = null; this._undo = []; this._modal = null; this._menu = null; this._q = ''; this._picked = [];
    this._ask = null;
  }
  set hass(h) {
    const first = !this._hass;
    if (h && STORE.data && STORE.data.tabs) { lpEnEnsure(h); h = lpEnVirt(h); }   // enerji değerleri Cihaz ekle'de seçilebilsin
    this._hass = h;
    if (first) {
      LEC.load(h);
      if (!this._lecUnsub) this._lecUnsub = LEC.onChange((k) => { if (k === 'playing') return; if (this._modal === 'pick') this._refreshPick(); else if (STORE.data && this.shadowRoot && !this._modal) this._render(); });
      STORE.load(h).then(() => {
        this._sub();
        this._render();
      }).catch(() => this._render());
      return;
    }
    if (this._pv) this._pv.hass = h;
  }
  // ayar değişince yeniden çiz; kendi kaydımızın ve sunucu yankısının aynısı gelirse çizme (odak ve tıklama kaybolmasın)
  _sub() {
    if (this._unsub) return;
    this._unsub = STORE.onChange((d) => {
      const j = JSON.stringify(d);
      if (j === this._lastJson) return;
      this._lastJson = j;
      if (!this._modal) this._render();
    });
  }
  _histSync() {
    const open = !!this._modal;
    if (open && !this._hp) { try { history.pushState(Object.assign({}, history.state, { lhdAdm: 1 }), ''); this._hp = true; } catch (e) {} }
    else if (!open && this._hp) { this._hp = false; try { history.back(); } catch (e) {} }
    this._hpNav = false;
  }
  // Esc: yalnız en üstteki katman kapanır (v0.32: yardım açıkken alttaki pencereyi kapatıp yazılanı siliyordu)
  _esc() {
    if (this._help) { this._help = null; return this._render(); }
    if (this._menu) { this._menu = null; return this._render(); }
    if (this._modal === 'icon' && this._ip && this._ip.kind === 'im' && this._im) { this._ip = null; this._modal = 'item'; return this._render(); }
    if (this._modal === 'cardedit' && this._ce && this._ce.im) { this._im = this._ce.im; this._ce = null; this._modal = 'item'; return this._render(); }
    if (this._modal === 'energy') {
      if (this._lrn) { this._lrn = null; return this._render(); }
      if (this._enAddM) { this._enAddM = null; return this._render(); }
      if (this._enE) return this._enEClose(false);
    }
    if (this._modal === 'news') return this._newsClose();
    if (this._modal === 'guide') return this._guideClose();
    this._modal = null; this._picked = []; this._q = ''; this._bk = null; this._im = null; this._ce = null; this._render();
  }
  // cihaz formu: yazılan bir şey varsa dışarı dokunma ya da Esc ilk seferde kapatmaz, uyarır (İptal ve × hemen kapatır)
  _enEClose(sure) {
    const D = this._enE; if (!D) return;
    const dirty = D.f0 !== undefined && JSON.stringify(D.f) !== D.f0;
    if (!sure && dirty && !D.warned) { D.warned = true; this._enErr = this._t('enEDirty'); return this._render(); }
    this._enE = null; this._enErr = ''; this._render();
  }
  set narrow(v) { this._narrow = v; const a = this.shadowRoot && this.shadowRoot.querySelector('.app'); if (a) a.classList.toggle('hanarrow', !!v); }   // HA'nın dar modu: Yıldız ver yalnız simge
  set panel(p) { this._panelCfg = p; }
  connectedCallback() {
    if (!this._key) {
      this._key = (e) => {
        const typing = e.composedPath && e.composedPath()[0] && /INPUT|SELECT|TEXTAREA/.test(e.composedPath()[0].tagName || '');
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && this._undo.length) { e.preventDefault(); this._undoIt(); }
        else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')) && !typing && this._redo && this._redo.length) { e.preventDefault(); this._redoIt(); }
        if (e.key === 'Escape' && (this._modal || this._menu || this._help)) { e.preventDefault(); this._esc(); }
      };
    }
    window.addEventListener('keydown', this._key);
    // v0.32: bir pencere açıkken tarayıcının Geri'si pencereyi kapatır (panelden çıkarıyordu); pano pencereleriyle aynı yol
    if (!this._pop) this._pop = () => { if (this._hp) { this._hp = false; this._hpNav = true; this._help = null; this._menu = null; this._lrn = null; this._enAddM = null; this._enE = null; this._modal = null; this._picked = []; this._q = ''; this._bk = null; this._im = null; this._ce = null; this._render(); } };
    window.addEventListener('popstate', this._pop);
    if (!this._nw) { this._nw = 1; lhdNewerUse(true, this._hass ? pickLang(this._hass) : null); }   // yeni sürüm uyarısı (src/store.js)
    if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => this._fit());
    if (!this._leciUnsub) this._leciUnsub = lpLecIconsSub(() => { if (this._hass && STORE.data) this._render(); });
    if (!this._mdicUnsub) this._mdicUnsub = lpMdicSub(() => { if (this._hass && STORE.data) { this._render(); if (this._modal === 'icon') this._refreshIcons(); } });
    if (this._hass && STORE.data) { this._sub(); this._render(); }
  }
  disconnectedCallback() {
    window.removeEventListener('keydown', this._key);
    if (this._pop) window.removeEventListener('popstate', this._pop);
    if (this._nw) { this._nw = 0; lhdNewerUse(false); }
    if (this._leciUnsub) { this._leciUnsub(); this._leciUnsub = null; }
    if (this._mdicUnsub) { this._mdicUnsub(); this._mdicUnsub = null; }
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._lecUnsub) { this._lecUnsub(); this._lecUnsub = null; }
    if (this._ro) this._ro.disconnect();
  }

  get _lang() { return pickLang(this._hass); }
  _t(k, v) {
    const d = ADM[this._lang] || ADM.en;
    let s = d[k] !== undefined ? d[k] : (ADM.en[k] !== undefined ? ADM.en[k] : k);
    if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  _settings() { return (STORE.data && STORE.data.settings) || {}; }
  // telefona özel düzenleme: önizleme Telefon'dayken (ya da 'Bu ekran' bir telefonken) sağdaki düzenleyici telefona yazar
  // telefon düzeninde çizilen önizleme ekranları: Telefon, Büyük dikey (dikey tablet panoda da telefon düzenine geçer) ve dar/dikey Bu ekran
  _scrPh(k) { if (k === 'custom') { const c = lhdCustomScr(); return lhdScrIsPh(c[0], c[1]); } return k === 'phone' || k === 'tabp' || (k === 'here' && lpPhoneScreen()); }
  _phEd() { return this._scrPh(this._screenKey()); }
  _phOv() { const p = this._settings().phone; return lhdIsObj(p) ? p : {}; }
  _phSec(id) { const S = this._phOv().secs; return lhdIsObj(S) && lhdIsObj(S[id]) ? S[id] : {}; }
  _phTabs() { const T = this._phOv().tabs; return lhdIsObj(T) ? T : {}; }
  _phStyle() { const T = this._phOv().style; return lhdIsObj(T) ? T : {}; }
  _phOrd(tab) { const O = this._phOv().order; return lhdIsObj(O) && Array.isArray(O[tab.id]) && O[tab.id].length ? O[tab.id] : null; }
  // fn(p) settings.phone'un kopyasını değiştirir; boş kalan kayıtlar silinir, geri al çalışır
  _phEdit(fn, soft) {
    this._snap();
    const s = lhdClone(this._settings());
    const p = lhdIsObj(s.phone) ? s.phone : {};
    if (!lhdIsObj(p.secs)) p.secs = {};
    if (!lhdIsObj(p.order)) p.order = {};
    if (!lhdIsObj(p.tabs)) p.tabs = {};
    if (!lhdIsObj(p.style)) p.style = {};
    ['order', 'hide', 'names', 'icons'].forEach((k) => { if (k === 'order' ? !Array.isArray(p.tabs.order) : !lhdIsObj(p.tabs[k])) p.tabs[k] = k === 'order' ? [] : {}; });
    fn(p);
    if (!p.tabs.order.length) delete p.tabs.order;
    ['hide', 'names', 'icons'].forEach((k) => { Object.keys(p.tabs[k]).forEach((x) => { if (!p.tabs[k][x]) delete p.tabs[k][x]; }); if (!Object.keys(p.tabs[k]).length) delete p.tabs[k]; });
    if (!Object.keys(p.tabs).length) delete p.tabs;
    Object.keys(p.style).forEach((k) => { if (p.style[k] === undefined || p.style[k] === null || p.style[k] === '') delete p.style[k]; });
    if (!Object.keys(p.style).length) delete p.style;
    Object.keys(p.secs).forEach((k) => { const o = p.secs[k]; if (!lhdIsObj(o)) { delete p.secs[k]; return; } ['hide_items', 'item_order'].forEach((q) => { if (Array.isArray(o[q]) && !o[q].length) delete o[q]; }); if (Array.isArray(o.folds)) { o.folds = o.folds.filter(lhdIsObj); o.folds.forEach((g) => { if (!g.name) delete g.name; if (!g.icon) delete g.icon; if (!Array.isArray(g.items)) g.items = []; }); if (!o.folds.length) delete o.folds; } if (!Object.keys(o).length) delete p.secs[k]; });
    Object.keys(p.order).forEach((k) => { if (!Array.isArray(p.order[k]) || !p.order[k].length) delete p.order[k]; });
    if (!Object.keys(p.secs).length) delete p.secs;
    if (!Object.keys(p.order).length) delete p.order;
    if (Object.keys(p).length) s.phone = p; else delete s.phone;   // telefona özel bir şey kalmadıysa boş kayıt da kalmasın
    this._commit('settings', s);
    if (soft) this._undoBtn(); else this._render();   // yazı kutusundan çıkınca yeniden çizme: hemen tıklanan düğme kaybolmasın
    this._toast(this._t('saved'));
  }
  _cw() { return (this._settings().canvas || {}).width || 1280; }
  _isAuto() { const d = STORE.data; return !(d && d.tabs && d.tabs.length); }
  _work() { const d = STORE.data; return lhdClone(d && d.tabs && d.tabs.length ? d.tabs : buildDefaultTabs(this._hass, this._lang)).map(lhdNormTab); }
  _area(id) { const a = this._hass.areas && this._hass.areas[id]; return a ? a.name : ''; }
  _ename(id) { const s = this._hass.states[id]; return (s && s.attributes.friendly_name) || id; }

  // ---- kayıt: önce ekranda, sonra entegrasyona; her değişiklik geri alınabilir ----
  _commit(key, value) {
    STORE.data = Object.assign({}, STORE.data); STORE.data[key] = value;
    const d = STORE.data;
    this._lastJson = JSON.stringify(d);   // kendi değişikliğimiz: abonelikten gelince yeniden çizme
    STORE.subs.forEach((f) => { try { f(d); } catch (e) {} });
    if (key === 'settings' && this._modal === 'energy' && this._hass) {   // sayaç, güneş/batarya ya da tarife değiştiyse veriyi hemen yenile
      const k2 = JSON.stringify([lpEnMeter(), lpEnSolar(), lpEnCfg().price_mode || '']);
      if (this._enKey !== k2) { const first = this._enKey === undefined; this._enKey = k2; if (!first) { LP_EN.at = 0; LP_EN.yr = null; LP_EN.tou = null; setTimeout(() => lpEnEnsure(this._hass), 50); } }
    }
    return STORE.set(key, value).catch((e) => {
      // başka bir ekran (ikinci yönetim paneli, aktarma, tabletteki yaz / kış) bu veriyi arada değiştirdi: üstüne yazılmaz, güncel hâli gelir
      if (e && e.code === 'conflict') { this._undo = []; this._redo = []; this._lastJson = ''; return this._toast(this._t('errConflict'), false); }
      this._toast(this._t('err', { e: (e && e.message) || e }), false);
    });
  }
  _snap() {
    this._undo.push({ tabs: lhdClone((STORE.data && STORE.data.tabs) || []), settings: lhdClone(this._settings()) });
    if (this._undo.length > 40) this._undo.shift();
    this._redo = [];   // yeni bir değişiklik: ileri alınacak bir şey kalmaz
  }
  // telefon önizlemesinde katlanır gruplar: kapalıyken öğeler yerinde (sıralamak ve gizlemek için), açıkken telefondaki gibi
  _pvFoldsOn() { try { return localStorage.getItem('lhd-pv-folds') === '1'; } catch (e) { return false; } }
  _hasFolds() { const S0 = this._phOv().secs; return lhdIsObj(S0) && Object.keys(S0).some((k) => lhdIsObj(S0[k]) && Array.isArray(S0[k].folds) && S0[k].folds.length > 0); }
  _undoIt() {
    const u = this._undo.pop(); if (!u) return;
    (this._redo || (this._redo = [])).push({ tabs: lhdClone((STORE.data && STORE.data.tabs) || []), settings: lhdClone(this._settings()) });
    this._histApply(u);
    this._toast(this._t('undone'), false);
  }
  // İleri al: geri alınan son değişiklik yeniden yapılır (v0.34)
  _redoIt() {
    const u = (this._redo || []).pop(); if (!u) return;
    this._undo.push({ tabs: lhdClone((STORE.data && STORE.data.tabs) || []), settings: lhdClone(this._settings()) });
    this._histApply(u);
    this._toast(this._t('redone'), false);
  }
  _histApply(u) {
    // sadece değişen anahtar gönderilir (ikisi birden gönderilince ara yankı geri alınanı bir an geri getiriyordu)
    if (JSON.stringify(u.settings) !== JSON.stringify(this._settings())) this._commit('settings', u.settings);
    if (JSON.stringify(u.tabs) !== JSON.stringify((STORE.data && STORE.data.tabs) || [])) this._commit('tabs', u.tabs);
    this._render();
  }
  // soft: yazı alanından gelen değişiklik; panel yeniden çizilmez (odak ve hemen ardından gelen tıklama kaybolmasın), önizleme kendisi güncellenir
  _edit(fn, msg, soft) {
    this._snap();
    const tabs = this._work();
    fn(tabs);
    this._commit('tabs', tabs);
    if (!soft) this._render(); else this._undoBtn();
    this._toast(msg || this._t('saved'));
  }
  // zemin: seçim (bg) ve HA'nın çizdiği CSS metni (background) birlikte kaydedilir
  _bgSet(b, soft) {
    this._snap();
    const s = lhdClone(this._settings());
    if (b) s.bg = b; else delete s.bg;
    const css = lpBgCss(b);
    if (css) s.background = css; else delete s.background;
    this._commit('settings', s);
    if (!soft) this._render(); else { this._undoBtn(); const box = this.shadowRoot && this.shadowRoot.querySelector('.pvbox'); if (box) box.style.background = lpBgOf(s); }
    this._toast(this._t('saved'));
  }



  // ---- sorun bildir: sürüm ve cihaz bilgisiyle hazır bir GitHub kaydı; kişisel bilgi yok ----
  async _reportOpen() {
    this._rep = { text: '', iv: null, copied: false }; this._modal = 'report'; this._render();
    try { this._rep.iv = (await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version; } catch (e) {}
    if (this._modal === 'report') this._repInfoPaint();
  }
  _repInfo() {
    const t = (k) => this._t(k), H = this._hass || {}, R = this._rep || {}, s = this._settings();
    const ua = navigator.userAgent || '', app = /Home ?Assistant\//i.test(ua);
    const m = (re) => { const x = re.exec(ua); return x ? x[1] : null; };
    const br = (m(/Edg\/(\d+)/) && 'Edge ' + m(/Edg\/(\d+)/)) || (m(/Firefox\/(\d+)/) && 'Firefox ' + m(/Firefox\/(\d+)/)) || (m(/Chrome\/(\d+)/) && 'Chrome ' + m(/Chrome\/(\d+)/)) || (m(/Version\/([\d.]+).*Safari/) && 'Safari ' + m(/Version\/([\d.]+)/)) || '?';
    const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iOS ' + ((m(/OS (\d+)_/)) || '') : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '?';
    const tabs = this._work(); let secs = 0, items = 0; const kinds = {};
    tabs.forEach((x) => (x.sections || []).forEach((sc) => { secs++; (sc.entities || []).forEach((it) => { items++; const k = lhdKind(it); kinds[k] = (kinds[k] || 0) + 1; }); }));
    const err = (window.__LEMUR_HD_ERR || []).slice(-5);
    const cv = s.canvas || {};
    return [
      [t('rPanel'), 'v' + PANEL_VERSION + (R.iv && R.iv !== PANEL_VERSION ? ' · ' + t('rInt') + ' v' + R.iv : '')],
      [t('rHa'), (H.config && H.config.version) || '?'],
      [t('rBrowser'), (app ? t('rApp') + ' · ' : '') + br + ' · ' + os],
      [t('rScreen'), window.innerWidth + '×' + window.innerHeight + ' · ' + ((navigator.maxTouchPoints || 0) > 0 ? t('rTouch') : t('rNoTouch')) + ' · ' + t('rCanvas') + ' ' + (cv.width || 1280) + '×' + (cv.ref_height || 1075)],
      [t('rLang'), ((H.locale && H.locale.language) || H.language || '?') + ' → ' + this._lang],
      [t('rLayout'), (this._isAuto() ? t('rAuto') + ' · ' : '') + tabs.length + ' ' + t('rTabs') + ', ' + secs + ' ' + t('rSecs') + ', ' + items + ' ' + t('rItems')],
      [t('rKinds'), Object.keys(kinds).sort().map((k) => k + ' ' + kinds[k]).join(', ') || '–'],
      [t('rLook'), lpIconMode() + (s.bg && s.bg.mode ? ' · ' + s.bg.mode : '') + (s.kiosk && (s.kiosk.hide_header || s.kiosk.hide_sidebar) ? ' · kiosk' : '')],
      [t('rLec'), LEC.installed(H) ? (LEC.version ? 'v' + LEC.version : '✓') : '–'],
      [t('rErr'), err.length ? err.join(' | ') : t('rNoErr')],
    ];
  }
  _repBody() {
    const t = (k) => this._t(k), R = this._rep || {};
    return '**' + t('rWhat') + '**\n\n' + ((R.text || '').trim() || '…') + '\n\n**' + t('rInfoH') + '**\n\n' + this._repInfo().map((x) => '- ' + x[0] + ': ' + x[1]).join('\n');
  }
  _repInfoPaint() { const el = this.shadowRoot && this.shadowRoot.getElementById('repinfo'); if (el) el.innerHTML = this._repInfo().map((x) => '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>').join(''); }
  _reportHtml() {
    const t = (k, v) => esc(this._t(k, v)), R = this._rep || {};
    return '<div class="ov" data-ovl><div class="dlg sm rep"><div class="dh"><div class="di">' + lpIcon('mdi:chat-question') + '</div><h2>' + t('repT') + '</h2><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="db"><label class="rl" for="repq">' + t('repQ') + '</label><textarea id="repq" class="inp" rows="5" data-repq placeholder="' + t('repPh') + '">' + esc(R.text || '') + '</textarea>' +
      '<div class="rl">' + t('repInfo') + '<span>' + t('repInfoS') + '</span></div><div class="rinfo" id="repinfo">' + this._repInfo().map((x) => '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>').join('') + '</div>' +
      '<p class="rnote">' + t('repNoGh') + '</p></div>' +
      '<div class="df"><button class="btn" data-a="repcopy">' + (R.copied ? t('repCopied') : t('repCopy')) + '</button><span style="flex:1"></span><button class="btn pri" data-a="repgo">' + t('repGh') + '</button></div></div></div>';
  }
  _repGo() {
    const R = this._rep || {}, first = (R.text || '').trim().split('\n')[0].slice(0, 70);
    const title = '[v' + PANEL_VERSION + '] ' + (first || this._t('repT'));
    let body = this._repBody(); if (body.length > 6000) body = body.slice(0, 6000) + '\n…';
    window.open('https://github.com/mendebur-lemur/lemur-home-dashboard/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body), '_blank', 'noopener');
  }
  async _repCopy() {
    const txt = '[v' + PANEL_VERSION + '] ' + this._t('repT') + '\n\n' + this._repBody();
    let ok = false; try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) {}
    if (!ok) { const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); }
    if (ok && this._rep) { this._rep.copied = true; this._render(); }
  }

  // ---- yedekle / içe aktar: bütün pano düzeni (sekmeler, bölümler, ayarlar) tek JSON dosyasında ----
  _backupDown() {
    const d = STORE.data || {};
    const out = { format: 'lemur-home-dashboard-backup', version: PANEL_VERSION, date: new Date().toISOString(), data: { tabs: d.tabs || [], settings: d.settings || {}, profiles: d.profiles || {}, pets: d.pets || {}, estimates: d.estimates || {} } };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
    a.download = 'lemur-pano-yedek-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    this._toast(this._t('bkSaved'));
  }
  _backupRead(f) {
    const rd = new FileReader();
    rd.onload = () => {
      let b = null; try { b = JSON.parse(rd.result); } catch (e) {}
      if (!b || b.format !== 'lemur-home-dashboard-backup' || !b.data || !Array.isArray(b.data.tabs)) return this._toast(this._t('bkErr'), false);
      // yedek dosyası dışarıdan gelir: sekmeler ve hayvanlar temizlenir (src/safe.js), ayarlar nesne olmalı
      const D = b.data;
      b.data = { tabs: lhdCleanTabs(D.tabs), settings: lhdIsObj(D.settings) ? D.settings : {} };
      if (lhdIsObj(D.profiles)) b.data.profiles = D.profiles;
      if (lhdIsObj(D.pets)) b.data.pets = lhdCleanPets(D.pets);
      if (lhdIsObj(D.estimates)) b.data.estimates = D.estimates;
      this._bk = b; this._modal = 'restore'; this._render();
    };
    rd.readAsText(f);
  }
  _restoreHtml() {
    const t = (k, v) => esc(this._t(k, v)), b = this._bk || {}, D = b.data || {}; let d = ''; try { d = new Date(b.date).toLocaleString(this._lang === 'tr' ? 'tr-TR' : 'en-GB'); } catch (e) {}
    let secs = 0; (D.tabs || []).forEach((x) => { secs += (x.sections || []).length; });
    // hayvanların yemlik servisi ve bildirimi: "Besledim" / gecikme ile kendiliğinden çalışır, geri yüklemeden önce görünsün
    const run = [];
    Object.keys(D.pets || {}).forEach((id) => { const P = D.pets[id]; if (P.feeder) run.push(esc(P.name) + ': ' + esc(P.feeder.service) + (P.feeder.target ? ' → ' + esc(P.feeder.target) : '')); if (P.notify) run.push(esc(P.name) + ': ' + esc(P.notify)); });
    const svcs = run.length ? '<div class="rnote">' + t('bkSvc') + '<br>' + run.join('<br>') + '</div>' : '';
    return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di">' + lpIcon('mdi:package-up') + '</div><h2>' + t('bkQ') + '</h2></div>' +
      '<div class="db"><div>' + t('bkW', { d: d || '?', v: b.version || '?', n: (D.tabs || []).length, s: secs }) + '</div>' + (b.version && b.version !== PANEL_VERSION ? '<div class="rnote">' + t('bkVer', { v: b.version }) + '</div>' : '') + svcs + '</div>' +
      '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="bkyes">' + t('bkYes') + '</button></div></div></div>';
  }
  _backupApply() {
    const b = this._bk; if (!b) return; const D = b.data || {};
    this._snap();
    this._commit('tabs', lhdCleanTabs(D.tabs));
    this._commit('settings', lhdIsObj(D.settings) ? D.settings : {});
    if (lhdIsObj(D.profiles)) this._commit('profiles', D.profiles);
    if (lhdIsObj(D.pets)) this._commit('pets', lhdCleanPets(D.pets));
    if (lhdIsObj(D.estimates)) this._commit('estimates', D.estimates);   // entegrasyon doğrular (estimates.py)
    this._bk = null; this._modal = null; this._tab = null; this._render(); this._toast(this._t('bkOk'));
  }
  // ---- yenilikler: güncellemeden sonra bir kez, ve Ayarlar → Sürüm'den ----
  _newsAuto() {
    let seen = null; try { seen = localStorage.getItem('lemur-hd-news'); } catch (e) { return; }
    if (seen === PANEL_VERSION) return;
    const mark = () => { try { localStorage.setItem('lemur-hd-news', PANEL_VERSION); } catch (e) {} };
    const d = STORE.data || {}, used = (d.tabs && d.tabs.length) || (d.settings && Object.keys(d.settings).length);
    if (!seen && !used) return mark();                       // ilk kurulumda gösterilecek bir şey yok
    if (!LHD_CHANGES.length || LHD_CHANGES[0].v !== PANEL_VERSION) return mark();
    if (this._modal) return;                                   // başka bir pencere açık: bir dahaki sefere
    this._newsFrom = null; this._newsAll = false; this._modal = 'news';
  }
  _newsClose() { try { localStorage.setItem('lemur-hd-news', PANEL_VERSION); } catch (e) {} this._modal = this._newsFrom || null; this._newsFrom = null; this._render(); }
  _newsHtml() {
    const t = (k, v) => esc(this._t(k, v)), lines = (c) => c[this._lang] || c.en || [];
    const one = (c, cur) => '<div class="nv' + (cur ? ' cur' : '') + '"><div class="nvh">' + t('newsV', { v: c.v }) + '</div><ul>' + lines(c).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    const rest = LHD_CHANGES.slice(1);
    return '<div class="ov" data-ovl><div class="dlg sm news"><div class="dh"><div class="di">' + lpIcon('mdi:creation') + '</div><h2>' + t('newsT') + '</h2><button class="btn ic" data-newsclose><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="db">' + (LHD_CHANGES.length ? one(LHD_CHANGES[0], true) : '') +
      (rest.length ? (this._newsAll ? rest.map((c) => one(c, false)).join('') : '<button class="lnk" data-newsall>' + t('newsOld') + ' ›</button>') : '') +
      '<div class="nstar"><ha-icon icon="mdi:star"></ha-icon><span>' + t('starNews') + '</span><a class="btn" href="' + LHD_REPO + '" target="_blank" rel="noopener"><ha-icon class="s16" icon="mdi:star"></ha-icon>' + t('starGh') + '</a></div></div>' +
      '<div class="df"><a class="btn" href="https://github.com/mendebur-lemur/lemur-home-dashboard/releases" target="_blank" rel="noopener">' + t('newsAll') + '</a><span style="flex:1"></span><button class="btn pri" data-newsclose>' + t('newsOk') + '</button></div></div></div>';
  }
  // ---- Rehber: panonun yapabildiklerini sırayla anlatan görselli pencere (src/guide.json) ----
  // Görseller kurulum dosyasında değil: bu sürümün GitHub etiketinden (docs/guide/<dil>/<id>.webp) yüklenir, yalnız rehber açıkken.
  // İnternet yoksa görselin yerine kısa bir not çıkar, yazı yine okunur.
  // ---- Önerilen ürünler (src/picks.js) ----
  _pkOpen() { this._pk = this._pk || { cat: 'all', q: '', ready: false, proto: '', info: null, pop: null, toast: null }; this._pk.pop = null; this._pk.info = null; this._modal = 'picks'; this._menu = null; LHDPicks.load(() => { if (this._modal === 'picks') this._render(); else if (this.shadowRoot) this._render(); }); this._render(); }
  _pkL(o) { return o && typeof o === 'object' ? (o[this._lang === 'tr' ? 'tr' : 'en'] || o.en || o.tr || '') : (o || ''); }
  _pkList() {
    const P = this._pk, q = (P.q || '').trim().toLocaleLowerCase(this._lang === 'tr' ? 'tr' : 'en');
    return LHDPicks.get().items.filter((x) => x && x.id && (P.cat === 'all' || x.cat === P.cat) && (!P.ready || LHDPicks.en(x) === 'lut' || LHDPicks.en(x) === 'self') &&
      (!P.proto || (x.proto || []).indexOf(P.proto) >= 0) && (!q || (x.name + ' ' + this._pkL(x.what) + ' ' + this._pkL(x.kind)).toLocaleLowerCase(this._lang === 'tr' ? 'tr' : 'en').indexOf(q) >= 0));
  }
  _pkStores(x) {
    const pc = !lpTouchDev(), B = x.buy || {};
    return (pc ? ['amz', 'hb'] : ['hb', 'amz']).filter((k) => lhdHttps(B[k])).map((k) => '<a class="sb ' + k + (pc && k === 'amz' ? ' fill' : '') + '" href="' + esc(lhdHttps(B[k])) + '" target="_blank" rel="noopener noreferrer" data-pkbuy="' + esc(x.id + ':' + k) + '">' + esc(LHD_PICK_STORES.filter((s) => s[0] === k)[0][1]) + '</a>').join('');
  }
  _pkCards() {
    const t = (k, v) => esc(this._t(k, v)), L = this._pkList(), P = this._pk;
    if (!L.length) return '<div class="empty">' + t('pkEmpty') + '</div>';
    const pr = (p) => (p === 'Local' ? this._t('pkLocal') : p);
    return L.map((x) => {
      const img = x.img ? LHD_PICKS_IMG + encodeURIComponent(String(x.img)) + '.webp' : '';
      const why = this._pkL(x.why), pros = (x.pros && this._pkL(x.pros)) || [], cons = (x.cons && this._pkL(x.cons)) || [];
      const more = !!(why || (pros && pros.length) || (cons && cons.length)), en = LHDPicks.en(x);
      const list = (a) => (Array.isArray(a) ? a : []).map((y) => '<li>' + esc(y) + '</li>').join('');
      return '<div class="pkc"><div class="pkimg' + (img ? '' : ' noimg') + '">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(x.name) + '" loading="lazy" onerror="this.parentNode.classList.add(\'noimg\');this.remove()">' : '') + '<span class="pkic">' + lpIcon(x.icon || 'mdi:package-variant') + '</span>' +
        (more ? '<button class="pki" data-pkinfo="' + esc(x.id) + '" title="' + t('pkInfo') + '"><ha-icon class="s18" icon="' + (P.info === x.id ? 'mdi:close' : 'mdi:information-outline') + '"></ha-icon></button>' : '') +
        (more && P.info === x.id ? '<div class="pkinf">' + (why ? '<div><b>' + t('pkWhy') + '</b><p>' + esc(why) + '</p></div>' : '') + (pros && pros.length ? '<div><b>' + t('pkPros') + '</b><ul class="pro">' + list(pros) + '</ul></div>' : '') + (cons && cons.length ? '<div><b>' + t('pkCons') + '</b><ul class="con">' + list(cons) + '</ul></div>' : '') + '</div>' : '') + '</div>' +
        '<div class="pkb"><div class="pkk">' + esc(this._pkL(x.kind)) + '</div><b class="pkn">' + esc(x.name) + '</b><p>' + esc(this._pkL(x.what)) + '</p>' +
        '<div class="pkpr">' + (x.proto || []).map((p) => '<span>' + esc(pr(p)) + '</span>').join('') + '</div>' +
        '<div class="pke e-' + en + '"><i></i>' + t('pkE_' + en) + '</div><div class="pks">' + this._pkStores(x) + '</div></div></div>';
    }).join('');
  }
  _pkHtml() {
    const t = (k, v) => esc(this._t(k, v)), P = this._pk, all = LHDPicks.get().items;
    const cats = LHD_PICK_CATS.filter((c) => c[0] === 'all' || all.some((x) => x.cat === c[0]));
    const protos = []; all.forEach((x) => (x.proto || []).forEach((p) => { if (protos.indexOf(p) < 0) protos.push(p); }));
    let pop = '';
    if (P.pop) {
      const x = all.filter((y) => y.id === P.pop.id)[0], url = x ? lhdHttps((x.buy || {})[P.pop.k]) : '', nm = (LHD_PICK_STORES.filter((s) => s[0] === P.pop.k)[0] || ['', ''])[1];
      if (url) pop = '<div class="pkpop" style="left:' + P.pop.x + 'px;top:' + P.pop.bot + 'px"><div class="pph"><b>' + t('pkApp', { s: nm }) + '</b><button class="btn ic sm" data-pkx><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        (P.pop.phones && P.pop.phones.length ? '<div class="pkph"><span>' + t('pkWhich') + '</span>' + P.pop.phones.map((f, i) => '<button class="btn pri" data-pkphone="' + i + '"><ha-icon class="s16" icon="mdi:cellphone"></ha-icon>' + esc(f.name) + '</button>').join('') + '</div>' : '') +
        '<div class="pkqr">' + lhdQrSvg(url) + '<span>' + t('pkQr') + '</span></div><a class="pkhere" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" data-pkx>' + t('pkHere') + '</a></div>';
    }
    const T = P.toast;
    return '<div class="ov" data-ovl><div class="dlg picks"><div class="dh"><div class="di"><ha-icon icon="mdi:shopping-outline"></ha-icon></div><div class="pkt"><h2>' + t('picksB') + '</h2><small><b class="pkad">' + t('pkAd') + '</b>' + t('picksS') + '</small></div>' +
      '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="pkcats">' + cats.map((c) => { const n = c[0] === 'all' ? all.length : all.filter((x) => x.cat === c[0]).length; return '<button class="pkcat' + (P.cat === c[0] ? ' on' : '') + '" data-pkcat="' + c[0] + '"><ha-icon class="s18" icon="' + c[1] + '"></ha-icon><span>' + t('pkCat_' + c[0]) + '<sup>' + n + '</sup></span></button>'; }).join('') + '</div>' +
      '<div class="pktools"><input class="inp" data-pkq placeholder="' + t('pkSearch') + '" value="' + esc(P.q || '') + '">' +
      '<button class="btn' + (P.ready ? ' on' : '') + '" data-pkready title="' + t('pkReadyT') + '"><ha-icon class="s16" icon="mdi:lightning-bolt"></ha-icon><span class="l">' + t('pkReady') + '</span></button>' +
      '<select class="inp" data-pkproto><option value="">' + t('pkProto') + '</option>' + protos.map((p) => '<option value="' + esc(p) + '"' + (P.proto === p ? ' selected' : '') + '>' + esc(p === 'Local' ? this._t('pkLocal') : p) + '</option>').join('') + '</select></div>' +
      '<div class="db"><div class="pkgrid">' + this._pkCards() + '</div><div class="pknote"><ha-icon class="s16" icon="mdi:information-outline"></ha-icon><span>' + t('pkNote') + '</span></div></div>' + pop +
      (T ? '<div class="pktoast"><ha-icon class="s18" icon="' + (T.err ? 'mdi:alert-circle-outline' : 'mdi:check-circle-outline') + '"></ha-icon><span>' + esc(T.msg) + '</span>' + (T.url ? '<a href="' + esc(T.url) + '" target="_blank" rel="noopener noreferrer">' + t('pkHere') + '</a>' : '') + '</div>' : '') +
      '</div></div>';
  }
  _pkToast(msg, url, err) { this._pk.toast = { msg: msg, url: url, err: !!err }; this._render(); clearTimeout(this._pkTT); this._pkTT = setTimeout(() => { if (this._pk) { this._pk.toast = null; if (this._modal === 'picks') this._render(); } }, 5000); }
  // bilgisayarda Hepsiburada: telefona gönder; telefon yoksa ya da birden fazlaysa düğmenin yanında küçük kutu
  _pkBuy(id, k, btn) {
    const x = LHDPicks.get().items.filter((y) => y.id === id)[0]; if (!x) return;
    const url = lhdHttps((x.buy || {})[k]), nm = (LHD_PICK_STORES.filter((s) => s[0] === k)[0] || ['', ''])[1];
    const phones = lhdPhones(this._hass);
    let saved = ''; try { saved = localStorage.getItem('lhd-pick-phone') || ''; } catch (e) {}
    const ph = phones.length === 1 ? phones[0] : phones.filter((f) => f.svc === saved)[0];
    if (ph) {
      this._pk.pop = null;
      lhdPickSend(this._hass, ph, x, k, this._lang).then(() => this._pkToast(this._t('pkSent', { s: nm }), url), () => this._pkToast(this._t('pkSendErr'), url, true));
      return;
    }
    const dlg = this.shadowRoot.querySelector('.dlg.picks'), r = btn.getBoundingClientRect(), d = dlg.getBoundingClientRect();
    this._pk.pop = { id: id, k: k, x: Math.max(10, Math.min(d.width - 274, r.left - d.left + r.width / 2 - 132)), top: r.top - d.top, bot: r.bottom - d.top + 8, phones: phones.length > 1 ? phones : null };
    this._render();
  }
  _pkPlace() {   // kutu düğmenin altına sığmazsa üstüne
    const P = this._pk, el = P && P.pop && this.shadowRoot.querySelector('.pkpop'), dlg = this.shadowRoot.querySelector('.dlg.picks');
    if (!el || !dlg) return;
    const H = el.offsetHeight, D = dlg.clientHeight;
    if (P.pop.bot + H > D - 8 && P.pop.top - H - 8 > 8) { el.style.top = (P.pop.top - H - 8) + 'px'; el.classList.add('up'); }
  }
  _guideImg(id) { return 'https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/v' + PANEL_VERSION + '/docs/guide/' + (this._lang === 'tr' ? 'tr' : 'en') + '/' + id + '.webp'; }
  _guideClose() { this._modal = this._guideFrom || null; this._guideFrom = null; this._render(); }
  _guideHtml() {
    const t = (k, v) => esc(this._t(k, v)), G = LHD_GUIDE.steps, L = this._lang === 'tr' ? 'tr' : 'en';
    const i = Math.max(0, Math.min(G.length - 1, this._gi || 0)), S = G[i], T = S[L] || S.en;
    const md = (x) => esc(x).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
    let last = '';
    const list = G.map((x, k) => {
      const grp = x.group !== last ? '<div class="ggrp">' + esc((LHD_GUIDE.groups[x.group] || {})[L] || '') + '</div>' : ''; last = x.group;
      return grp + '<button class="gli' + (k === i ? ' on' : '') + '" data-gi="' + k + '"><span class="gno">' + (k + 1) + '</span>' + esc((x[L] || x.en)[0]) + '</button>';
    }).join('');
    const gh = 'https://github.com/mendebur-lemur/lemur-home-dashboard/blob/main/docs/' + (L === 'tr' ? 'REHBER.md' : 'GUIDE.md');
    return '<div class="ov" data-ovl><div class="dlg guide"><div class="dh"><div class="di"><ha-icon icon="mdi:book-open-page-variant-outline"></ha-icon></div><h2>' + t('guideT') + '</h2>' +
      '<a class="btn sm gh" href="' + gh + '" target="_blank" rel="noopener"><ha-icon class="s16" icon="mdi:open-in-new"></ha-icon>' + t('guideGh') + '</a>' +
      '<button class="btn ic" data-gx><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="gbody"><div class="glist">' + list + '</div><div class="gmain">' +
      '<div class="gfig"><img src="' + this._guideImg(S.id) + '" alt="' + esc(T[0]) + '" loading="lazy" onerror="this.parentNode.classList.add(\'bad\')"><span>' + t('guideNoImg') + '</span></div>' +
      '<div class="gtx"><div class="gstep">' + t('guideStep', { n: i + 1, m: G.length }) + '</div><h3>' + md(T[0]) + '</h3>' + T.slice(1).map((p) => '<p>' + md(p) + '</p>').join('') + '</div>' +
      // seçenekler: etiketler panelin kendi yazılarından (o.k), böylece rehberdeki adla ekrandaki ad hep aynı
      (S.opts && S.opts.length ? '<div class="gopt"><h4>' + t('guideOpts') + '</h4>' + S.opts.map((o) => {
        const lab = o.k ? this._t(o.k) : ((o.l || {})[L] || ''), val = (x) => (x.charAt(0) === '=' ? (x.slice(1).split('|')[L === 'tr' ? 0 : 1] || x.slice(1).split('|')[0]) : this._t(x));
        return '<div class="go"><b>' + esc(lab) + '</b>' + (o.v ? '<div class="gv">' + o.v.map((x) => '<span>' + esc(val(x)) + '</span>').join('') + '</div>' : '') + '<p>' + md(o[L] || o.en) + '</p></div>';
      }).join('') + '</div>' : '') + '</div></div>' +
      '<div class="df"><button class="btn" data-gi="' + Math.max(0, i - 1) + '"' + (i ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:chevron-left"></ha-icon>' + t('guidePrev') + '</button><span style="flex:1"></span>' +
      (i < G.length - 1 ? '<button class="btn pri" data-gi="' + (i + 1) + '">' + t('guideNext') + '<ha-icon class="s16" icon="mdi:chevron-right"></ha-icon></button>' : '<button class="btn pri" data-gx>' + t('guideDone') + '</button>') + '</div></div></div>';
  }
  // ---- sürüm ve güncelleme: HACS varsa onunla (bilgileri güncelle, indir), yoksa GitHub'daki son sürümü gösterir ----
  _updRow() {
    const t = (k, v) => esc(this._t(k, v)), U = this._upd || { st: 'idle' }, cur = U.cur || PANEL_VERSION;
    const notes = U.url ? ' · <a href="' + esc(U.url) + '" target="_blank" rel="noopener">' + t('updNotes') + '</a>' : '';
    let sub = t('updInst', { v: cur }) + ' · <a href="#" data-news>' + t('newsLink') + '</a>', ctl = '<button class="btn" data-updcheck>' + t('updCheck') + '</button>';
    if (U.st === 'checking') ctl = '<button class="btn" disabled>' + t('updChecking') + '</button>';
    else if (U.st === 'ok') { sub += ' · <span class="uok">✓ ' + t('updOk') + '</span> · ' + t('updAt', { t: U.at }); ctl = '<button class="btn" data-updcheck>' + t('updAgain') + '</button>'; }
    else if (U.st === 'new') { sub += ' · <b class="unew">' + t('updNew', { v: U.latest }) + '</b>' + notes + (U.ent ? '' : '<br>' + t('updNoHacs')); ctl = U.ent ? '<button class="btn pri" data-updgo>' + t('updGo') + '</button>' : (U.url ? '<a class="btn" href="' + esc(U.url) + '" target="_blank" rel="noopener">' + t('updGh') + '</a>' : ''); }
    else if (U.st === 'installing') { sub = '<b class="unew">' + t('updIng', { v: U.latest }) + '</b>' + (U.pct != null ? ' %' + U.pct : ''); ctl = ''; }
    else if (U.st === 'installed') { sub = '<b class="unew">' + t('updDone', { v: U.latest }) + '</b>' + notes; ctl = '<button class="btn pri" data-updrs>' + t('updRestart') + '</button>'; }
    else if (U.st === 'ask') { sub = '<b>' + t('updAsk') + '</b>'; ctl = '<button class="btn" data-updno>' + t('cancel') + '</button><button class="btn pri" data-updyes style="background:var(--red);border-color:var(--red);color:#fff">' + t('updYes') + '</button>'; }
    else if (U.st === 'restarting') { sub = '<b class="unew">' + t('updRest') + '</b>'; ctl = ''; }
    else if (U.st === 'err') { sub += ' · <span class="uerr">' + t('updErr', { e: U.err }) + '</span>'; ctl = '<button class="btn" data-updcheck>' + t('updAgain') + '</button>'; }
    return '<div class="srow upd" style="flex-wrap:wrap"><div class="t"><b>' + t('updT') + '</b><span>' + sub + '</span></div><div class="ubtn">' + ctl + '</div></div>';
  }
  _updSet(o) { this._upd = Object.assign({}, this._upd, o); if (this._modal === 'settings') this._render(); }
  // yedek kontrol adayları: aynı alanda, adı aynı (govee / matter / parantez içi ekler hariç) başka bir lamba ya da anahtar
  _twinCands(eid) {
    const H = this._hass, E = H.entities || {}, D = H.devices || {}, S = H.states;
    const area = (id) => { const e = E[id]; if (!e) return null; return e.area_id || (e.device_id && D[e.device_id] ? D[e.device_id].area_id : null); };
    const me = E[eid] || {}, myArea = area(eid), myKey = lhdTwinKey(this._ename(eid));
    return Object.keys(S).filter((x) => {
      if (x === eid || LHD_TWIN_DOMAINS.indexOf(x.split('.')[0]) < 0) return false;
      const e = E[x]; if (e && e.entity_category) return false;   // gizli olabilir: yedek kopya genelde gizlenir
      if (/_segment_?\d+$/.test(x)) return false;                       // aynı lambanın segmentleri değil
      if (me.device_id && e && e.device_id === me.device_id) return false;   // ikinci kopya başka bir entegrasyondan gelir
      if (!myKey || lhdTwinKey(this._ename(x)) !== myKey) return false;
      const ax = area(x); return !myArea || !ax || ax === myArea;   // alanı olmayan kopya da olur (Matter cihazına çoğu zaman alan verilmez)
    }).sort();
  }
  // ---- duvar anahtarları (Ayarlar, gelişmiş) ----
  _walls() { return lhdClone(this._wallDraft || (STORE.data && STORE.data.walls) || []); }
  _wallsHtml() {
    const t = (k, v) => esc(this._t(k, v)), W = this._walls(), S = this._hass.states;
    const ents = (doms) => Object.keys(S).filter((x) => doms.indexOf(x.split('.')[0]) >= 0).sort();
    const sel = (i, key, list, cur) => '<select class="inp" data-wl="' + i + ':' + key + '"><option value="">' + t('wallPick') + '</option>' + list.map((x) => '<option value="' + esc(x) + '"' + (cur === x ? ' selected' : '') + '>' + esc(this._ename(x)) + '</option>').join('') + '</select>';
    // aynı anahtarı kullanan açık otomasyonlar (HA'nın "ilgili öğeler" araması; bir kez sorulur)
    const C = this._wallAutos || (this._wallAutos = {});
    const autos = (sw) => {
      if (!C[sw]) { C[sw] = []; this._hass.callWS({ type: 'search/related', item_type: 'entity', item_id: sw }).then((r) => { C[sw] = (r && r.automation) || []; if (C[sw].length && this._modal === 'settings') this._render(); }).catch(() => {}); }
      return C[sw].filter((x) => S[x] && S[x].state === 'on');
    };
    const sws = ents(LHD_WALL_DOMAINS), lights = ents(LHD_TWIN_DOMAINS);
    let h = '<div class="sh" data-sh="sWalls">' + t('sWalls') + this._hb('walls') + '</div><div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><span>' + t('wallsT') + '</span></div>';
    if (!W.length) h += '<div class="mu" style="flex:1 1 100%">' + t('wallNone') + '</div>';
    W.forEach((w, i) => {
      h += '<div class="wallrow">' +
        '<div class="fld"><label>' + t('wallSw') + '</label>' + sel(i, 'switch', sws, w.switch) + '</div>' +
        '<div class="fld"><label>' + t('wallLight') + '</label>' + sel(i, 'light', lights, w.light) + '</div>' +
        '<div class="fld"><label>' + t('wallBr') + '</label><input class="inp" type="number" min="1" max="100" data-wl="' + i + ':brightness" value="' + esc(w.brightness || '') + '" placeholder="—"></div>' +
        '<div class="fld"><label>' + t('wallK') + '</label><input class="inp" type="number" min="2000" max="9000" step="100" data-wl="' + i + ':kelvin" value="' + esc(w.kelvin || '') + '" placeholder="—"></div>' +
        '<button class="btn sm dan" data-wldel="' + i + '">' + t('wallDel') + '</button>' +
        (w.switch && autos(w.switch).length ? '<div class="hint wallw">' + t('wallAuto', { n: autos(w.switch).map((x) => (S[x].attributes.friendly_name || x)).join(', ') }) + '</div>' : '') + '</div>';
    });
    return h + '<button class="btn sm" data-wladd><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('wallAdd') + '</button></div>';
  }
  _wallSet(i, key, v) {
    const W = this._walls(); if (!W[i]) return;
    if (key === 'brightness' || key === 'kelvin') { const n = parseFloat(v); if (n > 0) W[i][key] = Math.round(n); else delete W[i][key]; }
    else if (v) W[i][key] = v; else delete W[i][key];
    // yarım satır (anahtar ya da lamba seçilmemiş) sunucuya gitmez; bitince kaydedilir
    this._wallDraft = W;
    const ok = W.filter((w) => w.switch && w.light);
    if (ok.length === W.length) { this._wallDraft = null; this._commit('walls', W); }
    this._render();
  }
  _updEnt() {
    // yalnız HACS'in ya da Marketplace'in (HA 2026.11'de HACS'ın yerini aldı) oluşturduğu güncelleme varlığı (başka bir entegrasyon aynı adresi taklit edemesin)
    const S = this._hass.states, E = this._hass.entities || {};
    const hacs = (s) => !!s && s.entity_id.indexOf('update.') === 0 && !!E[s.entity_id] && (E[s.entity_id].platform === 'hacs' || E[s.entity_id].platform === 'marketplace');
    return Object.values(S).find((s) => hacs(s) && LHD_REPO_URL.test(String(s.attributes.release_url || ''))) || (hacs(S['update.lemur_home_dashboard_update']) ? S['update.lemur_home_dashboard_update'] : null);
  }
  async _updCheck() {
    const c = this._hass.connection, vnum = (v) => String(v || '').replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
    const newer = (a, b) => { const x = vnum(a), y = vnum(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
    this._updSet({ st: 'checking', err: null });
    try {
      let cur = PANEL_VERSION; try { cur = (await c.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version || cur; } catch (e) {}
      // HACS: menüsündeki "Bilgileri güncelle" ile aynı; güncelleme varlığı en yeni sürümü öğrensin
      // HA 2026.11'den beri HACS'ın yerinde Marketplace var; komutları aynı, öneki farklı (hacs/ -> marketplace/)
      for (const pre of ['marketplace', 'hacs']) {
        try { const L = await c.sendMessagePromise({ type: pre + '/repositories/list' }); const r = (L || []).filter((x) => /^mendebur-lemur\/lemur-home-dashboard$/i.test(x.full_name || ''))[0]; if (r) { await c.sendMessagePromise({ type: pre + '/repository/refresh', repository: String(r.id) }); await new Promise((z) => setTimeout(z, 900)); } break; } catch (e) {}
      }
      const ent = this._updEnt();
      let latest = ent && ent.attributes.latest_version, url = ent && ent.attributes.release_url;
      if (!latest) { const g = await fetch('https://api.github.com/repos/mendebur-lemur/lemur-home-dashboard/releases/latest').then((r) => r.json()); latest = g.tag_name; url = g.html_url; }
      latest = String(latest || '').replace(/^v/i, '');
      if (!LHD_REPO_URL.test(String(url || ''))) url = null;   // bağlantı yalnız projenin GitHub sayfasına
      const at = new Date().toLocaleTimeString(this._lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
      // HACS yeni sürümü indirmiş ama Home Assistant henüz yeniden başlamamış: güncelleme varlığı "güncel" der,
      // update.install "No update available" hatası verir. Bu durumda yalnız yeniden başlatma önerilir.
      const dl = ent && String(ent.attributes.installed_version || '').replace(/^v/i, '');
      if (newer(latest, cur) && dl && !newer(latest, dl)) { this._updSet({ st: 'installed', cur: cur, latest: latest, url: url, at: at }); return; }
      this._updSet(newer(latest, cur) ? { st: 'new', cur: cur, latest: latest, url: url, ent: ent ? ent.entity_id : null, at: at } : { st: 'ok', cur: cur, latest: latest, url: url, at: at });
    } catch (e) { this._updSet({ st: 'err', err: (e && (e.message || e.code)) || String(e) }); }
  }
  async _updInstall() {
    const U = this._upd || {}; if (!U.ent) return;
    this._updSet({ st: 'installing', pct: null });
    try { await this._hass.callService('update', 'install', { entity_id: U.ent }); }
    catch (e) {
      // başka bir yerden (HACS sayfası) zaten indirildiyse: hata değil, yeniden başlatma bekleniyor
      const s = this._hass.states[U.ent], iv = String((s && s.attributes.installed_version) || '').replace(/^v/i, '');
      if (iv && iv === U.latest) return this._updSet({ st: 'installed', pct: null });
      return this._updSet({ st: 'err', err: (e && e.message) || String(e) });
    }
    const t0 = Date.now();
    const tick = () => {
      const s = this._hass.states[U.ent], a = (s && s.attributes) || {};
      const done = s && !a.in_progress && String(a.installed_version || '').replace(/^v/i, '') === U.latest;
      if (done) return this._updSet({ st: 'installed', pct: null });
      if (Date.now() - t0 > 300000) return this._updSet({ st: 'err', err: 'timeout' });
      if (typeof a.update_percentage === 'number' || typeof a.in_progress === 'number') this._updSet({ pct: Math.round(a.update_percentage != null ? a.update_percentage : a.in_progress) });
      this._updT = setTimeout(tick, 1000);
    };
    tick();
  }
  // kullanıcı Yeniden başlat'a bastı: yeni sürüm cevap verince sayfayı bir kez yenile (o ana kadar bellekte eski kod var)
  _updRestart() {
    const want = (this._upd || {}).latest; this._updSet({ st: 'restarting' });
    this._hass.callService('homeassistant', 'restart').catch(() => {});
    const t0 = Date.now(); let down = false;
    const poll = async () => {
      if (Date.now() - t0 > 600000) return;
      try {
        const v = (await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version;
        if (v === want || (down && v)) return location.reload();   // kullanıcı Yeniden başlat'a bastı
      } catch (e) { down = true; }
      setTimeout(poll, 3000);
    };
    setTimeout(poll, 8000);
  }
  // üst şerit ayarları (ayar nav): oda düğmelerinin boyu ve kolona hizalama (src/panel-card.js lpNavCfg)
  // Saatte parlaklık: aç/kapa; açıkken görünüm, simge ve gösterge
  _bbRows(seg, tg) {
    const t = (k, v) => esc(this._t(k, v));
    const b = lhdIsObj(this._settings().bright) ? this._settings().bright : {}, on = b.on === true;
    return '<div class="srow"><div class="t"><b>' + t('bb') + '</b><span>' + t('bbT') + '</span></div>' + tg('bright.on', on) + '</div>' +
      (!on ? '' :
        ((this._adv() || b.look === 'box') ? '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('bbLook') + '</b><span>' + t('bbLookT') + '</span></div>' + seg('bright.look', b.look === 'box' ? 'box' : 'auto', [['auto', this._t('bbHidden')], ['box', this._t('bbBox')]]) + '</div>' : '') +
        '<div class="srow"><div class="t"><b>' + t('bbPh') + '</b><span>' + t('bbPhT') + '</span></div>' + tg('bright.phone', b.phone !== false) + '</div>' +
        ((this._adv() || b.icon === true) ? '<div class="srow"><div class="t"><b>' + t('bbIcon') + '</b><span>' + t('bbIconT') + '</span></div>' + tg('bright.icon', b.icon === true) + '</div>' : '') +
        ((this._adv() || b.value === 'always') ? '<div class="srow"><div class="t"><b>' + t('bbVal') + '</b><span>' + t('bbValT') + '</span></div>' + seg('bright.value', b.value === 'always' ? 'always' : 'auto', [['auto', this._t('bbDrag')], ['always', this._t('bbAlways')]]) + '</div>' : ''));
  }
  _navRows(seg, tg, fx) {
    const t = (k, v) => this._t(k, v), nc = lpNavCfg();
    const nCols = Math.max(1, Math.min(6, this._work().reduce((m, T) => Math.max(m, lpWeights(T).length), 1)));
    const opts = [['auto', t('navNo')]];
    for (let i = 1; i < nCols; i++) opts.push([String(i), t('navCol', { n: i })]);
    return '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('navAl') + '</b><span>' + t('navAlT') + '</span></div>' + seg('nav.cols', nc.cols ? String(nc.cols) : 'auto', opts) + '</div>' +
      (nc.cols && fx ? '<div class="srow"><div class="t"><b>' + t('navFx') + '</b><span>' + t('navFxT') + '</span></div>' + tg('nav.fx_in', nc.fx_in) + '</div>' : '') +
      '<div class="srow"><div class="t"><b>' + t('navSz') + '</b><span>' + t(nc.cols ? 'navSzA' : 'navSzT') + '</span></div><div class="acts">' +   // iki kutu yan yana kalsın (yan panelde ayrı satırlara bölünüyordu)
        (nc.cols ? '' : '<input class="inp" type="number" min="80" max="400" data-sf="nav.w" value="' + (nc.w || '') + '" placeholder="235" title="' + esc(t('navW')) + '" style="width:80px">') +
        '<input class="inp" type="number" min="60" max="260" data-sf="nav.h" value="' + (nc.h || '') + '" placeholder="155" title="' + esc(t('navH')) + '" style="width:80px"></div></div>';
  }
  // telefon seçenekleri (ayar phone; src/panel-card.js lpPhoneCfg). Her biri ayrı: istenen birleşim seçilebilir
  _phoneRows(seg, tg) {
    const t = (k, v) => this._t(k, v), pc = lpPhoneCfg();
    return '<div class="sh">' + t('s_phone') + '</div>' +
      '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('phNav') + '</b><span>' + t('phNavT') + '</span></div>' + seg('phone.nav', pc.nav, [['cats', t('phCats')], ['rooms', t('phRooms')], ['top', t('phTop')]]) + '</div>' +
      '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('phLights') + '</b><span>' + t('phLightsT') + '</span></div>' + seg('phone.lights', pc.lights, [['auto', t('phLAuto')], ['tiles', t('phLTiles')], ['rows', t('phLRows')]]) + '</div>' +
      '<div class="srow"><div class="t"><b>' + t('phSheet') + '</b><span>' + t('phSheetT') + '</span></div>' + tg('phone.sheet', pc.sheet) + '</div>' +
      '<div class="srow"><div class="t"><b>' + t('sections') + '</b><span>' + t('phSecsT') + '</span></div></div>' +
      ((lhdIsObj(this._phOv().secs) || lhdIsObj(this._phOv().order) || lhdIsObj(this._phOv().tabs) || lhdIsObj(this._phOv().style)) ? '<div class="srow"><div class="t"><b>' + t('phResetAll') + '</b><span>' + t('phResetAllT') + '</span></div><button class="btn sm dan" data-a="phresall">' + t('phResetAll') + '</button></div>' : '');
  }
  // Otomatik kur (mode 'kur') ve Stil seç (mode 'stil') aynı pencereyi kullanır: solda önizleme, sağda büyük seçenekler.
  // Kur: sekmeler senin alanlarından yeniden kurulur. Stil: sekmelerine dokunulmaz, yalnız görünüm ayarları topluca değişir.
  _autoInit(mode) {
    const A = this._hass.areas || {}, F = this._hass.floors || {};
    const lv = (a) => { const f = F[A[a].floor_id]; return f && typeof f.level === 'number' ? f.level : 9999; };
    const order = Object.keys(A).map((a, i) => ({ a: a, i: i })).sort((x, y) => (lv(x.a) - lv(y.a)) || (x.i - y.i)).map((x) => x.a);
    const def = {}; buildDefaultTabs(this._hass, this._lang).forEach((T) => { if (T.area) def[T.area] = true; });
    const areas = {}; order.forEach((a) => { areas[a] = !!def[a]; });
    const st = this._settings(), m = st.bg && st.bg.mode;
    // arka plan: Koyu, Siyah, Renk, Resim ya da efekt rengi (eski kayıtta yalnız background yazısı olabilir)
    const sb = typeof st.background === 'string' ? st.background : '', url = (sb.match(/url\(['"]?([^'")]+)/) || [])[1] || '';
    const bg = !m ? (url ? 'img' : sb ? null : 'zen') : m === 'fx' ? (st.bg.fx || 'zen') : m;
    const pc = lpPhoneCfg(), stil = mode === 'stil';
    // stilde ışık görünümü: sekmelerdeki ışık bölümlerinin çoğu çubuksa çubuk
    let nb = 0, nt = 0; if (stil) this._work().forEach((T) => (T.sections || []).forEach((x) => { if (x.type === 'lights') { if (x.look === 'bar') nb++; else nt++; } }));
    this._ak = { mode: stil ? 'stil' : 'kur', src: stil ? 'mine' : 'demo', order: order, areas: areas, home: true, other: true,
      types: { lights: true, scenes: true, climate: true, vacuum: true, media: true, camera: false, energy: Object.keys(this._hass.states || {}).some((id) => id.indexOf('sensor.') === 0 && lpEnIsPow(this._hass.states[id])) }, look: nb > nt ? 'bar' : 'tiles', clim: stil && lpClimStyle() === 'rows' ? 'rows' : 'halo',
      bg: bg, bgColor: (m === 'color' && st.bg.color) || LHD_BG_COLORS[1], bgUrl: (m === 'img' && st.bg.url) || url, nav: pc.nav, plights: pc.lights, sheet: pc.sheet, lec: st.lec_nav !== false, hold: lpHoldMode(), pv: 'tablet' };
    this._ak.look0 = this._ak.look;
    // önizlemenin hayali evi (dokunulunca durumu değişir; pencere açık kaldıkça aynı ev)
    const home = lhdDemoHome(this._lang);
    this._akDemo = lhdDemoHass(this._hass, home, () => { if (this._akCard) this._akCard.hass = this._akHassFor(); });
    this._akTab = null; this._akCard = null;
  }
  _akLecOk() { return LEC.installed(this._hass); }
  // önizlemenin hass'ı: hayali ev ya da (stilde "Benim evim") senin evin; senin evinde dokunuşlar cihazlara gitmez
  _akHassFor() {
    // hayali evde efektler kurulu gibi görünür (potansiyeli görsün); kendi evinde yalnız kuruluysa
    const K = this._ak, comps = K.lec && (K.src !== 'mine' || this._akLecOk()) ? ['lemur_light_effects'] : [];
    if (K.src === 'mine') return Object.assign({}, this._hass, { lhdDemo: true, callService: () => Promise.resolve(), config: Object.assign({}, this._hass.config, { components: comps }) });
    return Object.assign({}, this._akDemo, { lhdDemo: true, states: Object.assign({}, this._akDemo.states), config: Object.assign({}, this._akDemo.config, { components: comps }) });
  }
  _akBgSel(k) {
    const K = this._ak;
    if (k === 'dark' || k === 'black') return { mode: k };
    if (k === 'color') return { mode: 'color', color: K.bgColor };
    if (k === 'img') return K.bgUrl ? { mode: 'img', url: K.bgUrl } : null;   // adres yazılmadan zemin değişmez
    return { mode: 'fx', fx: k };
  }
  _akBgCss(k) { return k === 'dark' ? LP_DARK_BG : lpBgCss(this._akBgSel(k)); }
  // stilde ışık görünümü sekmelere uygulanır (yalnız değiştirildiyse; "telefonda çubuk" gibi özel seçimler korunur)
  _akLook(tabs) {
    const K = this._ak; if (K.look === K.look0) return tabs;
    return tabs.map((T) => Object.assign({}, T, { sections: (T.sections || []).map((x) => { if (x.type !== 'lights') return x; const o = Object.assign({}, x); if (K.look === 'bar') o.look = 'bar'; else delete o.look; return o; }) }));
  }
  _akTabs() {
    const K = this._ak;
    // hayali evde üstte 4 düğme: Ev, Salon, Yatak Odası ve Diğer (Mutfak ile Çalışma Odası Diğer'e düşer; Diğer'in ne olduğu görünsün)
    const da = ['salon', 'yatak'];
    if (K.mode === 'stil') return K.src === 'mine' ? this._akLook(this._work()) : buildDefaultTabs(this._akDemo, this._lang, { areas: da, look: K.look });
    return buildDefaultTabs(this._akDemo, this._lang, { areas: da, home: K.home, other: K.other, types: K.types, look: K.look });
  }
  _akSettings() {
    const K = this._ak, s = Object.assign({}, this._settings());
    s.climate_style = K.clim === 'rows' ? 'rows' : null;
    s.phone = Object.assign({}, lhdIsObj(s.phone) ? s.phone : {}, { nav: K.nav, lights: K.plights, sheet: K.sheet });
    s.lec_nav = K.lec; s.hold = K.hold === 'lec' && !this._akLecOk() ? 'popup' : K.hold;
    const sel = K.bg && this._akBgSel(K.bg);
    if (sel) { s.bg = sel; s.background = this._akBgCss(K.bg); }
    if (K.src !== 'mine') s.nav = null;   // hayali evin sekmeleri farklı: senin üst şerit hizan ona uymaz
    return s;
  }
  // önizleme kartını yerleştir ve ölçekle: tablet 1280×800, telefon 390×844 ekrana sığdırılır
  _akMount() {
    const R = this.shadowRoot, box = R.querySelector('.akpvc'), wrap = R.querySelector('.akpv'); if (!box || !wrap || !this._ak) return;
    const K = this._ak, ph = K.pv === 'phone', tabs = this._akTabs();
    let card = this._akCard;
    if (!card) card = this._akCard = document.createElement('lemur-home-dashboard-card');
    else if (card._config && card._config.tab && tabs.some((x) => x.id === card._config.tab)) this._akTab = card._config.tab;   // önizlemede açılan sekme kalsın
    if (!tabs.some((x) => x.id === this._akTab)) this._akTab = tabs.length ? tabs[0].id : null;
    // kutu önce boyutlanır: telefon karolarının sayısı kartın genişliğinden hesaplanır
    const W = ph ? 390 : 1280, H = ph ? 844 : 800;
    const z = Math.min(wrap.clientWidth / W, wrap.clientHeight / H) || 0.5;
    box.style.width = W + 'px'; box.style.height = H + 'px'; box.style.overflow = 'hidden';
    box.style.setProperty('--lp-h', H + 'px');
    // kart kaydırılan iç kutuda; ışık penceresi dış kutuya açılır, böylece önizlemenin ekranında kalır (kaydırınca kaymaz)
    if (LP_POP.cur) LP_POP.cur.close(true);
    const scr = document.createElement('div'); scr.className = 'akscr'; scr.style.overflowY = ph ? 'auto' : 'hidden';
    // kart önce yerine takılır, sonra ayarlanır: dışarıdayken çizilirse genişliği 0 okunur, telefonda 8 minicik karo çıkıyordu
    const cfg = { type: 'custom:lemur-home-dashboard-card', demo: true, demo_tabs: tabs, demo_settings: this._akSettings(), demo_mount: box, tab: this._akTab, phone: ph };
    if (!card._config) card.setConfig(cfg);
    box.innerHTML = ''; box.appendChild(scr); scr.appendChild(card);
    card.setConfig(cfg);
    card.hass = this._akHassFor();
    // "Işık penceresi" düğmesi ya da pencere seçimi: önizlemede bir ışığın penceresi açılır
    if (K.pop) { K.pop = false; setTimeout(() => { if (card.lhdDemoPop) card.lhdDemoPop(); }, 80); }
    const bgc = K.bg && this._akBgSel(K.bg) ? this._akBgCss(K.bg) : lpBgOf(this._settings());
    box.style.background = String(bgc || LP_DARK_BG).replace(/ fixed/g, '');
    box.style.transform = 'translate(' + Math.max(0, (wrap.clientWidth - W * z) / 2) + 'px,' + Math.max(0, (wrap.clientHeight - H * z) / 2) + 'px) scale(' + z + ')';
  }
  _autoOpts() { const K = this._ak; return { areas: K.order.filter((a) => K.areas[a]), home: K.home, other: K.other, types: K.types, look: K.look }; }
  _autoApply() {
    if (!this._ak) return;
    const K = this._ak, stil = K.mode === 'stil';
    let tabs = null;
    if (!stil) { tabs = buildDefaultTabs(this._hass, this._lang, this._autoOpts()); if (!tabs.length) return; }
    this._snap();
    if (tabs) this._commit('tabs', tabs);
    else if (K.look !== K.look0) this._commit('tabs', this._akLook(this._work()));
    const s = lhdClone(this._settings());
    if (K.clim === 'rows') s.climate_style = 'rows'; else delete s.climate_style;
    const sel = K.bg && this._akBgSel(K.bg);
    if (sel) { s.bg = sel; const css = lpBgCss(sel); if (css) s.background = css; else delete s.background; }
    s.phone = Object.assign({}, lhdIsObj(s.phone) ? s.phone : {}, { nav: K.nav, lights: K.plights, sheet: K.sheet });
    if (this._akLecOk()) s.lec_nav = K.lec;
    if (K.hold) s.hold = K.hold === 'lec' && !this._akLecOk() ? 'popup' : K.hold;
    this._commit('settings', s);
    this._modal = null; this._sec = null; if (tabs) this._tab = tabs[0].id; this._ak = null; this._akCard = null; this._akDemo = null;
    this._toast(this._t(stil ? 'akOkS' : 'akOk'));
    this._render();
  }
  _setting(path, value, soft) {
    this._snap();
    const s = lhdClone(this._settings());
    const p = path.split('.');
    let o = s;
    for (let i = 0; i < p.length - 1; i++) { if (!o[p[i]] || typeof o[p[i]] !== 'object') o[p[i]] = {}; o = o[p[i]]; }
    if (value === undefined || value === null || value === '') delete o[p[p.length - 1]]; else o[p[p.length - 1]] = value;
    this._commit('settings', s);
    if (!soft) this._render(); else this._undoBtn();   // ayarlar penceresi açıkken de güncel görünsün
    this._toast(this._t('saved'));
  }
  // yazı alanından gelen kayıtta panel yeniden çizilmez; geri al düğmesi yine de açılsın (ilk değişiklikte kapalı kalıyordu)
  _undoBtn() { const R = this.shadowRoot, u = R && R.querySelector('[data-a="undo"]'), r = R && R.querySelector('[data-a="redo"]'); if (u) u.disabled = !this._undo.length; if (r) r.disabled = !(this._redo && this._redo.length); }
  _toast(x, undo) {
    const el = this.shadowRoot && this.shadowRoot.querySelector('.toast'); if (!el) return;
    el.querySelector('span').textContent = x;
    el.querySelector('button').hidden = undo === false || !this._undo.length;
    el.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => el.classList.remove('show'), 4200);
  }

  // ---- seçili sekme ve bölüm ----
  _curTab(tabs) {
    let t = tabs.filter((x) => x.id === this._tab)[0];
    if (!t) { t = tabs[0]; this._tab = t ? t.id : null; }
    return t;
  }
  _curSec(tab) {
    if (!tab) return null;
    const s = (tab.sections || []).filter((x) => x.id === this._sec)[0];
    if (!s) this._sec = null;
    return s || null;
  }

  // ---- çizim ----
  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    // büyük harfe çevrilen başlıklar panelin diliyle çevrilsin (İngilizce panoda "SECTİONS" olmasın)
    if (this.getAttribute('lang') !== this._lang) this.setAttribute('lang', this._lang);
    const icm = 'ic-' + lpIconMode(); if (this.className !== icm) this.className = icm; this.style.setProperty('--lp-ic-on', lpIconTint());
    if (!LP_MDIC.map) lpMdicLoad();
    if (!this._newsChk && STORE.data) { this._newsChk = true; this._newsAuto(); }
    const R = this.shadowRoot;
    if (!STORE.data) { R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app"><div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + esc(this._t('title')) + '</h1></div><div class="warn">' + esc(this._t('notLoaded')) + '</div></div>'; return; }
    const tabs = this._work(), tab = this._curTab(tabs), sec = this._curSec(tab);
    const t = (k, v) => esc(this._t(k, v));
    const narrow = (this.clientWidth || window.innerWidth) < 980;
    this._narrowNow = narrow;

    const top = '<div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + t('title') + '</h1>' +
      (this._isAuto() ? '<span class="badge" title="' + t('autoT') + '">' + t('auto') + '</span>' : '') + '<div class="grow"></div>' +
      // "Yıldız ver": yalnız GitHub bağlantısı (sayım, hatırlatma yok); dar ekranda yalnız simge
      '<a class="btn stb" href="' + LHD_REPO + '" target="_blank" rel="noopener" title="' + t('starT') + '" aria-label="' + t('starT') + '"><ha-icon class="s16" icon="mdi:star"></ha-icon><span class="l">' + t('starB') + '</span></a>' +
      // Önerilen ürünler (src/picks.js): yıldızın yanında; Ayarlar → Pano'dan gizlenir
      (this._settings().picks !== 'off' && LHDPicks.get().items.length ? '<button class="btn shb" data-a="picks" title="' + t('picksS') + '"><ha-icon class="s16" icon="mdi:shopping-outline"></ha-icon><span class="l">' + t('picksB') + '</span></button>' : '') +
      // v0.28.9: Basit / Gelişmiş'in yanındaki ? kalktı (ne olduğu anlaşılıyor); Geri al önizlemenin başlığına geçti
      '<div class="seg modeseg" title="' + t('modeT') + '"><button data-mode="simple"' + (this._adv() ? '' : ' class="on"') + '>' + t('modeSimple') + '</button><button data-mode="adv"' + (this._adv() ? ' class="on"' : '') + '>' + t('modeAdv') + '</button></div>' +
      '<button class="btn stl" data-a="stilsec" title="' + t('akSHint') + '"><ha-icon class="s16" icon="mdi:palette-outline"></ha-icon>' + t('akST') + '</button>' +   // stil seç göze çarpsın: ayarların yanında
      '<button class="btn enb" data-a="energy" title="' + t('enOpenT') + '"><ha-icon class="s16" icon="mdi:lightning-bolt"></ha-icon><span class="l">' + t('enBtn') + '</span></button>' +
      '<button class="btn" data-a="settings"><ha-icon class="s16" icon="mdi:cog-outline"></ha-icon>' + t('settings') + '</button>' +
      '<button class="btn ic" data-a="more" title="' + t('more') + '"><ha-icon class="s16" icon="mdi:dots-horizontal"></ha-icon></button></div>';

    const phE = this._phEd(), PTB = this._phTabs();
    const PTN = lhdIsObj(PTB.names) ? PTB.names : {}, PTI = lhdIsObj(PTB.icons) ? PTB.icons : {}, PTH = lhdIsObj(PTB.hide) ? PTB.hide : {};
    // telefonda oda düğmeleri telefondaki sırasıyla, telefona özel ad ve simgeyle; gizliler soluk
    const tabsShown = phE ? lhdOrderBy(tabs, PTB.order) : tabs;
    const rooms = '<div class="rooms' + (phE ? ' phl' : '') + '" data-dl="tabs" data-dir="x">' + tabsShown.map((x) => '<div class="rb' + (x.id === this._tab ? ' on' : '') + (phE && PTH[x.id] ? ' phoff' : '') + '" data-di data-tab="' + esc(x.id) + '" data-handle>' + lpIcon((phE && PTI[x.id]) || x.icon || 'mdi:door') + esc((phE && PTN[x.id]) || x.name) + '</div>').join('') +
      (phE ? '' : '<div class="rb add" data-a="addtab"><ha-icon class="s18" icon="mdi:plus"></ha-icon>' + t('addTab') + '</div>') + '</div>';
    const areaOpts = '<option value="">' + t('noArea') + '</option>' + Object.keys(this._hass.areas || {}).map((a) => '<option value="' + esc(a) + '"' + (tab && tab.area === a ? ' selected' : '') + '>' + esc(this._area(a)) + '</option>').join('');
    const W = tab ? lpWeights(tab) : LP_DEFAULT_COLS, wsum = W.reduce((a, b) => a + b, 0), SP = lpSplits(tab, W.length);
    const rpanelPh = tab ? '<div class="rpanel phr' + (tabsShown[0] && tabsShown[0].id === tab.id ? ' first' : '') + '">' +
      (!this._adv() && !PTN[tab.id] && !PTI[tab.id] ? '' :
      '<div class="fld" style="flex:1 1 180px"><label>' + t('phTabName') + (PTN[tab.id] ? ' <i class="phb">' + t('phOwn') + '</i>' : '') + '</label><input class="inp" data-phtn="' + esc(tab.id) + '" value="' + esc(PTN[tab.id] || '') + '" placeholder="' + esc(tab.name || '') + '"></div>' +
      '<div class="fld" style="flex:1 1 200px"><label>' + t('phTabIcon') + (PTI[tab.id] ? ' <i class="phb">' + t('phOwn') + '</i>' : '') + '</label><div class="iconin"><div class="pv">' + lpIcon(PTI[tab.id] || tab.icon || 'mdi:door') + '</div><input class="inp" data-phti="' + esc(tab.id) + '" value="' + esc(PTI[tab.id] || '') + '" placeholder="' + esc(tab.icon || 'mdi:door') + '"><button class="btn sm ic" data-ip="phtab" title="' + t('iconPick') + '"><ha-icon class="s16" icon="mdi:shape-outline"></ha-icon></button></div></div>') +
      '<div class="fld"><label>' + t('phTabShow') + '</label><div class="seg"><button data-phtabh="0"' + (PTH[tab.id] ? '' : ' class="on"') + '>' + t('phShown') + '</button><button data-phtabh="1"' + (PTH[tab.id] ? ' class="on"' : '') + '>' + t('phHidden') + '</button></div></div>' +
      ((PTN[tab.id] || PTI[tab.id] || PTH[tab.id]) ? '<button class="btn sm" data-a="phrestab">' + t('phReset') + '</button>' : '') +
      '<div class="hint" style="flex:1 1 100%">' + (PTH[tab.id] ? t('phTabHidden') + ' ' : '') + t('phTabNote') + '</div></div>' : '';
    const rpanel = phE ? rpanelPh : tab ? '<div class="rpanel' + (tabs[0] && tabs[0].id === tab.id ? ' first' : '') + '">' +
      '<div class="fld" style="flex:1 1 180px"><label>' + t('tabName') + '</label><input class="inp" data-f="tab.name" value="' + esc(tab.name || '') + '"></div>' +
      '<div class="fld" style="flex:1 1 200px"><label>' + t('icon') + '</label><div class="iconin"><div class="pv">' + lpIcon(tab.icon || 'mdi:door') + '</div><input class="inp" data-f="tab.icon" value="' + esc(tab.icon || '') + '" placeholder="mdi:sofa-outline"><button class="btn sm ic" data-ip="tab" title="' + t('iconPick') + '"><ha-icon class="s16" icon="mdi:shape-outline"></ha-icon></button></div></div>' +
      '<div class="fld" style="flex:1 1 160px"><label>' + t('area') + '</label><select class="inp" data-f="tab.area">' + areaOpts + '</select></div>' +
      ((this._adv() || (tab.bg && tab.bg.mode)) ? (() => {   // odaya özel arka plan (v0.29.2)
        const B = tab.bg || {}, k = B.mode === 'fx' ? 'fx:' + B.fx : B.mode === 'color' ? 'color:' + String(B.color || '').toLowerCase() : B.mode || '';
        const b1 = (v, css, title) => '<button class="phsw' + (k === v ? ' on' : '') + '" data-tabbg="' + esc(v) + '" style="background:' + esc(css) + '" title="' + esc(title) + '"></button>';
        return '<div class="fld" style="flex:1 1 100%"><label>' + t('tabBg') + (k ? ' <i class="phb">' + t('tabBgOwn') + '</i>' : '') + '</label><div class="phbgs"><button class="phsw same' + (k ? '' : ' on') + '" data-tabbg="">' + t('tabBgSame') + '</button>' +
          b1('dark', '#0b0e15', this._t('phDark')) + b1('black', '#000', this._t('phBlack')) + LHD_BG_COLORS.map((c) => b1('color:' + c, c, c)).join('') +
          LP_BG_FX.map((f) => b1('fx:' + f[0], lpFxSwatch(f[3]), this._lang === 'tr' ? f[1] : f[2])).join('') + '</div><div class="hint">' + t('tabBgT') + '</div></div>';
      })() : '') +
      (!this._adv() && tab.layout !== 'grid' ? '' : '<div class="fld"><label>' + t('layout') + '</label><div class="acts"><div class="seg"><button data-a="laycols"' + (tab.layout === 'grid' ? '' : ' class="on"') + '>' + t('layCols') + '</button><button data-a="laygrid"' + (tab.layout === 'grid' ? ' class="on"' : '') + '>' + t('layGrid') + '</button></div>' +
        (tab.layout === 'grid' ? '<div class="seg"><button data-a="gfit"' + (tab.gfit === false ? '' : ' class="on"') + '>' + t('gFit') + '</button><button data-a="gscr"' + (tab.gfit === false ? ' class="on"' : '') + '>' + t('gScr') + '</button></div>' + (tab.gfit === false ? '' : '<div class="seg" title="' + t('gRowsT') + '">' + [8, 10, 12, 16, 20].map((n) => '<button data-grows="' + n + '"' + ((+tab.grows || 12) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div>') + '<button class="btn sm" data-a="gfill" title="' + t('gFillT') + '"><ha-icon class="s16" icon="mdi:arrow-expand-all"></ha-icon>' + t('gFill') + '</button>' + (tab.gm_own ? '<button class="btn sm" data-a="gmauto" title="' + t('gmAutoT') + '">' + t('gmAuto') + '</button>' : '') : '') + '</div>' + (tab.layout === 'grid' ? '<div class="hint">' + t('layGridT') + '</div>' : '') + '</div>') +
      (tab.layout === 'grid' ? '' : '<div class="fld"><label title="' + t('colHint') + '">' + t('cols') + ' · ' + W.map((x) => Math.round(x / wsum * 100)).join(' / ') + '</label><div class="acts">' +
        '<button class="btn sm ic" data-a="coldel" title="' + t('colDel') + '"' + (W.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:minus"></ha-icon></button>' +
        '<span class="btn sm" style="pointer-events:none;min-width:38px">' + W.length + '</span>' +
        '<button class="btn sm ic" data-a="coladd" title="' + t('colAdd') + '"' + (W.length >= LHD_MAXCOLS ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:plus"></ha-icon></button>' +
        (W.length === 3 ? '<button class="btn sm" data-a="coltab">' + t('colTab') + '</button>' : '') + '<button class="btn sm" data-a="coleq">' + t('colEq') + '</button></div></div>' +
      (!this._adv() ? '' : '<div class="fld"><label title="' + t('splitsT') + '">' + t('splits') + this._hb('splits') + '</label><div class="acts">' + SP.map((v, i) => '<div class="seg"><button disabled style="opacity:.6">' + esc(this._colName(i, W.length)) + '</button>' + [1, 2, 3].map((n) => '<button data-split="' + i + ':' + n + '"' + (v === n ? ' class="on"' : (!lhdCanSplit(tab, i, n, this._cw()) ? ' disabled title="' + esc(t('splitNarrow')) + '"' : '')) + '>' + n + '</button>').join('') + '</div>').join('') + '</div></div>')) +
      (tab.area ? '<button class="btn sm" data-a="refill" title="' + t('refillT') + '"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('refill') + '</button>' : '') +
      '<button class="btn sm dan' + (this._ask === 'deltab' ? ' ask' : '') + '" data-a="deltab"' + (tabs.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'deltab' ? t('sure') : t('delTab')) + '</button></div>' : '';

    const ncols = W.length;
    const colName = (s) => tab.layout === 'grid' ? (() => { const gp = s.g || (lpGridPos(tab, 12, (tab.sections || []).map((x) => x.id))[s.id] || {}); return this._t('gPos', { w: gp.w || '?', h: gp.h || '?' }); })() : this._colName(Math.min(s.col || 0, ncols - 1), ncols) + (SP[Math.min(s.col || 0, ncols - 1)] > 1 ? ' · ' + (Math.min(s.sub || 0, SP[Math.min(s.col || 0, ncols - 1)] - 1) + 1) : '');
    // özet: içindeki öğe türleri ("Işıklar 7 · İklim 2"); boşsa "0 öğe"
    const summary = (s) => { const k = lhdKinds(s), ks = Object.keys(k); return ks.length ? ks.map((x) => this._t(LHD_KIND_KEY[x]) + ' ' + k[x]).join(' · ') : this._t('n_items', { n: 0 }); };
    const secsShown = tab ? (phE ? lhdPhoneOrder(tab, this._phOrd(tab)) : (tab.sections || [])) : [];
    const secList = tab && (tab.sections || []).length ? '<div class="sl' + (phE ? ' phl' : '') + '" data-dl="secs">' + secsShown.map((s) => {
      const po = phE ? this._phSec(s.id) : {}, own = phE && Object.keys(po).length > 0;
      return '<div class="si' + (s.id === this._sec ? ' on' : '') + (po.hide ? ' phoff' : '') + '" data-di data-sec="' + esc(s.id) + '">' +
        '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span><div class="ti"><ha-icon icon="' + esc((LHD_TYPES[s.type] || {}).icon || 'mdi:shape') + '"></ha-icon></div>' +
        '<div class="nm"><b>' + esc(s.title || this._t('t_' + (LHD_TYPES[s.type] ? s.type : 'free'))) + '</b><span>' + esc(summary(s)) + (own ? ' · <i class="phb">' + t('phOwn') + '</i>' : '') + '</span></div>' +
        (phE ? '<button class="btn sm phey' + (po.hide ? ' off' : '') + '" data-phhide="' + esc(s.id) + '"><ha-icon class="s16" icon="' + (po.hide ? 'mdi:eye-off-outline' : 'mdi:eye-outline') + '"></ha-icon>' + t(po.hide ? 'phHidden' : 'phShown') + '</button>' : '<span class="cb">' + colName(s) + '</span>') + '</div>';
    }).join('') + '</div>' + (phE ? '<div class="hint">' + t('phOrderT') + (this._phOrd(tab) ? ' <button class="btn sm" data-a="phresord">' + t('phReset') + '</button>' : '') + '</div>' : '')
      : '<div class="empty">' + t('noSec') + '</div>';
    // Düzenlenen: Tablet / Telefon (önizleme ekranıyla aynı seçim)
    const phCnt = (() => { const S0 = this._phOv().secs, O0 = this._phOv().order; let n = 0; if (lhdIsObj(S0)) Object.keys(S0).forEach((k) => { n += Object.keys(S0[k] || {}).length; }); if (lhdIsObj(O0)) n += Object.keys(O0).length; const TB = this._phTabs(); ['hide', 'names', 'icons'].forEach((k) => { if (lhdIsObj(TB[k])) n += Object.keys(TB[k]).length; }); if (Array.isArray(TB.order)) n++; n += Object.keys(this._phStyle()).filter((k) => k !== 'background').length; const L0 = this._phOv().lights; if (L0 === 'tiles' || L0 === 'rows') n++; return n; })();
    const edMode = '<div class="edm' + (phE ? ' ph' : '') + '"><span class="lb">' + t('edMode') + '</span><div class="seg"><button data-edm="tab"' + (phE ? '' : ' class="on"') + '><ha-icon class="s16" icon="mdi:tablet"></ha-icon>' + t('edTab') + '</button><button data-edm="ph"' + (phE ? ' class="on"' : '') + '><ha-icon class="s16" icon="mdi:cellphone"></ha-icon>' + t('edPh') + '</button></div>' +
      (phCnt ? '<span class="phc">' + t('phCount', { n: phCnt }) + '</span>' : '') + '</div>' + (phE ? '<div class="phban"><ha-icon class="s16" icon="mdi:cellphone"></ha-icon><span>' + t('phBanner') + '</span></div>' : '');

    const ins = '<div class="ins"><div class="sc">' +
      edMode + (phE ? this._phLookHtml() : '') + '<h3>' + t('sections') + '<span class="grow"></span>' + (phE ? '' : '<button class="btn sm" data-a="addsec"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addSec') + '</button>') + '</h3>' + secList +
      (sec ? (phE ? this._secEditorPh(tab, sec) : this._secEditor(tab, sec, ncols)) : '') +
      (this._isAuto() ? '<div class="hint">' + t('autoT') + ' <button class="btn sm" data-a="autokur"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('akT') + '</button></div>' : '') + '<div class="hint">' + t('editNote') + '</div></div></div>';

    const scr = this._screenKey();
    const pv = '<div class="pvw"><div class="pvh"><ha-icon class="s16" icon="mdi:eye-outline"></ha-icon><b>' + t('preview') + '</b><span class="pvhint">· ' + t('pvHint') + '</span>' +
      '<div class="seg">' + LHD_SCREENS.filter((x) => x[0] !== 'custom' || this._adv() || scr === 'custom').map((x) => '<button data-scr="' + x[0] + '"' + (x[0] === scr ? ' class="on"' : '') + '>' + t('scr_' + x[0]) + '</button>').join('') + '</div>' +
      (scr === 'custom' ? (() => { const c = lhdCustomScr(); return '<span class="scrc" title="' + t('scrCustT') + '"><input class="inp" type="number" min="200" max="8000" data-scrw value="' + c[0] + '">×<input class="inp" type="number" min="200" max="8000" data-scrh value="' + c[1] + '"></span>'; })() : '') +
      (this._scrPh(scr) && this._hasFolds() ? '<button class="btn sm pvfold' + (this._pvFoldsOn() ? ' on' : '') + '" data-a="pvfolds" title="' + t('pvFoldsT') + '"><ha-icon class="s16" icon="' + (this._pvFoldsOn() ? 'mdi:arrow-collapse-vertical' : 'mdi:arrow-expand-vertical') + '"></ha-icon>' + t('pvFolds') + '</button>' : '') +
      '<button class="btn ic pvundo" data-a="undo" title="' + t('undoK') + '"' + (this._undo.length ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:undo"></ha-icon></button>' +
      '<button class="btn ic pvundo" data-a="redo" title="' + t('redoK') + '"' + (this._redo && this._redo.length ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:redo"></ha-icon></button></div><div class="pvbox"><div class="pvc"></div></div></div>';

    // yeniden çizimde odaktaki alan ve imleç korunur
    const act = R.activeElement, keyOf = (el) => { if (!el || !el.getAttribute) return null; const n = ['data-f', 'data-if', 'data-sf', 'data-q', 'data-bgurl', 'data-imf', 'data-enf', 'data-enst', 'data-encf', 'data-enq'].filter((k) => el.hasAttribute(k))[0]; return n ? '[' + n + (el.getAttribute(n) ? '="' + el.getAttribute(n) + '"' : '') + ']' : null; };
    const focusKey = keyOf(act), selS = act && act.selectionStart, selE = act && act.selectionEnd;
    // LEC kuruluysa bir kez: efektlerin nerede olduğunu anlatan bilgi kutusu ("Tamam" deyince kaybolur)
    const st0 = this._settings();
    const lecInfo = LEC.installed(this._hass) && !st0.lec_seen ? '<div class="lecinfo" data-lecinfo><ha-icon icon="mdi:creation"></ha-icon><div class="t"><b>' + t('lecInfoT') + '</b><span>' + t('lecInfo') + '</span></div>' +
      '<button class="btn sm" data-a="settings">' + t('settings') + '</button><button class="btn sm pri" data-a="lecok">' + t('ok') + '</button></div>' : '';
    // yeniden çizimde kaydırma yerleri korunsun (ayarlarda bir şey değişince pencere başa atlamasın)
    const SCR = ['.app', '.akr2', '.enm', '.enddb', '.ov .db', '.dock .db', '.ins .sc', '.main', '.rooms', '.plist', '.ilist'], scrKeep = {};
    // cihaz formunda yazılmakta olan alan henüz taslağa geçmediyse (change gelmedi) yeniden çizimde silinmesin
    if (act && act.hasAttribute && act.hasAttribute('data-enf') && this._enE && act.tagName !== 'SELECT') this._enE.f[act.getAttribute('data-enf')] = act.value;
    SCR.forEach((q) => { const el = R.querySelector(q); if (el && (el.scrollTop || el.scrollLeft)) scrKeep[q] = [el.scrollTop, el.scrollLeft]; });
    // Ayarlar önizlemenin üstünü kapatmaz: sağdaki panelin yerinde açılır, önizleme değişiklikleri canlı gösterir
    let modal = this._modalHtml(tabs, tab, sec), dock = '';
    const OV = '<div class="ov" data-ovl><div class="dlg sm sset">';
    if (this._modal === 'settings' && modal.indexOf(OV) === 0) { dock = '<div class="dlg sm sset dock">' + modal.slice(OV.length, modal.length - 6); modal = ''; }
    R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app' + (narrow ? ' narrowv' : '') + (dock ? ' docked' : '') + (this._narrow ? ' hanarrow' : '') + '">' + top + lecInfo +
      '<div class="rblock">' + rooms + rpanel + '</div><div class="main">' + pv + (dock || ins) + '</div>' +
      this._menuHtml() + modal + this._helpHtml() +
      '<div class="toast"><span></span><button data-a="undo">' + t('undo') + '</button></div></div>';

    Object.keys(scrKeep).forEach((q) => { const el = R.querySelector(q); if (el) { el.scrollTop = scrKeep[q][0]; el.scrollLeft = scrKeep[q][1]; } });
    // menü ekranın altından taşmasın: sığmıyorsa yukarı kayar, yine sığmazsa kendi içinde kayar (v0.32)
    Array.prototype.forEach.call(R.querySelectorAll('.menu'), (m) => {
      const vh = window.innerHeight, need = Math.min(m.scrollHeight + 2, vh - 16), b = m.getBoundingClientRect();
      m.style.maxHeight = need + 'px';
      if (b.top + need > vh - 8) m.style.top = Math.max(8, (parseFloat(m.style.top) || 0) - (b.top + need - (vh - 8))) + 'px';
    });
    this._mountPreview(tab, sec);
    this._histSync();
    if (this._modal === 'auto') this._akMount();
    this._ceMount();
    this._bind(tabs, tab, sec);
    if (focusKey) { const el = R.querySelector(focusKey); if (el && el.focus) { el.focus(); try { if (selS !== null && selS !== undefined) el.setSelectionRange(selS, selE); } catch (x) {} } }
  }

  // telefon görünümü: Stil seç'in telefon adımı (gezinme, ışıklar, ışık penceresi) ve telefona özel zemin, simge stili, iklim kartları
  _phLookHtml() {
    const t = (k, v) => esc(this._t(k, v));
    const pc = lpPhoneCfg(), st = this._phStyle();
    const PHK = { 'data-phst="icon_style"': 'icon_style', 'data-phst="climate_style"': 'clim', 'data-phset="nav"': 'phone.nav', 'data-phset="lights"': 'phone.lights' };
    const seg = (attr, cur, opts) => lhdSegX((v) => attr + ' data-v="' + esc(v) + '"', cur, opts.map((o) => (o[0] === '' && attr.indexOf('data-phst') === 0 ? [o[0], o[1], o[2], lhdThSame()] : o)), PHK[attr]);
    const own = (on) => (on ? ' <i class="phb">' + t('phOwn') + '</i>' : '');
    const bgk = st.bg && st.bg.mode === 'fx' ? 'fx:' + st.bg.fx : st.bg && st.bg.mode ? st.bg.mode : '';
    const sw = '<div class="phbgs"><button class="phsw same' + (bgk ? '' : ' on') + '" data-phbg="" title="' + t('phStSame') + '">' + t('phStSame') + '</button>' +
      '<button class="phsw' + (bgk === 'dark' ? ' on' : '') + '" data-phbg="dark" style="background:#0b0e15" title="' + t('phDark') + '"></button>' +
      '<button class="phsw' + (bgk === 'black' ? ' on' : '') + '" data-phbg="black" style="background:#000" title="' + t('phBlack') + '"></button>' +
      LP_BG_FX.map((f) => '<button class="phsw' + (bgk === 'fx:' + f[0] ? ' on' : '') + '" data-phbg="fx:' + f[0] + '" style="background:' + lpFxSwatch(f[3]) + '" title="' + esc(this._lang === 'tr' ? f[1] : f[2]) + '"></button>').join('') + '</div>';
    const P0 = this._phOv(), any = ['secs', 'order', 'tabs', 'style'].some((k) => lhdIsObj(P0[k]) && Object.keys(P0[k]).length) || P0.lights === 'tiles' || P0.lights === 'rows' || P0.flat === true;
    // normalde sağında "Aynı yap" düğmesi; basınca soru ve iki açık düğme: Evet, sil / Vazgeç
    const same = this._ask === 'phresall'
      ? '<div class="phsame ask"><ha-icon icon="mdi:alert-outline"></ha-icon><span><b>' + t('phSameAsk') + '</b><i>' + t('phSameT') + '</i>' +
        '<span class="phsq"><button class="btn sm phyes" data-a="phresall"><ha-icon class="s16" icon="mdi:delete-outline"></ha-icon>' + t('phSameYes') + '</button><button class="btn sm" data-a="phresno">' + t('phSameNo') + '</button></span></span></div>'
      : '<div class="phsame' + (any ? '' : ' none') + '"><ha-icon icon="mdi:tablet-cellphone"></ha-icon><span><b>' + t(any ? 'phSame' : 'phSameNone') + '</b>' + (any ? '<i>' + t('phSameT') + '</i>' : '') + '</span>' +
        (any ? '<button class="btn sm phgo" data-a="phresall">' + t('phSameGo') + '</button>' : '') + '</div>';
    return same + '<details class="phlook"' + (this._phLookOpen ? ' open' : '') + '><summary data-phlk><span class="phli"><ha-icon icon="mdi:cellphone-cog"></ha-icon></span><span class="phlt"><b>' + t('phLookT') + '</b><i>' + t('phLookS') + '</i></span></summary>' +
      '<div class="fld"><label>' + t('phNav') + '</label>' + seg('data-phset="nav"', pc.nav, [['cats', this._t('phCats')], ['rooms', this._t('phRooms')], ['top', this._t('phTop')]]) + '</div>' +
      '<div class="fld"><label>' + t('phLights') + '</label>' + seg('data-phset="lights"', pc.lights, [['auto', this._t('phLAuto')], ['tiles', this._t('phLTiles')], ['rows', this._t('phLRows')]]) + '</div>' +
      '<div class="fld"><label>' + t('phFlat') + '</label>' + seg('data-phset="flat"', pc.flat ? '1' : '0', [['0', this._t('phFlat0')], ['1', this._t('phFlat1')]]) + '<div class="hint">' + t('phFlatT') + '</div></div>' +
      '<div class="fld"><label>' + t('phSheet') + '</label>' + seg('data-phset="sheet"', pc.sheet ? '1' : '0', [['1', this._t('akSheetOn')], ['0', this._t('akSheetOff')]]) + '</div>' +
      ((this._adv() || st.icon_style) ? '<div class="fld"><label>' + t('phIcons') + own(!!st.icon_style) + '</label>' + seg('data-phst="icon_style"', st.icon_style || '', [['', this._t('phStSame')], ['auto', this._t('icAuto')], ['full', this._t('icColor')], ['mono', this._t('icFlat')], ['tint', this._t('icTint')]]) + '</div>' : '') +
      ((this._adv() || st.climate_style) ? '<div class="fld"><label>' + t('phClim') + own(!!st.climate_style) + '</label>' + seg('data-phst="climate_style"', st.climate_style || '', [['', this._t('phStSame')], ['halo', this._t('clHalo')], ['rows', this._t('clRows')]]) + '</div>' : '') +
      ((this._adv() || st.bg) ? '<div class="fld"><label>' + t('phBg') + own(!!st.bg) + '</label>' + sw + '</div>' : '') + '</details>';
  }

  // telefona özel bölüm ayarları: görünüm, satırdaki karo, telefonda görünen öğeler; ortak ayarlar burada değişmez
  _secEditorPh(tab, s) {
    const t = (k, v) => esc(this._t(k, v));
    const o = this._phSec(s.id), kinds = lhdKinds(s), list = s.entities || [];
    const badge = (on) => (on ? ' <i class="phb">' + t('phOwn') + '</i>' : '');
    let h = '<div class="ed phed"><div class="pht"><b>' + esc(s.title || this._t('t_' + (LHD_TYPES[s.type] ? s.type : 'free'))) + '</b><span>' + t('edPh') + '</span>' +
      (Object.keys(o).length ? '<button class="btn sm" data-a="phressec">' + t('phReset') + '</button>' : '') + '</div>';
    if (o.hide) return h + '<div class="hint">' + t('phHiddenSec') + '</div></div>';
    if (kinds.tile) {
      h += '<div class="fld"><label>' + t('phLook') + badge(!!o.look) + '</label>' + lhdSegX((v) => 'data-phlook="' + v + '"', o.look || '', [['', this._t('phLookSame'), '', lhdThSame()], ['tiles', this._t('phLookTiles')], ['rows', this._t('phLookRows')], ['rows2', this._t('phLookRows2')]], 'phlook') + '</div>';
      if (o.look !== 'rows' && o.look !== 'rows2' && (this._adv() || o.cols)) h += '<div class="fld"><label>' + t('phCols') + badge(!!o.cols) + '</label>' + lhdSegX((v) => 'data-phcols="' + v + '"', +o.cols || 0, [0, 2, 3, 4, 5].map((n) => [n, n ? String(n) : this._t('phColsAuto'), '', n ? lhdTh('cols:' + n) : lhdThSame()]), 'cols') + '</div>';
    }
    if (list.length) {
      const hid = Array.isArray(o.hide_items) ? o.hide_items : [], FL = Array.isArray(o.folds) ? o.folds.filter(lhdIsObj) : [];
      const S = this._hass.states;
      const nm = (raw) => { const it = typeof raw === 'string' ? { entity: raw } : raw || {}; if (it.name) return it.name; if (it.subtitle) return it.subtitle; if (it.entity) return this._ename(it.entity); if (it.pet) { const P = ((STORE.data && STORE.data.pets) || {})[it.pet] || {}; return P.name || it.pet; } if (it.energy) return lpEnT(this._lang, 'k_' + it.energy); if (it.card) return String(it.card.title || it.card.type || '?'); return '?'; };
      const icoOf = (raw) => { const it = typeof raw === 'string' ? { entity: raw } : raw || {}; return it.entity && S[it.entity] ? lpIcon(lpEntIcon(S[it.entity], it.icon), 's16') : lpIcon(it.icon || (it.subtitle ? 'mdi:format-header-pound' : 'mdi:circle-small'), 's16'); };
      const ordered = lhdOrderBy(list.map((raw, i) => ({ raw: raw, i: i })), o.item_order, (x) => lhdItemKey(x.raw));
      const grpOf = (k) => { for (let j = 0; j < FL.length; j++) if (Array.isArray(FL[j].items) && FL[j].items.indexOf(k) >= 0) return j; return -1; };
      const gName = (j) => (FL[j] && FL[j].name) || this._t('phFoldN', { n: j + 1 });
      h += '<div class="fld"><label>' + t('phItems') + badge(hid.length > 0 || (Array.isArray(o.item_order) && o.item_order.length > 0)) + '</label><div class="phits">' + ordered.map((q) => { const raw = q.raw, i = q.i;
        const k = lhdItemKey(raw), off = hid.indexOf(k) >= 0, gj = grpOf(k);
        return '<button class="phit' + (off ? ' off' : '') + '" data-phitem="' + i + '">' + icoOf(raw) + '<span>' + esc(nm(raw)) + '</span>' + (gj >= 0 && !off ? '<i class="phgt">' + esc(gName(gj)) + '</i>' : '') + '</button>';
      }).join('') + '</div><div class="hint">' + t('phItemsT') + ' ' + t('phItemsDrag') + '</div></div>';
      // katlanır gruplar (v0.29): her grup bir kart; adı, simgesi ve içine alınacak öğeler (kutucuk). Bir öğe tek grupta olabilir
      h += '<div class="fld"><label>' + t('phFolds') + badge(FL.length > 0) + '</label><div class="hint" style="margin:0 0 8px">' + t('phFoldsT') + '</div>' +
        FL.map((g, gj) => { const its = Array.isArray(g.items) ? g.items : [];
          return '<div class="phfg"><div class="phfgh"><div class="iconin"><div class="pv">' + lpIcon(g.icon || 'mdi:chevron-down-box-outline') + '</div></div>' +
            '<input class="inp" data-phgn="' + gj + '" value="' + esc(g.name || '') + '" placeholder="' + esc(this._t('phFoldPh')) + '" maxlength="40">' +
            '<button class="btn sm ic" data-ip="phfold:' + gj + '" title="' + t('iconPick') + '"><ha-icon class="s16" icon="mdi:shape-outline"></ha-icon></button>' +
            '<button class="btn sm ic dan" data-phgdel="' + gj + '" title="' + t('phFoldDel') + '"><ha-icon class="s16" icon="mdi:delete-outline"></ha-icon></button></div>' +
            '<div class="phfgs">' + t('phFoldPick', { n: its.length }) + '</div><div class="phfgl">' + ordered.map((q) => { const k = lhdItemKey(q.raw), on = its.indexOf(k) >= 0, oj = on ? -1 : grpOf(k);
              return '<button class="phfi' + (on ? ' on' : '') + (oj >= 0 ? ' dis' : '') + '" data-phgit="' + gj + ':' + q.i + '"' + (oj >= 0 ? ' disabled' : '') + '><ha-icon class="s16 ck" icon="' + (on ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline') + '"></ha-icon>' + icoOf(q.raw) + '<span>' + esc(nm(q.raw)) + '</span>' + (oj >= 0 ? '<i>' + esc(gName(oj)) + '</i>' : '') + '</button>';
            }).join('') + '</div></div>';
        }).join('') + '<button class="btn sm" data-a="phgadd"><ha-icon class="s16" icon="mdi:plus"></ha-icon> ' + t('phFoldAdd') + '</button></div>';
    }
    return h + '<div class="hint">' + t('phShared') + '</div></div>';
  }

  _secEditor(tab, s, ncols) {
    const t = (k, v) => esc(this._t(k, v));
    const S = this._hass.states;
    const ci = Math.min(s.col || 0, ncols - 1), nsub = lpSplits(tab, ncols)[ci];
    const subSeg = nsub > 1 ? '<div class="fld" style="flex:0 0 auto"><label>' + t('sub') + '</label><div class="seg">' + Array.apply(null, Array(nsub)).map((x, j) => '<button data-ssub="' + j + '"' + (Math.min(s.sub || 0, nsub - 1) === j ? ' class="on"' : '') + '>' + (j + 1) + '</button>').join('') + '</div></div>' : '';
    const colSeg = '<div class="seg">' + Array.apply(null, Array(ncols)).map((x, c) => '<button data-scol="' + c + '"' + (Math.min(s.col || 0, ncols - 1) === c ? ' class="on"' : '') + '>' + esc(this._colName(c, ncols)) + '</button>').join('') + '</div>';
    let body = '';
    const handle = '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span>';
    // her öğenin sağında: ayarlar (ad, simge, dokununca, koşul...) ve sil
    const xBtn = (i) => '<button class="x" data-im="' + i + '" title="' + t('imT') + '"><ha-icon class="s16" icon="mdi:cog-outline"></ha-icon></button><button class="x" data-del="' + i + '" title="×"><ha-icon class="s16" icon="mdi:close"></ha-icon></button>';
    const cond = (it) => (it && typeof it === 'object' && it.visible && it.visible.entity ? ' · <b class="cnd">' + t('cond') + '</b>' : '') +
      (!this._adv() && lhdItemAdv(it) ? ' · <b class="advb">' + t('advTag') + '</b>' : '');
    const iconField = (i, cur, ph) => '<div class="sub"><input class="inp" data-if="' + i + '.icon" value="' + esc(cur || '') + '" placeholder="' + esc(ph) + '" style="height:28px;font-size:12px"><button class="btn sm ic ipb" data-ip="item:' + i + '" title="' + t('iconPick') + '"><ha-icon class="s14" icon="mdi:shape-outline"></ha-icon></button></div>';
    const temps = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'temperature');
    const hums = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'humidity');
    const sel = (i, key, list, cur) => '<select class="inp" data-if="' + i + '.' + key + '"><option value="">' + t('fromDevice') + '</option>' +
      list.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
    const list = s.entities || [];
    // her öğe kendi türüne göre düzenlenir: düğmede renk, simge ve ne çalıştırdığı; karoda ad ve simge; iklimde sensörler
    body = list.length ? '<div class="items" data-dl="items">' + list.map((raw, i) => {
      const k = lhdKind(raw), it = typeof raw === 'string' ? { entity: raw } : raw;
      if (k === 'sub') {
        return '<div class="it" data-di>' + handle + '<div class="ico">' + lpIcon('mdi:format-header-pound') + '</div><div class="col"><input class="inp" data-if="' + i + '.subtitle" value="' + esc(it.subtitle) + '" placeholder="' + t('subText') + '">' +
          '<span class="eid">' + t('subItem') + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      if (k === 'pet') {
        const P = ((STORE.data && STORE.data.pets) || {})[it.pet] || {};
        return '<div class="it" data-di>' + handle + '<div class="ico">' + lpIcon(P.icon || LP_PET_KINDS[P.kind] || 'mdi:paw') + '</div><div class="col"><b class="cty">' + esc(P.name || it.pet) + '</b>' +
          '<span class="eid">' + t('petItem') + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      if (k === 'energy') {
        return '<div class="it" data-di>' + handle + '<div class="ico">' + lpIcon(LP_EN_IC[it.energy] || 'mdi:lightning-bolt') + '</div><div class="col"><b class="cty">' + esc(lpEnT(this._lang, 'k_' + it.energy)) + '</b>' +
          '<span class="eid">' + t('enItem') + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      if (k === 'card') {
        return '<div class="it" data-di>' + handle + '<div class="ico">' + lpIcon('mdi:card-text-outline') + '</div><div class="col"><b class="cty">' + t('cardItem') + ': ' + esc(String(it.card.type || '?')) + '</b>' +
          '<span class="eid">' + esc(it.card.title || it.card.entity || '') + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      if (k === 'scene' && !it.entity) {
        return '<div class="it" data-di>' + handle +
          '<input type="color" data-if="' + i + '.color" value="' + esc(it.color || '#5B8DEF') + '">' +
          '<div class="ico">' + lpIcon(it.icon || 'mdi:play', '', 'color:' + esc(it.color || '#5B8DEF')) + '</div>' +
          '<div class="col"><input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + t('name') + '">' +
          iconField(i, it.icon, 'mdi:play') + '<span class="eid">' + this._scTarget(tab, it) + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      const st = it.entity ? S[it.entity] : null;
      const ico = it.entity ? lpIcon(lpEntIcon(this._hass.states[it.entity], it.icon)) : lpIcon(it.icon || 'mdi:lightbulb');
      let extra = '';
      if (k === 'tile' || k === 'ph' || k === 'scene' || k === 'value') extra = iconField(i, it.icon, this._t('icon') + ' (mdi:...)');
      if (k === 'climate') {
        const sel2 = (key, opts, cur, none, title) => '<select class="inp" data-if="' + i + '.' + key + '" title="' + esc(title) + '"><option value="">' + esc(none) + '</option>' +
          opts.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
        const climates = Object.keys(S).filter((id) => id.indexOf('climate.') === 0 && id !== it.entity);
        extra = '<div class="sub">' + sel(i, 'temperature_sensor', temps, it.temperature_sensor) + sel(i, 'humidity_sensor', hums, it.humidity_sensor) + '</div>' +
          '<div class="sub">' + sel2('outdoor_sensor', temps, it.outdoor_sensor, this._t('noOutdoor'), this._t('outdoorT')) + sel2('link', climates, (it.entities || [])[0], this._t('noLink'), this._t('linkT')) + '</div>' +
          '<div class="sub"><select class="inp" data-if="' + i + '.kind">' + ['auto', 'ac', 'radiator'].map((x) => '<option value="' + x + '"' + ((it.kind || 'auto') === x ? ' selected' : '') + '>' + t('k_' + x) + '</option>').join('') + '</select></div>';
      }
      return '<div class="it' + (it.entity ? '' : ' ph') + '" data-di>' + handle + '<div class="ico">' + ico + '</div><div class="col">' +
        '<input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + esc(it.entity ? this._ename(it.entity) : this._t('name')) + '">' + extra +
        '<span class="eid">' + esc(it.entity ? it.entity + (st ? '' : ' · ?') : this._t('addPh')) + cond(it) + '</span></div>' + xBtn(i) + '</div>';
    }).join('') + '</div>' : '<div class="empty">' + t('noItems') + '</div>';
    body += '<div class="acts"><button class="btn sm" data-a="pick"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addDev') + '</button>' +
      (!this._adv() ? '' : '<button class="btn sm dash" data-a="addph"><ha-icon class="s16" icon="mdi:square-rounded-outline"></ha-icon>' + t('addPh') + '</button>' +
      '<button class="btn sm dash" data-a="addscph"><ha-icon class="s16" icon="mdi:gesture-tap"></ha-icon>' + t('addScPh') + '</button>') +
      (!this._adv() ? '' : '<button class="btn sm dash" data-a="addsub" title="' + t('addSubT') + '"><ha-icon class="s16" icon="mdi:format-header-pound"></ha-icon>' + t('addSub') + '</button>') +
      '<button class="btn sm dash" data-a="addpet" title="' + t('addPetT') + '"><ha-icon class="s16" icon="mdi:paw"></ha-icon>' + t('addPet') + '</button>' +
      '<button class="btn sm dash" data-a="addenergy" title="' + t('addEnT') + '"><ha-icon class="s16" icon="mdi:lightning-bolt"></ha-icon>' + t('addEn') + '</button>' +
      ('<button class="btn sm dash" data-a="addcard" title="' + t('addCardT') + '"><ha-icon class="s16" icon="mdi:card-text-outline"></ha-icon>' + t('addCard') + '</button>') +
      (LEC.installed(this._hass) ? '<button class="btn sm" data-a="addlec"><ha-icon class="s16" icon="mdi:creation"></ha-icon>' + t('lecOpen') + '</button>' : '') + '</div>';
    // karo görünümü: bölümde karo varsa (ya da bölüm boşsa) gösterilir
    const kinds = lhdKinds(s), tilesHere = !!kinds.tile || !list.length;
    const thIts = this._thItems(list);
    const lookHtml = tilesHere ? '<div class="fld"><label>' + t('look') + '</label>' + lhdSegX((v) => 'data-look="' + v + '"', s.look || 'tile', [['tile', 'lookTile'], ['bar', 'lookBar'], ['phone', 'lookPhone']].map((x) => [x[0], this._t(x[1]), this._t(x[1] + 'T'), lhdThLook(x[0], thIts)])) + '</div>' +
      '<div class="row2">' + (s.look !== 'bar' ? '<div class="fld" style="flex:0 0 auto"><label>' + t('tileCols') + '</label><div class="seg">' + [2, 3, 4, 5, 6].map((n) => '<button data-tc="' + n + '"' + ((s.tile_columns || 5) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') +
      (s.look === 'bar' || s.look === 'phone' ? '<div class="fld" style="flex:0 0 auto"><label>' + t('barCols') + '</label><div class="seg">' + [1, 2, 3].map((n) => '<button data-bc="' + n + '"' + ((s.bar_columns || ((kinds.tile || 0) > 12 ? 3 : 2)) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') + '</div>' : '';
    const camHtml = kinds.camera ? '<div class="fld"><label title="' + t('camColsT') + '">' + t('camCols') + '</label><div class="seg">' + [0, 1, 2, 3, 4].map((n) => '<button data-cc="' + n + '"' + ((+s.cam_columns || 0) === n ? ' class="on"' : '') + '>' + (n ? n : t('camAuto')) + '</button>').join('') + '</div></div>' +
      '<div class="fld"><label>' + t('camRefS') + '</label><div class="seg">' + [[5, '5 sn'], [0, '10 sn'], [30, '30 sn'], [60, '1 dk']].map((o) => '<button data-cr="' + o[0] + '"' + ((+s.cam_refresh || 0) === o[0] ? ' class="on"' : '') + '>' + esc(this._lang === 'tr' ? o[1] : o[1].replace('sn', 's').replace('dk', 'min')) + '</button>').join('') + '</div><div class="hint">' + t('camRefST') + '</div></div>' : '';
    return '<div class="ed"><div class="row2"><div class="fld"><label>' + t('secTitle') + '</label><input class="inp" data-f="sec.title" value="' + esc(s.title || '') + '" placeholder="' + t('titleOpt') + '"></div>' +
      (tab.layout === 'grid' ? '' : '<div class="fld" style="flex:0 0 auto"><label>' + t('column') + '</label>' + colSeg + '</div>' + subSeg) + '</div>' +
      lookHtml + camHtml + (this._adv() ? this._secBoxHtml(s) : '') + body + '<div class="acts"><span class="grow"></span><button class="btn sm dan' + (this._ask === 'delsec' ? ' ask' : '') + '" data-a="delsec"><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'delsec' ? t('sure') : t('delSec')) + '</button></div></div>';
  }

  // Basit / Gelişmiş mod (tarayıcıya göre; varsayılan basit). Basit modda gelişmiş ayarlar gizlenir, silinmez.
  _adv() { try { return localStorage.getItem('lhd-admin-mode') === 'adv'; } catch (e) { return false; } }
  // ? yardım düğmesi ve penceresi
  _hb(key) { return LHD_HELP[key] ? '<button class="hlp" data-help="' + key + '" title="' + esc(this._t('helpT')) + '">?</button>' : ''; }
  _helpHtml() {
    const h = this._help && LHD_HELP[this._help]; if (!h) return '';
    const L = h[this._lang] || h.en;
    return '<div class="hlpov" data-hlpov><div class="hlpd"><div class="dh"><div class="di"><ha-icon icon="mdi:help-circle-outline"></ha-icon></div><h2>' + esc(L[0]) + '</h2><button class="btn ic" data-hlpx><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="hb">' + L.slice(1).map((p) => '<p>' + esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') + '</p>').join('') + '</div></div></div>';
  }

  // bölümün kutu ayarları: doldurma (içeriğe göre / kutuyu doldur) ve hizalama (üst / orta / eşit dağıt)
  _secBoxHtml(s) {
    const t = (k) => esc(this._t(k));
    const seg = (attr, cur, opts) => lhdSegX((v) => attr + '="' + v + '"', cur, opts, { 'data-sfill': 'fill', 'data-salign': 'align', 'data-sgap': 'gap' }[attr]);
    return '<div class="row2"><div class="fld" style="flex:1 1 100%"><label>' + t('fillL') + this._hb('fill') + '</label>' + seg('data-sfill', s.fill ? '1' : '', [['', this._t('fillC')], ['1', this._t('fillF'), this._t('fillT')]]) + '</div>' +
      (s.fill ? '' : '<div class="fld" style="flex:1 1 100%"><label>' + t('alignL') + '</label>' + seg('data-salign', s.align === 'center' || s.align === 'spread' ? s.align : '', [['', this._t('alTop')], ['center', this._t('alCenter')], ['spread', this._t('alSpread')]]) + '</div>') +
      '<div class="fld" style="flex:1 1 100%"><label>' + t('gapL') + '</label>' + seg('data-sgap', typeof s.gap === 'number' ? String(s.gap) : '', [['', this._t('gapAuto')], ['0', '0'], ['6', '6'], ['12', '12'], ['18', '18'], ['24', '24']]) + '</div></div>';
  }

  // ---- Enerji sayfası (üst çubukta Enerji): özet, veri kaynağı, fiyat ve tarife, faturalar, tahmini cihazlar, görünüm ----
  // Ayarlar settings.energy'de (src/energy.js başındaki açıklama), tahmini cihazlar data.estimates'te (entegrasyon sensörlerini kurar).
  _enOpen(view) {
    this._modal = 'energy'; this._menu = null; this._env = view || this._env || 'sum';
    if (!this._enU) this._enU = lpEnSub(() => { if (this._modal === 'energy') this._render(); });
    this._enKey = JSON.stringify([lpEnMeter(), lpEnSolar(), lpEnCfg().price_mode || '']);
    LP_EN.at = 0; lpEnEnsure(this._hass);
    this._lrnStartPoll();
    this._render();
  }
  _enEsts() { const E = STORE.data && STORE.data.estimates; return lhdIsObj(E) ? E : {}; }
  _enPage() {
    // v0.28.8: Görünüm ve Veri kaynağı tek sayfa (ikisi de dörder satırdı); eski 'src' bağlantıları bu sayfaya
    const t = (k, v) => esc(this._t(k, v)), V = this._env === 'est' ? 'dev' : this._env === 'src' ? 'look' : this._env || 'sum', L = this._lang;
    const nav = [['sum', 'mdi:view-dashboard-outline'], ['dev', 'mdi:power-plug-outline'], ['cat', 'mdi:shape-outline'], ['meter', 'mdi:meter-electric-outline'], ['solar', 'mdi:solar-power-variant-outline'], ['tariff', 'mdi:cash'], ['bill', 'mdi:file-document-outline'], ['tips', 'mdi:lightbulb-on-outline'], ['imp', 'mdi:import'], ['look', 'mdi:eye-outline']];
    const cnt = { bill: lpEnBills().length, dev: Object.keys(this._enEsts()).length, cat: this._enCats().length };
    const list = nav.map((n) => '<button class="gli' + (V === n[0] ? ' on' : '') + '" data-env="' + n[0] + '"><ha-icon class="s16" icon="' + n[1] + '"></ha-icon><span style="flex:1">' + t('en_' + n[0]) + '</span>' + (cnt[n[0]] ? '<span class="gno">' + cnt[n[0]] + '</span>' : '') + '</button>').join('');
    const body = V === 'tariff' ? this._enTariff() : V === 'bill' ? this._enBill() : V === 'dev' ? this._enDev() : V === 'cat' ? this._enCat() : V === 'meter' ? this._enMeterV() : V === 'solar' ? this._enSolarV() : V === 'tips' ? this._enTipsV() : V === 'imp' ? this._enImpV() : V === 'look' ? this._enLook() + '<div class="ensep"></div>' + this._enSrc() : this._enSum();
    return '<div class="ov" data-ovl><div class="dlg guide enpg"><div class="dh"><div class="di"><ha-icon icon="mdi:lightning-bolt"></ha-icon></div><h2>' + t('enPage') + '</h2>' +
      '<button class="btn ic" data-a="close" style="margin-left:auto"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="gbody"><div class="glist enl">' + list + '</div><div class="gmain enm"><div class="ennav">' + nav.map((n) => '<button class="' + (V === n[0] ? 'on' : '') + '" data-env="' + n[0] + '">' + t('en_' + n[0]) + '</button>').join('') + '</div>' + body + '</div></div></div></div>' + this._lrnHtml();
  }
  _enNum(v, d) { return lpEnNum(v, d || 0, this._lang); }
  _enCur() { return lpEnMoney(this._hass, 1, this._lang).replace(/[\d.,\s\u00a0]/g, '') || ''; }
  _enTl(v) { return lpEnMoney(this._hass, v, this._lang); }
  _enSum() {
    const t = (k, v) => esc(this._t(k, v)), M = LP_EN.m, S = this._hass.states;
    const row = (v, title, val, pill) => '<button class="ensr" data-env="' + v + '"><span><b>' + esc(title) + '</b><i>' + esc(val) + '</i></span>' + (pill || '') + '<ha-icon class="s16" icon="mdi:chevron-right"></ha-icon></button>';
    const pill = (x, c) => '<em class="enp' + (c ? ' ' + c : '') + '">' + esc(x) + '</em>';
    if (!M) return '<h3 class="enh">' + t('en_sum') + '</h3><div class="hint">' + t('enLoading') + '</div>';
    const mk = lpEnMonthKwh(M), u = lpEnUnit(M), mc = M.days ? lpEnMonthCost(mk, lpEnMonthDays(), M) : null, mode = lpEnMode();
    const yk = lpEnYear(M), yl = lpEnYearLimit(), b = lpEnLastBill(), E = this._enEsts(), ek = Object.keys(E), nm = ek.filter((k) => E[k].kind === 'meas').length;
    const ew = ek.reduce((a, k) => a + (this._enDevNetW(k, E[k]) || 0), 0), C = this._enCats(), sol = lpEnSolar(), F = lpEnFlowNow(S), tips = lpEnTips(this._hass, M, this._lang), nf = this._enFound().length;
    return '<h3 class="enh">' + t('en_sum') + '</h3><p class="enlead">' + t('enSumT') + '</p><div class="ensl">' +
      row('tariff', this._t('enSMonth'), M.days ? this._enNum(mk) + ' kWh' + (u ? ' · ' + this._enTl(mc.tl) : '') : '–',
        mode === 'tou' ? pill(this._t('enChTou')) : mode === 'tier' && mc ? pill(this._t(mc.hi > 0 ? 'enHigh' : 'enLow'), mc.hi > 0 ? 'w' : 'ok') : pill(u ? (mode === 'bill' ? this._t('enPrBill') : this._t('enPrSingle')) + ' · ' + this._enNum(u, 2) + ' ' + this._enCur() + '/kWh' : this._t('enPriceNone'))) +
      row('tariff', this._t('enSYear'), yk ? this._enNum(yk) + ' / ' + this._enNum(yl) + ' kWh' : this._t('enNone'), yk ? pill('%' + Math.round(yk / yl * 100), yk / yl > 0.85 ? 'w' : 'ok') : '') +
      row('bill', this._t('enSBill'), b ? this._enNum(b.kwh) + ' kWh · ' + this._enTl(b.tl) : this._t('enNoBill'), b && lpEnUntracked() ? pill(this._t('enUnt', { p: Math.round(lpEnUntracked() * 100) }), 'w') : '') +
      row('dev', this._t('en_dev'), ek.length ? this._t('enDevN', { n: ek.length, m: nm, v: ek.length - nm, w: lpEnWs(ew, this._lang) }) : this._t('enNone'), nf ? pill(this._t('enFoundP', { n: nf }), 'w') : '') +
      row('cat', this._t('en_cat'), C.length ? this._t('enCatN', { n: C.length, u: ek.filter((k) => !E[k].cat).length }) : this._t('enNone'), '') +
      row('meter', this._t('en_meter'), lpEnMeter() && lpEnMeter().power ? this._ename(lpEnMeter().power) + ' · ' + lpEnWs(lpEnW(S, lpEnMeter().power), this._lang) : this._t('enNone'), '') +
      row('solar', this._t('en_solar'), lpEnSunOn(sol) || lpEnBatOn(sol) ? [lpEnSunOn(sol) ? (F && F.prod !== null ? this._t('enSolN', { w: lpEnWs(F.prod, this._lang) }) : this._t('enSolNoS')) : '', lpEnBatOn(sol) ? (F && F.soc !== null ? this._t('enBatN', { p: lpEnPct(F.soc, this._lang) }) : this._t('enBatOnly')) : ''].filter((x) => x).join(' · ') : this._t('enOff'), '') +
      row('tips', this._t('en_tips'), lpEnTipCfg().on === false ? this._t('enOff') : this._t('enTNow', { n: tips.length }), tips.length ? pill(String(tips.length), 'w') : '') +
      row('src', this._t('en_src'), lpEnLemur() ? this._t(lpEnCfg().sync === false ? 'enSyncOff' : 'enSyncOn') : M.cats.length ? this._t('enCats', { n: M.cats.length, d: M.devs.length }) : this._t('enNoData'), '') + '</div>';
  }
  _enPowSel(path, cur, none) {
    const S = this._hass.states;
    const pows = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && lpEnIsPow(S[id])).sort((a, b) => this._ename(a).localeCompare(this._ename(b), this._lang));
    return '<select class="inp w" data-sf="' + path + '" style="max-width:300px"><option value="">' + esc(none) + '</option>' +
      pows.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
  }
  _enSrc() {
    const t = (k, v) => esc(this._t(k, v)), M = LP_EN.m, en = lpEnCfg();
    const own = !!lpEnLemur();
    return '<h3 class="enh">' + t('en_src') + '</h3><p class="enlead">' + t(own ? 'enSrcT2' : 'enSrcT') + '</p>' +
      (own ? '<div class="srow"><div class="t"><b>' + t('enSync') + '</b><span>' + t('enSyncT') + '</span></div>' + this._enFlag('energy.sync', true) + '</div>' : '') +
      '<div class="srow"><div class="t"><b>' + t('enSrc') + '</b><span>' + (M ? (M.cats.length ? t('enCats', { n: M.cats.length, d: M.devs.length }) : t('enNoData')) : t('enLoading')) + '</span></div><a class="btn" href="/config/energy">' + t('enSrcGo') + '</a></div>' +
      '<div class="srow"><div class="t"><b>' + t('enTotal') + '</b><span>' + t('enTotalT') + '</span></div>' + this._enPowSel('energy.total', en.total, this._t('enAuto')) + '</div>' +
      '<div class="srow"><div class="t"><b>' + t('enSb') + '</b><span>' + t('enSbT') + '</span></div>' + this._enPowSel('energy.standby', en.standby, this._t('enSbAuto')) + '</div>';
  }
  _enTariff() {   // üç adım: tarife, 1 kWh'in fiyatı, yılın gidişi (fatura girmeden de çalışır)
    const t = (k, v) => esc(this._t(k, v)), en = lpEnCfg(), M = LP_EN.m, L = this._lang === 'tr' ? 'tr-TR' : 'en-GB';
    const num = (path, v, step, unit, ph) => '<span class="ennum"><input class="inp" type="number" min="0" step="' + step + '" data-dec data-sf="' + path + '" value="' + esc(v === undefined || v === null ? '' : v) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + (unit ? '<i>' + esc(unit) + '</i>' : '') + '</span>';
    const cur = this._enCur() + '/kWh', fd = (d, y) => d.toLocaleDateString(L, y ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long' });
    const pm = en.price_mode || (lpEnLastBill() ? 'bill' : 'tier'), ch = en.sktt_on ? 'sktt' : pm === 'bill' || pm === 'single' || pm === 'tou' ? pm : 'tier';
    const step = (n, title, body) => '<div class="tfs"><div class="tfn">' + n + '</div><div class="tfc"><div class="tft">' + title + '</div>' + body + '</div></div>';
    const li = (k, sub, v, cls) => '<div class="tfli"><div class="k"><b>' + k + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</div><div class="v' + (cls ? ' ' + cls : '') + '">' + v + '</div></div>';
    let h = '<h3 class="enh">' + t('en_tariff') + '</h3><p class="enlead">' + t('enTarLead2') + '</p>';
    // 1) tarife
    h += step(1, t('enTarQ1'), '<div class="tfch">' + [['tier', 'enChTier'], ['tou', 'enChTou'], ['sktt', 'enChSktt'], ['bill', 'enChBill'], ['single', 'enChSingle']].map((o) => '<button data-tfmode="' + o[0] + '"' + (ch === o[0] ? ' class="on"' : '') + '><b>' + t(o[1]) + '</b><span>' + t(o[1] + 'T') + '</span></button>').join('') + '</div>');
    // 2) fiyat
    let b2 = '';
    if (ch === 'tier') {
      b2 = '<p class="enexp">' + t('enTierExp2', { k: this._enNum(lpEnDaily(), lpEnDaily() % 1 ? 1 : 0) }) + '</p><div class="engrid g2">' +
        '<div class="fld"><label>' + t('enLow2', { k: this._enNum(lpEnDaily(), lpEnDaily() % 1 ? 1 : 0) }) + '</label>' + num('energy.low', en.low, '0.01', cur) + '</div>' +
        '<div class="fld"><label>' + t('enHigh2') + '</label>' + num('energy.high', en.high, '0.01', cur) + '</div></div>' +
        '<div class="enfill"><button class="btn sm" data-a="entarfill"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('enFill') + '</button><span>' + t('enFillT') + '</span></div>';
      if (M && M.days && lpEnMode() === 'tier') {
        const P = lpEnPeriod(), mk = lpEnMonthKwh(M), md = lpEnMonthDays(), D = 86400000;
        const from = P ? new Date(P.from) : (() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; })(), to = new Date(from.getTime() + (md - 1) * D);
        const el = Math.max(1, (Date.now() - from.getTime()) / D), endK = mk / el * md, c = lpEnMonthCost(endK, md, M);
        b2 += '<div class="tfsum">' + t('enPerSum', { a: fd(from), b: fd(to), k: this._enNum(mk), l: this._enNum(lpEnDaily() * md), e: this._enNum(endK), t: this._enTl(c.tl) }) + '</div>';
      }
    } else if (ch === 'tou') {
      b2 = '<p class="enexp">' + t('enTouExp') + '</p><div class="engrid g3">' + [['t_day', 'enTouD'], ['t_peak', 'enTouP'], ['t_night', 'enTouN']].map((o) => '<div class="fld"><label>' + t(o[1]) + '</label>' + num('energy.' + o[0], en[o[0]], '0.01', cur) + '</div>').join('') + '</div>' +
        '<div class="enfill"><button class="btn sm" data-a="entoufill"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('enFillTou') + '</button><span>' + t('enFillTouT') + '</span></div>';
      if (lpEnMode() === 'tou') {
        const f = lpEnTouShare(), pc = (x) => Math.round(x * 100);
        b2 += '<div class="tfsum">' + (f.known ? t('enTouSum', { d: pc(f.day), p: pc(f.peak), n: pc(f.night), u: this._enNum(lpEnUnit(M), 2) + ' ' + cur }) : t('enTouSumEst')) + '</div>';
        if (M && M.days && f.known && lpEnNumOf(en.low) && lpEnNumOf(en.high)) {
          const mk = lpEnMonthKwh(M), md = lpEnMonthDays(), lim = lpEnDaily() * md, tierTl = Math.min(mk, lim) * lpEnNumOf(en.low) + Math.max(0, mk - lim) * lpEnNumOf(en.high);
          b2 += '<div class="hint">' + t('enTouCmp', { a: this._enTl(tierTl), b: this._enTl(mk * lpEnUnit(M)) }) + '</div>';
        }
      }
    } else if (ch === 'sktt') {
      b2 = '<p class="enexp">' + t('enSkttExp') + '</p><div class="engrid g2"><div class="fld"><label>' + t('enSktt2') + '</label>' + num('energy.sktt_price', en.sktt_price, '0.01', cur) + '</div></div>' +
        '<div class="enfill"><button class="btn sm" data-a="enskttfill"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('enFillS') + '</button><span>' + t('enFillST') + '</span></div>';
    } else if (ch === 'bill') {
      const b = lpEnLastBill();
      b2 = '<p class="enexp">' + (b ? t('enPrBillT', { k: this._enNum(b.kwh), t: this._enTl(b.tl), u: this._enTl(b.tl / b.kwh) }) : t('enPrBillNo')) + '</p><div><button class="btn sm" data-env="bill"><ha-icon class="s16" icon="mdi:file-document-outline"></ha-icon>' + t('enGoBills') + '</button></div>';
    } else b2 = '<p class="enexp">' + t('enSingleExp') + '</p><div class="engrid g2"><div class="fld"><label>' + t('enPrice') + '</label>' + num('energy.price', en.price, '0.01', cur) + '</div></div>';
    h += step(2, t('enTarQ2'), b2);
    // 3) yılın gidişi
    const P = M ? lpEnYearPlan(M) : null, y = new Date().getFullYear(), Y = LP_EN.yr;
    let b3 = '';
    if (!P) b3 = '<div class="hint">' + t('enYNoData3') + '</div>';
    else {
      const ok = !P.prevOver && !P.cross && !P.past, col = P.prevOver || P.nowIn ? 'var(--red)' : ok ? '#3DDC84' : 'var(--ac)', yE = P.start ? P.start.getFullYear() : y;
      const verdict = P.prevOver ? this._t(en.sktt_on ? 'enV_prevOn' : 'enV_prev', { p: this._enNum(P.prev), l: this._enNum(lpEnLimitOf(y)) })
        : P.nowIn ? this._t(en.sktt_on ? 'enV_nowOn' : 'enV_now', { s: fd(P.start, true) })
        : P.cross ? this._t('enV_cross', { c: fd(P.cross), s: fd(P.start, true), y: yE })
        : P.short ? this._t('enV_short', { d: P.days, n: LP_EN_MIN_DAYS })
        : this._t('enV_ok', { p: this._enNum(P.proj), d: this._enNum(Math.max(0, P.lim - P.proj)) });
      const src = t('enSrc_' + (P.src || 'none')) + (P.src === 'bills' || P.src === 'manual' ? ' · ' + t('enSrcTail') : '') + (P.est && Y && Y.first ? ' · ' + t('enSrcEst', { d: fd(new Date(Y.first), true) }) : '');
      b3 = '<div class="tfbar"><div class="enbar"><i style="width:' + (Math.min(1, P.k / P.lim) * 100).toFixed(1) + '%;background:' + col + '"></i></div><span><b>' + (P.low ? '≥ ' : '') + this._enNum(P.k) + '</b> / ' + this._enNum(P.lim) + ' kWh</span></div>' +
        '<div class="enverd" style="border-color:' + col + '">' + verdict + '</div><div class="tfl">' +
        li(t('enRowTot', { y: y }), src, (P.est ? '~' : P.low ? '≥ ' : '') + this._enNum(P.k) + ' kWh') +
        (P.short ? '' : li(t('enRowAvg'), t('enRowAvgT'), this._enNum(P.avg, 1) + ' kWh') +
        li(t('enRowProj'), t('enRowProjT', { l: this._enNum(P.lim) }), '~' + this._enNum(P.proj) + ' kWh', ok ? 'okc' : 'acc')) +
        (P.cross && !P.past ? li(t('enRowCross'), t('enRowCrossT'), '~' + esc(fd(P.cross))) : '') +
        (P.start ? li(t('enRowStart'), t('enRowStartT'), '<em class="enp w">' + esc(fd(P.start, true)) + '</em>') : '') +
        (P.prev ? li(t('enRowPrev', { y: y - 1 }), t('enRowPrevT', { l: this._enNum(lpEnLimitOf(y)) }), this._enNum(P.prev) + ' kWh', P.prevOver ? 'redc' : '') : '') +
        '<div class="tfli"><div class="k"><b>' + t('enRowSktt') + '</b><span>' + t('enRowSkttT') + '</span></div><div class="v">' + num('energy.sktt_price', en.sktt_price, '0.01', cur, '~7') + '</div></div></div>';
    }
    b3 += '<details class="enmore tfd"><summary>' + t('enHow') + '</summary><ul class="enrules"><li>' + t('enYR1', { n: '3.000' }) + '</li><li>' + t('enYR2') + '</li><li>' + t('enYR3') + '</li><li>' + t('enYR4') + '</li></ul></details>' +
      '<details class="enmore tfd"><summary>' + t('enMoreExact') + '</summary><div class="engrid g2"><div class="fld"><label>' + t('enYtd') + '</label>' + num('energy.ytd', en.ytd, '1', 'kWh') + '</div><div class="fld"><label>' + t('enPrev', { y: y - 1 }) + '</label>' + num('energy.prev_year', en.prev_year, '1', 'kWh') + '</div></div><div class="hint">' + t('enMoreExactT') + '</div>' +
      '<div class="srow"><div class="t"><b>' + t('enYLim') + '</b><span>' + t('enYLimT') + '</span></div><div class="seg">' + [['auto', this._t('enYAuto', { n: this._enNum(y === 2026 ? 3000 : lpEnLimitOf(y)) })], ['manual', this._t('enYMan')]].map((o) => '<button data-set="energy.year_mode" data-val="' + o[0] + '"' + ((en.year_mode === 'manual' ? 'manual' : 'auto') === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div></div>' +
      (en.year_mode === 'manual' ? '<div class="srow"><div class="t"><b>' + t('enYLim') + '</b></div>' + num('energy.year_limit', en.year_limit || 3000, '100', 'kWh') + '</div>' : '') + '</details>';
    h += step(3, t('enTarQ3'), b3) + '<p class="ensrc">' + t('enTarSrc') + '</p>';
    return h;
  }
  _enSetMany(o) {   // birden çok enerji ayarını tek kayıtta
    this._snap(); const s = lhdClone(this._settings()); s.energy = Object.assign({}, s.energy || {}, o); this._commit('settings', s); this._render(); this._toast(this._t('saved'));
  }
  _enBill() {
    const t = (k, v) => esc(this._t(k, v)), en = lpEnCfg(), raw = Array.isArray(en.bills) ? en.bills : [];
    const rows = raw.map((x, i) => ({ x: x, i: i })).filter((r) => r.x && r.x.kwh > 0 && r.x.tl > 0).sort((a, b) => (a.x.to < b.x.to ? 1 : -1));
    const fd = (s) => { const p = String(s || '').split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0].slice(2) : s; };
    const today = new Date(), iso = (d) => d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    const lb = lpEnLastBill(), m1 = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()), nx = lb ? new Date(Date.parse(lb.to + 'T00:00:00') + 86400000) : null, f0 = nx && nx < today ? nx : m1;
    let h = '<h3 class="enh">' + t('en_bill') + '</h3><p class="enlead">' + t('enBillT') + '</p>';
    h += rows.length ? '<div class="entbl"><table><thead><tr><th>' + t('enBPer') + '</th><th class="r">kWh</th><th class="r">' + t('enBTl') + '</th><th class="r">' + t('enBUnit') + '</th><th class="r">' + t('enBPanel') + '</th><th class="r">' + t('enBUnt') + '</th><th></th></tr></thead><tbody>' +
      rows.map((r) => { const x = r.x, un = x.panel > 0 ? Math.max(0, (x.kwh - x.panel) / x.kwh) : null;
        return '<tr><td>' + esc(fd(x.from)) + ' – ' + esc(fd(x.to)) + '</td><td class="r">' + this._enNum(x.kwh) + '</td><td class="r">' + esc(this._enTl(x.tl)) + '</td><td class="r">' + esc(this._enTl(x.tl / x.kwh)) + '</td><td class="r">' + (x.panel > 0 ? this._enNum(x.panel) : '–') + '</td><td class="r">' + (un === null ? '–' : '<em class="enp w">%' + Math.round(un * 100) + '</em>') + '</td>' +
          '<td class="r"><button class="btn ic sm" data-enbdel="' + r.i + '" title="×"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></td></tr>'; }).join('') + '</tbody></table></div>' : '<div class="hint">' + t('enBNone') + '</div>';
    h += '<div class="encalc enadd"><b>' + t('enBAdd') + '</b><div class="engrid">' +
      '<div class="fld"><label>' + t('enBFrom') + '</label><input class="inp" type="date" id="enbf" value="' + iso(f0) + '"></div>' +
      '<div class="fld"><label>' + t('enBTo') + '</label><input class="inp" type="date" id="enbt" value="' + iso(today) + '"></div>' +
      '<div class="fld"><label>' + t('enBKwh') + '</label><input class="inp" type="number" min="1" step="1" id="enbk"></div>' +
      '<div class="fld"><label>' + t('enBTl') + '</label><input class="inp" type="number" min="0" step="0.01" id="enbl"></div></div>' +
      (this._enErr ? '<div class="imerr">' + esc(this._enErr) + '</div>' : '') +
      '<div class="acts"><button class="btn pri" data-a="enbadd"' + (this._enBusy ? ' disabled' : '') + '>' + (this._enBusy ? t('enBAdding') : t('enBAdd')) + '</button></div></div>';
    h += '<div class="srow"><div class="t"><b>' + t('enYtd') + '</b><span>' + t('enYtdT') + '</span></div><span class="ennum"><input class="inp" type="number" min="0" step="1" data-dec data-sf="energy.ytd" value="' + esc(en.ytd || '') + '"><i>kWh</i></span></div>';
    if (lb && lb.panel > 0 && lb.panel < lb.kwh) h += '<div class="hint">' + t('enUntT', { a: this._enNum(lb.kwh), b: this._enNum(lb.panel), c: this._enNum(Math.max(0, lb.kwh - lb.panel)), p: Math.round(lpEnUntracked() * 100) }) + '</div>';
    return h;
  }
  async _enBillAdd() {
    const R = this.shadowRoot, v = (id) => { const el = R.getElementById(id); return el ? String(el.value).trim() : ''; };
    const from = v('enbf'), to = v('enbt'), kwh = parseFloat(v('enbk').replace(',', '.')), tl = parseFloat(v('enbl').replace(',', '.'));
    this._enErr = '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to || !(kwh > 0) || !(tl > 0)) { this._enErr = this._t('enBBad'); return this._render(); }
    // v0.32: bir fatura bir dönemdir (en çok 100 gün); yıllar süren tek fatura birim fiyatı ve payları bozuyordu
    if ((new Date(to).getTime() - new Date(from).getTime()) / 86400000 > 100) { this._enErr = this._t('enBLong'); return this._render(); }
    const had = (Array.isArray(lpEnCfg().bills) ? lpEnCfg().bills : []).some((x) => x && x.from === from && x.to === to);
    this._enBusy = true; this._render();
    const panel = await lpEnPeriodKwh(this._hass, from, to);
    this._enBusy = false;
    const L = (Array.isArray(lpEnCfg().bills) ? lpEnCfg().bills : []).filter((x) => !(x && x.from === from && x.to === to)).concat([{ from: from, to: to, kwh: kwh, tl: tl, panel: panel }]);
    this._setting('energy.bills', L.slice(-36));
    if (had) this._toast(this._t('enBUpd'));
  }
  // ---- cihazlar (data.estimates): ölçen (kendi güç sensörü) ve sanal (tahmini). Taslak this._enE = { id, f }, kaydedilmeden saklanmaz ----
  // cihaz düzenleyicide hesap ve uyarılar yerinde yenilenir
  _enCalc() {
    const R = this.shadowRoot, ed = R && R.querySelector('.enm .ened'); if (!ed) return;
    const box = document.createElement('div'); box.innerHTML = this._enEditor();
    ['.encalc', '.enwarn'].forEach((sel) => { const a = ed.querySelectorAll(sel), b = box.querySelectorAll(sel); if (a.length === b.length) for (let i = 0; i < a.length; i++) a[i].innerHTML = b[i].innerHTML; else this._enLater(); });
    const er = ed.querySelector('.imerr'); if (er && !this._enErr) er.parentNode.removeChild(er);
  }
  // tam çizim biraz sonra (alandan çıkarken basılan düğmenin tıklaması bitsin)
  _enLater() { clearTimeout(this._enLT); this._enLT = setTimeout(() => { if (this._modal === 'energy') this._render(); }, 350); }
  // düzenleyici açılınca görünsün (listenin üstünde)
  _enTop() { const ed = this.shadowRoot && this.shadowRoot.querySelector('.enm .ened'); if (ed && ed.scrollIntoView) ed.scrollIntoView({ block: 'nearest' }); }
  // ---- Öğren: bir cihazı güç ölçen bir prizle ölç (ışıkta tam tablo, diğerlerinde durumlara göre). Ölçüm Home Assistant'ta sürer (learn.py) ----
  // this._lrn = { id, kind: 'light'|'states', entity, step: 'pool'|'prep'|'run', plug, iv, only, tested, pool, share, apply: {id: true} }
  _lrnRun(id) { const S = this._lrnS || {}; return S[id] || null; }
  _lrnPoll() {
    if (this._lrnBusy || !this._hass) return;
    if (this._modal !== 'energy') { clearInterval(this._lrnT); this._lrnT = null; return; }
    this._lrnBusy = true;
    this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/learn_status' }).then((r) => {
      this._lrnBusy = false;
      const j = JSON.stringify(r || {});
      if (j === this._lrnJ) return;
      this._lrnJ = j; this._lrnS = r || {};
      if (this._lrn && this._lrn.step === 'run') this._lrnPaint(); else if (this._env === 'dev' || this._lrn) this._render();
    }, () => { this._lrnBusy = false; });
  }
  // prizin gönderdiği değerler: hazırlıkta saniyede bir bakılır (aralık ve şu anki değer)
  _lrnWatch() {
    clearInterval(this._lrnW);
    this._lrnW = setInterval(() => {
      const L = this._lrn; if (!L || L.step !== 'prep' || this._modal !== 'energy') { clearInterval(this._lrnW); this._lrnW = null; return; }
      const iv = L.iv, w = L.plug ? lpEnW(this._hass.states, L.plug) : null; this._lrnIv();
      if (iv !== L.iv || w !== L.lw) { L.lw = w; const R = this.shadowRoot, act = R && R.activeElement; if (!act || !act.hasAttribute || !act.hasAttribute('data-lrf')) this._render(); }
    }, 1000);
  }
  _lrnStartPoll() { if (!this._lrnT) this._lrnT = setInterval(() => this._lrnPoll(), 2000); this._lrnPoll(); }
  // cihazın marka ve modeli (Home Assistant cihaz kaydından)
  _lrnDev(ent) {
    const E = this._hass.entities || {}, D = this._hass.devices || {}, e = E[ent], d = e && e.device_id ? D[e.device_id] : null;
    return { man: (d && d.manufacturer) || '', model: (d && d.model) || '', model_id: (d && d.model_id) || '', sw: (d && d.sw_version) || '', integ: (e && e.platform) || '', dev: e ? e.device_id : null };
  }
  // şerit LED mi: tüketim uzunlukla orantılı, havuzda metre başına tutulur
  _lrnIsStrip(ent, extra) { const d = this._lrnDev(ent); return /strip|şerit|serit|bant|lightstrip|led ?tape|neon/i.test([this._ename(ent), d.model, d.model_id, extra || ''].join(' ')); }
  // tabloyu başka uzunluğa uyarla: bekleme aynı, üstü uzunlukla orantılı
  // cap: adaptörün verebildiği en çok güç (şerit uzasa da toplam bunu geçmez)
  _lrnScale(lut, sb, k, cap) {
    const f = (w) => { let v = sb + Math.max(0, w - sb) * k; if (cap > 0) v = Math.min(v, cap); return Math.round(v * 100) / 100; }, o = JSON.parse(JSON.stringify(lut));
    if (o.ct) o.ct.w = o.ct.w.map((r) => r.map(f));
    if (o.hs) o.hs.w = o.hs.w.map((p) => p.map((r) => r.map(f)));
    if (o.br) o.br.w = o.br.w.map(f);
    if (o.fx !== undefined && o.fx !== null) { if (typeof o.fx === 'object') { Object.keys(o.fx.e || {}).forEach((k) => { o.fx.e[k] = f(o.fx.e[k]); }); if (o.fx.avg !== undefined) o.fx.avg = f(o.fx.avg); } else o.fx = f(o.fx); }
    return o;
  }
  _lrnSpan(lut) { const v = []; if (lut.ct) lut.ct.w.forEach((r) => r.forEach((x) => v.push(x))); if (lut.hs) lut.hs.w.forEach((p) => p.forEach((r) => r.forEach((x) => v.push(x)))); if (lut.br) lut.br.w.forEach((x) => v.push(x)); if (lut.fx && typeof lut.fx === 'object' && lut.fx.e) Object.keys(lut.fx.e).forEach((k) => v.push(lut.fx.e[k])); return v.length ? [Math.min.apply(null, v), Math.max.apply(null, v)] : [0, 0]; }
  _lrnSame(id, ent) {   // aynı modeldeki diğer ışıklar
    const me = this._lrnDev(ent), E = this._hass.entities || {}, D = this._hass.devices || {};
    if (!me.man || !(me.model || me.model_id)) return [];
    const myDev = E[ent] ? E[ent].device_id : null;   // aynı cihazın parçaları (segmentler) ayrı ışık değil
    return Object.keys(this._hass.states).filter((x) => x.indexOf('light.') === 0 && x !== ent && E[x] && E[x].device_id && E[x].device_id !== myDev && D[E[x].device_id] && !/_segment_?\d*$/.test(x)).filter((x) => {
      const d = D[E[x].device_id]; return d.manufacturer === me.man && (d.model || '') === me.model && (d.model_id || '') === me.model_id;
    });
  }
  _lrnOpen(id) {
    const e = this._enEsts()[id] || (this._enE && this._enE.f) || {}, avgK = ['fixed', 'year', 'cycle'].indexOf(e.kind) >= 0;
    const ent = avgK ? '' : e.entity || (this._enE && this._enE.f.entity) || '';
    if (!avgK && (!ent || !this._hass.states[ent])) { this._toast(this._t('lrNoEnt'), false); return; }
    const kind = avgK ? 'avg' : ent.indexOf('light.') === 0 ? 'light' : 'states', run = this._lrnRun(id);
    this._lrn = { id: id, kind: kind, entity: ent, name: e.name || id, step: run ? 'run' : kind === 'light' ? 'pool' : 'prep', plug: (run && run.plug) || '', iv: 0, only: false, tested: 0, pool: null, share: false, apply: {} };
    if (kind === 'light') this._lrnSame(id, ent).forEach((x) => { this._lrn.apply[x] = true; });
    this._lrn.strip = kind === 'light' && (!!e.strip || this._lrnIsStrip(ent)); this._lrn.len = lpEnNumOf(e.len) > 0 ? lpEnNumOf(e.len) : 0; this._lrn.lens = {}; if (lpEnNumOf(e.cap) > 0 && !(this._lrn.cap > 0)) this._lrn.cap = lpEnNumOf(e.cap);
    if (this._lrn.strip) { const E0 = this._enEsts(); Object.keys(this._lrn.apply).forEach((x) => { const k = Object.keys(E0).filter((k2) => E0[k2].entity === x)[0]; if (k && E0[k].len > 0) this._lrn.lens[x] = String(E0[k].len); }); }
    this._lrnStartPoll();
    if (this._lrn.step === 'pool') this._lrnPool();
    this._render();
  }
  _lrnPool() {
    const L = this._lrn, d = this._lrnDev(L.entity);
    L.pool = { busy: true, dev: d };
    if (!d.man || !(d.model || d.model_id)) { L.pool = { none: true, dev: d, nomodel: true }; return; }
    this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/pool_lookup', manufacturer: d.man, model: d.model, model_id: d.model_id })
      .then((r) => { if (this._lrn !== L) return; L.pool = r ? Object.assign({ dev: d }, r) : { none: true, dev: d }; this._render(); }, () => { if (this._lrn === L) { L.pool = { none: true, dev: d, err: true }; this._render(); } });
  }
  // prizin değer gönderme aralığı: son değişimler arasındaki süre (Home Assistant ekrana gönderdikçe)
  _lrnIv() {
    const L = this._lrn; if (!L || !L.plug) return;
    const st = this._hass.states[L.plug]; if (!st) return;
    const t = Date.parse(st.last_reported || st.last_updated || '');
    L.ts = L.ts || [];
    if (isFinite(t) && L.ts.indexOf(t) < 0) { L.ts.push(t); L.ts = L.ts.slice(-6); }
    if (L.ts.length >= 3) { const d = []; for (let i = 1; i < L.ts.length; i++) d.push((L.ts[i] - L.ts[i - 1]) / 1000); d.sort((a, b) => a - b); L.iv = Math.max(0.5, Math.min(60, d[Math.floor(d.length / 2)])); }
  }
  _lrnSteps(L) { const st = this._hass.states[L.entity], m = (st && st.attributes.supported_color_modes) || []; let n = 5; if (m.indexOf('color_temp') >= 0) n += 40; if (m.some((x) => ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'].indexOf(x) >= 0)) n += 192; if (n === 5) n += 8; return n; }
  _lrnEta(sec) { const m = Math.max(1, Math.round(sec / 60)); return m >= 60 ? this._t('lrH', { h: Math.floor(m / 60), m: m % 60 }) : this._t('lrM', { m: m }); }
  async _lrnTest() {
    const L = this._lrn, S = () => this._hass.states, w0 = lpEnW(S(), L.plug), st = S()[L.entity], wasOn = st && st.state === 'on';
    L.tested = 1; L.testMsg = ''; this._render();
    const call = (svc, data) => this._hass.callService(L.kind === 'light' ? 'light' : 'homeassistant', svc, Object.assign({ entity_id: L.entity }, data || {}));
    try {
      await call(wasOn ? 'turn_off' : 'turn_on', wasOn || L.kind !== 'light' ? {} : { brightness_pct: 100 });
      let w1 = w0;
      for (let i = 0; i < 30; i++) { await new Promise((r) => setTimeout(r, 500)); w1 = lpEnW(S(), L.plug); if (w1 !== null && w0 !== null && Math.abs(w1 - w0) >= 1) break; }
      await call(wasOn ? 'turn_on' : 'turn_off');
      const ok = w1 !== null && w0 !== null && Math.abs(w1 - w0) >= 1;
      L.tested = ok ? 2 : 3; L.testMsg = this._t(ok ? 'lrTestOk' : 'lrTestNo', { a: lpEnWs(Math.min(w0, w1), this._lang), b: lpEnWs(Math.max(w0, w1), this._lang) });
    } catch (err) { L.tested = 3; L.testMsg = String((err && err.message) || err); }
    this._render();
  }
  async _lrnStart() {
    const L = this._lrn;
    try {
      await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/learn_start', device: L.id, kind: L.kind, entity: L.entity || '', plug: L.plug, interval: L.iv || 3 });
      L.step = 'run'; this._lrnJ = ''; this._lrnPoll();
    } catch (err) { const c = (err && err.code) || 'x'; this._toast(this._t(['busy', 'too_many', 'plug', 'entity', 'plug_busy', 'bridge_busy'].indexOf(c) >= 0 ? 'lrErr_' + c : 'lrErr_x'), false); }
    this._render();
  }
  _lrnCtl(action) {
    const L = this._lrn; if (!L) return Promise.resolve();
    return this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/learn_ctl', device: L.id, action: action }).then((r) => { this._lrnS = r || {}; this._lrnJ = ''; this._render(); }, () => {});
  }
  // sonucu cihazın kaydına yaz (ve aynı modeldekilere)
  async _lrnSave() {
    const L = this._lrn, run = this._lrnRun(L.id), E = lhdClone(this._enEsts()), S = this._hass.states;
    const cur = E[L.id] || (this._enE && this._enE.id === null ? this._enRec(this._enE.f) : null) || { name: this._ename(L.entity), kind: L.kind === 'light' ? 'light' : 'states', entity: L.entity };
    if (L.kind === 'light') {
      const usePool = !!(L.pool && L.pool.use), r = usePool ? L.pool : run && run.result; if (!r) return;
      const src = usePool ? L.pool.source : 'own', sb = r.standby || 0;
      // bekleme prizin alt sınırında (0,1 W'ın altı): havuzda aynı model için ölçülmüş bekleme varsa o, yoksa kapalıyken LP_SB_FLOOR sayılır
      const sbPool = !usePool && sb < LP_SB_MIN && L.pool && L.pool.standby >= LP_SB_MIN ? Math.round(L.pool.standby * 100) / 100 : null;
      // şerit: havuzdaki tablo metre başına ya da ölçüldüğü uzunlukta; kendi uzunluğuna göre uyarlanır
      let base = r.lut, baseLen = 0;
      const cap = L.cap > 0 ? L.cap : r.cap_w > 0 ? r.cap_w : 0;
      if (usePool && (r.strip || L.strip) && L.len > 0 && (r.per_m || r.length_m > 0)) base = this._lrnScale(r.lut, sb, r.per_m ? L.len : L.len / r.length_m, cap);
      if (!usePool && L.strip && L.len > 0) baseLen = L.len;
      const rec = (x, tb, len) => { const sp = this._lrnSpan(tb), o = Object.assign({}, x, { kind: 'light', idle: sb, min: Math.round(sp[0] * 100) / 100, max: Math.round(sp[1] * 100) / 100, lut: tb, src: src });
        if (L.strip) { o.strip = true; if (len > 0) o.len = Math.round(len * 100) / 100; else delete o.len; if (cap > 0) o.cap = cap; } return o; };
      E[L.id] = rec(Object.assign({}, cur, { entity: L.entity }), base, L.len);
      if (sbPool !== null) E[L.id].idle = sbPool;
      Object.keys(L.apply).filter((x) => L.apply[x]).forEach((x) => {
        const ln = parseFloat(L.lens[x]), sc = L.strip && baseLen > 0 && ln > 0, tb = sc ? this._lrnScale(base, sb, ln / baseLen, L.cap > 0 ? L.cap : 0) : base, tl = sc ? ln : L.len;
        const k = Object.keys(E).filter((k2) => E[k2].entity === x)[0];
        if (k) { if (E[k].kind === 'light') E[k] = rec(E[k], tb, tl); }   // v0.32: işaretlenen her ışık tabloyu alır (kendi ölçümü olan baştan işaretli gelmez)
        else { const nid = this._enSlug(this._ename(x), E); E[nid] = rec({ name: String(this._ename(x)).slice(0, 60), entity: x, cat: E[L.id].cat }, tb, tl); }
      });
    } else if (L.kind === 'avg') {
      if (!run || run.avg === null || run.avg === undefined) return;
      await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/learn_ctl', device: L.id, action: 'stop' }).catch(() => {});
      E[L.id] = Object.assign({}, cur, { kind: 'fixed', w: Math.round(run.avg * 100) / 100, src: 'own' });
      ['year', 'k100', 'week', 'entity'].forEach((k) => { delete E[L.id][k]; });
    } else {
      if (!run) return;
      if (run.phase === 'run') await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/learn_ctl', device: L.id, action: 'stop' }).then((r) => { this._lrnS = r || {}; }).catch(() => {});
      const R = this._lrnRun(L.id) || run, rows = [];
      Object.keys(R.states || {}).forEach((s) => { const x = R.states[s]; if (x.sec >= 60 && x.avg !== null) rows.push({ s: s.slice(0, 40), w: Math.round(x.avg * 100) / 100 }); });
      const off = rows.filter((x) => ['off', 'standby', 'unavailable'].indexOf(x.s) >= 0).map((x) => x.w);
      const old = cur.kind === 'states' ? cur : null;
      E[L.id] = Object.assign({}, cur, { kind: 'states', entity: L.entity, states: rows.slice(0, 24), other: off.length ? Math.min.apply(null, off) : old && old.other !== undefined ? old.other : lpEnNumOf(cur.off), src: 'own' });
      delete E[L.id].on; delete E[L.id].off;
    }
    if (L.share && lhdPoolShare() && !lhdPoolWhy(run && run.result) && !(L.strip && !(L.len > 0)) && !(L.pool && L.pool.use)) this._lrnShare();
    await this._commit('estimates', E);
    await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/learn_ctl', device: L.id, action: 'clear' }).catch(() => {});
    this._lrnJ = ''; this._lrn = null; this._enE = null;
    LP_EN.at = 0; LP_EN.tp = {}; lpEnEnsure(this._hass);
    this._toast(this._t('lrSaved')); this._lrnPoll(); this._render();
  }
  // ortak havuza gönderim: GitHub'da hazır doldurulmuş sayfa (yalnız model, özellikler ve ölçüm; ev ve cihaz adları yok)
  _lrnPayload() {
    const L = this._lrn, run = this._lrnRun(L.id), r = run && run.result, st = this._hass.states[L.entity], a = (st && st.attributes) || {}, d = this._lrnDev(L.entity), p = this._lrnDev(L.plug);
    const c = String((this._hass.config && this._hass.config.country) || '').toUpperCase();
    return { v: 1, model: { manufacturer: d.man, model: d.model, model_id: d.model_id, integration: d.integ }, caps: { color_modes: a.supported_color_modes || [], kelvin: [a.min_color_temp_kelvin || null, a.max_color_temp_kelvin || null], effects: (a.effect_list || []).length, sw: d.sw },
      mains_v: ['US', 'CA', 'MX', 'JP', 'TW', 'BR', 'CO', 'VE', 'PH', 'SA'].indexOf(c) >= 0 ? 120 : 230, plug: { manufacturer: p.man, model: p.model }, standby: r && r.standby >= LP_SB_MIN ? r.standby : null, standby_floor: !!(r && !(r.standby >= LP_SB_MIN)), lut: r ? r.lut : null,
      samples: r ? { n: r.n, settle_s: r.settle, repeats: r.repeats, diff: run.plan ? run.plan.diff : null, rechecked: r.rechecked || 0, floor: r.floor || 0 } : null, strip: !!L.strip, length_m: L.strip && L.len > 0 ? L.len : null, adapter_w: L.strip && L.cap > 0 ? L.cap : null, panel: PANEL_VERSION };
  }
  _lrnShare() {
    const P = this._lrnPayload(), t = 'Ölçüm: ' + P.model.manufacturer + ' ' + (P.model.model_id || P.model.model);
    const u = 'https://github.com/mendebur-lemur/lemur-home-dashboard/issues/new?template=olcum.yml&title=' + encodeURIComponent(t) + '&olcum=' + encodeURIComponent(JSON.stringify(P));
    try { window.open(u, '_blank', 'noopener'); } catch (e) {}
  }
  // ---- pencere ----
  _lrnHtml() {
    const L = this._lrn; if (!L) return '';
    const t = (k, v) => esc(this._t(k, v)), S = this._hass.states, run = this._lrnRun(L.id), nm = L.entity ? this._ename(L.entity) : L.name;
    const names = L.kind === 'light' ? ['lrS_pool', 'lrS_prep', 'lrS_probe', 'lrS_full', 'lrS_res'] : ['lrS_prep', 'lrS_listen', 'lrS_res'];
    let stepI = 0, body = '';
    const ph = run ? run.phase : '';
    if (L.step === 'pool') { stepI = 0; body = this._lrnPoolHtml(); }
    else if (L.step === 'prep') { stepI = L.kind === 'light' ? 1 : 0; body = this._lrnPrepHtml(); }
    else if (L.kind === 'light') {
      if (ph === 'done') { stepI = 4; body = this._lrnResHtml(); }
      else if (ph === 'standby' || ph === 'probe' || ph === 'start' || (ph === 'paused' && !run.n)) { stepI = 2; body = this._lrnRunHtml(); }
      else { stepI = 3; body = this._lrnRunHtml(); }
    } else if (L.kind === 'avg') { stepI = 1; body = this._lrnAvgHtml(); }
    else { stepI = ph === 'done' ? 2 : 1; body = this._lrnStHtml(); }
    return '<div class="ov lrov"><div class="dlg lrd" role="dialog" aria-modal="true"><div class="dh"><div class="di"><ha-icon icon="mdi:school-outline"></ha-icon></div><h2>' + t('lrTitle', { n: nm }) + '<small>' + t(L.kind === 'light' ? 'lrSubL' : L.kind === 'avg' ? 'lrSubA' : 'lrSubS') + '</small></h2>' +
      '<button class="btn ic" data-a="lrclose" style="margin-left:auto" title="' + t('close') + '"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="lrsteps">' + names.map((n, i) => '<div class="' + (i < stepI ? 'done' : i === stepI ? 'on' : '') + '">' + t(n) + '</div>').join('') + '</div>' + body + '</div></div>';
  }
  _lrnPoolHtml() {
    const t = (k, v) => esc(this._t(k, v)), P = this._lrn.pool || {}, d = P.dev || {};
    let h = '<div class="lrchk"><div><em class="' + (P.busy ? 'wait' : 'ok') + '">' + (P.busy ? '…' : '✓') + '</em><span>' + t('lrPoolLook') + '<i>' + esc([d.man, d.model_id || d.model, d.integ].filter((x) => x).join(' · ') || this._t('lrNoModel')) + '</i></span></div></div>';
    if (P.busy) return h;
    if (P.none) h += '<div class="lrpool"><div class="t"><b>' + t(P.nomodel ? 'lrPoolNoModel' : P.err ? 'lrPoolErr' : 'lrPoolNone') + '</b><span>' + t('lrPoolNoneT') + '</span></div><div class="acts"><button class="btn pri" data-a="lrown">' + t('lrOwn') + '</button></div></div>';
    else {
      const src = P.source === 'pool' ? this._t('lrSrcPool', { n: P.n || 1 }) + (P.n >= 2 ? ' · ' + this._t('lrVerified') : '') : this._t('lrSrcLib');
      const L = this._lrn, strip = P.strip || L.strip, known = P.per_m || P.length_m > 0, need = strip && known && !(L.len > 0);
      h += '<div class="lrpool"><div class="t"><b>' + esc(src) + '</b><span>' + (strip && P.per_m ? t('lrPoolValsM', { s: lpEnWs(P.standby || 0, this._lang), b: lpEnWs(P.max, this._lang), n: P.lut ? lrCount(P.lut) : 0 }) : t('lrPoolVals', { s: lpEnWs(P.standby || 0, this._lang), a: lpEnWs(P.min, this._lang), b: lpEnWs(P.max, this._lang), n: P.lut ? lrCount(P.lut) : 0 }) + (strip && P.length_m > 0 ? ' ' + t('lrPoolLen', { m: lpEnNum(P.length_m, 1, this._lang) }) : '')) + (P.mains_v && P.mains_v !== 230 ? ' ' + t('lrV', { v: P.mains_v }) : '') + '</span>' +
        (strip ? (known ? '<label class="lrlen">' + t('lrLenQ') + ' <input class="inp" type="number" min="0.1" max="50" step="0.1" data-lrf="len" value="' + (L.len > 0 ? L.len : '') + '"> m</label>' +
          '<label class="lrlen">' + t('lrCapQ') + ' <input class="inp" type="number" min="1" max="2000" step="1" data-lrf="cap" value="' + (L.cap > 0 ? L.cap : P.cap_w > 0 ? P.cap_w : '') + '"> W</label><span class="hint">' + t('lrCapT') + '</span>' : '<span class="lrwarn2">' + t('lrLenUnknown') + '</span>') : '') + '</div>' +
        '<div class="acts"><button class="btn" data-a="lruse"' + (need ? ' disabled' : '') + '>' + t('lrUse') + '</button><button class="btn pri" data-a="lrown">' + t('lrOwn') + '</button></div></div><div class="hint">' + t(strip ? 'lrPoolNoteStrip' : 'lrPoolNote') + '</div>';
    }
    return h;
  }
  _lrnPrepHtml() {
    const L = this._lrn, t = (k, v) => esc(this._t(k, v)), S = this._hass.states;
    const used = {}; [lpEnSolar().prod, lpEnSolar().grid, lpEnSolar().bat_power].forEach((x) => { if (x) used[x] = 1; });
    const plugs = Object.keys(S).filter((x) => x.indexOf('sensor.') === 0 && x.indexOf('sensor.lhd_') !== 0 && lpEnIsPow(S[x]) && !used[x]).sort((a, b) => this._ename(a).localeCompare(this._ename(b), this._lang));
    const busy = {}, RS = this._lrnS || {}, E0 = this._enEsts();   // başka bir öğrenmede kullanılan prizler
    Object.keys(RS).forEach((k) => { const r = RS[k]; if (k !== L.id && r && ['done', 'error', 'stopped'].indexOf(r.phase) < 0) busy[r.plug] = (E0[k] && E0[k].name) || k; });
    this._lrnIv();
    const w = L.plug ? lpEnW(S, L.plug) : null, sent = L.plug && w !== null;
    const st0 = L.entity ? S[L.entity] : null, nfx = L.kind === 'light' && st0 ? (st0.attributes.effect_list || []).filter((x) => ['None', 'none', 'off', 'Off', 'solid', 'Solid', ''].indexOf(String(x)) < 0).slice(0, 150).length : 0;
    const n = L.kind === 'light' ? this._lrnSteps(L) + nfx + (nfx ? 12 : 0) : 0, eta = (n - nfx - (nfx ? 12 : 0)) * ((L.iv || 3) * 3 + 2) + (nfx ? (nfx + 12) * (Math.max(30, (L.iv || 3) * 6) + 3) : 0);
    let h = '<div class="engrid"><div class="fld"><label>' + t('lrPlug') + '</label><select class="inp" data-lrf="plug"><option value="">' + t('enPick') + '</option>' + plugs.map((x) => '<option value="' + esc(x) + '"' + (L.plug === x ? ' selected' : '') + (busy[x] ? ' disabled' : '') + '>' + esc(this._ename(x)) + ' · ' + esc(busy[x] ? this._t('lrPlugBusy', { n: busy[x] }) : lpEnWs(lpEnW(S, x), this._lang)) + '</option>').join('') + '</select></div></div>';
    h += '<div class="lrchk"><div><em class="' + (sent ? 'ok' : L.plug ? 'wait' : '') + '">' + (sent ? '✓' : L.plug ? '…' : '1') + '</em><span>' + t('lrC1') + '<i>' + (sent ? t(L.iv ? 'lrC1ok' : 'lrC1wait', { s: lpEnNum(L.iv || 0, (L.iv || 0) < 10 ? 1 : 0, this._lang), w: lpEnWs(w, this._lang) }) : t('lrC1T')) + '</i></span></div>' +
      '<div><label><input type="checkbox" data-lrf="only"' + (L.only ? ' checked' : '') + '><span>' + t('lrC2') + '<i>' + t(L.kind === 'light' ? 'lrC2T' : 'lrC2Ts') + '</i></span></label></div>' +
      (L.kind === 'avg' ? '' : '<div><em class="' + (L.tested === 2 ? 'ok' : L.tested === 1 ? 'wait' : L.tested === 3 ? 'bad' : '') + '">' + (L.tested === 2 ? '✓' : L.tested === 1 ? '…' : L.tested === 3 ? '!' : '3') + '</em><span>' + t('lrC3') + '<i>' + (L.testMsg ? esc(L.testMsg) : t('lrC3T')) + '</i></span>' +
      '<button class="btn sm" data-a="lrtest"' + (sent && L.only && L.tested !== 1 ? '' : ' disabled') + '>' + t('lrTest') + '</button></div>') + '</div>';
    if (L.kind === 'light') h += '<div class="lrwarn">' + t(nfx ? 'lrWarnFx' : 'lrWarn', { e: this._lrnEta(eta), n: n, f: nfx }) + '</div>';
    else h += '<div class="hint">' + t(L.kind === 'avg' ? 'lrAvgHow' : 'lrStHow') + '</div>';
    const ready = sent && L.only && (L.kind === 'avg' || L.tested === 2);
    const need = ready ? '' : !sent ? 'lrNeedPlug' : !L.only ? 'lrNeedOnly' : 'lrNeedTest';
    h += '<div class="acts">' + (need ? '<span class="hint lrneed">' + t(need) + '</span>' : '') + '<span class="grow"></span><button class="btn pri" data-a="lrstart"' + (ready ? '' : ' disabled') + '>' + t(L.kind === 'light' ? 'lrStartL' : 'lrStartS') + '</button></div>';
    return h;
  }
  _lrnGrid(tb, cur) {   // ölçüm tablosu ızgarası (hücre rengi watt'a göre)
    if (!tb) return '';
    const all = []; const push = (v) => { if (typeof v === 'number') all.push(v); };
    if (tb.ct) tb.ct.w.forEach((r) => r.forEach(push));
    if (tb.hs) tb.hs.w.forEach((p) => p.forEach((r) => r.forEach(push)));
    if (tb.br) tb.br.w.forEach(push);
    const mx = Math.max.apply(null, all.concat([1])), t = (k, v) => esc(this._t(k, v));
    const cell = (v, on) => '<td' + (on ? ' class="cur"' : '') + (typeof v === 'number' ? ' style="background:rgba(255,181,74,' + (0.12 + 0.88 * Math.min(1, v / mx)).toFixed(2) + ')" title="' + esc(lpEnNum(v, 1, this._lang)) + ' W"' : '') + '></td>';
    const head = (b) => '<tr><th></th>' + b.map((x) => '<th>%' + x + '</th>').join('') + '</tr>';
    let h = '';
    if (tb.ct) h += '<div class="lrgt">' + t('lrWhite') + '</div><div class="lrgw"><table class="lrgrid">' + head(tb.ct.b) + tb.ct.k.map((k, i) => '<tr><th class="r">' + k + ' K</th>' + tb.ct.b.map((b, j) => cell(tb.ct.w[i][j], cur && cur.t === 'ct' && cur.k === k && cur.b === b)).join('') + '</tr>').join('') + '</table></div>';
    if (tb.hs) tb.hs.s.forEach((s, si) => { h += '<div class="lrgt">' + t('lrColor', { s: s }) + '</div><div class="lrgw"><table class="lrgrid">' + head(tb.hs.b) + tb.hs.h.map((hh, i) => '<tr><th class="r"><i class="lrsw" style="background:hsl(' + hh + ',' + s + '%,55%)"></i>' + hh + '°</th>' + tb.hs.b.map((b, j) => cell(tb.hs.w[si][i][j], cur && cur.t === 'hs' && cur.h === hh && cur.s === s && cur.b === b)).join('') + '</tr>').join('') + '</table></div>'; });
    if (tb.br) h += '<div class="lrgt">' + t('lrBri') + '</div><div class="lrgw"><table class="lrgrid">' + head(tb.br.b) + '<tr><th class="r">W</th>' + tb.br.b.map((b, j) => cell(tb.br.w[j], cur && cur.t === 'br' && cur.b === b)).join('') + '</tr></table></div>';
    return h + '<div class="lrleg"><span>0 W</span><i></i><span>' + esc(lpEnWs(mx, this._lang)) + '</span></div>';
  }
  _lrnFx(fxl, n, cur) {   // efekt listesi: ölçülenler ve sıradaki
    if (!n) return '';
    const t = (k, v) => esc(this._t(k, v)), L = Object.keys(fxl || {});
    return '<div class="lrgt">' + t('lrFxT', { i: L.length, n: n }) + '</div><div class="lrfx">' + L.slice(-24).map((k) => '<span' + (k === cur ? ' class="cur"' : '') + '>' + esc(k) + ' <b>' + esc(lpEnNum(fxl[k], 1, this._lang)) + ' W</b></span>').join('') + (cur && L.indexOf(cur) < 0 ? '<span class="cur">' + esc(cur) + ' <b>…</b></span>' : '') + '</div>';
  }
  _lrnRunHtml() {
    const L = this._lrn, run = this._lrnRun(L.id), t = (k, v) => esc(this._t(k, v));
    if (!run) return '<div class="hint">' + t('enLoading') + '</div>';
    if (run.phase === 'error' || run.phase === 'stopped') return '<div class="imerr">' + t('lrErrRun_' + (run.msg === 'external' || run.msg === 'plug_silent' || run.msg === 'no_light' ? run.msg : 'x'), { e: run.msg }) + '</div>' + (run.kind === 'light' && run.i > 0 && run.i < run.n ? '<div class="hint">' + t('lrContT', { i: run.i, n: run.n }) + '</div>' : '') + '<div class="acts"><span class="grow"></span><button class="btn" data-a="lrclear">' + t('close') + '</button>' +
      (run.kind === 'light' && run.i > 0 && run.i < run.n ? '<button class="btn" data-a="lragain">' + t('lrAgainZero') + '</button><button class="btn pri" data-a="lrcont">' + t('lrCont') + '</button>' : '<button class="btn pri" data-a="lragain">' + t('lrAgain') + '</button>') + '</div>';
    const cur = run.cur, ph = run.phase;
    const fxCur = cur && (cur.t === 'fx' || cur.t === 'fxb');
    const now = fxCur ? this._t(cur.t === 'fx' ? 'lrNowFx' : 'lrNowFxb', { e: cur.e, b: cur.b }) : ph === 'standby' ? this._t('lrNowSb') : ph === 'probe' && cur ? this._t('lrNowProbe', { c: this._t('lrC_' + cur.c) }) : cur && cur.t === 'ct' ? this._t('lrNowCt', { k: cur.k, b: cur.b }) : cur && cur.t === 'hs' ? this._t('lrNowHs', { h: cur.h, s: cur.s, b: cur.b }) : cur && cur.t === 'br' ? this._t('lrNowBr', { b: cur.b }) : '';
    let h = '<div class="lrrow"><div class="lrleft">';
    if (run.probe && run.probe.length) h += '<div class="lrprobe">' + run.probe.map((p) => '<div><i style="background:' + ({ white: '#F4EFE6', red: '#E5484D', green: '#3DDC84', blue: '#5B8DEF' }[p.c] || '#888') + '"></i><span>' + t('lrC_' + p.c) + '</span><b>' + esc(lpEnWs(p.w, this._lang)) + '</b></div>').join('') + '</div>';
    if (run.plan && run.plan.b) h += '<div class="hint">' + t('lrPlan', { d: Math.round((run.plan.diff || 0) * 100), n: run.n }) + '</div>';
    h += this._lrnGrid(run.res, cur) + this._lrnFx(run.res && run.res.fxl, run.fx_n, fxCur ? cur.e : null) + '</div><div class="lrside"><div class="lrbig"><b>' + (run.w === null || run.w === undefined ? '–' : esc(lpEnNum(run.w, 1, this._lang)) + '<small>W</small>') + '</b></div><div class="hint lrnow">' + esc(ph === 'paused' ? this._t('lrPaused') : now) + '</div>' +
      '<div class="lrbar"><i style="width:' + (run.n ? run.i / run.n * 100 : 0).toFixed(1) + '%"></i></div><div class="encalc"><div><span>' + t('lrDone') + '</span><b>' + run.i + ' / ' + (run.n || '…') + '</b></div><div><span>' + t('lrLeft') + '</span><b>~' + esc(this._lrnEta(run.eta || 0)) + '</b></div>' +
      (run.eta_fx > 0 && run.eta_col > 0 ? '<div class="sub2"><span>' + t('lrLeftCol', { n: run.n_col }) + '</span><b>~' + esc(this._lrnEta(run.eta_col)) + '</b></div><div class="sub2"><span>' + t('lrLeftFx', { n: run.n_fx }) + '</span><b>~' + esc(this._lrnEta(run.eta_fx)) + '</b></div>' : '') +
      (run.every ? '<div class="sub2"><span>' + t('lrEvery') + '</span><b>' + t('lrEveryV', { s: this._enNum(run.every, run.every < 10 ? 1 : 0) }) + '</b></div>' : '') +
      (run.resumed ? '<div class="sub2"><span>' + t('lrResumed') + '</span><b></b></div>' : '') +
      (run.standby !== null && run.standby !== undefined ? '<div><span>' + t('lrStandby') + '</span><b>' + esc(lpEnNum(run.standby, 1, this._lang)) + ' W</b></div>' : '') + (run.repeats ? '<div><span>' + t('lrRepeats') + '</span><b>' + run.repeats + '</b></div>' : '') + (run.rechecked ? '<div><span>' + t('lrRecheck') + '</span><b>' + run.rechecked + '</b></div>' : '') + (run.floor_n ? '<div><span>' + t('lrFloor') + '</span><b>' + run.floor_n + '</b></div>' : '') + '</div>' +
      '<div class="hint">' + t('lrBgNote') + '</div></div></div>' +
      '<div class="acts"><button class="btn" data-a="lrcancel">' + t('lrCancel') + '</button><span class="grow"></span>' + (run.fx_n && !run.skip_fx ? '<button class="btn" data-a="lrskipfx" title="' + t('lrSkipFxT') + '">' + t('lrSkipFx') + '</button>' : '') + '<button class="btn" data-a="' + (ph === 'paused' ? 'lrresume' : 'lrpause') + '">' + t(ph === 'paused' ? 'lrResume' : 'lrPause') + '</button><button class="btn" data-a="lrclose">' + t('lrBg') + '</button></div>';
    return h;
  }
  _lrnPaint() {   // ölçüm sürerken yalnız pencerenin gövdesi yenilenir
    const R = this.shadowRoot, d = R && R.querySelector('.lrd'); if (!d) return this._render();
    const L = this._lrn, run = this._lrnRun(L.id);
    if (!run || run.phase === 'done' || run.phase === 'error' || run.phase === 'stopped') return this._render();
    const box = document.createElement('div'); box.innerHTML = this._lrnHtml();
    const nd = box.querySelector('.lrd'); if (nd) { d.innerHTML = nd.innerHTML; }
  }
  _lrnResHtml() {
    const L = this._lrn, run = this._lrnRun(L.id), r = run && run.result, t = (k, v) => esc(this._t(k, v)); if (!r) return '';
    const same = this._lrnSame(L.id, L.entity), P = this._lrnPayload(), canShare = !!(P.model.manufacturer && (P.model.model || P.model.model_id));
    const val = (a) => { const v = lrPow(r.lut, a); return v === null ? '–' : lpEnNum(v, 1, this._lang) + ' W'; };
    let h = '<div class="lrrow"><div class="lrleft">' + this._lrnGrid(r.lut, null) + '</div><div class="lrside"><div class="encalc"><div><span>' + t('lrStandby') + '</span><b>' + (r.standby >= LP_SB_MIN ? esc(lpEnNum(r.standby, 1, this._lang)) + ' W' : t('enSbUnm', { w: lpEnNum(LP_SB_FLOOR, 1, this._lang) })) + '</b></div>' +
      (r.lut.ct ? '<div><span>' + t('lrV100w') + '</span><b>' + esc(val({ brightness: 255, color_mode: 'color_temp', color_temp_kelvin: 6500 })) + '</b></div><div><span>' + t('lrV50w') + '</span><b>' + esc(val({ brightness: 128, color_mode: 'color_temp', color_temp_kelvin: 2700 })) + '</b></div>' : '') +
      (r.lut.hs ? '<div><span>' + t('lrV100r') + '</span><b>' + esc(val({ brightness: 255, color_mode: 'hs', hs_color: [0, 100] })) + '</b></div><div><span>' + t('lrV100b') + '</span><b>' + esc(val({ brightness: 255, color_mode: 'hs', hs_color: [240, 100] })) + '</b></div>' : '') +
      (r.lut.br ? '<div><span>' + t('lrV100') + '</span><b>' + esc(val({ brightness: 255 })) + '</b></div>' : '') +
      (r.lut.fx && typeof r.lut.fx === 'object' ? '<div><span>' + t('lrFxAvg', { n: Object.keys(r.lut.fx.e || {}).length }) + '</span><b>' + esc(lpEnNum(r.lut.fx.avg || 0, 1, this._lang)) + ' W</b></div>' + (r.lut.fx.r ? '<div><span>' + t('lrFx50') + '</span><b>%' + Math.round(lrLin(r.lut.fx.b, r.lut.fx.r, 50) * 100) + '</b></div>' : '') : '') +
      '<div><span>' + t('lrPoints') + '</span><b>' + r.n + '</b></div></div></div></div>' + (r.lut.fx && r.lut.fx.e ? this._lrnFx(r.lut.fx.e, Object.keys(r.lut.fx.e).length, null) : '');
    h += '<div class="lrsend"><label><input type="checkbox" data-lrf="strip"' + (L.strip ? ' checked' : '') + '><span><b>' + t('lrStrip') + '</b><i>' + t('lrStripT') + '</i></span></label>' +
      (L.strip ? '<label class="lrlen">' + t('lrLenMine') + ' <input class="inp" type="number" min="0.1" max="50" step="0.1" data-lrf="len" value="' + (L.len > 0 ? L.len : '') + '"> m</label>' +
        '<label class="lrlen">' + t('lrCapMine') + ' <input class="inp" type="number" min="1" max="2000" step="1" data-lrf="cap" value="' + (L.cap > 0 ? L.cap : '') + '"> W</label><span class="hint">' + t('lrCapT') + '</span>' : '') + '</div>';
    // v0.32: panoda kayıtlı olup kendi ölçümü olmayan aynı model ışıklar baştan işaretli; kendi ölçümü olan ya da panoda olmayan sorulur
    const EE = this._enEsts(), sameK = {}; same.forEach((x) => { sameK[x] = Object.keys(EE).filter((k2) => EE[k2].entity === x)[0] || ''; });
    const sameOwn = (x) => !!(sameK[x] && EE[sameK[x]].lut && EE[sameK[x]].src === 'own');
    if (!L.applyInit) { L.applyInit = true; same.forEach((x) => { if (sameK[x] && EE[sameK[x]].kind === 'light' && !sameOwn(x)) L.apply[x] = true; }); }
    if (same.length) h += '<div class="lrsend"><b>' + t('lrSame', { n: same.length }) + '</b>' + (L.strip ? '<i class="hint">' + t('lrSameStrip') + '</i>' : '') + same.map((x) => '<label><input type="checkbox" data-lrap="' + esc(x) + '"' + (L.apply[x] ? ' checked' : '') + '><span>' + esc(this._ename(x)) + (sameOwn(x) ? ' <i class="hint">' + t('lrSameOwn') + '</i>' : !sameK[x] ? ' <i class="hint">' + t('lrSameNew') + '</i>' : '') + '</span>' +
      (L.strip ? '<input class="inp lrlenin" type="number" min="0.1" max="50" step="0.1" data-lrlen="' + esc(x) + '" value="' + esc(L.lens[x] || (L.len > 0 ? L.len : '')) + '"> m' : '') + '</label>').join('') + '</div>';
    const why = lhdPoolWhy(r), shareOk = canShare && !why && !(L.strip && !(L.len > 0));
    if (lhdPoolShare()) h += '<div class="lrsend"><label><input type="checkbox" data-lrf="share"' + (L.share && shareOk ? ' checked' : '') + (shareOk ? '' : ' disabled') + '><span><b>' + t('lrShare') + '</b><i>' + t(!canShare ? 'lrShareNo' : why ? why : !shareOk ? 'lrShareLen' : 'lrShareT', { s: lpEnNum(r.settle || 0, 0, this._lang) }) + '</i></span></label>' +
      (L.share ? '<div class="lrcols"><div><b>' + t('lrSent') + '</b><ul><li>' + t('lrSent1', { m: [P.model.manufacturer, P.model.model_id || P.model.model].join(' ') }) + '</li><li>' + t('lrSent2') + '</li><li>' + t('lrSent3', { n: r.n }) + '</li><li>' + t('lrSent4') + '</li><li>' + t('lrSent5', { v: P.mains_v }) + '</li>' + (L.strip ? '<li>' + t('lrSent6', { m: lpEnNum(L.len, 1, this._lang) }) + (L.cap > 0 ? ', ' + t('lrSent7', { w: L.cap }) : '') + '</li>' : '') + '</ul></div><div><b>' + t('lrNotSent') + '</b><ul><li>' + t('lrNot1') + '</li><li>' + t('lrNot2') + '</li><li>' + t('lrNot3') + '</li></ul></div></div><pre class="lrjs">' + esc(JSON.stringify(P, null, 1).slice(0, 1500)) + '</pre>' : '') + '</div>';
    h += '<div class="acts"><span class="hint" style="flex:1">' + t('lrBack') + '</span><button class="btn" data-a="lragain">' + t('lrAgain') + '</button><button class="btn pri" data-a="lrsave">' + t(L.share && lhdPoolShare() ? 'lrSaveShare' : 'enESave') + '</button></div>';
    return h;
  }
  _lrnStHtml() {
    const L = this._lrn, run = this._lrnRun(L.id), t = (k, v) => esc(this._t(k, v)), st = this._hass.states[L.entity];
    if (!run) return '<div class="hint">' + t('enLoading') + '</div>';
    const keys = this._enStatesOf(L.entity); Object.keys(run.states || {}).forEach((k) => { if (keys.indexOf(k) < 0) keys.push(k); });
    let ok = 0;
    const rows = keys.map((k) => { const x = (run.states || {})[k] || { sec: 0, avg: null }, good = x.sec >= 120; if (good) ok++;
      return '<tr' + (run.cur === k ? ' class="cur"' : '') + '><td>' + esc(this._enStLab(st, k)) + '</td><td>' + (x.sec ? esc(this._lrnEta(x.sec)) : '–') + '</td><td><span class="lrmini"><i class="' + (good ? 'ok' : '') + '" style="width:' + Math.min(100, x.sec / 120 * 100).toFixed(0) + '%"></i></span></td><td class="n">' + (x.avg === null ? '–' : esc(lpEnNum(x.avg, x.avg < 10 ? 1 : 0, this._lang)) + ' W') + '</td></tr>'; }).join('');
    return '<div class="lrbig"><b>' + (run.w === null || run.w === undefined ? '–' : esc(lpEnNum(run.w, run.w < 10 ? 1 : 0, this._lang)) + '<small>W</small>') + '</b><span>' + t('lrNowState', { s: run.cur ? this._enStLab(st, run.cur) : '–' }) + '</span></div>' +
      '<div class="lrgw"><table class="lrst"><thead><tr><th>' + t('lrState') + '</th><th>' + t('lrGot') + '</th><th></th><th class="n">' + t('lrAvg') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="hint">' + t('lrStHint') + '</div>' +
      '<div class="acts"><button class="btn" data-a="lrcancel">' + t('lrCancel') + '</button><span class="grow"></span><span class="hint">' + esc(this._lrnEta(run.sec || 0)) + '</span><button class="btn" data-a="lrclose">' + t('lrBg') + '</button><button class="btn pri" data-a="lrsave"' + (ok ? '' : ' disabled') + '>' + t('lrFinish') + '</button></div>';
  }
  _lrnAvgHtml() {   // sürekli açık cihaz: başından bu yana ortalama (Home Assistant'ın kayıtlarından)
    const L = this._lrn, run = this._lrnRun(L.id), t = (k, v) => esc(this._t(k, v));
    if (!run) return '<div class="hint">' + t('enLoading') + '</div>';
    const h0 = run.hours || 0, lvl = run.settled ? 'ok' : h0 >= 24 ? 'mid' : 'early';
    const days = run.days || [], mx = Math.max.apply(null, days.map((d) => d.avg).concat([1]));
    let h = '<div class="lrbig"><b>' + (run.avg === null || run.avg === undefined ? '–' : esc(lpEnNum(run.avg, 1, this._lang)) + '<small>W</small>') + '</b><span>' + t('lrAvgSince', { t: this._lrnEta(run.sec || 0) }) + '</span></div>' +
      '<div class="lrq ' + lvl + '"><b>' + t('lrQ_' + lvl) + '</b><span>' + t('lrQ_' + lvl + 'T') + '</span></div>' +
      '<div class="encalc"><div><span>' + t('lrAvgKwh') + '</span><b>' + esc(lpEnNum(run.kwh || 0, 2, this._lang)) + ' kWh</b></div>' +
      (run.avg ? '<div><span>' + t('lrAvgDay') + '</span><b>' + esc(lpEnNum(run.avg * 24 / 1000, 2, this._lang)) + ' kWh</b></div><div><span>' + t('lrAvgYear') + '</span><b>' + esc(lpEnNum(run.avg * 8.76, 0, this._lang)) + ' kWh</b></div>' : '') +
      (run.avg24 !== null && run.avg24 !== undefined ? '<div><span>' + t('lrAvg24') + '</span><b>' + esc(lpEnNum(run.avg24, 1, this._lang)) + ' W</b></div>' : '') + '<div><span>' + t('lrAvgNow') + '</span><b>' + esc(lpEnWs(run.w, this._lang)) + '</b></div></div>';
    if (days.length) h += '<div class="lrdays">' + days.map((d) => '<div><i style="height:' + Math.max(4, d.avg / mx * 60).toFixed(0) + 'px"></i><b>' + esc(lpEnNum(d.avg, 0, this._lang)) + '</b><span>' + esc(d.d.slice(5).split('-').reverse().join('.')) + '</span></div>').join('') + '</div>';
    h += '<div class="hint">' + t('lrAvgNote') + '</div><div class="acts"><button class="btn" data-a="lrcancel">' + t('lrCancel') + '</button><span class="grow"></span><button class="btn" data-a="lrclose">' + t('lrBg') + '</button><button class="btn pri" data-a="lrsave"' + (run.avg ? '' : ' disabled') + '>' + t('lrFinish') + '</button></div>';
    return h;
  }
  // cihaz satırı ve düzenleyicide öğrenme durumu
  _lrnPill(id) {
    const r = this._lrnRun(id); if (!r) return '';
    if (r.phase === 'done') return '<em class="enp ok">' + esc(this._t('lrPillDone')) + '</em>';
    if (r.phase === 'error') return '<em class="enp w">' + esc(this._t('lrPillErr')) + '</em>';
    if (r.kind === 'states') return '<em class="enp w lrlive">' + esc(this._t('lrPillSt', { t: this._lrnEta(r.sec || 0) })) + '</em>';
    if (r.kind === 'avg') return '<em class="enp ' + (r.settled ? 'ok' : 'w') + ' lrlive">' + esc(this._t('lrPillAvg', { t: this._lrnEta(r.sec || 0), w: r.avg === null || r.avg === undefined ? '…' : lpEnWs(r.avg, this._lang) })) + '</em>';
    return '<em class="enp w lrlive">' + esc(this._t('lrPillL', { p: r.n ? Math.round(r.i / r.n * 100) : 0 })) + '</em>';
  }
  _lrnBox() {
    const D = this._enE; if (!D) return '';
    const f = D.f, t = (k, v) => esc(this._t(k, v));
    const avgK = ['fixed', 'year', 'cycle'].indexOf(f.kind) >= 0;
    if (!avgK && (['light', 'states', 'onoff'].indexOf(f.kind) < 0 || !f.entity || !this._hass.states[f.entity])) return '';
    const id = D.id, run = id ? this._lrnRun(id) : null, light = !avgK && f.entity.indexOf('light.') === 0;
    const e = id ? this._enEsts()[id] : null, own = e && e.src === 'own', pool = e && (e.src === 'pool' || e.src === 'library' || e.src === 'import') && e.lut;
    const txt = run ? (run.phase === 'done' ? this._t('lrBoxDone') : run.kind === 'states' ? this._t('lrBoxSt', { t: this._lrnEta(run.sec || 0) }) : run.kind === 'avg' ? this._t('lrBoxAvgRun', { t: this._lrnEta(run.sec || 0), w: run.avg ? lpEnWs(run.avg, this._lang) : '…' }) : this._t('lrBoxRun', { p: run.n ? Math.round(run.i / run.n * 100) : 0, e: this._lrnEta(run.eta || 0) }))
      : own ? this._t(avgK ? 'lrBoxOwnA' : light ? 'lrBoxOwnL' : 'lrBoxOwnS', { n: e.lut ? lrCount(e.lut) : (e.states || []).length, w: lpEnWs(lpEnNumOf(e.w), this._lang) }) : pool ? this._t('lrBoxPool') : this._t(avgK ? 'lrBoxA' : light ? 'lrBoxL' : 'lrBoxS');
    const can = id || String(f.name || '').trim();   // yeni cihaz: önce kaydedilir, sonra öğrenme açılır
    return '<div class="lrbox"><div class="t"><b>' + t(light ? 'lrBoxTL' : 'lrBoxTS') + '</b><span>' + esc(txt) + '</span></div><button class="btn pri" data-a="lropen"' + (can ? '' : ' disabled title="' + t('lrNameFirst') + '"') + '>' + t(run ? 'lrSee' : own || pool ? 'lrRe' : id ? 'lrGo' : 'lrSaveGo') + '</button></div>';
  }
  _enCats() { const C = STORE.data && STORE.data.ecats; return Array.isArray(C) ? C : []; }
  _enGet(path) { let o = this._settings(); const p = path.split('.'); for (let i = 0; i < p.length; i++) { if (!o || typeof o !== 'object') return undefined; o = o[p[i]]; } return o; }
  _enKindIc(k) { return { meas: 'mdi:gauge', light: 'mdi:lightbulb-outline', states: 'mdi:format-list-bulleted-type', onoff: 'mdi:power-plug-outline', fixed: 'mdi:router-wireless', year: 'mdi:fridge-outline', cycle: 'mdi:washing-machine' }[k] || 'mdi:flash'; }
  // cihazın şu anki gücü: ölçende sensörü, sanalda entegrasyonun sensörü (yoksa burada hesaplanır)
  // toplamlarda: paylaşımlı prizin kalan payı (prizdeki cihazlar kendileri sayılır)
  _enDevNetW(id, e) {
    const w = this._enDevW(id, e), E = this._enEsts(), ins = lpEnInside(id, e, E);
    if (w === null || !ins.length) return w;
    return Math.max(0, ins.reduce((a, k) => a - (this._enDevW(k, E[k]) || 0), w));
  }
  _enDevW(id, e) {
    const S = this._hass.states;
    if (e.kind === 'meas') return lpEnW(S, e.sensor);
    const w = lpEnW(S, 'sensor.lhd_' + id + '_power');
    return w !== null ? w : lpEnEstW(e, e.entity ? S[e.entity] : null);
  }
  // Home Assistant'ta güç ölçen ama panele eklenmemiş sensörler (şebeke, güneş, batarya, toplam ve bekleme sensörleri hariç)
  _enFound() {
    const S = this._hass.states, E = this._enEsts(), R = this._hass.entities || {}, sol = lpEnSolar(), c = lpEnCfg(), used = {};
    Object.keys(E).forEach((k) => { if (E[k] && E[k].sensor) used[E[k].sensor] = 1; });
    [sol.prod, sol.grid, sol.grid_in, sol.grid_out, sol.bat_power, c.total, c.standby].forEach((x) => { if (x) used[x] = 1; });
    const mt = lpEnMeter(); if (mt) [mt.power].forEach((x) => { if (x) used[x] = 1; });
    if (mt && mt.power && this._hass.entities && this._hass.entities[mt.power]) { const dv = this._hass.entities[mt.power].device_id; Object.keys(this._hass.entities).forEach((k) => { if (dv && this._hass.entities[k].device_id === dv) used[k] = 1; }); }   // sayacın öteki kanalları da evin parçası değil
    // Enerji ayarlarında başka girişleri içeren (grup toplamı) girişlerin güç sensörü: eklenirse içindekiler iki kez sayılır
    const dc = ((LP_EN.prefs && LP_EN.prefs.device_consumption) || []).filter((d) => d && d.stat_consumption);
    const par = {}; dc.forEach((d) => { if (d.included_in_stat) par[d.included_in_stat] = 1; });
    dc.forEach((d) => { if (par[d.stat_consumption]) { const pw = lpEnPowOf(this._hass, d.stat_consumption, d.stat_rate); if (pw) used[pw] = 1; } });
    const names = {}; Object.keys(E).forEach((k) => { names[String(E[k].name || '').toLocaleLowerCase('tr')] = 1; });
    const skip = /grid|şebeke|sebeke|solar|güneş|gunes|\bpv\b|inverter|invertör|invertor|battery|batarya|\bak[uü]\b|total|toplam|standby|bekleme|import|export|lhd_kat_/i;   // lhd_kat_: panelin kendi kategori sensörleri (yalnız "_kat_" olsaydı "ust_kat_pc" gibi kat adlı cihazlar da elenirdi)
    // sensor.lhdx_: panelin kendi enerji değerleri (Ev şu an...), cihaz değil: eklenirse evin toplamı kendine eklenir
    return Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && lpEnIsPow(S[id]) && !used[id] && id.indexOf('sensor.lhd_') !== 0 && !lpEnIsVirt(id) && S[id].state !== 'unavailable' &&
      !(R[id] && /^(lemur_home_dashboard|powercalc)$/.test(String(R[id].platform || ''))) && !skip.test(id + ' ' + this._ename(id)) && !names[this._enMeasName(id).toLocaleLowerCase('tr')])
      .sort((a, b) => (lpEnW(S, b) || 0) - (lpEnW(S, a) || 0));
  }
  // güç sensörünün kWh karşılığı: ad benzerliği ya da aynı cihazın enerji sensörü
  _enGuessE(pid) {
    const S = this._hass.states, R = this._hass.entities || {};
    const isE = (id) => !!S[id] && !!S[id].attributes.state_class && (S[id].attributes.device_class === 'energy' || /^(kWh|Wh)$/.test(String(S[id].attributes.unit_of_measurement || '')));
    const c = [pid.replace(/_power$/, '_energy'), pid.replace(/power/g, 'energy'), pid.replace(/_(power|guc|watt|w)$/, '_energy'), pid.replace(/_power$/, '_total_energy')];
    for (let i = 0; i < c.length; i++) if (c[i] !== pid && isE(c[i])) return c[i];
    const dv = R[pid] && R[pid].device_id;
    if (dv) { const L = Object.keys(R).filter((x) => R[x].device_id === dv && x.indexOf('sensor.') === 0 && isE(x) && !/today|bugun|daily|month|ay_/.test(x)); if (L.length) return L.sort((a, b) => a.length - b.length)[0]; }
    return '';
  }
  _enMeasName(pid) { return String(this._ename(pid)).replace(/[\s_-]*(power|güç|guc|watt|anlık güç|anlik guc)\s*$/i, '').trim() || pid.split('.')[1]; }
  // ölçen cihaz ekle (tek ya da hepsi); kategori sonra seçilir
  _enAddMeas(ids) {
    const E = lhdClone(this._enEsts());
    ids.forEach((pid) => {
      const name = this._enMeasName(pid).slice(0, 60), id = this._enSlug(name, E), en = this._enGuessE(pid);
      E[id] = en ? { name: name, kind: 'meas', sensor: pid, energy: en } : { name: name, kind: 'meas', sensor: pid };
    });
    this._commit('estimates', E); LP_EN.at = 0; lpEnEnsure(this._hass);
    this._toast(this._t('enDAdded', { n: ids.length }));
    this._render();
  }
  // durum listesi: varlığın alabileceği durumlar (alana göre) ve kayıtlı olanlar
  _enStatesOf(ent) {
    const st = this._hass.states[ent], d = String(ent || '').split('.')[0], a = (st && st.attributes) || {}, L = [];
    const add = (x) => { x = String(x); if (x && L.indexOf(x) < 0 && x !== 'unavailable' && x !== 'unknown') L.push(x); };
    if (d === 'climate') (a.hvac_modes || ['off', 'heat', 'cool', 'auto']).forEach(add);
    else if (d === 'media_player') ['off', 'standby', 'idle', 'paused', 'playing', 'on'].forEach(add);
    else if (d === 'vacuum') ['docked', 'cleaning', 'returning', 'idle', 'paused', 'error'].forEach(add);
    else if (d === 'water_heater') ['off'].concat(a.operation_list || []).forEach(add);
    else if (d === 'select' || d === 'input_select') (a.options || []).forEach(add);
    else ['off', 'on'].forEach(add);
    if (st) add(st.state);
    return L;
  }
  // durumun HA'daki adı (Oynatılıyor, Soğutma ...); bulunamazsa kendisi
  _enStLab(st, x) { const h = this._hass; if (st && typeof h.formatEntityState === 'function') { try { const v = h.formatEntityState(st, x); if (v) return v; } catch (e) {} } return x; }
  _enDraft(id) {
    const E = this._enEsts(), e = id && E[id] ? E[id] : null;
    const D0 = { idle: 0.5, min: '', max: 9, off: 0.5, on: 60, w: 5, year: 250, k100: 50, week: 3, other: 0 };
    const f = e ? Object.assign({}, e) : { name: '', kind: 'light', entity: '', cat: '' };
    Object.keys(D0).forEach((k) => { f[k] = String(f[k] === undefined ? D0[k] : f[k]); });
    f.st = {}; (Array.isArray(f.states) ? f.states : []).forEach((x) => { if (x && x.s) f.st[x.s] = String(x.w); });
    f.inside = Array.isArray(f.inside) ? f.inside.slice() : []; f.rest = f.rest || '';
    // şerit: kayıtlı uzunluk len0 tablonun şu anki uzunluğu; yoksa aynı tabloyu kullanan başka şeridin uzunluğu tahmin
    f.strip = !!f.strip; f.len0 = e && e.len > 0 ? e.len : 0; f.len = f.len0 ? String(f.len0) : ''; f.cap = e && e.cap > 0 ? String(e.cap) : ''; f.lenref = '';
    if (e && e.lut && !f.len0) { const js = JSON.stringify(e.lut), o = Object.keys(E).filter((k) => k !== id && E[k].len > 0 && E[k].lut && JSON.stringify(E[k].lut) === js)[0]; if (o) { f.lenref = String(E[o].len); f.strip = true; if (!f.cap && E[o].cap > 0) f.cap = String(E[o].cap); } }
    this._enE = { id: e ? id : null, f: f, ask: false };
    this._enE.f0 = JSON.stringify(f);
  }
  // ---- Enerji → Cihazlar (v0.28.5): odaya ya da kategoriye göre gruplu liste, durum etiketleri, sağdan açılan düzenleme, toplu ekleme ----
  // cihazın odası: bağlı varlığın ya da güç sensörünün HA'daki alanı, yoksa o varlığın cihazının alanı
  _enRoom(id, e) {
    const R = this._hass.entities || {}, D = this._hass.devices || {};
    const L = [e.entity, e.sensor, e.kind === 'meas' ? null : 'sensor.lhd_' + id + '_power'];
    for (let i = 0; i < L.length; i++) {
      const r = L[i] && R[L[i]]; if (!r) continue;
      if (r.area_id) return r.area_id;
      const d = r.device_id && D[r.device_id]; if (d && d.area_id) return d.area_id;
    }
    return '';
  }
  _enAreaN(a) { const A = (this._hass.areas || {})[a]; return (A && A.name) || a; }
  // satırın durumu: meas (ölçülüyor), run (öğreniliyor), own (öğrenildi), lib (hazır tablo), est (tahmini), chk (kontrol et) ve uyarısı
  _enStat(id, e) {
    const S = this._hass.states, bad = (x) => !S[x] || ['unavailable', 'unknown'].indexOf(String(S[x].state)) >= 0;
    if (e.kind === 'meas') return bad(e.sensor) ? { s: 'chk', w: this._t('enWSens') } : { s: 'meas' };
    if (['light', 'states', 'onoff'].indexOf(e.kind) >= 0 && (!e.entity || !S[e.entity])) return { s: 'chk', w: this._t('enWNoEnt') };
    const run = this._lrnRun(id);
    if (run && (run.phase === 'error' || run.phase === 'stopped')) return run.kind === 'light' && run.i > 0 && run.i < run.n ? { s: 'chk', w: this._t('enWLrn', { i: run.i, n: run.n }) } : { s: 'est' };
    if (run && run.phase !== 'done') return { s: 'run' };
    if (e.src === 'own') return { s: 'own' };
    if (e.lut && (e.src === 'pool' || e.src === 'library' || e.src === 'import')) return { s: 'lib' };
    return { s: 'est' };
  }
  _enDev() {
    const t = (k, v) => esc(this._t(k, v)), E = this._enEsts(), C = this._enCats(), F = this._enF || 'all', G = this._enG === 'cat' ? 'cat' : 'room', Q = String(this._enQ || '').toLocaleLowerCase('tr');
    const catN = (id) => (C.filter((c) => c.id === id)[0] || {}).name || '';
    const ids = Object.keys(E), owner = {};
    ids.forEach((k) => lpEnInside(k, E[k], E).forEach((x) => { owner[x] = k; }));
    const I = {}; ids.forEach((k) => { const e = E[k], st = this._enStat(k, e), room = this._enRoom(k, e); I[k] = { e: e, st: st, room: room, w: this._enDevNetW(k, e), wAll: this._enDevW(k, e), ins: lpEnInside(k, e, E) }; });
    const FL = { all: () => true, light: (k) => I[k].e.kind === 'light', meas: (k) => I[k].e.kind === 'meas', est: (k) => ['est', 'lib'].indexOf(I[k].st.s) >= 0, chk: (k) => I[k].st.s === 'chk', noroom: (k) => !I[k].room };
    const tot = ids.reduce((a, k) => a + (I[k].w || 0), 0), nM = ids.filter(FL.meas).length, nC = ids.filter(FL.chk).length;
    let h = '<div class="endv"><div class="endsum"><div><small>' + t('enDvN') + '</small><b>' + ids.length + '</b></div><div><small>' + t('enDvW') + '</small><b>' + esc(lpEnWs(tot, this._lang)) + '</b></div><div><small>' + t('enDvMT') + '</small><b>' + nM + ' / ' + (ids.length - nM) + '</b></div><div class="' + (nC ? 'w' : '') + '"><small>' + t('enDvC') + '</small><b>' + nC + '</b></div></div>';
    const nf = this._enFound().length, nl = this._enNewLights().length;
    h += '<div class="endbar"><input class="inp endq" data-enq value="' + esc(this._enQ || '') + '" placeholder="' + t('enDvQ') + '" aria-label="' + t('enDvQ') + '">' +
      '<div class="seg"><button data-eng="room"' + (G === 'room' ? ' class="on"' : '') + '>' + t('enDvGR') + '</button><button data-eng="cat"' + (G === 'cat' ? ' class="on"' : '') + '>' + t('enDvGC') + '</button></div>' +
      '<button class="btn pri" data-a="enaddl"' + (nl ? '' : ' disabled title="' + t('enDvNoL') + '"') + '><ha-icon class="s16" icon="mdi:lightbulb-on-outline"></ha-icon>' + t('enDvAddL') + (nl ? ' <i class="cnt">' + nl + '</i>' : '') + '</button>' +
      '<button class="btn" data-a="enaddm"' + (nf ? '' : ' disabled title="' + t('enDvNoM') + '"') + '><ha-icon class="s16" icon="mdi:gauge"></ha-icon>' + t('enDvAddM') + (nf ? ' <i class="cnt">' + nf + '</i>' : '') + '</button>' +
      '<button class="btn" data-a="enenew"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('enDvAddO') + '</button></div>';
    const FN = [['all', 'enAll'], ['light', 'enDvFL'], ['meas', 'enFMeas'], ['est', 'enDvFE'], ['chk', 'enDvFC'], ['noroom', 'enDvFR']];
    h += '<div class="endchips">' + FN.map((x) => { const n = ids.filter(FL[x[0]]).length; return (n || x[0] === 'all' || F === x[0]) ? '<button class="chip' + (F === x[0] ? ' on' : '') + (x[0] === 'chk' && n ? ' warn' : '') + '" data-enfil="' + x[0] + '">' + t(x[1]) + ' <i>' + n + '</i></button>' : ''; }).join('') + '</div>';
    const vis = ids.filter((k) => FL[F] && FL[F](k) && (!Q || String(I[k].e.name).toLocaleLowerCase('tr').indexOf(Q) >= 0));
    const visSet = {}; vis.forEach((k) => { visSet[k] = 1; });
    const top = vis.filter((k) => !(owner[k] && visSet[owner[k]]));   // prize bağlı olanlar prizin altında
    const gKey = (k) => (G === 'room' ? I[k].room : I[k].e.cat && catN(I[k].e.cat) ? I[k].e.cat : '');
    const gName = (g) => (G === 'room' ? (g ? this._enAreaN(g) : this._t('enDvNoRoom')) : (g ? catN(g) : this._t('enNoCat')));
    const GR = {}; top.forEach((k) => { const g = gKey(k); (GR[g] = GR[g] || []).push(k); });
    const tag = { meas: ['t-meas', 'enTgM'], run: ['t-run', 'enTgR'], own: ['t-own', 'enTgO'], lib: ['t-lrn', 'enTgL'], est: ['t-est', 'enTgE'], chk: ['t-chk', 'enTgC'] };
    const row = (k, sub) => {
      const x = I[k], e = x.e, tg = tag[x.st.s], on = this._enE && this._enE.id === k;
      const other = G === 'room' ? (e.cat && catN(e.cat) ? catN(e.cat) : this._t('enNoCat')) : (x.room ? this._enAreaN(x.room) : this._t('enDvNoRoom'));
      const line = x.st.w || [other, this._t('ek_' + e.kind)].concat(x.ins.length ? [this._t('enInTag', { n: x.ins.length })] : []).concat(sub ? [this._t('enDvInPlug')] : []).join(' · ');
      const wv = x.ins.length ? x.w : x.wAll;
      return '<button class="endr' + (sub ? ' sub' : '') + (on ? ' on' : '') + '" data-enest="' + esc(k) + '"><span class="ic"><ha-icon class="s18" icon="' + esc(e.icon || this._enKindIc(e.kind)) + '"></ha-icon></span><span class="nm"><b>' + esc(e.name) + '</b><small' + (x.st.w ? ' class="wn"' : '') + '>' + esc(line) + '</small></span><span class="etg ' + tg[0] + '">' + t(tg[1]) + '</span><span class="wv">' + (wv === null ? '–' : esc(lpEnWs(wv, this._lang))) + '</span></button>';
    };
    const keys = Object.keys(GR).sort((a, b) => (!a ? 1 : !b ? -1 : gName(a).localeCompare(gName(b), this._lang)));
    h += keys.length ? keys.map((g) => {
      const L = GR[g].sort((a, b) => (I[b].w || 0) - (I[a].w || 0)), gw = L.reduce((a, k) => a + (I[k].w || 0) + I[k].ins.reduce((s, c) => s + (I[c] ? I[c].w || 0 : 0), 0), 0);
      return '<div class="endg"><div class="endgh"><b>' + esc(gName(g)) + '</b><span>' + t('enDvGN', { n: L.length }) + '</span><em>' + esc(lpEnWs(gw, this._lang)) + '</em></div><div class="endl">' +
        L.map((k) => row(k, false) + I[k].ins.filter((c) => visSet[c]).map((c) => row(c, true)).join('')).join('') + '</div></div>';
    }).join('') : '<div class="endempty">' + (ids.length ? t('enDvNone') : t('enDvEmpty')) + '</div>';
    if (!this._enG && ids.some((k) => !I[k].room)) h += '<div class="hint">' + t('enDvRoomT') + '</div>';
    h += '</div>';
    // sağdan açılan düzenleme ve toplu ekleme pencereleri
    if (this._enE) h += '<div class="endscrim" data-a="eneclose"></div><aside class="enddr" role="dialog" aria-label="' + t(this._enE.id ? 'enEEdit' : 'enENew') + '">' + this._enEditor() + '</aside>';
    if (this._enAddM) h += this._enAddHtml();
    return h;
  }
  // HA'daki, panelde takip edilmeyen ışıklar (gruplar ve ışık odaları hariç)
  _enNewLights() {
    const S = this._hass.states, E = this._enEsts(), R = this._hass.entities || {}, used = {};
    Object.keys(E).forEach((k) => { if (E[k].entity) used[E[k].entity] = 1; });
    return Object.keys(S).filter((x) => x.indexOf('light.') === 0 && !used[x] && !(R[x] && (R[x].hidden || R[x].entity_category)) && !Array.isArray(S[x].attributes.entity_id) && !S[x].attributes.is_hue_group &&
      !(R[x] && R[x].platform === 'group'));
  }
  _enAddHtml() {
    const t = (k, v) => esc(this._t(k, v)), M = this._enAddM, S = this._hass.states, sel = M.sel || {};
    const lights = M.kind === 'lights', L = lights ? this._enNewLights() : this._enFound();
    const room = (x) => { const r = (this._hass.entities || {})[x], d = r && r.device_id && (this._hass.devices || {})[r.device_id]; return (r && r.area_id) || (d && d.area_id) || ''; };
    const G = {}; L.forEach((x) => { const g = room(x); (G[g] = G[g] || []).push(x); });
    // v0.32: adlar bir kez çıkarılır (sıralamanın her karşılaştırmasında bütün sekmeler geziliyordu: pencere 5-7 sn donuyordu)
    const PN = lights ? this._enPanelNames() : null, NM = {};
    const nm = (x) => (NM[x] !== undefined ? NM[x] : (NM[x] = lights ? PN[x] || this._ename(x) : this._enMeasName(x)));
    const lib = M.lib || {};
    const tg = (x) => (!lights ? '<span class="etg t-meas">' + esc(lpEnWs(lpEnW(S, x), this._lang)) + '</span>' : lib[x] === undefined ? '<span class="etg t-est">…</span>' : lib[x] ? '<span class="etg t-lrn">' + t('enTgL') + '</span>' : '<span class="etg t-est">' + t('enTgE') + '</span>');
    const n = L.filter((x) => sel[x] !== false).length;
    const keys = Object.keys(G).sort((a, b) => (!a ? 1 : !b ? -1 : this._enAreaN(a).localeCompare(this._enAreaN(b), this._lang)));
    return '<div class="endscrim" data-a="enaddx"></div><div class="endmod" role="dialog" aria-label="' + t(lights ? 'enDvAddL' : 'enDvAddM') + '"><div class="endmh"><div><b>' + t(lights ? 'enDvAddL' : 'enDvAddM') + '</b><small>' + t(lights ? 'enDvAddLT' : 'enDvAddMT', { n: L.length }) + '</small></div><button class="btn ic sm" data-a="enaddx" aria-label="' + t('close') + '"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="endmb">' +
      '<div class="endall"><button class="btn sm" data-a="enaddsall">' + t('enDvSelAll') + '</button><button class="btn sm" data-a="enaddsnone">' + t('enDvSelNone') + '</button></div>' +
      keys.map((g) => '<div class="endmr">' + esc(g ? this._enAreaN(g) : this._t('enDvNoRoom')) + '</div>' + G[g].sort((a, b) => nm(a).localeCompare(nm(b), this._lang)).map((x) => '<button class="endml' + (sel[x] !== false ? ' on' : '') + '" data-enaddt="' + esc(x) + '"><span class="ck"></span><span class="nm"><b>' + esc(nm(x)) + '</b><small>' + esc(x) + '</small></span>' + tg(x) + '</button>').join('')).join('') +
      '<div class="hint">' + t(lights ? 'enDvAddLH' : 'enDvAddMH') + '</div></div><div class="endmf"><button class="btn" data-a="enaddx">' + t('cancel') + '</button><span class="grow"></span><button class="btn pri" data-a="enaddgo"' + (n && !M.busy ? '' : ' disabled') + '>' + t('enDvAddN', { n: n }) + '</button></div></div>';
  }
  // ışıkların ölçülmüş tablosu var mı (paylaşılan havuz ya da kütüphane): pencere açılınca sırayla sorulur
  _enAddLib() {
    const M = this._enAddM; if (!M || M.kind !== 'lights') return;
    M.lib = M.lib || {};
    const L = this._enNewLights().filter((x) => M.lib[x] === undefined), conn = this._hass.connection;
    // her cevapta bütün panel yeniden çiziliyordu (ışık sayısı kadar çizim); cevaplar 250 ms'de bir toplu çizilir
    const later = () => { if (M.rt) return; M.rt = setTimeout(() => { M.rt = null; if (this._enAddM === M) this._render(); }, 250); };
    const next = (i) => {
      if (this._enAddM !== M || i >= L.length) return;
      const d = this._lrnDev(L[i]);
      if (!d.man || !(d.model || d.model_id)) { M.lib[L[i]] = null; later(); return next(i + 1); }
      conn.sendMessagePromise({ type: 'lemur_home_dashboard/pool_lookup', manufacturer: d.man, model: d.model, model_id: d.model_id })
        .then((r) => { M.lib[L[i]] = r && r.lut && !r.per_m ? r : null; }, () => { M.lib[L[i]] = null; }).then(() => { later(); next(i + 1); });
    };
    next(0);
  }
  // seçilenleri ekle: ışıklar Işıklar kategorisine (yoksa açılır), ölçülmüş tablo varsa onunla; ölçenler kendi sensörleriyle
  async _enAddGo() {
    const M = this._enAddM; if (!M) return;
    const sel = M.sel || {}, L = (M.kind === 'lights' ? this._enNewLights() : this._enFound()).filter((x) => sel[x] !== false);
    if (!L.length) return;
    if (M.kind !== 'lights') { this._enAddM = null; return this._enAddMeas(L); }
    M.busy = true; this._render();
    let C = this._enCats(), cat = C.filter((c) => /ışık|isik|light|aydınlat|lamba/i.test(String(c.name).toLocaleLowerCase('tr')))[0];
    if (!cat) { const cid = this._enSlug(this._t('enDvLCat'), null, ''); cat = { id: cid, name: this._t('enDvLCat'), color: '#FFC94A', icon: 'mdi:lightbulb-group' }; C = C.concat([cat]); }
    const E = lhdClone(this._enEsts()), P = this._enPanelNames();
    L.forEach((x) => {
      const name = String(P[x] || this._ename(x)).slice(0, 60), id = this._enSlug(name, E), r = (M.lib || {})[x];
      const e = { name: name, kind: 'light', entity: x, idle: 0.5, max: 9, cat: cat.id };
      if (r && r.lut) { e.lut = r.lut; e.src = r.source === 'pool' ? 'pool' : 'library'; e.idle = Math.round((r.standby || 0) * 100) / 100; e.min = r.min; e.max = r.cap_w > 0 ? Math.min(r.max, r.cap_w) : r.max; }
      E[id] = e;
    });
    try {
      if (C !== this._enCats()) await this._commit('ecats', C);
      await this._commit('estimates', E);
      this._toast(this._t('enDAdded', { n: L.length }));
    } catch (err) { this._toast(String((err && err.message) || err)); }
    this._enAddM = null; LP_EN.at = 0; lpEnEnsure(this._hass); this._render();
  }
  _enEditor() {
    const t = (k, v) => esc(this._t(k, v)), D = this._enE; if (!D) return '';
    const S = this._hass.states, f = D.f, C = this._enCats(), E0 = this._enEsts();
    const fld = (key, label, step, dl, ph, wide) => '<div class="fld' + (wide ? ' wide' : '') + '"><label title="' + label + '">' + label + '</label><input class="inp" ' + (step ? 'type="number" min="0" step="' + step + '"' : 'spellcheck="false"' + (dl ? ' list="' + dl + '"' : '')) + ' data-enf="' + key + '" value="' + esc(f[key] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '></div>';
    const sel = (key, label, list, none) => '<div class="fld"><label>' + label + '</label><select class="inp" data-enf="' + key + '">' + (none ? '<option value="">' + esc(none) + '</option>' : '') +
      list.map((id) => '<option value="' + esc(id) + '"' + (f[key] === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + (f[key] && list.indexOf(f[key]) < 0 ? '<option value="' + esc(f[key]) + '" selected>' + esc(f[key]) + '</option>' : '') + '</select></div>';
    const ids = Object.keys(S).sort(), st = f.entity ? S[f.entity] : null, dom = String(f.entity || '').split('.')[0];
    const room = D.id && E0[D.id] ? this._enRoom(D.id, E0[D.id]) : (f.entity && this._enRoom('', { entity: f.entity, kind: f.kind })) || '';
    const stat = D.id && E0[D.id] ? this._enStat(D.id, E0[D.id]) : null;
    // başlık
    let h = '<div class="ened"><div class="enddh"><span class="ic"><ha-icon icon="' + esc(f.icon || this._enKindIc(f.kind)) + '"></ha-icon></span><div class="nm"><b>' + (D.id ? esc(f.name || '') : t('enENew')) + '</b><small>' + esc((room ? this._enAreaN(room) : this._t('enDvNoRoom')) + (f.cat && f.cat !== '__new' ? ' · ' + ((C.filter((c) => c.id === f.cat)[0] || {}).name || '') : '') + (f.kind === 'light' && f.strip && f.len0 > 0 ? ' · ' + this._t('enSrM', { m: lpEnNum(f.len0, 2, this._lang) }) : '')) + '</small></div>' +
      '<button class="btn ic sm" data-a="eneclose" aria-label="' + t('close') + '"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="enddb">';
    if (stat && stat.w) h += '<div class="enddw"><b>' + esc(stat.w) + '</b><span>' + t(stat.s === 'chk' && f.kind === 'meas' ? 'enWSensT' : 'enWNoEntT') + '</span></div>';
    // 1. bu ne?
    h += '<section><h4>' + t('enDsWhat') + '</h4><div class="engrid g2">' + (D.id ? '' : this._enPickHtml()) + fld('name', t('enEName'), '', '', '', !!D.id) +
      '<div class="fld"><label>' + t('enECat') + '</label><select class="inp" data-enf="cat"><option value="">' + t('enNoCat') + '</option>' + C.map((c) => '<option value="' + esc(c.id) + '"' + (f.cat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') +
      '<option value="__new"' + (f.cat === '__new' ? ' selected' : '') + '>' + t('enNewCat') + '</option></select></div>' + (f.cat === '__new' ? fld('newcat', t('enNewCatN')) : '') +
      '<div class="fld"><label>' + t('enDsRoom') + '</label><div class="endro">' + esc(room ? this._enAreaN(room) : this._t('enDvNoRoom')) + '</div></div></div><div class="hint">' + t('enDsRoomT') + '</div></section>';
    // 2. gücünü nereden biliyoruz? cihaza uyan yöntemler, önerilen işaretli
    const rec = f.kind === 'meas' && f.sensor ? 'meas' : dom === 'light' ? 'light' : /^(media_player|climate|vacuum|water_heater|select|input_select|humidifier|fan)$/.test(dom) ? 'states' : /^(switch|input_boolean|remote)$/.test(dom) ? 'onoff' : '';
    const ok = (k) => k === f.kind || k === 'meas' || k === 'fixed' || k === 'year' || k === 'cycle' || (k === 'light' ? !f.entity || dom === 'light' : !f.entity || dom !== 'light' || k === 'onoff');
    const kinds = ['meas', 'light', 'states', 'onoff', 'fixed', 'year', 'cycle'].filter(ok);
    if (rec) kinds.sort((a, b) => (a === rec ? -1 : b === rec ? 1 : 0));
    h += '<section><h4>' + t('enDsHow') + '</h4><div class="endhow">' + kinds.map((k) => '<button class="' + (f.kind === k ? 'on' : '') + '" data-enk="' + k + '"><span class="dot"></span><span><b>' + t('ekL_' + k) + (k === rec ? ' <em>' + t('enDsRec') + '</em>' : '') + '</b><small>' + t('ekD_' + k) + '</small></span></button>').join('') + '</div></section>';
    // 3. değerler
    h += '<section><h4>' + t('enDsVals') + '</h4><div class="engrid ' + ({ light: 'g3', onoff: 'g2', cycle: 'g2', meas: 'g2' }[f.kind] || 'g1') + '">';
    if (f.kind === 'meas') {
      const sol = lpEnSolar(), taken = {};
      Object.keys(E0).forEach((k) => { if (k !== D.id && E0[k].sensor) taken[E0[k].sensor] = 1; });
      [sol.prod, sol.grid, sol.grid_in, sol.grid_out, sol.bat_power].forEach((x) => { if (x) taken[x] = 1; });
      const pw = ids.filter((x) => x.indexOf('sensor.') === 0 && lpEnIsPow(S[x]) && x.indexOf('sensor.lhd_') !== 0 && !lpEnIsVirt(x) && !taken[x]);
      const en = ids.filter((x) => x.indexOf('sensor.') === 0 && x.indexOf('sensor.lhd_') !== 0 && !lpEnIsVirt(x) && S[x].attributes.state_class && (S[x].attributes.device_class === 'energy' || /^(kWh|Wh)$/.test(String(S[x].attributes.unit_of_measurement || ''))));
      h += sel('sensor', t('enMSensor'), pw, this._t('enPick')) + sel('energy', t('enMEnergy'), en, this._t('enMCalc'));
    }
    if (f.kind === 'light') h += (D.id ? '' : fld('entity', t('enEEnt'), '', 'enlights', '', true)) + fld('idle', t('enEIdle'), '0.1') + fld('min', t('enEMin'), '0.1', '', this._t('enMinPh')) + fld('max', t('enEMax'), '1');
    if (f.kind === 'onoff') h += fld('entity', t('enEEnt'), '', 'enents', '', true) + fld('off', t('enEOff'), '0.1') + fld('on', t('enEOn'), '1');
    if (f.kind === 'states') h += fld('entity', t('enEEnt'), '', 'enents', '', true);
    if (f.kind === 'fixed') h += fld('w', t('enEW'), '0.1');
    if (f.kind === 'year') h += fld('year', t('enEYear'), '1');
    if (f.kind === 'cycle') h += fld('k100', t('enEK100'), '1') + fld('week', t('enEWeek'), '1');
    if (f.kind === 'light' && D.lib) h += '<div class="hint enlib wide' + (D.lib.lut ? ' ok' : '') + '">' + (D.lib.busy ? t('enLibBusy') : D.lib.lut ? t('enLibOk', { n: D.lib.name || '' }) : D.lib.strip ? t('enLibStrip') : t('enLibNone')) + '</div>';
    if (f.kind === 'light' && f.lut) h += '<div class="hint wide">' + t(f.src === 'own' ? 'enDsLutOwn' : 'enDsLutLib') + (lpEnNumOf(f.idle) < LP_SB_MIN ? ' ' + t('enSbUnmT', { w: lpEnNum(LP_SB_FLOOR, 1, this._lang) }) : '') + '</div>';
    h += '</div>';
    if (f.kind === 'light') {
      const K = this._enStripK(f);
      h += '<div class="enstrip"><label class="enstc"><input type="checkbox" data-enstrip' + (f.strip ? ' checked' : '') + '><span><b>' + t('enSr') + '</b><i>' + t('enSrT') + '</i></span></label>';
      if (f.strip) {
        const num = (key, label, step, ph) => '<div class="fld"><label>' + label + '</label><input class="inp" type="number" min="0" step="' + step + '" data-enf="' + key + '" value="' + esc(f[key] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '></div>';
        h += '<div class="engrid g3">' + num('len', t('enSrLen'), '0.1') + num('cap', t('enSrCap'), '1', this._t('enSrCapPh')) + (f.lut && !(f.len0 > 0) && !f._per ? num('lenref', t('enSrRef'), '0.1', this._t('enSrRefPh')) : '') + '</div>';
        if (f.lut && !(f.len0 > 0) && !f._per) h += '<div class="hint">' + t('enSrRefT') + '</div>';
        if (K && K.len && K.ref && K.k !== 1) h += '<div class="hint enlib ok">' + t('enSrNew', { a: lpEnNum(K.ref, 2, this._lang), b: lpEnNum(K.len, 2, this._lang), w: lpEnWs(this._enRec(f).max, this._lang) }) + '</div>';
      }
      h += '</div>';
    }
    if (f.kind === 'states') {
      const L = this._enStatesOf(f.entity); Object.keys(f.st).forEach((x) => { if (L.indexOf(x) < 0) L.push(x); });
      h += f.entity ? '<div class="enst"><div class="ensh"><b>' + t('enStT') + '</b><span>' + t('enStH') + '</span></div>' + L.map((x) => '<div class="enstr' + (st && st.state === x ? ' on' : '') + '"><span>' + esc(this._enStLab(st, x)) + (st && st.state === x ? ' <em class="enp ok">' + t('enENow') + '</em>' : '') + '</span><span class="ennum"><input class="inp" type="number" min="0" step="0.1" data-enst="' + esc(x) + '" value="' + esc(f.st[x] !== undefined ? f.st[x] : '') + '" placeholder="' + esc(f.other || '0') + '"><i>W</i></span></div>').join('') +
        '<div class="enstr"><span>' + t('enStOther') + '</span><span class="ennum"><input class="inp" type="number" min="0" step="0.1" data-enf="other" value="' + esc(f.other || '') + '"><i>W</i></span></div></div>' : '<div class="hint">' + t('enStPick') + '</div>';
    }
    const e = this._enRec(f);
    const now = f.kind === 'meas' ? lpEnW(S, f.sensor) : lpEnEstW(e, st);
    let calc = '';
    if (f.kind === 'light') calc = [10, 30, 50, 100].map((p) => '<div><span>' + t('enEBri', { p: p }) + '</span><b>' + esc(lpEnNum(lpEnEstW(e, { state: 'on', attributes: { brightness: p * 2.55 } }), 1, this._lang)) + ' W</b></div>').join('') + (st ? '<div class="tot"><span>' + t('enENow') + '</span><b>' + esc(lpEnNum(now, 1, this._lang)) + ' W</b></div>' : '');
    else if (f.kind === 'onoff' || f.kind === 'states' || f.kind === 'meas') calc = now !== null && (st || f.kind === 'meas') ? '<div class="tot"><span>' + t('enENow') + '</span><b>' + esc(lpEnNum(now, 1, this._lang)) + ' W</b></div>' : '';
    else calc = '<div><span>' + t('enEAvg') + '</span><b>' + esc(lpEnNum(now, 1, this._lang)) + ' W</b></div><div class="tot"><span>' + t('enEDay', { k: lpEnNum(now * 24 / 1000, 2, this._lang), y: lpEnNum(now * 8.76, 0, this._lang) }) + '</span><b></b></div>';
    if (calc) h += '<div class="encalc">' + calc + '</div>';
    if (f.kind === 'meas') h += this._enInsideHtml(D, now);
    const warn = (f.kind === 'light' || f.kind === 'onoff' || f.kind === 'states') && f.entity && !st ? t('enWNoEnt') : f.kind === 'states' && f.entity && !e.states.length && !e.other ? t('enWZero') : '';
    h += '<div class="hint enwarn">' + warn + '</div>' + this._lrnBox();
    if (f.kind === 'year') h += '<div class="hint">' + t('enEYearT') + '</div>';
    const sid = D.id || this._enSlug(f.name);
    h += '<details class="endadv"><summary>' + t('enDsAdv') + '</summary><div class="hint">' + (f.kind === 'meas' ? (f.energy ? t('enDsOwnE', { e: f.energy }) : t('enMCalcT', { e: 'sensor.lhd_' + sid + '_energy' })) : t('enEEnts', { p: 'sensor.lhd_' + sid + '_power', e: 'sensor.lhd_' + sid + '_energy' })) + '</div></details></section></div>' +
      (this._enErr ? '<div class="imerr">' + esc(this._enErr) + '</div>' : '') +
      '<div class="enddf">' + (D.id ? '<button class="btn dan' + (D.ask ? ' ask' : '') + '" data-a="enedel"><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (D.ask ? t('enEDelQ') : t('enEDel')) + '</button>' : '') + '<span class="grow"></span>' +
      '<button class="btn" data-a="eneclose">' + t('cancel') + '</button><button class="btn pri" data-a="enesave"' + (this._enBusy ? ' disabled' : '') + '>' + t('enESave') + '</button></div></div>';
    h += '<datalist id="enlights">' + ids.filter((x) => x.indexOf('light.') === 0).map((x) => '<option value="' + esc(x) + '">' + esc(this._ename(x)) + '</option>').join('') + '</datalist>' +
      '<datalist id="enents">' + ids.filter((x) => /^(light|switch|media_player|fan|climate|input_boolean|binary_sensor|vacuum|humidifier|water_heater|select|input_select|remote|lock|cover)\./.test(x)).map((x) => '<option value="' + esc(x) + '">' + esc(this._ename(x)) + '</option>').join('') + '</datalist>';
    return h;
  }
  // ölçen prize bağlı öteki cihazlar: işaretlenenlerin gücü prizin değerinden çıkar, kalan pay ayrı satır olur
  _enInsideCand(D) {
    const E = this._enEsts(), me = D.id;
    const other = {}; Object.keys(E).forEach((k) => { if (k !== me && E[k].kind === 'meas' && Array.isArray(E[k].inside)) E[k].inside.forEach((x) => { other[x] = k; }); });
    return Object.keys(E).filter((k) => k !== me && !(E[k].kind === 'meas' && Array.isArray(E[k].inside) && E[k].inside.length) && !other[k])
      .sort((a, b) => String(E[a].name).localeCompare(String(E[b].name), this._lang));
  }
  _enInsideHtml(D, now) {
    const t = (k, v) => esc(this._t(k, v)), E = this._enEsts(), f = D.f, ins = f.inside || [], L = this._enInsideCand(D);
    let h = '<div class="eninside"><div class="ensh"><b>' + t('enInT') + '</b><span>' + t('enInH') + '</span></div>';
    if (!L.length) return h + '<div class="hint">' + t('enInNone') + '</div></div>';
    let sum = 0;
    h += '<div class="eninl">' + L.map((k) => { const on = ins.indexOf(k) >= 0, w = this._enDevW(k, E[k]); if (on && w !== null) sum += w;
      return '<button class="eninb' + (on ? ' on' : '') + '" data-eninside="' + esc(k) + '" aria-pressed="' + on + '"><span class="ck"></span><ha-icon class="s16" icon="' + esc(E[k].icon || this._enKindIc(E[k].kind)) + '"></ha-icon><b>' + esc(E[k].name) + '</b><em>' + (w === null ? '–' : esc(lpEnNum(w, 1, this._lang)) + ' W') + '</em></button>'; }).join('') + '</div>';
    if (ins.length) {
      h += '<div class="fld"><label>' + t('enInRest') + '</label><input class="inp" data-enf="rest" value="' + esc(f.rest || '') + '" placeholder="' + esc(String(f.name || '').trim() || this._t('enInRestPh')) + '"><div class="hint">' + t('enInRestT') + '</div></div>';
      if (now !== null && now !== undefined) h += '<div class="encalc"><div><span>' + t('enInPlug') + '</span><b>' + esc(lpEnNum(now, 1, this._lang)) + ' W</b></div><div><span>' + t('enInDevs', { n: ins.length }) + '</span><b>− ' + esc(lpEnNum(sum, 1, this._lang)) + ' W</b></div><div class="tot"><span>' + esc(String(f.rest || '').trim() || String(f.name || '').trim() || this._t('enInRestPh')) + '</span><b>' + esc(lpEnNum(Math.max(0, now - sum), 1, this._lang)) + ' W</b></div></div>';
      h += '<div class="hint">' + t('enInHint') + '</div>';
    }
    return h + '</div>';
  }
  // taslaktan kayıt (sayılar 0-50000)
  // paneldeki adlar: sekmelerdeki öğelerin kendi adı (yoksa Home Assistant'taki adı)
  _enPanelNames() {
    const m = {};
    this._work().forEach((T) => (T.sections || []).forEach((sc) => (sc.entities || []).forEach((r) => { const it = typeof r === 'string' ? { entity: r } : r || {}; if (it.entity && m[it.entity] === undefined) m[it.entity] = it.name || ''; })));
    return m;
  }
  _enPickHtml() {
    const S = this._hass.states, E = this._enEsts(), used = {}, P = this._enPanelNames(), ok = /^(light|switch|media_player|fan|climate|input_boolean|vacuum|humidifier|water_heater|select|input_select|remote|cover)\./;
    Object.keys(E).forEach((k) => { if (E[k].entity) used[E[k].entity] = 1; });
    const nm = (x) => P[x] || this._ename(x), cmp = (a, b) => nm(a).localeCompare(nm(b), this._lang);
    const inP = Object.keys(P).filter((x) => S[x] && ok.test(x) && !used[x]).sort(cmp);
    const rest = Object.keys(S).filter((x) => ok.test(x) && !used[x] && P[x] === undefined).sort(cmp);
    const cur = this._enE.f.entity || '';
    const o = (x) => '<option value="' + esc(x) + '"' + (x === cur ? ' selected' : '') + '>' + esc(nm(x)) + '</option>';
    return '<div class="fld"><label>' + esc(this._t('enPick1')) + '</label><select class="inp" data-enpick><option value="">' + esc(this._t('enPick')) + '</option>' +
      (inP.length ? '<optgroup label="' + esc(this._t('enPick1N', { n: inP.length })) + '">' + inP.map(o).join('') + '</optgroup>' : '') +
      (rest.length ? '<optgroup label="' + esc(this._t('enPickOther')) + '">' + rest.map(o).join('') + '</optgroup>' : '') + '</select></div>';
  }
  // yeni cihazda bir cihaz seçilince: ad paneldekinden, tür alanından, kategori adından; ışıkta ölçülmüş tablo kütüphaneden
  _enAuto(ent) {
    const D = this._enE, S = this._hass.states; if (!D || D.id || !ent || !S[ent]) return;
    const f = D.f, dom = ent.split('.')[0], nm = this._enPanelNames()[ent] || this._ename(ent);
    if (!String(f.name || '').trim() || f.name === f._auto) { f.name = nm; f._auto = nm; }
    f.entity = ent;
    f.kind = dom === 'light' ? 'light' : /^(switch|input_boolean|fan|remote)$/.test(dom) ? 'onoff' : 'states';
    const want = { light: /ışık|isik|light|aydınlat|lamba/i, climate: /klima|iklim|climate|ısıt|isit/i, media_player: /medya|media|ekran|tv|müzik/i, vacuum: /süpürge|supurge|vacuum|robot/i }[dom];
    if (!f.cat || f.cat === f._autoCat) { const c = want ? this._enCats().filter((x) => want.test(String(x.name).toLocaleLowerCase('tr')))[0] : null; f.cat = c ? c.id : ''; f._autoCat = f.cat; }
    delete f.lut; delete f.src; delete f._per; D.lib = null;
    if (f.kind === 'light') this._enLib(ent);
  }
  _enLib(ent) {
    const D = this._enE, d = this._lrnDev(ent);
    if (!d.man || !(d.model || d.model_id)) return;
    D.lib = { busy: true };
    this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/pool_lookup', manufacturer: d.man, model: d.model, model_id: d.model_id }).then((r) => {
      if (this._enE !== D || D.f.entity !== ent) return;
      if (!r || !r.lut) { D.lib = { none: true }; return this._render(); }
      if (r.per_m) { D.lib = { strip: true }; D.f._per = r; D.f.strip = true; if (r.cap_w > 0 && !D.f.cap) D.f.cap = String(r.cap_w); D.f.idle = String(Math.round((r.standby || 0) * 100) / 100); return this._render(); }
      const f = D.f; D.lib = r; f.lut = r.lut; f.src = r.source === 'pool' ? 'pool' : 'library';
      f.idle = String(Math.round((r.standby || 0) * 100) / 100); f.min = String(r.min); f.max = String(r.max);
      if (r.cap_w > 0) f.max = String(Math.min(r.max, r.cap_w));
      this._render();
    }, () => { if (this._enE === D) { D.lib = { none: true }; this._render(); } });
  }
  // şerit uzunluğu: tablo (ya da en düşük / en yüksek) eski uzunluktan yenisine ölçeklenir, adaptör gücünü geçmez
  _enStripK(f) {
    if (f.kind !== 'light' || !f.strip) return null;
    const len = lpEnNumOf(f.len), cap = lpEnNumOf(f.cap), ref = f.len0 > 0 ? f.len0 : lpEnNumOf(f.lenref) > 0 ? lpEnNumOf(f.lenref) : len;
    if (f._per && len > 0) return { len: len, cap: cap, k: len, per: true, ref: 0 };
    return { len: len > 0 && len <= 50 ? len : 0, cap: cap > 0 && cap <= 2000 ? cap : 0, k: len > 0 && ref > 0 ? len / ref : 1, ref: ref };
  }
  _enRec(f) {
    const n = (k) => Math.min(50000, lpEnNumOf(f[k])), ent = String(f.entity || '').trim(), e = { name: String(f.name || '').trim().slice(0, 60), kind: f.kind };
    if (f.kind === 'meas') {
      e.sensor = f.sensor || ''; if (f.energy) e.energy = f.energy;
      const ins = (f.inside || []).filter((k) => this._enEsts()[k]).slice(0, 20);
      if (ins.length) { e.inside = ins; const r = String(f.rest || '').trim().slice(0, 60); if (r) e.rest = r; }
    }
    if (f.kind === 'light') {
      Object.assign(e, { idle: n('idle'), max: n('max'), entity: ent }); if (String(f.min).trim() !== '') e.min = n('min'); if (f.lut && typeof f.lut === 'object') e.lut = f.lut;
      const K = this._enStripK(f);
      if (K) {
        e.strip = true; if (K.len) e.len = Math.round(K.len * 100) / 100; if (K.cap) e.cap = K.cap;
        const sb = e.idle || 0, sc = (w) => { let v = sb + Math.max(0, w - sb) * K.k; if (K.cap > 0) v = Math.min(v, K.cap); return Math.round(v * 100) / 100; };
        if (K.per) { e.lut = this._lrnScale(f._per.lut, f._per.standby || 0, K.len, K.cap); e.src = 'pool'; }
        else if (e.lut && (K.k !== 1 || K.cap > 0)) e.lut = this._lrnScale(e.lut, sb, K.k, K.cap);
        if (e.lut) { const sp = this._lrnSpan(e.lut); e.min = Math.round(sp[0] * 100) / 100; e.max = Math.round(sp[1] * 100) / 100; }
        else if (K.k !== 1 || K.cap > 0) { e.max = sc(e.max); if (e.min !== undefined) e.min = sc(e.min); }
      }
    }
    if (f.src && !e.src && (f.kind === 'light' || f.kind === 'fixed' || f.kind === 'states')) e.src = f.src;
    if (f.kind === 'onoff') Object.assign(e, { off: n('off'), on: n('on'), entity: ent });
    if (f.kind === 'states') { e.entity = ent; e.other = n('other'); e.states = Object.keys(f.st || {}).filter((x) => String(f.st[x]).trim() !== '').slice(0, 24).map((x) => ({ s: x.slice(0, 40), w: Math.min(50000, lpEnNumOf(f.st[x])) })); }
    if (f.kind === 'fixed') e.w = n('w');
    if (f.kind === 'year') e.year = n('year');
    if (f.kind === 'cycle') Object.assign(e, { k100: n('k100'), week: Math.min(100, n('week')) });
    if (f.icon && /^[a-z]+:[a-z0-9-]+$/.test(f.icon)) e.icon = f.icon;
    return e;
  }
  _enSlug(name, E0, pre) {
    const base = (pre || '') + (String(name || '').toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 30) || 'cihaz');
    const E = E0 || this._enEsts(), S = this._hass.states, C = this._enCats();
    const cat = pre !== undefined;   // kategori kimliği: kategoriler arasında benzersiz
    let b2 = base; if (!cat && (b2.indexOf('kat_') === 0 || b2 === 'solar')) b2 = 'c_' + b2;
    let id = b2, k = 2; while (cat ? C.some((c) => c.id === id) : (E[id] || S['sensor.lhd_' + id + '_power'] || S['sensor.lhd_' + id + '_energy'])) id = b2 + '_' + (k++);
    return id;
  }
  _enColor(i) { const P = ['#5B8DEF', '#FFC94A', '#4DD0E1', '#FF7AA2', '#3DDC84', '#B388FF', '#FF9142', '#90A4AE', '#7BD83A', '#E5484D']; return P[i % P.length]; }
  _enBadNum(f) {
    const raw = (v) => String(v === undefined || v === null ? '' : v).trim().replace(',', '.'), num = (v) => { const s = raw(v); return s === '' ? null : /^-?\d*\.?\d+(e[+-]?\d+)?$/i.test(s) ? parseFloat(s) : NaN; };
    const keys = { light: ['idle', 'min', 'max'], onoff: ['off', 'on'], states: ['other'], fixed: ['w'], year: ['year'], cycle: ['k100', 'week'] }[f.kind] || [];
    const lim = { year: 100000, k100: 10000, week: 100 };
    const vals = keys.map((k) => [k, num(f[k]), lim[k] || 50000]).concat(f.kind === 'states' ? Object.keys(f.st || {}).map((s) => ['st', num(f.st[s]), 50000]) : []);
    for (let i = 0; i < vals.length; i++) { const v = vals[i][1]; if (v === null) continue; if (v !== v) return this._t('enENaN'); if (!(v >= 0)) return this._t('enENeg'); if (v > vals[i][2]) return this._t('enEBig', { n: this._enNum(vals[i][2]) }); }
    const g = (k) => { const v = num(f[k]); return v === null ? null : v; };
    if (f.kind === 'onoff' && g('on') !== null && g('off') !== null && g('on') < g('off')) return this._t('enEOnOff');
    if (f.kind === 'light' && !f.lut && g('max') !== null && ((g('min') !== null && g('max') < g('min')) || (g('idle') !== null && g('max') < g('idle')))) return this._t('enEMaxMin');
    return '';
  }
  async _enSave() {
    const D = this._enE; if (!D) return;
    const f = D.f, e = this._enRec(f);
    this._enErr = '';
    if (!e.name) { this._enErr = this._t('enENeed'); return this._render(); }
    if (e.kind === 'meas' && !e.sensor) { this._enErr = this._t('enMNeed'); return this._render(); }
    if (e.kind === 'meas' && Object.keys(this._enEsts()).some((k) => k !== D.id && this._enEsts()[k].sensor === e.sensor)) { this._enErr = this._t('enMUsed'); return this._render(); }
    if ((e.kind === 'light' || e.kind === 'onoff' || e.kind === 'states') && !/^[a-z0-9_]+\.[a-z0-9_]+$/.test(e.entity)) { this._enErr = this._t('enENeedEnt'); return this._render(); }
    // v0.32: sayılar sessizce düzeltilmez (eksi değer 0, çok büyük değer 50000 oluyordu); neyin yanlış olduğu yazılır
    const bad = this._enBadNum(f); if (bad) { this._enErr = bad; return this._render(); }
    if (Object.keys(this._enEsts()).some((k) => k !== D.id && String(this._enEsts()[k].name || '').toLocaleLowerCase('tr') === e.name.toLocaleLowerCase('tr'))) { this._enErr = this._t('enEDup'); return this._render(); }
    let C = this._enCats();
    if (f.cat === '__new') {
      const nm = String(f.newcat || '').trim(); if (!nm) { this._enErr = this._t('enCNeed'); return this._render(); }
      const same = C.filter((c) => String(c.name).toLocaleLowerCase('tr') === nm.toLocaleLowerCase('tr'))[0];   // aynı adda kategori varsa o
      if (same) e.cat = same.id;
      else { const cid = this._enSlug(nm, null, ''); C = C.concat([{ id: cid, name: nm.slice(0, 60), color: this._enColor(C.length) }]); e.cat = cid; }
    } else if (f.cat) e.cat = f.cat;
    const E = lhdClone(this._enEsts()), id = D.id || this._enSlug(e.name);
    E[id] = e;
    this._enBusy = true; this._render();
    try {
      if (C !== this._enCats()) await this._commit('ecats', C);
      await this._commit('estimates', E);
      this._toast(this._t('enESaved'));
    } catch (err) { this._toast(this._t('err', { e: (err && err.message) || err }), false); }
    LP_EN.at = 0; LP_EN.tp = {}; lpEnEnsure(this._hass);
    this._enBusy = false; this._enDraft(id); this._render();
  }
  async _enDel() {
    const D = this._enE; if (!D || !D.id) return;
    if (!D.ask) { D.ask = true; return this._render(); }
    const E = lhdClone(this._enEsts()); delete E[D.id];
    await this._commit('estimates', E); this._toast(this._t('enEDeleted'));
    LP_EN.at = 0; LP_EN.tp = {}; lpEnEnsure(this._hass);
    this._enE = null; this._render();
  }
  // ---- kategoriler (data.ecats): her biri için Home Assistant'ta toplam güç ve kWh sensörü ----
  _enCat() {
    const t = (k, v) => esc(this._t(k, v)), C = this._enCats(), E = this._enEsts(), S = this._hass.states;
    let h = '<h3 class="enh">' + t('en_cat') + '</h3><p class="enlead">' + t('enCatT') + '</p>';
    const ed = this._enCEd(), lst = C.length ? '<div class="ensl">' + C.map((c, i) => { const n = Object.keys(E).filter((k) => E[k].cat === c.id).length, w = lpEnW(S, 'sensor.lhd_kat_' + c.id + '_power'), lk = lpEnLookOf(c.name, i);
      return '<button class="ensr' + (this._enC && this._enC.id === c.id ? ' on' : '') + '" data-encid="' + esc(c.id) + '"><span class="encmv"><i data-encmv="' + i + ':-1"' + (i ? '' : ' class="off"') + '><ha-icon icon="mdi:chevron-up"></ha-icon></i><i data-encmv="' + i + ':1"' + (i < C.length - 1 ? '' : ' class="off"') + '><ha-icon icon="mdi:chevron-down"></ha-icon></i></span><span class="encdot" style="background:' + esc(c.color || lk[1]) + '"><ha-icon icon="' + esc(c.icon || lk[0]) + '"></ha-icon></span><span><b>' + esc(c.name) + '</b><i>' + t('enCDevs', { n: n }) + '</i></span><em class="enp">' + (w === null ? '…' : esc(lpEnWs(w, this._lang))) + '</em></button>'; }).join('') + '</div>' : '<div class="hint">' + t('enCNone') + '</div>';
    return h + '<div class="acts"><button class="btn" data-a="encnew"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('enCAdd') + '</button></div>' + ed + lst;
  }
  _enCEd() {
    const t = (k, v) => esc(this._t(k, v)), E = this._enEsts(), D = this._enC; if (!D) return '';
    let h = '';
    const ids = Object.keys(E).sort((a, b) => String(E[a].name).localeCompare(String(E[b].name), this._lang));
    const cols = ['#5B8DEF', '#FFC94A', '#4DD0E1', '#FF7AA2', '#3DDC84', '#B388FF', '#FF9142', '#90A4AE', '#7BD83A', '#E5484D'];
    h += '<div class="ened"><div class="ensh"><b>' + t(D.id ? 'enCEdit' : 'enCAdd') + '</b><button class="btn ic sm" data-a="encclose" style="margin-left:auto"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="engrid"><div class="fld"><label>' + t('enEName') + '</label><input class="inp" spellcheck="false" data-encf="name" value="' + esc(D.name) + '"></div></div>' +
      '<div class="fld"><label>' + t('enCColor') + '</label><div class="encols">' + cols.map((c) => '<button data-encol="' + c + '" class="' + (D.color === c ? 'on' : '') + '" style="background:' + c + '"></button>').join('') + '</div></div>' +
      '<div class="fld"><label>' + t('enCMem', { n: Object.keys(D.m).filter((k) => D.m[k]).length }) + '</label>' + (ids.length ? '<div class="enmem">' + ids.map((k) => { const oc = E[k].cat && E[k].cat !== D.id ? (this._enCats().filter((c) => c.id === E[k].cat)[0] || {}).name : '';
        return '<label class="enmi"><input type="checkbox" data-encm="' + esc(k) + '"' + (D.m[k] ? ' checked' : '') + '><span><b>' + esc(E[k].name) + '</b>' + (oc ? '<i>' + esc(oc) + '</i>' : '') + '</span></label>'; }).join('') + '</div>' : '<div class="hint">' + t('enENone') + '</div>') + '</div>' +
      (this._enErr ? '<div class="imerr">' + esc(this._enErr) + '</div>' : '') +
      '<div class="acts">' + (D.id ? '<button class="btn dan' + (D.ask ? ' ask' : '') + '" data-a="encdel"><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (D.ask ? t('enEDelQ') : t('enEDel')) + '</button>' : '') + '<span class="grow"></span><button class="btn pri" data-a="encsave">' + t('enESave') + '</button></div></div>';
    return h;
  }
  _enCDraft(id) {
    const c = id ? this._enCats().filter((x) => x.id === id)[0] : null, E = this._enEsts(), m = {};
    if (c) Object.keys(E).forEach((k) => { if (E[k].cat === c.id) m[k] = true; });
    this._enC = { id: c ? c.id : null, name: c ? c.name : '', color: c ? c.color || '' : this._enColor(this._enCats().length), m: m, ask: false };
  }
  async _enCSave() {
    const D = this._enC; if (!D) return;
    const nm = String(D.name || '').trim(); this._enErr = '';
    if (!nm) { this._enErr = this._t('enCNeed'); return this._render(); }
    if (this._enCats().some((c) => c.id !== D.id && String(c.name).toLocaleLowerCase('tr') === nm.toLocaleLowerCase('tr'))) { this._enErr = this._t('enCSame'); return this._render(); }
    const id = D.id || this._enSlug(nm, null, '');
    const C = this._enCats().map((c) => (c.id === id ? Object.assign({}, c, { name: nm.slice(0, 60), color: D.color || c.color }) : c));
    if (!D.id) { const o = { id: id, name: nm.slice(0, 60) }; if (D.color) o.color = D.color; C.push(o); }
    const E = lhdClone(this._enEsts());
    Object.keys(E).forEach((k) => { if (D.m[k]) E[k].cat = id; else if (E[k].cat === id) delete E[k].cat; });
    await this._commit('ecats', C); await this._commit('estimates', E);
    this._toast(this._t('enESaved')); LP_EN.at = 0; lpEnEnsure(this._hass);
    this._enCDraft(id); this._render();
  }
  async _enCDel() {
    const D = this._enC; if (!D || !D.id) return;
    if (!D.ask) { D.ask = true; return this._render(); }
    const E = lhdClone(this._enEsts()); Object.keys(E).forEach((k) => { if (E[k].cat === D.id) delete E[k].cat; });
    await this._commit('estimates', E); await this._commit('ecats', this._enCats().filter((c) => c.id !== D.id));
    this._toast(this._t('enEDeleted')); LP_EN.at = 0; lpEnEnsure(this._hass);
    this._enC = null; this._render();
  }
  // ---- güneş, şebeke ve batarya (settings.energy.solar) ----
  _enSensSel(path, cur, none, test) {
    const S = this._hass.states;
    const L = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && id.indexOf('sensor.lhd_') !== 0 && test(S[id], id)).sort((a, b) => this._ename(a).localeCompare(this._ename(b), this._lang));
    if (cur && L.indexOf(cur) < 0) L.unshift(cur);
    return '<select class="inp w" data-sf="' + path + '" style="max-width:300px"><option value="">' + esc(none) + '</option>' + L.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
  }
  _enFlag(path, def) { const v = this._enGet(path), on = def ? v !== false : v === true; return '<button class="tg' + (on ? ' on' : '') + '" data-enflag="' + path + '|' + (def ? 1 : 0) + '"></button>'; }
  _enSolarV() {   // iki anahtar: güneş, batarya; kimse kendini ilgilendirmeyen ayarı görmez
    const t = (k, v) => esc(this._t(k, v)), s = lpEnSolar(), S = this._hass.states, gm = lpEnGridMode(s), sun = lpEnSunOn(s), bat = lpEnBatOn(s), mt = lpEnMeter();
    const pw = (st) => lpEnIsPow(st), en = (st) => !!st.attributes.state_class && (st.attributes.device_class === 'energy' || /^(kWh|Wh)$/.test(String(st.attributes.unit_of_measurement || '')));
    const pc = (st, id) => st.attributes.device_class === 'battery' || (String(st.attributes.unit_of_measurement || '') === '%' && !st.attributes.device_class && /bat|soc|akü|aku|charge|şarj|sarj/i.test(id + ' ' + (st.attributes.friendly_name || '')));
    const row = (b, sp, ctl) => '<div class="srow"><div class="t"><b>' + b + '</b>' + (sp ? '<span>' + sp + '</span>' : '') + '</div>' + ctl + '</div>';
    const tg = (k, on) => '<button class="tg' + (on ? ' on' : '') + '" data-solt="' + k + '"></button>';
    let h = '<h3 class="enh">' + t('en_solar') + '</h3><p class="enlead">' + t('enSolT2') + '</p>' +
      '<div class="ensec">' + row(t('enSunOn'), t('enSunOnT'), tg('sun', sun)) + row(t('enBatOn'), t('enBatOnT'), tg('bat', bat)) + '</div>';
    if (!sun && !bat) return h + '<div class="hint">' + t('enSolNone') + '</div>';
    if (sun) h += '<div class="ensec"><div class="ensh"><b>' + t('enSolProd') + '</b></div>' +
      row(t('enSolP'), t('enSolPT'), this._enSensSel('energy.solar.prod', s.prod, this._t('enNone'), pw)) +
      row(t('enSolPE'), t('enSolPET'), this._enSensSel('energy.solar.prod_energy', s.prod_energy, this._t('enMCalc'), en)) +
      row(t('enExp'), t('enExpT'), '<span class="ennum"><input class="inp" type="number" min="0" step="0.01" data-dec data-sf="energy.solar.export_price" value="' + esc(s.export_price || '') + '"><i>' + esc(this._enCur()) + '</i></span>') + '</div>';
    if (bat) {
      h += '<div class="ensec"><div class="ensh"><b>' + t('enSolBat') + '</b></div>' +
        row(t('enBP'), t('enBPT'), this._enSensSel('energy.solar.bat_power', s.bat_power, this._t('enNone'), pw)) +
        (s.bat_power ? row(t('enBInv'), t('enBInvT'), this._enFlag('energy.solar.bat_inv', false)) : '') +
        row(t('enBSoc'), '', this._enSensSel('energy.solar.soc', s.soc, this._t('enNone'), pc)) +
        row(t('enBCap'), t('enBCapT'), '<span class="ennum"><input class="inp" type="number" min="0" step="0.1" data-dec data-sf="energy.solar.cap" value="' + esc(s.cap || '') + '"><i>kWh</i></span>') + '</div>';
      const G = lpEnBatGain();
      if (G) h += '<div class="encalc"><div><span>' + t('enBgCh', { d: new Date(G.from).toLocaleDateString(this._lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long' }) }) + '</span><b>' + this._enNum(G.ch, 1) + ' kWh</b></div><div><span>' + t('enBgDis') + '</span><b>' + this._enNum(G.dis, 1) + ' kWh</b></div>' +
        '<div><span>' + t('enBgLoss') + '</span><b>' + this._enNum(G.loss, 1) + ' kWh' + (G.ch > 0.5 ? ' · %' + Math.round(G.loss / G.ch * 100) : '') + '</b></div>' +
        (G.gain !== null ? '<div class="tot"><span>' + t(G.gain >= 0 ? 'enBgGain' : 'enBgCost') + '</span><b style="color:' + (G.gain >= 0 ? '#3DDC84' : 'var(--ac)') + '">' + this._enTl(Math.abs(G.gain)) + '</b></div>' : '<div class="tot"><span>' + t('enBgNoTou') + '</span><b></b></div>') + '</div>';
      else if (s.bat_power) h += '<div class="hint">' + t('enBgNone') + '</div>';
    }
    // şebeke: ev sayacı seçiliyse oradan, değilse burada
    if (mt && mt.power) h += '<div class="ensec"><div class="ensh"><b>' + t('enSolGrid') + '</b></div><div class="hint">' + t('enGridFromMeter', { n: esc(this._ename(mt.power)) }) + ' <button class="btn sm" data-env="meter">' + t('en_meter') + '</button></div></div>';
    else h += '<div class="ensec"><div class="ensh"><b>' + t('enSolGrid') + '</b><span>' + t('enGridNoMeter') + '</span></div>' +
      row(t('enSolGM'), '', '<div class="seg">' + [['net', this._t('enGNet')], ['two', this._t('enGTwo')], ['none', this._t('enGNone')]].map((o) => '<button data-set="energy.solar.grid_mode" data-val="' + o[0] + '"' + (gm === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>') +
      (gm === 'net' ? row(t('enGNetS'), t('enGNetST'), this._enSensSel('energy.solar.grid', s.grid, this._t('enNone'), pw)) : '') +
      (gm === 'net' && s.grid ? row(t('enGInv'), t('enGInvT'), this._enFlag('energy.solar.grid_inv', false)) : '') +
      (gm === 'two' ? row(t('enGIn'), '', this._enSensSel('energy.solar.grid_in', s.grid_in, this._t('enNone'), pw)) + row(t('enGOut'), '', this._enSensSel('energy.solar.grid_out', s.grid_out, this._t('enNone'), pw)) : '') + '</div>';
    const F = lpEnFlowNow(S);
    if (F && F.has) {
      const v = (x) => (x === null ? '–' : esc(lpEnWs(x, this._lang)));
      h += '<div class="encalc">' + (sun ? '<div><span>' + t('enFProd') + '</span><b>' + v(F.prod) + '</b></div>' : '') +
        (F.outage ? '<div><span>' + t('enFOut') + '</span><b style="color:var(--red)">' + t('enFOutT') + '</b></div>' : gm === 'none' && !mt ? '' : '<div><span>' + t(F.grid !== null && F.grid < 0 ? 'enFExp' : 'enFImp') + '</span><b>' + v(F.grid === null ? null : Math.abs(F.grid)) + '</b></div>') +
        (F.bat !== null ? '<div><span>' + t(F.bat >= 0 ? 'enFCh' : 'enFDis') + '</span><b>' + v(Math.abs(F.bat)) + '</b></div>' : '') + (F.soc !== null ? '<div><span>' + t('enBSoc') + '</span><b>' + esc(lpEnPct(F.soc, this._lang)) + '</b></div>' : '') +
        (F.gridKnown ? '<div class="tot"><span>' + t('enFHome') + '</span><b>' + v(F.home) + '</b></div>' : '') + '</div>';
    }
    h += '<div class="acts"><button class="btn" data-a="ensolcard"><ha-icon class="s16" icon="mdi:transmission-tower-export"></ha-icon>' + t('enSolCard') + '</button></div>';
    return h;
  }
  // ev sayacı: evin tamamını ölçen cihaz (Shelly Pro EM gibi). Bulunur, tek dokunuşla seçilir; HA'nın Enerji ayarlarına şebeke kaynağı olarak panel yazar
  _enMeterCands() {
    const S = this._hass.states, R = this._hass.entities || {}, D = this._hass.devices || {}, E = this._enEsts(), used = {};
    Object.keys(E).forEach((k) => { if (E[k] && E[k].sensor) used[E[k].sensor] = 1; });
    const sol = lpEnSolar(); [sol.prod, sol.bat_power].forEach((x) => { if (x) used[x] = 1; });
    const re = /\bp?em\b|3em|pro ?em|em1|energy ?meter|power ?meter|smart ?meter|sayaç|sayac|\bp1\b|grid|şebeke|sebeke|ana ?hat|main|mains|whole|house|home ?total|ev ?toplam|tüm ?ev/i;
    return Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && id.indexOf('sensor.lhd_') !== 0 && lpEnIsPow(S[id]) && !used[id] && S[id].state !== 'unavailable').map((id) => {
      const e = R[id], d = e && e.device_id ? D[e.device_id] : null, txt = [id, this._ename(id), d ? d.name : '', d ? d.model : '', d ? d.manufacturer : ''].join(' ');
      return { id: id, dev: d, txt: txt, w: Math.abs(lpEnW(S, id) || 0) };
    }).filter((x) => re.test(x.txt) && !/solar|güneş|gunes|\bpv\b|inverter|batter|batarya|returned|export|verilen/i.test(x.id + ' ' + this._ename(x.id))).sort((a, b) => b.w - a.w).slice(0, 6);
  }
  _enMeterAuto(pid) {   // güç sensörünün cihazından: enerji (alınan), verilen, gerilim
    const S = this._hass.states, R = this._hass.entities || {}, dv = R[pid] ? R[pid].device_id : null;
    const same = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && (dv ? R[id] && R[id].device_id === dv : id.indexOf(pid.replace(/_power$|_active_power$/, '')) === 0));
    const isE = (id) => !!S[id].attributes.state_class && (S[id].attributes.device_class === 'energy' || /^(kWh|Wh)$/.test(String(S[id].attributes.unit_of_measurement || '')));
    const out = (id) => /return|export|out|verilen|üretim|produc/i.test(id + ' ' + this._ename(id));
    // aynı cihazda birden çok kanal olabilir (Pro EM: 2 kanal): güç sensörünün adına en çok benzeyen
    const base = pid.replace(/_(active_)?power$/, ''), score = (id) => (id.indexOf(base) === 0 ? 2 : 0) + (/total/i.test(id) ? 1 : 0);
    const en = same.filter((id) => isE(id) && !out(id)).sort((a, b) => score(b) - score(a))[0] || '';
    const ex = same.filter((id) => isE(id) && out(id)).sort((a, b) => score(b) - score(a))[0] || '';
    const vo = same.filter((id) => S[id].attributes.device_class === 'voltage' || String(S[id].attributes.unit_of_measurement || '') === 'V').sort((a, b) => score(b) - score(a))[0] || '';
    return { power: pid, energy: en, out: ex, volt: vo };
  }
  _enMeterV() {
    const t = (k, v) => esc(this._t(k, v)), S = this._hass.states, m = lpEnMeter(), M = LP_EN.m, Y = LP_EN.yr, L = this._lang === 'tr' ? 'tr-TR' : 'en-GB';
    const row = (b, sp, ctl) => '<div class="srow"><div class="t"><b>' + b + '</b>' + (sp ? '<span>' + sp + '</span>' : '') + '</div>' + ctl + '</div>';
    const pw = (st) => lpEnIsPow(st), en = (st) => !!st.attributes.state_class && (st.attributes.device_class === 'energy' || /^(kWh|Wh)$/.test(String(st.attributes.unit_of_measurement || '')));
    const vo = (st) => st.attributes.device_class === 'voltage' || String(st.attributes.unit_of_measurement || '') === 'V';
    let h = '<h3 class="enh">' + t('en_meter') + '</h3><p class="enlead">' + t('enMeterT') + '</p>';
    if (!m) {
      const C = this._enMeterCands(), R = this._hass.entities || {}, D = this._hass.devices || {};
      h += C.length ? '<div class="ensec"><div class="ensh"><b>' + t('enMeterFound', { n: C.length }) + '</b></div><div class="ensl">' + C.map((x) => '<div class="ensr"><ha-icon class="s16" icon="mdi:meter-electric-outline"></ha-icon><span><b>' + esc(this._ename(x.id)) + '</b><i>' + esc([x.dev ? [x.dev.manufacturer, x.dev.model].filter((y) => y).join(' ') : '', x.id].filter((y) => y).join(' · ')) + '</i></span><em class="enp ok">' + esc(lpEnWs(lpEnW(S, x.id), this._lang)) + '</em><button class="btn sm pri" data-enmeter="' + esc(x.id) + '">' + t('enMeterUse') + '</button></div>').join('') + '</div></div>'
        : '<div class="hint">' + t('enMeterNone') + '</div>';
      h += '<details class="enmore tfd"><summary>' + t('enMeterManual') + '</summary>' + row(t('enMPow'), t('enMPowT'), this._enSensSel('energy.meter.power', '', this._t('enPick'), pw)) + '</details>';
      return h;
    }
    // seçili sayaç
    const w = lpEnW(S, m.power), ws = w === null ? null : m.inv ? -w : w;
    let pan = null; if (M && !M.demo) M.cats.forEach((c) => { const v = lpEnCatW(S, c); if (v !== null) pan = (pan || 0) + v; });
    const F = lpEnFlowNow(S), home = F && F.gridKnown ? F.home : ws, unt = home !== null && pan !== null ? Math.max(0, home - pan) : null;
    const d0 = new Date(); d0.setHours(0, 0, 0, 0); let today = null; if (Y && Y.src === 'grid') { today = 0; Object.keys(Y.days).forEach((k) => { if (+k >= d0.getTime() - 43200000 && +k < d0.getTime() + 43200000) today += Y.days[k]; }); }
    const I = M ? lpEnYtdInfo(M) : null;
    h += '<div class="ensec"><div class="ensh"><b>' + esc(this._ename(m.power)) + '</b><button class="btn sm" data-a="enmeterdel" style="margin-left:auto">' + t('enMeterDel') + '</button></div>' +
      row(t('enMPow'), t('enMPowT'), this._enSensSel('energy.meter.power', m.power, this._t('enPick'), pw)) +
      row(t('enMIn'), t('enMInT'), this._enSensSel('energy.meter.energy', m.energy, this._t('enNone'), en)) +
      row(t('enMOut'), t('enMOutT'), this._enSensSel('energy.meter.out', m.out, this._t('enNone'), en)) +
      row(t('enMVolt'), t('enMVoltT'), this._enSensSel('energy.meter.volt', m.volt, this._t('enNone'), vo)) +
      row(t('enGInv'), t('enMInvT'), this._enFlag('energy.meter.inv', false)) + '</div>';
    h += '<div class="encalc"><div><span>' + t('enMNow') + '</span><b>' + (ws === null ? '–' : esc(lpEnWs(ws, this._lang))) + '</b></div>' +
      (pan !== null ? '<div><span>' + t('enMPanel') + '</span><b>' + esc(lpEnWs(pan, this._lang)) + '</b></div>' : '') +
      (unt !== null && home > 0 ? '<div><span>' + t('enMUnt') + '</span><b>' + esc(lpEnWs(unt, this._lang)) + ' · %' + Math.round(unt / home * 100) + '</b></div>' : '') +
      (today ? '<div><span>' + t('enMToday') + '</span><b>' + this._enNum(today, 1) + ' kWh</b></div>' : '') +
      (I && I.k && I.src === 'grid' ? '<div class="tot"><span>' + t('enMYear', { y: new Date().getFullYear() }) + (I.est && Y && Y.first ? ' · ' + t('enMYearEst', { d: new Date(Y.first).toLocaleDateString(L, { day: 'numeric', month: 'long' }) }) : '') + '</span><b>' + this._enNum(I.k) + ' kWh</b></div>' : '') + '</div>';
    if (!m.energy) h += '<div class="hint enwarn">' + t('enMNoE') + '</div>';
    h += '<div class="ensec"><div class="ensh"><b>' + t('enMWhat') + '</b></div><ul class="enrules"><li>' + t('enMW1') + '</li><li>' + t('enMW2') + '</li><li>' + t('enMW3') + '</li><li>' + t('enMW4') + '</li></ul></div>';
    return h;
  }
  // akış (ve batarya) kartını enerji sekmesine ekle: enerji kartı olan ilk sekmenin ilk kolonuna
  _enSolCard() {
    const tabs = this._work(), T = tabs.filter((x) => (x.sections || []).some((s) => s.type === 'energy' || lpEnOnly(s)))[0];
    if (!T) { this._toast(this._t('enSolNoTab'), false); return; }
    const has = (k) => (T.sections || []).some((s) => (s.entities || []).some((x) => x && x.energy === k));
    const L = this._lang, add = [];
    if (!has('flow')) add.push({ id: T.id + '-f' + Date.now().toString(36), type: 'energy', title: upper(L, lpEnT(L, 's_flow')), col: 0, grow: 2, entities: [{ energy: 'flow' }] });
    if (!add.length) { this._toast(this._t('enSolHas'), false); return; }
    this._snap();
    T.sections = add.concat(T.sections || []);
    this._commit('tabs', tabs); this._toast(this._t('enSolAdded', { t: T.name }));
  }
  // ---- ipuçları ----
  _enTipsV() {
    const t = (k, v) => esc(this._t(k, v)), c = lpEnTipCfg(), M = LP_EN.m;
    const row = (b, sp, ctl) => '<div class="srow"><div class="t"><b>' + b + '</b>' + (sp ? '<span>' + sp + '</span>' : '') + '</div>' + ctl + '</div>';
    const num = (k, d, step, u) => '<span class="ennum"><input class="inp" type="number" min="0" step="' + step + '" data-dec data-sf="energy.tips.' + k + '" value="' + esc(c[k] || '') + '" placeholder="' + d + '"><i>' + u + '</i></span>';
    let h = '<h3 class="enh">' + t('en_tips') + '</h3><p class="enlead">' + t('enTipsT') + '</p>' + row(t('enTOn'), t('enTOnT'), this._enFlag('energy.tips.on', true));
    if (c.on === false) return h;
    const L = M ? lpEnTips(this._hass, M, this._lang) : [];
    h += '<div class="ensec"><div class="ensh"><b>' + t('enTNow', { n: L.length }) + '</b></div>' + (L.length ? '<div class="ensl">' + L.map((x) => '<div class="ensr"><ha-icon class="s16" icon="' + esc(x.ic) + '" style="color:#FF9142"></ha-icon><span><b>' + esc(x.t) + '</b></span><button class="btn sm" data-entipoff="' + esc(x.k) + '">' + t('enTHide') + '</button></div>').join('') + '</div>' : '<div class="hint">' + t('enTNone') + '</div>') + '</div>';
    h += '<div class="ensec">' + row(t('enTLeft'), t('enTLeftT'), '<div style="display:flex;gap:6px;flex:0 0 auto">' + num('left_w', 300, 10, 'W') + num('left_h', 3, 0.5, this._t('enHrs')) + '</div>') +
      row(t('enTSb'), t('enTSbT'), num('standby_w', 150, 10, 'W')) +
      row(t('enTDay'), t('enTDayT'), '<div style="display:flex;gap:8px;align-items:center;flex:0 0 auto">' + (c.daily === true ? num('daily_kwh', 12, 0.5, 'kWh') : '') + this._enFlag('energy.tips.daily', false) + '</div>') +
      row(t('enTYear'), t('enTYearT'), this._enFlag('energy.tips.year', true)) +
      row(t('enTSun'), t('enTSunT'), this._enFlag('energy.tips.sun', true)) +
      row(t('enTDot'), t('enTDotT'), this._enFlag('energy.tips.dot', false)) + '</div>';
    const off = (Array.isArray(lpEnCfg().tips_off) ? lpEnCfg().tips_off.length : 0) + (() => { try { return JSON.parse(localStorage.getItem('lhd-en-tips-off') || '[]').length; } catch (e) { return 0; } })();
    if (off) h += '<div class="acts"><button class="btn" data-a="entipsreset"><ha-icon class="s16" icon="mdi:eye-refresh-outline"></ha-icon>' + t('enTReset', { n: off }) + '</button></div>';
    return h;
  }
  // ---- aktar: başka bir güç tahmini eklentisinin tanımları ----
  _enImpV() {
    const t = (k, v) => esc(this._t(k, v)), P = this._enImp;
    let h = '<h3 class="enh">' + t('en_imp') + '</h3><p class="enlead">' + t('enImpT') + '</p>';
    if (!P) return h + '<div class="acts"><button class="btn pri" data-a="enimpscan"' + (this._enBusy ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:magnify"></ha-icon>' + t('enImpScan') + '</button></div>';
    if (P.err) return h + '<div class="imerr">' + esc(P.err) + '</div><div class="acts"><button class="btn" data-a="enimpscan">' + t('enImpScan') + '</button></div>';
    if (P.done) return h + '<div class="encalc"><div><span>' + t('enImpDone', { n: P.done.n, c: P.done.c }) + '</span><b></b></div><div><span>' + t('enImpOld') + '</span><b>' + esc(lpEnWs(P.old_w, this._lang)) + '</b></div>' +
      '<div class="tot"><span>' + t('enImpNew') + '</span><b>' + esc(lpEnWs(P.devices.reduce((a, d) => a + (d.w || 0), 0), this._lang)) + '</b></div></div><div class="hint">' + t('enImpAfter') + '</div>' +
      '<div class="acts"><button class="btn" data-a="enimpscan">' + t('enImpAgain') + '</button><span class="grow"></span><button class="btn pri" data-env="dev">' + t('enImpToDev') + '</button></div>';
    if (!P.found) return h + '<div class="hint">' + t('enImpNone') + '</div>';
    const C = {}; P.cats.forEach((c) => { C[c.id] = c.name; });
    const nw = P.devices.reduce((a, d) => a + (d.w || 0), 0), nchk = P.devices.filter((d) => d.check).length;
    h += '<div class="encalc"><div><span>' + t('enImpCats') + '</span><b>' + P.cats.length + '</b></div><div><span>' + t('enImpDevs') + '</span><b>' + P.devices.length + '</b></div>' +
      (P.skipped.length ? '<div><span>' + t('enImpSkip') + '</span><b>' + P.skipped.length + '</b></div>' : '') +
      '<div><span>' + t('enImpOld') + '</span><b>' + esc(lpEnWs(P.old_w, this._lang)) + '</b></div><div class="tot"><span>' + t('enImpNew') + '</span><b>' + esc(lpEnWs(nw, this._lang)) + '</b></div></div>';
    if (nchk) h += '<div class="hint">' + t('enImpChk', { n: nchk }) + '</div>';
    h += '<div class="ensl">' + P.devices.map((d) => '<div class="ensr"><ha-icon class="s16" icon="' + this._enKindIc(d.kind) + '"></ha-icon><span><b>' + esc(d.name) + '</b><i>' + esc(this._t('ek_' + d.kind) + ' · ' + (C[d.cat] || this._t('enNoCat'))) + '</i></span>' + (d.check ? '<em class="enp w">' + t('enImpChkP') + '</em>' : '') + '<em class="enp' + (d.kind === 'meas' ? ' ok' : ' est') + '">' + esc(lpEnWs(d.w, this._lang)) + '</em></div>').join('') + '</div>';
    h += '<div class="hint">' + t('enImpWhat', { n: P.drop.length }) + '</div><div class="acts"><button class="btn" data-a="enimpscan">' + t('enImpAgain') + '</button><span class="grow"></span>' +
      (P.devices.length || P.cats.length ? '<button class="btn pri' + (P.ask ? ' ask' : '') + '" data-a="enimpgo"' + (this._enBusy ? ' disabled' : '') + '>' + (P.ask ? t('enImpGoQ') : t('enImpGo', { n: P.devices.length })) + '</button>' : '') + '</div>';
    return h;
  }
  async _enImpRun(apply) {
    if (apply && this._enImp && !this._enImp.ask) { this._enImp.ask = true; return this._render(); }
    this._enBusy = true; this._render();
    try {
      const r = await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/energy_import', apply: !!apply });
      if (apply) { this._enImp = Object.assign({}, this._enImp, { done: { n: (r && r.devices ? r.devices.length : 0), c: (r && r.cats ? r.cats.length : 0) }, ask: false }); LP_EN.at = 0; LP_EN.tp = {}; lpEnEnsure(this._hass); this._toast(this._t('enESaved')); } else this._enImp = r || { found: 0 };
    } catch (err) { this._enImp = { err: this._t('err', { e: (err && err.message) || err }) }; }
    this._enBusy = false; this._render();
  }
  _enLook() {
    const t = (k, v) => esc(this._t(k, v)), en = lpEnCfg(), L = lpEnLim();
    const seg = (path, cur, opts) => lhdSegX((v) => 'data-set="' + path + '" data-val="' + esc(v) + '"', cur, opts, path === 'nav.cols' ? 'nav' : path);
    const tg = (key, on) => '<button class="tg' + (on ? ' on' : '') + '" data-entg="' + key + '"></button>';
    return '<h3 class="enh">' + t('en_look') + '</h3>' +
      '<div class="srow"><div class="t"><b>' + t('enLim') + '</b><span>' + t('enLimT') + '</span></div><div style="display:flex;flex:0 0 auto">' + L.map((v, i) => '<input class="inp" type="number" min="1" step="50" data-enlim="' + i + '" value="' + esc(v) + '" style="width:80px' + (i ? ';margin-left:6px' : '') + '">').join('') + '</div></div>' +
      '<div class="srow"><div class="t"><b>' + t('enBadge') + '</b><span>' + t('enBadgeT') + '</span></div>' + seg('energy.badge', lpEnBadge() || 'auto', [['auto', this._t('enB_off')], ['on', this._t('enB_on')], ['always', this._t('enB_always')]]) + '</div>' +
      '<div class="srow"><div class="t"><b>' + t('enTilde') + '</b><span>' + t('enTildeT') + '</span></div>' + tg('tilde', en.tilde !== false) + '</div>' +
      '<div class="srow"><div class="t"><b>' + t('enUntL') + '</b><span>' + t('enUntLT') + '</span></div>' + tg('untracked', en.untracked !== false) + '</div>';
  }
  _menuHtml() {
    const m = this._menu; if (!m) return '';
    const t = (k) => esc(this._t(k));
    let inner = '';
    if (m.kind === 'more') inner = '<button data-a="guide"><ha-icon class="s16" icon="mdi:book-open-page-variant-outline"></ha-icon>' + t('guideT') + '</button><hr><button data-a="autokur"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('akT') + '</button><button data-a="stilsec"><ha-icon class="s16" icon="mdi:palette-outline"></ha-icon>' + t('akST') + '</button><hr><button class="dan" data-a="reset"><ha-icon class="s16" icon="mdi:restore"></ha-icon>' + t('resetAll') + '</button>';
    if (m.kind === 'addtab') {
      const used = {}; this._work().forEach((x) => { if (x.area) used[x.area] = 1; });
      const areas = Object.keys(this._hass.areas || {}).filter((a) => !used[a]);
      const hasCam = Object.keys(this._hass.states || {}).some((e) => e.indexOf('camera.') === 0);
      inner = '<button data-newtab=""><ha-icon class="s16" icon="mdi:tab-plus"></ha-icon>' + t('emptyTab') + '</button>' +
        (hasCam ? '<button data-a="addcamtab" title="' + t('camTabT') + '"><ha-icon class="s16" icon="mdi:cctv"></ha-icon>' + t('camTab') + '</button>' : '') +
        '<button data-a="addentab" title="' + t('enTabT') + '"><ha-icon class="s16" icon="mdi:lightning-bolt"></ha-icon>' + t('enTab') + '</button>' +
        (areas.length ? '<hr><div class="mh">' + t('fromArea') + '</div>' + areas.map((a) => '<button data-newtab="' + esc(a) + '">' + lpIcon((this._hass.areas[a].icon) || 'mdi:door', 's16') + esc(this._area(a)) + '</button>').join('') : '');
    }
    if (m.kind === 'addenergy') {   // kart türleri canlı küçük önizlemeyle
      LP_EL_MINI.h = this._hass; LP_EL_MINI.lang = this._lang;
      // menü uygulamanın içinde kalsın: alta sığmazsa yukarı kayar, sağa taşmaz
      const app = this.shadowRoot && this.shadowRoot.querySelector('.app'), AW = (app && app.clientWidth) || window.innerWidth, AH = (app && app.clientHeight) || window.innerHeight;
      const W = Math.min(600, AW - 24), H = Math.min(640, AH - 24), top = Math.max(12, Math.min(m.y, AH - H - 12));
      const vs = this._enVals(), fit = this._enFit(this._curSec(this._curTab(this._work())));
      const vHtml = vs.length ? '<div class="mh">' + t('addEnVals') + '</div><div class="envg">' + vs.map((x) => '<button data-addvirt="' + esc(x.id) + '"' + (x.room ? ' class="rm"' : '') + '><ha-icon class="s16" icon="' + esc(x.icon) + '"></ha-icon><span><b>' + esc(x.name) + '</b><i>' + esc(x.val) + '</i></span></button>').join('') + '</div><div class="hint" style="padding:0 10px 6px">' + esc(this._t('addEnValsT', { l: this._t(fit === 'halo' ? 'lk_halo' : fit === 'button' ? 'lk_button' : 'lk_tile') })) + '</div><div class="mh">' + t('addEnCards') + '</div>' : '';
      return '<div class="menu enmenu" style="left:' + Math.max(12, Math.min(m.x, AW - W - 12)) + 'px;top:' + top + 'px;width:' + W + 'px;max-height:' + H + 'px;overflow:auto">' + vHtml + (vs.length ? '' : '<div class="mh">' + t('addEnPick') + '</div>') + '<div class="enmg">' +
        LP_EN_TYPES.map((x) => '<button data-adden="' + x + '"><div class="mk"><lhd-en-mini k="' + x + '"></lhd-en-mini></div><b><ha-icon class="s16" icon="' + LP_EN_IC[x] + '"></ha-icon>' + esc(lpEnT(this._lang, 'k_' + x)) + '</b><span>' + esc(lpEnT(this._lang, 'd_' + x)) + '</span></button>').join('') + '</div></div>';
    }
    if (m.kind === 'addsec') inner = '<div class="mh" style="white-space:normal;max-width:290px;line-height:1.45;text-transform:none;letter-spacing:0;font-weight:500;font-size:12.5px">' + t('secFree') + '</div>' + Object.keys(LHD_TYPES).map((k) => '<button data-newsec="' + k + '"><ha-icon class="s16" icon="' + LHD_TYPES[k].icon + '"></ha-icon><span><b>' + t('t_' + k) + '</b><br><span class="mu" style="font-size:12px">' + t('d_' + k) + '</span></span></button>').join('');
    return '<div class="menu" style="left:' + m.x + 'px;top:' + m.y + 'px;max-height:' + Math.max(200, window.innerHeight - m.y - 20) + 'px;overflow:auto">' + inner + '</div>';
  }

  _modalHtml(tabs, tab, sec) {
    const md = this._modal; if (!md) return '';
    const t = (k, v) => esc(this._t(k, v));
    if (md === 'pick' && sec) {
      return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="' + (LHD_TYPES[sec.type] || LHD_TYPES.free).icon + '"></ha-icon></div><h2>' + t('pickT') + ' → ' + esc(sec.title || this._t('t_' + (LHD_TYPES[sec.type] ? sec.type : 'free'))) + '</h2>' +
        '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-q placeholder="' + t('search') + '" value="' + esc(this._q) + '">' +
        '<div class="seg pf" style="margin-top:8px">' + [['all', 'pfAll'], ['lights', 'pfTile'], ['scenes', 't_scenes'], ['values', 't_values'], ['energy', 'pfEnergy'], ['climate', 't_climate'], ['vacuum', 't_vacuum'], ['media', 't_media'], ['camera', 't_camera']].map((x) => '<button data-pf="' + x[0] + '"' + ((this._pf || 'all') === x[0] ? ' class="on"' : '') + '>' + t(x[1]) + '</button>').join('') + '</div></div>' +
        '<div class="db"><div class="plist">' + this._pickList(sec) + '</div></div>' +
        '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="pickadd"' + (this._picked.length ? '' : ' disabled') + '>' + t('addN', { n: this._picked.length }) + '</button></div></div></div>';
    }
    if (md === 'icon') {
      return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="mdi:shape-outline"></ha-icon></div><h2>' + t('iconPick') + '</h2>' +
        '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-iq placeholder="' + t('iconSearch') + '" value="' + esc(this._iq || '') + '">' +
        ('<div class="seg" style="margin-top:8px">' + [['col', 'icCol'], ['lec', 'icLec']].map((x) => '<button data-icset="' + x[0] + '"' + ((this._icSet || 'col') === x[0] ? ' class="on"' : '') + '>' + t(x[1]) + '</button>').join('') + '</div>') + '</div>' +
        '<div class="db"><div class="ilist">' + this._iconList() + '</div></div></div></div>';
    }
    if (md === 'news') return this._newsHtml();
    if (md === 'guide') return this._guideHtml();
    if (md === 'picks') return this._pkHtml();
    if (md === 'item') return this._imHtml();
    if (md === 'cardpick') return this._cpHtml();
    if (md === 'cardedit') return this._ceHtml();
    if (md === 'report') return this._reportHtml();
    if (md === 'restore') return this._restoreHtml();
    if (md === 'energy') return this._enPage();
    if (md === 'settings') {
      const s = this._settings();
      const seg = (path, cur, opts) => lhdSegX((v) => 'data-set="' + path + '" data-val="' + esc(v) + '"', cur, opts, path === 'nav.cols' ? 'nav' : path);
      // kiosk: hiçbir yerde / sadece telefon ve tablette / her yerde (eski açık ayarı "her yerde")
      const kseg = (path, v) => seg(path, v === 'touch' ? 'touch' : v ? 'all' : 'auto', [['auto', this._t('kNo')], ['touch', this._t('kTouch')], ['all', this._t('kAll')]]);
      const tg = (path, on) => '<button class="tg' + (on ? ' on' : '') + '" data-tg="' + path + '"></button>';
      const k = s.kiosk || {}, cv = s.canvas || {};
      const lec = !!(this._hass.config && (this._hass.config.components || []).indexOf('lemur_light_effects') >= 0);
      return '<div class="ov" data-ovl><div class="dlg sm sset"><div class="dh"><div class="di"><ha-icon icon="mdi:cog-outline"></ha-icon></div><h2>' + t('settings') + '</h2><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="db">' +
        // uzun listede bölümlere atlama
        '<div class="sjump">' + [['sVer', 'sjVer'], ['s_board', 's_board'], ['s_look', 's_look'], ['s_screen', 's_screen'], ['s_info', 'sjLight']].concat(this._adv() ? [['sWalls', 'sjWalls']] : []).concat([['sEnergy', 'sEnergy'], ['sHelp', 'sHelp'], ['sBackup', 'sBackup']]).map((x) => '<button data-sjump="' + x[0] + '">' + t(x[1]) + '</button>').join('') + '</div>' +
        '<div class="sh" data-sh="sVer">' + t('sVer') + '</div>' + this._updRow() +   // en üstte (Light Effect Card ile aynı)
        '<div class="sh" data-sh="s_board">' + t('s_board') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lang') + '</b></div>' + seg('language', s.language || 'auto', [['auto', this._t('lAuto')], ['tr', 'Türkçe'], ['en', 'English']]) + '</div>' +
        '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('season') + '</b><span>' + t('seasonT') + '</span></div>' + seg('season', s.season || 'auto', [['auto', this._t('sAuto')], ['summer', this._t('sSum')], ['winter', this._t('sWin')]]) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('picksSet') + '</b><span>' + t('picksSetT') + '</span></div>' + seg('picks', s.picks === 'off' ? 'off' : 'auto', [['auto', this._t('pkShow')], ['off', this._t('pkHide')]]) + '</div>' +
        '<div class="sh" data-sh="s_look">' + t('s_look') + '</div>' +
        // arka plan, ışık ve iklim görünümü, telefon ve efekt düğmesi Stil seç'te (önizlemeyle); burada yalnız oraya giden kart
        '<div class="srow stl"><div class="stli"><ha-icon icon="mdi:palette-outline"></ha-icon></div><div class="t"><b>' + t('akST') + '</b><span>' + t('stlT') + '</span></div><button class="btn pri" data-a="stilsec">' + t('stlGo') + '</button></div>' +
        '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('icStyle') + '</b><span>' + t('icStyleT') + '</span></div>' + seg('icon_style', lpIconMode(), [['auto', this._t('icAuto')], ['full', this._t('icColor')], ['mono', this._t('icFlat')], ['tint', this._t('icTint')]]) +
          (lpIconMode() === 'tint' ? '<div class="bgsw" style="width:100%">' + LHD_TINT_COLORS.map((c) => '<button class="bgc' + (lpIconTint().toLowerCase() === c.toLowerCase() ? ' on' : '') + '" data-tintc="' + c + '" style="background:' + c + '" title="' + c + '"></button>').join('') + '<label class="bgc pick" title="' + t('icTintC') + '"><input type="color" data-tintpick value="' + esc(lpIconTint()) + '"><ha-icon class="s16" icon="mdi:eyedropper-variant"></ha-icon></label></div>' : '') + '</div>' +
        (lpIconMode() === 'tint' ? '<div class="srow"><div class="t"><b>' + t('icTintL') + '</b><span>' + t('icTintLT') + '</span></div>' + tg('icon_tint_light', lpIconTintLight()) + '</div>' : '') +
        ((this._adv() || (lhdIsObj(s.nav) && (s.nav.cols || s.nav.w || s.nav.h))) ? this._navRows(seg, tg, lec && s.lec_nav !== false) : '') +
        this._bbRows(seg, tg) +
        '<div class="srow"><div class="t"><b>' + t('theme') + '</b><span>' + t('themeT') + '</span></div><input class="inp w" data-sf="theme_name" value="' + esc(s.theme_name || '') + '" placeholder="ios-dark-mode-blue-red"></div>' +
        '<div class="sh" data-sh="s_screen">' + t('s_screen') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kHeader') + '</b><span>' + t('kHeaderT') + '</span></div>' + kseg('kiosk.hide_header', k.hide_header) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kSide') + '</b><span>' + t('kSideT') + '</span></div>' + kseg('kiosk.hide_sidebar', k.hide_sidebar) + '</div>' +
        (!this._adv() ? '' : '<div class="srow"><div class="t"><b>' + t('canvas') + '</b><span>' + t('canvasT') + '</span></div><div class="acts"><input class="inp" type="number" min="800" max="3000" data-sf="canvas.width" value="' + esc(cv.width || 1280) + '" title="' + t('navW') + '" style="width:80px"><input class="inp" type="number" min="500" max="2500" data-sf="canvas.ref_height" value="' + esc(cv.ref_height || 1075) + '" title="' + t('navH') + '" style="width:80px"></div></div>') +
        '<div class="sh" data-sh="s_info">' + t('s_info') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lec') + '</b><span>' + (lec ? t('lecOn', { v: LEC.version || '?' }) : t('lecOff')) + '</span></div></div>' +
        (this._adv() ? this._wallsHtml() : '') +
        '<div class="sh" data-sh="sEnergy">' + t('sEnergy') + '</div><div class="srow"><div class="t"><b>' + t('enPage') + '</b><span>' + t('enOpenT') + '</span></div><button class="btn" data-a="energy"><ha-icon class="s16" icon="mdi:lightning-bolt"></ha-icon>' + t('enPage') + '</button></div>' +
        '<div class="sh" data-sh="sHelp">' + t('sHelp') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('guideT') + '</b><span>' + t('guideS') + '</span></div><button class="btn" data-a="guide"><ha-icon class="s16" icon="mdi:book-open-page-variant-outline"></ha-icon>' + t('guideT') + '</button></div>' +
        '<div class="srow"><div class="t"><b>' + t('repT') + '</b><span>' + t('repS') + '</span></div><button class="btn" data-a="report">' + t('repT') + '</button></div>' +
        '<div class="sh" data-sh="sBackup">' + t('sBackup') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('bkDown') + '</b><span>' + t('bkDownS') + '</span></div><button class="btn" data-a="bkdown">' + t('bkDown') + '</button></div>' +
        '<div class="srow"><div class="t"><b>' + t('bkUp') + '</b><span>' + t('bkUpS') + '</span></div><label class="btn">' + t('bkUp') + '<input type="file" accept=".json,application/json" data-bkfile style="display:none"></label></div>' +
        '</div><div class="df"><button class="btn" data-a="close">' + t('close') + '</button></div></div></div>';
    }
    if (md === 'auto' && this._ak) {
      // Otomatik kur / Stil seç: solda önizleme (seçimlerle anında değişir), sağda büyük seçenekler
      const K = this._ak, A = this._hass.areas || {}, stil = K.mode === 'stil', tr = this._lang === 'tr';
      const opt = (k, on, icon, label, sub) => '<button class="ako' + (on ? ' on' : '') + '" data-ak="' + k + '">' + lpIcon(icon, 'akoi') + '<b>' + label + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</button>';   // yazılar t() ile zaten kaçışlı
      let n = 0;
      const step = (title, sub, body) => '<div class="akst"><div class="aksh"><i>' + (++n) + '</i><div><b>' + title + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</div></div>' + body + '</div>';
      const sub = (x) => '<div class="aksub">' + x + '</div>';
      const res = stil ? [] : buildDefaultTabs(this._hass, this._lang, this._autoOpts());
      const cnt = (ty) => res.reduce((m, T) => m + (T.sections || []).filter((x) => x.type === ty).reduce((q, x) => q + (x.entities || []).length, 0), 0);
      const rooms = K.order.length ? '<div class="akgrid rooms">' + K.order.map((a) => opt('area:' + a, K.areas[a], (A[a] && A[a].icon) || 'mdi:door', esc((A[a] && A[a].name) || a))).join('') + '</div>' : '<div class="hint">' + t('akNoAreas') + '</div>';
      // arka plan: küçük örnekler; efekt renklerinin hepsi, koyu ve siyah
      const sw = (k, css, label) => '<button class="akbg' + (K.bg === k ? ' on' : '') + '" data-ak="bg:' + k + '"><i style="background:' + esc(css) + '"></i><span>' + esc(label) + '</span></button>';
      const bgs = '<div class="akbgs">' + sw('dark', LP_DARK_BG.replace(/ fixed/g, ''), this._t('bgDark')) + sw('black', '#000', this._t('bgBlack')) +
        sw('color', K.bgColor, this._t('bgColor')) + sw('img', '#1b1e24', this._t('bgImg')).replace('></i>', '><ha-icon icon="mdi:image-outline"></ha-icon></i>') +
        LP_BG_FX.map((f) => sw(f[0], lpFxSwatch(f[3]), tr ? f[1] : f[2])).join('') + '</div>' +
        (K.bg === 'color' ? '<div class="bgsw akbgx">' + LHD_BG_COLORS.map((c) => '<button class="bgc' + (K.bgColor.toLowerCase() === c ? ' on' : '') + '" data-ak="bgc:' + c + '" style="background:' + c + '" title="' + c + '"></button>').join('') +
          '<label class="bgc pick" title="' + t('bgColor') + '"><input type="color" data-akpick value="' + esc(K.bgColor) + '"><ha-icon class="s16" icon="mdi:eyedropper-variant"></ha-icon></label></div>' : '') +
        (K.bg === 'img' ? '<div class="akbgx"><input class="inp w" data-akurl value="' + esc(K.bgUrl || '') + '" placeholder="/local/zemin.jpg" style="width:100%"><span class="hint">' + t('akImgT') + '</span></div>' : '');
      const lecOk = this._akLecOk(), lecUrl = 'https://my.home-assistant.io/redirect/hacs_repository/?owner=mendebur-lemur&repository=lemur-light-effect-card&category=integration';
      const lec = lecOk ? '<div class="akgrid">' + opt('lec:1', K.lec, 'mdi:creation', t('akLecOn'), t('akLecOnT')) + opt('lec:0', !K.lec, 'mdi:creation-outline', t('akLecOff'), '') + '</div>'
        : '<div class="aklec"><ha-icon icon="mdi:creation"></ha-icon><div><b>' + t('akLecWhy') + '</b><span>' + t('akLecHow') + '</span>' +
          '<a class="btn" href="' + lecUrl + '" target="_blank" rel="noopener"><ha-icon class="s16" icon="mdi:download"></ha-icon>' + t('akLecGet') + '</a></div></div>';
      const srcSeg = stil ? '<div class="seg">' + [['mine', t('akSrcMine')], ['demo', t('akSrcDemo')]].map((x) => '<button data-ak="src:' + x[0] + '"' + (K.src === x[0] ? ' class="on"' : '') + '>' + x[1] + '</button>').join('') + '</div>' : '';
      const body =
        (stil ? '' :
          step(t('akRooms'), t('akRoomsT'), rooms) +
          step(t('akTabs'), '', '<div class="akgrid">' + opt('home', K.home, 'lhd:room-whole-home', t('akHome'), t('akHomeT')) + opt('other', K.other, 'mdi:dots-horizontal-circle-outline', t('akOther'), t('akOtherT')) + '</div>') +
          step(t('akWhat'), '', '<div class="akgrid">' + [['lights', 'akL', 'mdi:lightbulb-group'], ['scenes', 'akS', 'lhd:scene-switch'], ['climate', 'akC', 'mdi:thermostat'], ['vacuum', 'akV', 'mdi:robot-vacuum'], ['media', 'akM', 'mdi:speaker'], ['camera', 'akK', 'mdi:cctv'], ['energy', 'akE', 'mdi:lightning-bolt']].map((x) => opt('type:' + x[0], K.types[x[0]], x[2], t(x[1]))).join('') + '</div>')) +
        step(t('akTablet'), t('akTabletT'),
          sub(t('akLights')) + '<div class="akgrid">' + opt('look:tiles', K.look === 'tiles', 'mdi:view-grid-outline', t('akTiles'), t('akTilesT')) + opt('look:bar', K.look === 'bar', 'mdi:view-sequential-outline', t('akBars'), t('akBarsT')) + '</div>' +
          sub(t('clSt')) + '<div class="akgrid">' + opt('clim:halo', K.clim === 'halo', 'mdi:circle-slice-8', t('clHalo'), t('akHaloT')) + opt('clim:rows', K.clim === 'rows', 'mdi:format-list-bulleted', t('clRows'), t('akRowsT')) + '</div>' +
          // ışığa basılı tutunca açılan pencere (v0.28.8: Ayarlar'dan buraya, ışık görünümünün yanına)
          sub(t('hold')) + '<div class="akgrid">' + opt('hold:popup', K.hold !== 'ha' && K.hold !== 'lec', 'mdi:lightbulb-on-outline', t('hPop'), t('akHoldPopT')) + opt('hold:ha', K.hold === 'ha', 'mdi:home-assistant', t('hHa'), t('akHoldHaT')) + (lecOk ? opt('hold:lec', K.hold === 'lec', 'mdi:creation', t('hLec'), t('akHoldLecT')) : '') + '</div>') +
        step(t('akPhone'), t('akPhoneT'),
          sub(t('phNav')) + '<div class="akgrid">' + opt('nav:cats', K.nav === 'cats', 'mdi:shape-outline', t('phCats'), t('akCatsT')) + opt('nav:rooms', K.nav === 'rooms', 'mdi:dock-bottom', t('phRooms'), t('akRoomsBT')) + opt('nav:top', K.nav === 'top', 'mdi:dock-top', t('phTop'), t('akTopT')) + '</div>' +
          sub(t('akLights')) + '<div class="akgrid">' + opt('plights:auto', K.plights === 'auto', 'mdi:link-variant', t('akPLSame'), t('akPLSameT')) + opt('plights:tiles', K.plights === 'tiles', 'mdi:view-grid-outline', t('phLTiles'), t('akTilesT')) + opt('plights:rows', K.plights === 'rows', 'mdi:view-sequential-outline', t('phLRows'), t('akBarsT')) + '</div>' +
          sub(t('phSheet')) + '<div class="akgrid">' + opt('sheet:1', K.sheet, 'mdi:dock-bottom', t('akSheetOn'), t('akSheetOnT')) + opt('sheet:0', !K.sheet, 'mdi:dock-window', t('akSheetOff'), t('akSheetOffT')) + '</div>') +
        step(t('bg'), stil || K.bg ? '' : t('akBgKeep'), bgs) +
        step(t('akLec'), t(lecOk ? 'akLecTOk' : 'akLecT'), lec);
      const foot = stil ? '<div class="aksum"><b>' + t('akResS') + '</b><span>' + t('akWarnS') + '</span></div>'
        : '<div class="aksum"><b>' + t('akRes', { n: res.length }) + '</b><span>' + (res.length ? t('akSum', { l: cnt('lights'), s: cnt('scenes'), c: cnt('climate') }) + ' · ' + t('akWarn') : t('akNone')) + '</span></div>';
      return '<div class="akw"><div class="akwin"><div class="akhd"><div class="di"><ha-icon icon="' + (stil ? 'mdi:palette-outline' : 'mdi:auto-fix') + '"></ha-icon></div><div class="akht"><h2>' + t(stil ? 'akST' : 'akT') + '</h2><span>' + t(stil ? 'akSHint' : 'akHint') + '</span></div><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        '<div class="akbody"><div class="akl"><div class="akpvh"><div class="seg">' + [['tablet', t('akPvTab')], ['phone', t('akPvPh')]].map((x) => '<button data-ak="pv:' + x[0] + '"' + (K.pv === x[0] ? ' class="on"' : '') + '>' + x[1] + '</button>').join('') + '</div>' + srcSeg +
        '<button class="btn sm" data-ak="pop"><ha-icon class="s16" icon="mdi:lightbulb-on-outline"></ha-icon>' + t('akPop') + '</button>' +
        '<span>' + t(K.src === 'mine' ? 'akPvMine' : 'akPvNote') + '</span></div><div class="akpv"><div class="akpvc"></div></div></div>' +
        '<div class="akr2">' + body + '</div></div>' +
        '<div class="akft">' + foot + '<button class="btn lg" data-a="close">' + t('cancel') + '</button><button class="btn lg pri" data-a="autogo"' + (stil || res.length ? '' : ' disabled') + '>' + t('akGo') + '</button></div></div></div>';
    }
    if (md === 'reset') {
      return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di" style="color:var(--red)"><ha-icon icon="mdi:restore"></ha-icon></div><h2>' + t('resetAll') + '</h2></div>' +
        '<div class="db"><div>' + t('resetQ') + '</div></div><div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="resetgo" style="background:var(--red);border-color:var(--red);color:#fff">' + t('resetAll') + '</button></div></div></div>';
    }
    return '';
  }

  // cihaz seçici listesi: bölümün türüne uyan cihazlar, alana göre gruplu, aramayla süzülür
  _pickList(sec) {
    const S = this._hass.states, ents = this._hass.entities || {}, devs = this._hass.devices || {};
    // bölüm serbest: her tür cihaz eklenebilir; üstteki süzgeç sadece listeyi daraltır
    const pf = this._pf || 'all', doms = pf === 'all' ? LHD_ALL_DOMAINS : pf === 'values' || pf === 'energy' ? LHD_VALUE_DOMAINS : (pf === 'lights' ? LHD_TYPES.lights.domains.concat(['lock']) : LHD_TYPES[pf].domains.concat(pf === 'scenes' ? ['button', 'input_button'] : []));
    const have = {};
    (sec.entities || []).forEach((x) => {
      if (typeof x === 'string') { have[x] = 1; return; }
      if (x.entity) have[x.entity] = 1;
      if (x.action && x.action.target) have[x.action.target] = 1;
      const k = lpLecKind(x), d = (x.action && x.action.data) || {};
      if (k === 'play') have['lec:' + d.room + ':' + d.effect] = 1;
      if (k === 'stop') have['lecstop:' + d.room] = 1;
    });
    const areaOf = (id) => { const e = ents[id]; if (!e) return ''; if (e.area_id) return e.area_id; const d = e.device_id && devs[e.device_id]; return (d && d.area_id) || ''; };
    const q = this._q.toLowerCase().trim();
    const ids = Object.keys(S).filter((id) => doms.indexOf(id.split('.')[0]) >= 0 && !(ents[id] && (ents[id].hidden || ents[id].entity_category)) && (pf !== 'energy' || lpEnIsVal(id) || /^sensor\.lhd_kat_.*_power$/.test(id)) && (pf === 'energy' || !lpEnIsVirt(id)))
      .filter((id) => !q || (this._ename(id) + ' ' + id + ' ' + this._area(areaOf(id))).toLowerCase().indexOf(q) >= 0);
    const lecHtml = pf === 'all' || pf === 'scenes' ? this._lecGroups(sec, have, q) : '';
    if (!ids.length) return lecHtml || '<div class="empty">' + esc(this._t('nothing')) + '</div>';
    const groups = {};
    ids.forEach((id) => { const a = areaOf(id); (groups[a] = groups[a] || []).push(id); });
    // sekmenin alanı en üstte (oda sekmesine cihaz eklerken önce o odanınkiler görünsün)
    const ct = this._curTab(this._work()), ta = ct && ct.area;
    const order = (ta && groups[ta] ? [ta] : []).concat(Object.keys(this._hass.areas || {}).filter((a) => groups[a] && a !== ta)).concat(groups[''] ? [''] : []);
    return order.map((a) => '<div class="pg">' + esc(a ? this._area(a) : this._t('noArea2')) + '</div>' + groups[a].sort((x, y) => this._ename(x).localeCompare(this._ename(y))).map((id) => {
      const on = this._picked.indexOf(id) >= 0, dis = !!have[id];
      return '<div class="pi' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-pk="' + esc(id) + '"><span class="ck">' + (on || dis ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '') + '</span>' +
        '<div class="ico">' + lpIcon(lpEntIcon(this._hass.states[id])) + '</div><div class="t"><b>' + esc(this._ename(id)) + '</b><span>' + esc(id) + '</span></div>' +
        '<span class="st">' + esc(dis ? this._t('added') : (this._hass.formatEntityState ? this._hass.formatEntityState(S[id]) : S[id].state)) + '</span></div>';
    }).join('')).join('') + lecHtml;
  }

  // simge seçicinin bağlamı: sekme → oda simgeleri, ışık bölümü → lambalar, senaryo → senaryolar
  _iconCtx() {
    const ip = this._ip || {};
    if (ip.kind === 'tab') return 'room';
    const tab = this._curTab(this._work()), sec = this._curSec(tab);
    const it = sec && (sec.entities || [])[ip.idx];
    return lhdKind(it) === 'scene' ? 'scene' : 'light';
  }
  _iconList() {
    const q = String(this._iq || '').toLowerCase().trim(), cur = this._ip && this._ip.cur;
    if (this._icSet === 'lec') return this._lecIconList(q, cur);
    return this._colIconList(q, cur);
    const cell = (n) => '<div class="icell' + ('mdi:' + n === cur ? ' on' : '') + '" data-icn="mdi:' + esc(n) + '" title="mdi:' + esc(n) + '"><ha-icon icon="mdi:' + esc(n) + '"></ha-icon><span>' + esc(n) + '</span></div>';
    const sug = LHD_ICON_SUGGEST[this._iconCtx()] || [];
    if (!q) return '<div class="pg">' + esc(this._t('iconSug')) + '</div><div class="igrid">' + sug.map(cell).join('') + '</div>';
    if (/^mdi:[a-z0-9-]+$/.test(q)) return '<div class="igrid">' + cell(q.slice(4)) + '</div>';
    const L = LHD_ICONS.list;
    if (!L) { lhdIconList().then(() => { if (this._modal === 'icon') this._refreshIcons(); }); return '<div class="empty">' + esc(this._t('iconLoading')) + '</div>'; }
    // Türkçe kelimeleri İngilizce karşılıklarıyla genişlet
    const words = q.split(/\s+/).filter(Boolean);
    // "Işık" küçültülünce "işık" olur; karşılaştırma Türkçe harfler sadeleştirilerek yapılır
    const nz = (s) => s.replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
    const terms = []; words.forEach((w) => { const a = nz(w); terms.push(a); Object.keys(LHD_ICON_TR).forEach((k) => { const b = nz(k); if (b.indexOf(a) === 0 || (b.length > 2 && a.indexOf(b) === 0)) LHD_ICON_TR[k].split(' ').forEach((x) => terms.push(x)); }); });
    const score = (x) => { let b = 0; terms.forEach((tm) => { if (x.n === tm) b = Math.max(b, 4); else if (x.n.indexOf(tm) === 0) b = Math.max(b, 3); else if (x.n.indexOf(tm) >= 0) b = Math.max(b, 2); else if (x.k.indexOf(tm) >= 0) b = Math.max(b, 1); }); return b; };
    const hits = L.map((x) => ({ n: x.n, s: score(x) })).filter((x) => x.s > 0).sort((a, b) => (b.s - a.s) || (a.n.length - b.n.length) || (a.n < b.n ? -1 : 1));
    const MAX = 240;
    const sugHit = sug.filter((n) => terms.some((tm) => n.indexOf(tm) >= 0));
    let h = sugHit.length ? '<div class="pg">' + esc(this._t('iconSug')) + '</div><div class="igrid">' + sugHit.map(cell).join('') + '</div>' : '';
    if (!hits.length && !sugHit.length) return '<div class="empty">' + esc(this._t('iconNone')) + '</div>';
    h += '<div class="pg">' + esc(this._t('iconAll')) + ' · ' + hits.length + '</div><div class="igrid">' + hits.slice(0, MAX).map((x) => cell(x.n)).join('') + '</div>';
    if (hits.length > MAX) h += '<div class="empty">' + esc(this._t('iconMore', { n: MAX })) + '</div>';
    return h;
  }
  // Light Effect Card'ın renkli simgeleri: hepsi bir ızgarada, arama adlarında (Türkçe kelimeler İngilizce karşılıklarıyla)
  _lecIconList(q, cur) {
    const M = LP_LECI.map;
    if (!M) { lpLecIcons().then(() => { if (this._modal === 'icon') this._refreshIcons(); }); return '<div class="empty">' + esc(this._t('iconLoading')) + '</div>'; }
    let keys = Object.keys(M).sort();
    if (!keys.length) return '<div class="empty">' + esc(this._t('icLecNone')) + '</div>';
    if (q) {
      const nz = (x) => x.replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
      const terms = []; q.split(/\s+/).filter(Boolean).forEach((w) => { const a = nz(w); terms.push(a); Object.keys(LHD_ICON_TR).forEach((k) => { const b = nz(k); if (b.indexOf(a) === 0 || (b.length > 2 && a.indexOf(b) === 0)) LHD_ICON_TR[k].split(' ').forEach((x) => terms.push(x)); }); });
      keys = keys.filter((k) => terms.some((tm) => k.replace(/_/g, ' ').indexOf(tm) >= 0 || k.indexOf(tm) >= 0));
      if (!keys.length) return '<div class="empty">' + esc(this._t('iconNone')) + '</div>';
    }
    return '<div class="igrid">' + keys.map((k) => '<div class="icell lec' + ('lec:' + k === cur ? ' on' : '') + '" data-icn="lec:' + esc(k) + '" title="' + esc(k.replace(/_/g, ' ')) + '"><span class="lic">' + M[k] + '</span><span>' + esc(k.replace(/_/g, ' ')) + '</span></div>').join('') + '</div>';
  }
  // gömülü renkli set (src/mdic.js): hepsi bir ızgarada; seçilen simge "mdi:ad" olarak kaydedilir, düz stilde de aynı simge düz çizilir
  _colIconList(q, cur) {
    const M = LP_MDIC.map;
    if (!M) { lpMdicLoad().then(() => { if (this._modal === 'icon') this._refreshIcons(); }); return '<div class="empty">' + esc(this._t('iconLoading')) + '</div>'; }
    let keys = Object.keys(M).sort();
    if (!keys.length) return '<div class="empty">' + esc(this._t('icColNone')) + '</div>';
    const cellOf = (k) => '<div class="icell lec' + (k === cur ? ' on' : '') + '" data-icn="' + esc(k) + '" title="' + esc(k) + '"><span class="lic">' + M[k] + '</span><span>' + esc(lpIsLhdIcon(k) ? k.slice(4) + ' ★' : k.slice(4)) + '</span></div>';
    if (!q) {
      const sug = []; (LHD_ICON_SUGGEST[this._iconCtx()] || []).forEach((n) => { const k = lpMdicKey('mdi:' + n); if (k && sug.indexOf(k) < 0) sug.push(k); });
      if (sug.length) return '<div class="pg">' + esc(this._t('iconSug')) + '</div><div class="igrid">' + sug.map(cellOf).join('') + '</div><div class="pg">' + esc(this._t('iconEvery')) + ' · ' + keys.length + '</div><div class="igrid">' + keys.map(cellOf).join('') + '</div>';
    }
    if (q) {
      const nz = (x) => x.replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
      const terms = []; q.replace(/^mdi:/, '').split(/\s+/).filter(Boolean).forEach((w) => { const a = nz(w); terms.push(a); Object.keys(LHD_ICON_TR).forEach((k) => { const b = nz(k); if (b.indexOf(a) === 0 || (b.length > 2 && a.indexOf(b) === 0)) LHD_ICON_TR[k].split(' ').forEach((x) => terms.push(x)); }); });
      keys = keys.filter((k) => terms.some((tm) => k.indexOf(tm) >= 0));
      if (!keys.length) return '<div class="empty">' + esc(this._t('iconNone')) + '</div>';
    }
    return '<div class="igrid">' + keys.map((k) => { const n = k.slice(4); return '<div class="icell lec' + (k === cur ? ' on' : '') + '" data-icn="' + esc(k) + '" title="' + esc(k) + '"><span class="lic">' + M[k] + '</span><span>' + esc(lpIsLhdIcon(k) ? n + ' ★' : n) + '</span></div>'; }).join('') + '</div>';
  }
  _refreshIcons() { const l = this.shadowRoot && this.shadowRoot.querySelector('.ilist'); if (l) l.innerHTML = this._iconList(); }
  _applyIcon(v) {
    const ip = this._ip || {}; this._modal = null; this._ip = null; this._iq = '';
    if (ip.kind === 'im' && this._im) { this._im.f[ip.key] = v; this._modal = 'item'; return this._render(); }
    const tabs = this._work(), tab = this._curTab(tabs), tabId = tab && tab.id;
    if (ip.kind === 'tab') return this._edit((T) => { const x = T.filter((y) => y.id === tabId)[0]; if (x) x.icon = v; });
    if (ip.kind === 'phtab') return this._phEdit((p) => { if (tabId) p.tabs.icons[tabId] = v; });
    const sec = this._curSec(tab), secId = sec && sec.id, i = ip.idx;
    if (ip.kind === 'phfold') return this._phEdit((p) => { const o = secId && p.secs[secId]; const G = o && Array.isArray(o.folds) ? o.folds[i] : null; if (G) G.icon = v; });
    return this._edit((T) => {
      const x = T.filter((y) => y.id === tabId)[0], S = x && (x.sections || []).filter((z) => z.id === secId)[0]; if (!S) return;
      let it = S.entities[i]; if (it === undefined) return;
      if (typeof it === 'string') { it = { entity: it }; S.entities[i] = it; }
      it.icon = v;
    });
  }

  // senaryo düğmesinin ne yaptığı (düzenleyicideki alt yazı)
  _scTarget(tab, it) {
    const T = (k, v) => esc(this._t(k, v)), k = lpLecKind(it), a = it.action || {};
    const rn = (r) => (r ? (LEC.names[r] || this._area(r) || r) : this._t('roomByTab'));
    let txt;
    if (k === 'open') txt = T('tOpen', { r: rn(a.room || tab.area) });
    else if (k === 'play') txt = T('tPlay', { e: (a.data && a.data.effect) || '?', r: rn(a.data && a.data.room) });
    else if (k === 'stop') txt = T('tStop', { r: rn(a.data && a.data.room) });
    else if (a.popup) txt = T('tPop', { t: (a.popup.title || (a.popup.card && a.popup.card.type) || '') });
    else txt = T('target') + ': ' + esc(a.target ? this._ename(a.target) : '—');
    if (k && !LEC.installed(this._hass)) txt += ' · <b class="lecna">' + T('lecNa') + '</b>';
    return txt;
  }
  _refreshPick() {
    const pl = this.shadowRoot && this.shadowRoot.querySelector('.plist'); if (!pl) return;
    const tabs = this._work(), tab = this._curTab(tabs), sec = this._curSec(tab); if (!sec) return;
    pl.innerHTML = this._pickList(sec);
    pl.querySelectorAll('ha-state-icon[data-eid]').forEach((x) => { x.hass = this._hass; x.stateObj = this._hass.states[x.getAttribute('data-eid')]; });
  }
  // senaryo seçicide LEC efektleri: sekmenin odası (oda yoksa bütün LEC odaları); önce "durdur", sonra favoriler, sonra hepsi
  _lecGroups(sec, have, q) {
    if (!LEC.installed(this._hass) || !LEC.rooms) return '';
    const tab = this._curTab(this._work());
    const rooms = LEC.hasRoom(tab && tab.area) ? [tab.area] : Object.keys(LEC.rooms);
    return rooms.map((r) => {
      const name = LEC.names[r] || this._area(r) || r;
      const list = LEC.effects[r];
      if (!list) { LEC.query(this._hass, r); return '<div class="pg">' + esc(this._t('lecGroup', { r: name })) + '</div><div class="empty">' + esc(this._t('lecLoading')) + '</div>'; }
      const fav = (LEC.favorites || []).map((x) => String(x).toLowerCase());
      const sorted = list.slice().sort((a, b) => ((fav.indexOf(String(a).toLowerCase()) < 0) - (fav.indexOf(String(b).toLowerCase()) < 0)) || String(a).localeCompare(String(b)));
      const row = (id, icon, title, sub) => {
        if (q && (title + ' ' + sub).toLowerCase().indexOf(q) < 0) return '';
        const on = this._picked.indexOf(id) >= 0, dis = !!have[id];
        return '<div class="pi' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-pk="' + esc(id) + '"><span class="ck">' + (on || dis ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '') + '</span>' +
          '<div class="ico">' + lpIcon(icon) + '</div><div class="t"><b>' + esc(title) + '</b><span>' + esc(sub) + '</span></div>' +
          '<span class="st">' + esc(dis ? this._t('added') : '') + '</span></div>';
      };
      const body = row('lecstop:' + r, 'mdi:stop-circle-outline', this._t('lecStop'), name) +
        sorted.map((e) => row('lec:' + r + ':' + e, fav.indexOf(String(e).toLowerCase()) >= 0 ? 'mdi:star' : 'mdi:creation', e, name)).join('');
      return body ? '<div class="pg">' + esc(this._t('lecGroup', { r: name })) + '</div>' + body : '';
    }).join('');
  }

  _colName(c, n) {
    if (n === 2) return [this._t('colL'), this._t('colR')][c] || String(c + 1);
    if (n === 3) return [this._t('colL'), this._t('colM'), this._t('colR')][c] || String(c + 1);
    return String(c + 1);
  }

  // ---- önizleme: panonun kendi kartı, düzenleme modunda, tasarım boyutunda çizilip kutuya sığdırılır ----
  _mountPreview(tab, sec) {
    const box = this.shadowRoot.querySelector('.pvc'); if (!box || !tab) return;
    if (!this._pv) {
      this._pv = document.createElement('lemur-home-dashboard-card');
      this._pv.addEventListener('lhd-select', (e) => { this._sec = e.detail.section; this._ask = null; this._render(); });
      this._pv.addEventListener('lhd-tab', (e) => { this._tab = e.detail.tab; this._sec = null; this._ask = null; this._render(); });
      // önizlemede sürükle-bırak ya da boyutlandırma: kart yeni sekme ayarını verir, burada kaydedilir (geri alınabilir)
      this._pv.addEventListener('lhd-coldel', (e) => {   // önizlemede boş kolonun 'Kolonu kaldır' düğmesi (v0.29.1)
        const i = e.detail.col, tabs0 = this._work(), tb = this._curTab(tabs0), tid = tb && tb.id; if (!tid) return;
        this._edit((T) => { const x = T.filter((y) => y.id === tid)[0]; if (!x) return; const w = lpWeights(x), n = w.length; if (n < 2 || i < 0 || i >= n) return;
          if ((x.sections || []).some((s) => Math.min(s.col || 0, n - 1) === i)) return;   // kolon boş değilse dokunma
          const sum = w.reduce((a, b) => a + b, 0), keep = w.filter((v, j) => j !== i), ks = keep.reduce((a, b) => a + b, 0);
          const sp = lpSplits(x, n); x.columns = keep.map((v) => Math.round(v * sum / ks * 100) / 100);
          (x.sections || []).forEach((s) => { if ((s.col || 0) > i) s.col = (s.col || 0) - 1; });
          if (x.splits) x.splits = sp.filter((v, j) => j !== i); lhdFitCols(x, this._cw()); lhdFitSplits(x, this._cw()); });
      });
      this._pv.addEventListener('lhd-addsec', (e) => {
        // tıklama olayı panele ulaştıktan sonra aç (yoksa "dışarı tıklandı" sayılıp hemen kapanır)
        const d = e.detail; setTimeout(() => { const rr = this.shadowRoot.querySelector('.app').getBoundingClientRect(); this._menu = { kind: 'addsec', x: Math.max(8, Math.min(d.x - rr.left, rr.width - 280)), y: Math.min(d.y - rr.top + 8, rr.height - 320), target: { col: d.col, sub: d.sub } }; this._render(); }, 0);
      });
      this._pv.addEventListener('lhd-phitems', (e) => {
        const d = e.detail || {}, tab0 = this._curTab(this._work()), S0 = tab0 && (tab0.sections || []).filter((x) => x.id === d.sec)[0]; if (!S0 || !Array.isArray(d.keys)) return;
        const all = lhdOrderBy(S0.entities || [], this._phSec(d.sec).item_order, lhdItemKey).map(lhdItemKey);
        const got = d.keys.filter((k) => all.indexOf(k) >= 0), rest = all.filter((k) => got.indexOf(k) < 0);
        const ids = got.concat(rest);
        if (ids.join('\n') === all.join('\n')) return;
        const def = (S0.entities || []).map(lhdItemKey).join('\n');
        this._phEdit((p) => { const o = p.secs[d.sec] = lhdIsObj(p.secs[d.sec]) ? p.secs[d.sec] : {}; if (ids.join('\n') === def) delete o.item_order; else o.item_order = ids; });
      });
      this._pv.addEventListener('lhd-phorder', (e) => {
        const d = e.detail || {}, T0 = (this._work() || []).filter((x) => x.id === d.tab)[0]; if (!T0 || !Array.isArray(d.order)) return;
        const full = lhdPhoneOrder(T0, this._phOrd(T0)).map((x) => x.id), vis = d.order.filter((id) => full.indexOf(id) >= 0);
        let k = 0; const ids = full.map((id) => (vis.indexOf(id) >= 0 ? vis[k++] : id));
        const def = lhdPhoneOrder(T0, null).map((x) => x.id).join();
        this._phEdit((p) => { if (ids.join() === def) delete p.order[d.tab]; else p.order[d.tab] = ids; });
      });
      this._pv.addEventListener('lhd-change', (e) => { const nt = e.detail.tab; this._edit((T) => { const i = T.map((x) => x.id).indexOf(nt.id); if (i >= 0) { lhdFitSplits(nt, this._cw()); T[i] = nt; } }); });
    }
    const cfg = { type: 'custom:lemur-home-dashboard-card', tab: tab.id, edit: true, selected: sec ? sec.id : '', phone: this._scrPh(this._screenKey()) };
    if (cfg.phone && this._pvFoldsOn()) cfg.folds = true;   // telefon önizlemesinde katlanır gruplar telefondaki gibi
    this._pvPh = cfg.phone;   // önizleme hangi düzende çizildi (özel ekranda telefon/tablet değişince yeniden çizmek için)
    if (!this._pvCfg || JSON.stringify(this._pvCfg) !== JSON.stringify(cfg)) { this._pvCfg = cfg; this._pv.setConfig(cfg); }
    box.appendChild(this._pv);
    this._pv.hass = this._hass;
    const s = this._settings();
    const tb0 = this._curTab(this._work()), ps = this._phEd() && s.phone && s.phone.style && s.phone.style.bg;
    box.style.background = (!ps && lpTabBg(tb0)) || lpBgOf(this._phEd() ? lpPhoneMerge(s) : s);   // odaya özel zemin önizlemede de
    if (this._ro) { this._ro.disconnect(); this._ro.observe(box.parentNode); }
    this._fit();
  }
  // önizleme ekranı bu tarayıcıda hatırlanır (ayar değil, herkese gitmez)
  _screenKey() { let k = null; try { k = localStorage.getItem('lhd-preview-screen'); } catch (e) {} return LHD_SCREENS.some((x) => x[0] === k) ? k : 'tab16'; }
  _fit() {
    const R = this.shadowRoot; if (!R) return;
    // dar ekranda (tablet dikey) önizleme üstte, düzenleyici altta
    if (this._narrowNow !== undefined && ((this.clientWidth || window.innerWidth) < 980) !== this._narrowNow && !this._modal) { this._render(); return; }
    const box = R.querySelector('.pvc'), wrap = R.querySelector('.pvbox'); if (!box || !wrap) return;
    // gerçek ölçeklemeyle aynı hesap: kanvas en az W geniş, ekranın oranına göre genişler, yüksekliği ekrana göre
    const cv = this._settings().canvas || {}, W = cv.width || 1280, H = cv.ref_height || 1075;
    const sc = LHD_SCREENS.filter((x) => x[0] === this._screenKey())[0];
    const cs = sc[0] === 'custom' ? lhdCustomScr() : null, sw = cs ? cs[0] : sc[1] || window.innerWidth, sh = cs ? cs[1] : sc[2] || window.innerHeight;
    const ph = this._scrPh(sc[0]);
    // telefon: pano ölçeklenmez, ekranın kendi genişliğinde çizilir ve aşağı kayar
    const cw = ph ? sw : Math.max(W, Math.floor(sw / sh * H)), ch = ph ? sh : Math.floor(sh * cw / sw);
    box.style.overflowY = ph ? 'auto' : '';
    const z = Math.min(wrap.clientWidth / cw, wrap.clientHeight / ch) || 0.5;
    box.style.width = cw + 'px'; box.style.height = ch + 'px';
    box.style.setProperty('--lp-h', ch + 'px');
    box.style.transform = 'translate(' + Math.max(0, (wrap.clientWidth - cw * z) / 2) + 'px,' + Math.max(0, (wrap.clientHeight - ch * z) / 2) + 'px) scale(' + z + ')';    // telefon önizlemesinde kart, kutunun gerçek genişliğine göre yeniden kurulsun (ilk kurulumda kutu henüz ölçülmemişti)
    const card = box.querySelector('lemur-home-dashboard-card');
    if (card && ph && card._config && lpPhoneKey(card, card._config) !== card._phone) { card._phone = lpPhoneKey(card, card._config); card._sig = null; if (card._render) card._render(); }
  }

  // ---- olaylar ----
  _bind(tabs, tab, sec) {
    const R = this.shadowRoot, app = R.querySelector('.app');
    if (this._modal === 'picks') this._pkPlace();
    R.querySelectorAll('ha-state-icon[data-eid]').forEach((e) => { e.hass = this._hass; e.stateObj = this._hass.states[e.getAttribute('data-eid')]; });
    // sekme ve bölüm sırayla değil kimlikle bulunur (otomatik düzen ya da başka cihazdan değişiklik sırayı kaydırabilir)
    const tabId = tab ? tab.id : null, secId = sec ? sec.id : null;
    const findTab = (T) => T.filter((x) => x.id === tabId)[0];
    const editTab = (fn, soft) => this._edit((T) => { const x = findTab(T); if (x) fn(x, T); }, null, soft);
    const editSec = (fn, soft) => this._edit((T) => { const x = findTab(T), y = x && (x.sections || []).filter((z) => z.id === secId)[0]; if (y) fn(y, x); }, null, soft);

    app.addEventListener('click', (e) => {
      const g = (sel) => (e.target.closest ? e.target.closest(sel) : null);
      const a = g('[data-a]'), act = a && !a.disabled ? a.getAttribute('data-a') : null;
      if (this._menu && !g('.menu') && act !== 'more' && act !== 'addtab' && act !== 'addsec') { this._menu = null; this._render(); return; }
      if (g('[data-ovl]') && e.target === g('[data-ovl]')) { if (this._modal === 'news') return this._newsClose(); if (this._modal === 'guide') return this._guideClose(); if (this._modal === 'item' || this._modal === 'cardedit') return; if (this._modal === 'icon' && this._ip && this._ip.kind === 'im' && this._im) { this._ip = null; this._modal = 'item'; return this._render(); } this._modal = null; this._render(); return; }   // öğe ayarları dışarı tıklayınca kapanmaz (yazılan kaybolmasın)
      // Önerilen ürünler penceresi
      if (this._modal === 'picks' && this._pk) {
        const P = this._pk, pb = g('[data-pkbuy]');
        if (pb) { const p = pb.getAttribute('data-pkbuy').split(':'); if (!lpTouchDev() && p[1] !== 'amz') { e.preventDefault(); this._pkBuy(p[0], p[1], pb); } return; }
        if (g('[data-pkx]')) { P.pop = null; setTimeout(() => this._render(), 0); return; }
        const phb = g('[data-pkphone]');
        if (phb && P.pop && P.pop.phones) {
          const f = P.pop.phones[+phb.getAttribute('data-pkphone')], pop = P.pop, x = LHDPicks.get().items.filter((y) => y.id === pop.id)[0];
          try { localStorage.setItem('lhd-pick-phone', f.svc); } catch (err) {}
          P.pop = null;
          if (f && x) { const url = lhdHttps((x.buy || {})[pop.k]), nm = (LHD_PICK_STORES.filter((z) => z[0] === pop.k)[0] || ['', ''])[1]; lhdPickSend(this._hass, f, x, pop.k, this._lang).then(() => this._pkToast(this._t('pkSent', { s: nm }), url), () => this._pkToast(this._t('pkSendErr'), url, true)); }
          return this._render();
        }
        if (P.pop && !g('.pkpop')) { P.pop = null; this._render(); return; }
        const pc = g('[data-pkcat]'); if (pc) { P.cat = pc.getAttribute('data-pkcat'); P.info = null; return this._render(); }
        const pi = g('[data-pkinfo]'); if (pi) { const id = pi.getAttribute('data-pkinfo'); P.info = P.info === id ? null : id; return this._render(); }
        if (g('[data-pkready]')) { P.ready = !P.ready; return this._render(); }
      }
      if (act === 'picks') return this._pkOpen();
      const hadAsk = !!this._ask;
      if (act !== 'deltab' && act !== 'delsec' && act !== 'phresall' && act !== 'phresno' && this._ask) { this._ask = null; }
      const at = (el) => { const r = el.getBoundingClientRect(), rr = app.getBoundingClientRect(); return { x: Math.min(r.left - rr.left, rr.width - 260), y: r.bottom - rr.top + 6 }; };
      if (act === 'undo') return this._undoIt();
      if (act === 'redo') return this._redoIt();
      if (act === 'pvfolds') { try { localStorage.setItem('lhd-pv-folds', this._pvFoldsOn() ? '0' : '1'); } catch (x) {} return this._render(); }
      // Enerji sayfası
      if (act === 'energy') return this._enOpen();
      if (act === 'enbadd') return this._enBillAdd();
      if (act === 'entarfill') return this._enSetMany({ price_mode: 'tier', low: 3.24, high: 4.88, daily: 8 });   // EPDK 4 Nisan 2026 mesken tek zamanlı: enerji + dağıtım, aktif enerjiye %5 tüketim vergisi ve %1 enerji fonu, hepsine %10 KDV
      if (act === 'enskttfill') return this._enSetMany({ sktt_price: 7 });
      if (act === 'entoufill') return this._enSetMany({ price_mode: 'tou', t_day: 4.95, t_peak: 7.03, t_night: 3.27 });   // EPDK 4 Nisan 2026 mesken çok zamanlı, vergiler dahil
      if (act === 'enenew') { this._enDraft(null); this._enErr = ''; this._render(); return this._enTop(); }
      if (act === 'lropen' && this._enE && this._enE.id) return this._lrnOpen(this._enE.id);
      if (act === 'lropen' && this._enE && !this._enE.id) return this._enSave().then(() => { if (this._enE && this._enE.id && !this._enErr) this._lrnOpen(this._enE.id); });
      if (act === 'lrskipfx') return this._lrnCtl('skipfx');
      if (act === 'lrclose') { this._lrn = null; return this._render(); }
      if (act === 'lrown' && this._lrn) { this._lrn.step = 'prep'; return this._render(); }
      if (act === 'lruse' && this._lrn && this._lrn.pool) { this._lrn.pool.use = true; this._lrn.share = false; return this._lrnSave(); }
      if (act === 'lrtest' && this._lrn) return this._lrnTest();
      if (act === 'lrstart' && this._lrn) return this._lrnStart();
      if (act === 'lrpause') return this._lrnCtl('pause');
      if (act === 'lrresume') return this._lrnCtl('resume');
      if (act === 'lrcancel') { const L0 = this._lrn; return this._lrnCtl('cancel').then(() => { if (this._lrn === L0) this._lrn = null; this._render(); }); }
      if (act === 'lrclear') { const L0 = this._lrn; return this._lrnCtl('clear').then(() => { if (this._lrn === L0) this._lrn = null; this._render(); }); }
      if (act === 'lrcont' && this._lrn) { const L0 = this._lrn; return this._lrnCtl('continue').then(() => { L0.step = 'run'; this._render(); }); }
      if (act === 'lragain' && this._lrn) { const L0 = this._lrn; return this._lrnCtl('clear').then(() => { L0.step = 'prep'; L0.tested = 0; L0.testMsg = ''; this._render(); }); }
      if (act === 'lrsave' && this._lrn) return this._lrnSave();
      if (act === 'eneclose') return this._enEClose(!(a.classList && a.classList.contains('endscrim')));
      if (act === 'enaddl' || act === 'enaddm') { this._enE = null; this._enAddM = { kind: act === 'enaddl' ? 'lights' : 'meas', sel: {} }; this._render(); return this._enAddLib(); }
      if (act === 'enaddx') { this._enAddM = null; return this._render(); }
      if (act === 'enaddsall' || act === 'enaddsnone') { if (this._enAddM) this._enAddM.sel = act === 'enaddsall' ? {} : (this._enAddM.kind === 'lights' ? this._enNewLights() : this._enFound()).reduce((o, x) => { o[x] = false; return o; }, {}); return this._render(); }
      if (act === 'enaddgo') return this._enAddGo();
      if (act === 'enaddall') { if (!this._enAskAll) { this._enAskAll = true; return this._render(); } this._enAskAll = false; return this._enAddMeas(this._enFound()); }
      if (act === 'enfoundall') { this._enAllF = true; return this._render(); }
      if (act === 'encnew') { this._enCDraft(null); this._enErr = ''; this._render(); return this._enTop(); }
      if (act === 'encclose') { this._enC = null; this._enErr = ''; return this._render(); }
      if (act === 'encsave') return this._enCSave();
      if (act === 'encdel') return this._enCDel();
      if (act === 'ensolcard') return this._enSolCard();
      if (act === 'enimpscan') { this._enImp = null; return this._enImpRun(false); }
      if (act === 'enimpgo') return this._enImpRun(true);
      if (act === 'entipsreset') { try { localStorage.removeItem('lhd-en-tips-off'); } catch (e2) {} return this._setting('energy.tips_off', null); }
      const eat = g('[data-enaddt]');
      if (eat && this._enAddM) { const x = eat.getAttribute('data-enaddt'), S0 = this._enAddM.sel = this._enAddM.sel || {}; S0[x] = S0[x] === false; return this._render(); }
      const eng = g('[data-eng]');
      if (eng) { this._enG = eng.getAttribute('data-eng'); return this._render(); }
      const enad = g('[data-enadd]');
      if (enad) return this._enAddMeas([enad.getAttribute('data-enadd')]);
      const enfil = g('[data-enfil]');
      if (enfil) { this._enF = enfil.getAttribute('data-enfil'); return this._render(); }
      const encmv = g('[data-encmv]');
      if (encmv) { const q = encmv.getAttribute('data-encmv').split(':'), i = +q[0], j = i + (+q[1]), C = this._enCats().slice(); if (j < 0 || j >= C.length) return; const x = C[i]; C[i] = C[j]; C[j] = x; this._snap(); this._commit('ecats', C); LP_EN.at = 0; lpEnEnsure(this._hass); return this._render(); }   // kategorinin sırası: kartlarda bu sırayla
      const encid = g('[data-encid]');
      if (encid) { this._enCDraft(encid.getAttribute('data-encid')); this._enErr = ''; this._render(); return this._enTop(); }
      const encol = g('[data-encol]');
      if (encol && this._enC) { this._enC.color = encol.getAttribute('data-encol'); return this._render(); }
      const eflag = g('[data-enflag]');
      if (eflag) { const q = eflag.getAttribute('data-enflag').split('|'), v = this._enGet(q[0]), def = q[1] === '1', on = def ? v !== false : v === true; return this._setting(q[0], on ? (def ? false : null) : (def ? null : true)); }
      const etoff = g('[data-entipoff]');
      if (etoff) { const L = (Array.isArray(lpEnCfg().tips_off) ? lpEnCfg().tips_off : []).concat([etoff.getAttribute('data-entipoff')]); return this._setting('energy.tips_off', L.slice(-100)); }
      if (act === 'enesave') return this._enSave();
      if (act === 'enedel') return this._enDel();
      const env = g('[data-env]');
      if (env) { this._env = env.getAttribute('data-env'); this._enErr = ''; this._enAskAll = false; if (this._enImp) { this._enImp.ask = false; if (this._enImp.done) this._enImp = null; } const m = this.shadowRoot.querySelector('.enm'); this._render(); const m2 = this.shadowRoot.querySelector('.enm'); if (m2 && m) m2.scrollTop = 0; return; }
      // ayarlarda uzun açıklama iki satır; dokununca tamamı
      const dsc = e.target && e.target.closest && e.target.closest('.sset .srow .t > span');
      if (dsc && dsc.scrollHeight > dsc.clientHeight + 2 || (dsc && dsc.classList.contains('open'))) { dsc.classList.toggle('open'); return; }
      const sj = g('[data-sjump]');
      if (sj) { const d = sj.closest('.dlg'), x = d && d.querySelector('[data-sh="' + sj.getAttribute('data-sjump') + '"]'), db = d && d.querySelector('.db'); if (x && db && db.scrollHeight > db.clientHeight + 4) db.scrollTo({ top: Math.max(0, x.offsetTop - db.offsetTop - 52), behavior: 'smooth' }); else if (x && x.scrollIntoView) x.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
      const ene = g('[data-enest]');
      if (ene) { this._enDraft(ene.getAttribute('data-enest')); this._enErr = ''; this._render(); return this._enTop(); }
      const eni = g('[data-eninside]');
      if (eni && this._enE) { const k = eni.getAttribute('data-eninside'), L = this._enE.f.inside = (this._enE.f.inside || []).slice(), i = L.indexOf(k); if (i >= 0) L.splice(i, 1); else L.push(k); return this._render(); }
      const enk = g('[data-enk]');
      if (enk && this._enE) { this._enE.f.kind = enk.getAttribute('data-enk'); this._enErr = ''; return this._render(); }
      const ebd = g('[data-enbdel]');
      if (ebd) { const i = +ebd.getAttribute('data-enbdel'), L = (Array.isArray(lpEnCfg().bills) ? lpEnCfg().bills : []).filter((x, k) => k !== i); return this._setting('energy.bills', L.length ? L : null); }
      const etg = g('[data-entg]');
      if (etg) { const k = etg.getAttribute('data-entg'); return this._setting('energy.' + k, lpEnCfg()[k] !== false ? false : null); }
      if (act === 'guide') { this._guideFrom = this._modal === 'settings' ? 'settings' : null; this._gi = this._gi || 0; this._modal = 'guide'; this._menu = null; return this._render(); }
      if (act === 'settings') {
        this._modal = 'settings'; this._menu = null; this._render();
        // dar ekranda (telefon) yan panel önizlemenin altında kalıyordu: Ayarlar'a basınca bir şey olmuyor gibiydi
        // çizim bir sonraki karede bitiyor: kaydırma ondan sonra
        if (this._narrowNow) setTimeout(() => { const d = this.shadowRoot && this.shadowRoot.querySelector('.dlg.dock'); if (d && d.scrollIntoView) d.scrollIntoView({ block: 'start' }); }, 80);
        return;
      }
      if (act === 'more' || act === 'addtab' || act === 'addsec' || act === 'addenergy') { const p = at(a); this._menu = this._menu && this._menu.kind === act ? null : { kind: act, x: p.x, y: p.y }; return this._render(); }
      if (act === 'close') {
        if (this._modal === 'icon' && this._ip && this._ip.kind === 'im' && this._im) { this._ip = null; this._modal = 'item'; return this._render(); }   // simge seçiciden öğe ayarlarına dön
        if (this._modal === 'cardedit' && this._ce && this._ce.im) { this._im = this._ce.im; this._ce = null; this._modal = 'item'; return this._render(); }
        this._modal = null; this._picked = []; this._q = ''; this._bk = null; this._im = null; this._ce = null; return this._render();
      }
      if (act === 'imsave') return this._imSave();
      if (act === 'addsub') return editSec((S) => { S.entities = (S.entities || []).concat([{ subtitle: this._t('subItem').toLocaleUpperCase(this._lang === 'tr' ? 'tr' : 'en') }]); });
      if (act === 'addpet') return this._imOpen(-1, { pet: '' }, true);
      if (act === 'addcard') { this._cpq = ''; this._modal = 'cardpick'; this._menu = null; return this._render(); }
      if (act === 'report') return this._reportOpen();
      if (act === 'repgo') return this._repGo();
      if (act === 'repcopy') return this._repCopy();
      if (act === 'bkdown') return this._backupDown();
      if (act === 'bkyes') return this._backupApply();
      if (act === 'reset') { this._menu = null; this._modal = 'reset'; return this._render(); }
      if (act === 'autokur' || act === 'stilsec') { this._menu = null; this._autoInit(act === 'stilsec' ? 'stil' : 'kur'); this._modal = 'auto'; return this._render(); }
      if (act === 'autogo') return this._autoApply();
      const ak = g('[data-ak]');
      if (ak && this._ak) {
        const p = ak.getAttribute('data-ak').split(':'), K = this._ak;
        if (p[0] === 'area') K.areas[p[1]] = !K.areas[p[1]];
        else if (p[0] === 'type') K.types[p[1]] = !K.types[p[1]];
        else if (p[0] === 'home' || p[0] === 'other') K[p[0]] = !K[p[0]];
        else if (p[0] === 'sheet' || p[0] === 'lec') K[p[0]] = p[1] === '1';
        else if (p[0] === 'bgc') { K.bg = 'color'; K.bgColor = p[1]; }
        else if (p[0] === 'pop') K.pop = true;
        else if (p[0] === 'src') { K.src = p[1]; this._akTab = null; if (this._akCard && this._akCard._config) this._akCard._config.tab = null; }
        else K[p[0]] = p[1];
        // telefon seçimi önizlemeyi telefona, tablet seçimi tablete çevirir: seçilenin etkisi hemen görünsün
        if (p[0] === 'sheet') K.pop = true;   // ışık penceresinin nasıl açıldığı hemen görünsün
        if (p[0] === 'nav' || p[0] === 'plights' || p[0] === 'sheet') K.pv = 'phone';
        else if (p[0] === 'look' || p[0] === 'clim') K.pv = 'tablet';
        return this._render();
      }
      if (act === 'resetgo') { this._snap(); this._modal = null; this._sec = null; this._commit('tabs', []); this._toast(this._t('resetOk')); return this._render(); }
      if (act === 'deltab') {
        if (this._ask !== 'deltab') { this._ask = 'deltab'; return this._render(); }
        this._ask = null; const id = tab.id; this._sec = null;
        this._edit((T) => { T.splice(T.map((x) => x.id).indexOf(id), 1); }); this._tab = null; return;
      }
      if (act === 'delsec') {
        if (this._ask !== 'delsec') { this._ask = 'delsec'; return this._render(); }
        this._ask = null; const id = sec.id; this._sec = null;
        return editTab((T) => { T.sections = T.sections.filter((x) => x.id !== id); });
      }
      if (act === 'refill') {
        const fresh = buildDefaultTabs(this._hass, this._lang).filter((x) => x.area === tab.area)[0];
        if (!fresh) return;
        this._sec = null;
        // sekmenin kolon sayısı korunur: otomatik düzendeki 3. kolon, kolonu az olan sekmede son kolona düşer
        return editTab((T) => { const n = lpWeights(T).length; T.sections = fresh.sections.map((s) => { const o = Object.assign({}, s, { id: lhdId('s') }); if ((o.col || 0) > n - 1) o.col = n - 1; delete o.sub; return o; }); });
      }
      if (act === 'pick') { this._modal = 'pick'; this._picked = []; this._q = ''; this._pf = 'all'; return this._render(); }
      if (act === 'pickadd') {
        const ids = this._picked.slice(); this._modal = null; this._picked = []; this._q = '';
        return editSec((S) => {
          S.entities = S.entities || [];
          const nBtn = () => S.entities.filter((x) => lhdKind(x) === 'scene').length;
          ids.forEach((id) => {
            if (id.indexOf('lec:') === 0) {
              const p = id.split(':'), room = p[1], effect = p.slice(2).join(':');
              S.entities.push({ name: effect, icon: 'mdi:creation', color: LHD_COLORS[nBtn() % LHD_COLORS.length], action: { service: LP_LEC_DOMAIN + '.play', data: { room: room, effect: effect } } });
              return;
            }
            if (id.indexOf('lecstop:') === 0) {
              S.entities.push({ name: this._t('lecStop'), icon: 'mdi:stop-circle-outline', color: '#E5484D', action: { service: LP_LEC_DOMAIN + '.stop', data: { room: id.slice(8) } } });
              return;
            }
            const d = id.split('.')[0], st = this._hass.states[id];
            // betik, sahne, otomasyon, buton: renkli düğme olur (ad, simge, renk düzenlenebilir)
            if (d === 'script' || d === 'scene' || d === 'automation' || d === 'button' || d === 'input_button') {
              const sv = d === 'automation' ? 'automation.trigger' : (d === 'button' || d === 'input_button') ? d + '.press' : d + '.turn_on';
              S.entities.push({ name: this._ename(id), icon: (st && st.attributes.icon) || (d === 'script' ? 'mdi:play-circle-outline' : d === 'scene' ? 'mdi:palette-outline' : d === 'automation' ? 'mdi:robot' : 'mdi:gesture-tap-button'),
                color: LHD_COLORS[nBtn() % LHD_COLORS.length], action: { service: sv, target: id } });
              return;
            }
            if (lpEnIsVal(id)) { const lk = this._enFit(S); S.entities.push(lk ? { entity: id, look: lk } : id); return; }   // enerji değeri bölüme uyan görünümle
            S.entities.push(d === 'climate' ? this._climateItem(id) : id);
          });
        });
      }
      const ipb = g('[data-ip]');
      if (ipb) {
        const v = ipb.getAttribute('data-ip'), tabs0 = this._work(), tab0 = this._curTab(tabs0), sec0 = this._curSec(tab0);
        let cur = '';
        if (v === 'tab') cur = tab0 && tab0.icon;
        else if (v === 'phtab') cur = tab0 && (this._phTabs().icons || {})[tab0.id];
        else if (v.indexOf('phfold:') === 0) { const F = sec0 ? this._phSec(sec0.id).folds : null, G = Array.isArray(F) ? F[+v.slice(7)] : null; cur = G && G.icon; }
        else if (v.indexOf('im:') === 0) cur = this._im ? this._im.f[v.slice(3)] : '';
        else { const i = +v.split(':')[1], L = sec0 && sec0.entities; const it = L && L[i]; cur = it && typeof it === 'object' ? it.icon : ''; }
        this._ip = v === 'tab' ? { kind: 'tab', cur: cur } : v === 'phtab' ? { kind: 'phtab', cur: cur } : v.indexOf('phfold:') === 0 ? { kind: 'phfold', idx: +v.slice(7), cur: cur } : v.indexOf('im:') === 0 ? { kind: 'im', key: v.slice(3), cur: cur } : { kind: 'item', idx: +v.split(':')[1], cur: cur };
        this._iq = ''; this._modal = 'icon'; this._icSet = lpIsLecIcon(cur) ? 'lec' : 'col'; lpMdicLoad(); this._render();
        // dokunmatik ekranda klavye kendiliğinden açılmasın: odak sadece fareli cihazda
        const q = this.shadowRoot.querySelector('[data-iq]'); if (q && !('ontouchstart' in window)) q.focus();
        return;
      }
      const ics = g('[data-icset]');
      if (ics) { this._icSet = ics.getAttribute('data-icset'); this.shadowRoot.querySelectorAll('[data-icset]').forEach((b) => b.classList.toggle('on', b === ics)); this._refreshIcons(); return; }
      const icn = g('[data-icn]');
      if (icn && this._modal === 'icon') return this._applyIcon(icn.getAttribute('data-icn'));
      if (act === 'lecok') return this._setting('lec_seen', true);
      if (act === 'addlec') return editSec((S) => { S.entities = S.entities || []; S.entities.push({ name: this._t('lecOpen'), icon: 'mdi:creation', color: '#FF6FAE', action: { service: LP_LEC_DOMAIN + '.open' } }); });
      if (act === 'addscph') return editSec((S) => { S.entities = S.entities || []; S.entities.push({ name: this._t('addScPh'), icon: 'mdi:gesture-tap', color: LHD_COLORS[S.entities.filter((x) => lhdKind(x) === 'scene').length % LHD_COLORS.length], action: null }); });
      if (act === 'addentab') {
        this._menu = null;
        const taken = {}; this._work().forEach((x) => { taken[x.id] = 1; });
        const base = this._lang === 'tr' ? 'enerji' : 'energy';
        let id = base, k = 2; while (taken[id]) id = base + '-' + (k++);
        const nw = lhdEnergyTab(this._lang, id);
        this._tab = id; this._sec = null;
        return this._edit((T) => { T.push(nw); });
      }
      const avb = g('[data-addvirt]');
      if (avb) { this._menu = null; const id = avb.getAttribute('data-addvirt'); return editSec((S) => { const lk = this._enFit(S), it = { entity: id }; if (lk) it.look = lk; S.entities = (S.entities || []).concat([it]); }); }
      const aen = g('[data-adden]');
      if (aen) { this._menu = null; const ty = aen.getAttribute('data-adden'); return editSec((S) => { S.entities = (S.entities || []).concat([{ energy: ty }]); }); }
      if (act === 'addcamtab') {
        this._menu = null;
        const taken = {}; this._work().forEach((x) => { taken[x.id] = 1; });
        const base = this._lang === 'tr' ? 'kameralar' : 'cameras';
        let id = base, k = 2; while (taken[id]) id = base + '-' + (k++);
        const nw = lhdCameraTab(this._hass, this._lang, id);
        this._tab = id; this._sec = null;
        return this._edit((T) => { T.push(nw); });
      }
      if (act === 'addph') return editSec((S) => { S.entities = (S.entities || []).concat([{ name: this._t('addPh'), icon: 'mdi:lightbulb-outline' }]); });
      const nt = g('[data-newtab]');
      if (nt) {
        const aid = nt.getAttribute('data-newtab'); this._menu = null;
        // sekme kimliği panonun adresinde görünür (/pano/salon): alan kimliği ya da "sekme", çakışırsa -2, -3...
        const taken = {}; this._work().forEach((x) => { taken[x.id] = 1; });
        const base = aid || (this._lang === 'tr' ? 'sekme' : 'tab');
        let id = base, k = 2; while (taken[id]) id = base + '-' + (k++);
        let nw;
        if (aid) {
          const fresh = buildDefaultTabs(this._hass, this._lang).filter((x) => x.area === aid)[0];
          const ar = this._hass.areas[aid];
          nw = fresh ? Object.assign({}, fresh, { id: id, sections: fresh.sections.map((s) => Object.assign({}, s, { id: lhdId('s') })) })
            : { id: id, name: ar.name, icon: ar.icon || 'mdi:door', area: aid, columns: LP_DEFAULT_COLS.slice(), sections: [] };
        } else {
          nw = { id: id, name: this._t('newTab'), icon: 'mdi:door', area: null, columns: LP_DEFAULT_COLS.slice(), sections: [] };
        }
        this._tab = id; this._sec = null;
        return this._edit((T) => { T.push(nw); });
      }
      const ns = g('[data-newsec]');
      if (ns) {
        const type = ns.getAttribute('data-newsec'), id = lhdId('s'), tgt = this._menu && this._menu.target; this._menu = null;
        const L = this._lang, titles = { free: '', lights: t(L, 'lights'), scenes: t(L, 'scenes'), climate: tab.area ? upper(L, this._area(tab.area)) : t(L, 'control'), vacuum: upper(L, this._t('t_vacuum')), media: t(L, 'media'), camera: upper(L, this._t('t_camera')), energy: upper(L, lpEnT(L, 's_energy')) };
        const ncol = lpWeights(tab).length;
        const s = { id: id, type: type, title: titles[type], col: tgt ? tgt.col : Math.min(LHD_TYPES[type].col, ncol - 1) };
        if (tgt && tgt.sub) s.sub = tgt.sub;
        s.entities = type === 'energy' ? [{ energy: 'halo' }] : [];
        // karo sayısı yerin genişliğine göre: geniş kolonda 5, dar sütunda daha az (tablet panosunda 56'lık kolonda 5 karo)
        if (type === 'lights' || type === 'free') { const w = lpWeights(tab), sum = w.reduce((a, b) => a + b, 0), sp = lpSplits(tab, w.length)[s.col] || 1;
          s.tile_columns = Math.max(2, Math.min(5, Math.round(w[s.col] / sum / sp * 9))); }
        this._sec = id;
        return editTab((T) => { T.sections.push(s); });
      }
      const tb = g('[data-tab]');
      if (tb && !this._dragged) { this._tab = tb.getAttribute('data-tab'); this._sec = null; return this._render(); }
      // --- telefona özel ayarlar ---
      const edm = g('[data-edm]');
      if (edm) {
        const want = edm.getAttribute('data-edm') === 'ph';
        if (want === this._phEd()) return;
        try {
          if (want) { const cur = this._screenKey(); if (cur !== 'phone' && cur !== 'here') localStorage.setItem('lhd-preview-tab', cur); localStorage.setItem('lhd-preview-screen', 'phone'); }
          else { const back = localStorage.getItem('lhd-preview-tab'); localStorage.setItem('lhd-preview-screen', LHD_SCREENS.some((x) => x[0] === back) && back !== 'here' && !this._scrPh(back) ? back : 'tab16'); }
        } catch (x) {}
        return this._render();
      }
      const phh = g('[data-phhide]');
      if (phh) { const id = phh.getAttribute('data-phhide'); return this._phEdit((p) => { const o = p.secs[id] = lhdIsObj(p.secs[id]) ? p.secs[id] : {}; if (o.hide) delete o.hide; else o.hide = true; }); }
      const phl = g('[data-phlook]');
      if (phl && secId) { const v = phl.getAttribute('data-phlook'); return this._phEdit((p) => { const o = p.secs[secId] = lhdIsObj(p.secs[secId]) ? p.secs[secId] : {}; if (v) o.look = v; else delete o.look; if (v === 'rows' || v === 'rows2') delete o.cols; }); }
      const phc = g('[data-phcols]');
      if (phc && secId) { const v = +phc.getAttribute('data-phcols'); return this._phEdit((p) => { const o = p.secs[secId] = lhdIsObj(p.secs[secId]) ? p.secs[secId] : {}; if (v) o.cols = v; else delete o.cols; }); }
      const phi = g('[data-phitem]');
      if (phi && sec) {
        const raw = (sec.entities || [])[+phi.getAttribute('data-phitem')], k = lhdItemKey(raw); if (!k) return;
        return this._phEdit((p) => { const o = p.secs[secId] = lhdIsObj(p.secs[secId]) ? p.secs[secId] : {}; const L = Array.isArray(o.hide_items) ? o.hide_items.slice() : []; const j = L.indexOf(k); if (j >= 0) L.splice(j, 1); else L.push(k); o.hide_items = L; });
      }
      const pga = act === 'phgadd' && secId, pgd = g('[data-phgdel]'), pgi = g('[data-phgit]');   // katlanır grup: ekle, sil, öğe seç
      if (pga || ((pgd || pgi) && sec)) {
        const fo = (p) => { const o = p.secs[secId] = lhdIsObj(p.secs[secId]) ? p.secs[secId] : {}; if (!Array.isArray(o.folds)) o.folds = []; return o.folds; };
        if (pga) return this._phEdit((p) => { fo(p).push({ items: [] }); });
        if (pgd) { const j = +pgd.getAttribute('data-phgdel'); return this._phEdit((p) => { fo(p).splice(j, 1); }); }
        const pr = pgi.getAttribute('data-phgit').split(':'), j = +pr[0], raw = (sec.entities || [])[+pr[1]], k = lhdItemKey(raw); if (!k) return;
        return this._phEdit((p) => { const G = fo(p)[j]; if (!G) return; const L = Array.isArray(G.items) ? G.items.slice() : [], x = L.indexOf(k); if (x >= 0) L.splice(x, 1); else L.push(k); G.items = L; });
      }
      if (act === 'phressec' && secId) return this._phEdit((p) => { delete p.secs[secId]; });
      if (act === 'phresord' && tabId) return this._phEdit((p) => { delete p.order[tabId]; });
      if (act === 'phresno') { this._ask = null; return this._render(); }
      if (act === 'phresall') {
        if (this._ask !== 'phresall') { this._ask = 'phresall'; return this._render(); }
        this._ask = null;
        return this._phEdit((p) => { p.secs = {}; p.order = {}; p.tabs = { order: [], hide: {}, names: {}, icons: {} }; p.style = {}; delete p.lights; delete p.flat; });   // v0.32: çerçevesiz bölümler de tabletten farktır
      }
      if (act === 'phrestab' && tabId) return this._phEdit((p) => { delete p.tabs.hide[tabId]; delete p.tabs.names[tabId]; delete p.tabs.icons[tabId]; });
      if (g('[data-phlk]')) { this._phLookOpen = !(g('details.phlook') && g('details.phlook').open); if (hadAsk && !this._ask) setTimeout(() => this._render(), 0); return; }   // açık/kapalı yeniden çizimde korunur; soru açıksa kapanır
      const phs = g('[data-phset]');
      if (phs) { const k = phs.getAttribute('data-phset'), val = phs.getAttribute('data-v'); return this._setting('phone.' + k, k === 'sheet' ? (val === '1' ? null : false) : k === 'flat' ? (val === '1' ? true : null) : val); }
      const pst = g('[data-phst]');
      if (pst) { const k = pst.getAttribute('data-phst'), val = pst.getAttribute('data-v'); return this._phEdit((p) => { if (val) p.style[k] = val; else delete p.style[k]; }); }
      const tbg = g('[data-tabbg]');
      if (tbg) { const v = tbg.getAttribute('data-tabbg'); return editTab((T) => { if (!v) { delete T.bg; return; } T.bg = v.indexOf('fx:') === 0 ? { mode: 'fx', fx: v.slice(3) } : v.indexOf('color:') === 0 ? { mode: 'color', color: v.slice(6) } : { mode: v }; }); }
      const pbg = g('[data-phbg]');
      if (pbg) {
        const v = pbg.getAttribute('data-phbg');
        return this._phEdit((p) => {
          if (!v) { delete p.style.bg; delete p.style.background; return; }
          const b = v.indexOf('fx:') === 0 ? { mode: 'fx', fx: v.slice(3) } : { mode: v };
          p.style.bg = b; p.style.background = b.mode === 'dark' ? LP_DARK_BG : lpBgCss(b);
        });
      }
      const pth = g('[data-phtabh]');
      if (pth && tabId) { const on = pth.getAttribute('data-phtabh') === '1'; return this._phEdit((p) => { if (on) p.tabs.hide[tabId] = true; else delete p.tabs.hide[tabId]; }); }
      const si = g('.si[data-sec]');
      if (si && !this._dragged && !g('[data-handle]')) { this._sec = si.getAttribute('data-sec'); return this._render(); }
      const sb = g('[data-scr]');
      if (sb) { try { localStorage.setItem('lhd-preview-screen', sb.getAttribute('data-scr')); } catch (x) {} return this._render(); }
      // kolonlar: ekle / son kolonu kaldır (bölümleri bir soldakine geçer) / tablet düzeni / eşit. Toplam oran korunur, bölümler yerinde kalır.
      if (act === 'coladd') return editTab((T) => { const w = lpWeights(T), n = w.length, sum = w.reduce((a, b) => a + b, 0); T.columns = w.map((x) => Math.round(x * n / (n + 1) * 100) / 100).concat([Math.round(sum / (n + 1) * 100) / 100]); if (T.splits) T.splits = lpSplits(T, n + 1);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coldel') return editTab((T) => { const w = lpWeights(T), n = w.length; if (n < 2) return; const sum = w.reduce((a, b) => a + b, 0), keep = w.slice(0, -1), ks = keep.reduce((a, b) => a + b, 0);
        T.columns = keep.map((x) => Math.round(x * sum / ks * 100) / 100); T.sections.forEach((s) => { if ((s.col || 0) > n - 2) { s.col = n - 2; delete s.sub; } });
        if (T.splits) T.splits = lpSplits(T, n - 1); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const grb = g('[data-grows]');
      if (grb) { const n = +grb.getAttribute('data-grows'); return editTab((T) => { if (n === 12) delete T.grows; else T.grows = n; }); }
      const spb = g('[data-split]');
      if (spb) { const p = spb.getAttribute('data-split').split(':'), i = +p[0], v = +p[1];
        return editTab((T) => { const sp = lpSplits(T, lpWeights(T).length); sp[i] = v; T.splits = sp; T.sections.forEach((s) => { if ((s.col || 0) === i && (s.sub || 0) > v - 1) { if (v > 1) s.sub = v - 1; else delete s.sub; } }); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); }); }
      const ssb = g('[data-ssub]');
      if (ssb) { const v = +ssb.getAttribute('data-ssub'); return editSec((S) => { if (v) S.sub = v; else delete S.sub; }); }
      if (act === 'laygrid') return editTab((T) => { if (!(T.sections || []).every((x) => x.g)) lpGridFromCols(T); T.layout = 'grid'; });   // sütunlu düzenden ızgaraya; kutular aynı yerde başlar
      if (act === 'laycols') return editTab((T) => { delete T.layout; });   // sütun ayarları duruyor, geri dönülür
      if (act === 'gfit') return editTab((T) => { delete T.gfit; });
      if (act === 'gscr') return editTab((T) => { T.gfit = false; });
      if (act === 'gfill') return editTab((T) => {   // boşlukları kapat: geniş düzende (dikey önizlemedeyse dikeyde)
        const pv = this._screenKey() === 'tabp', C = pv ? 6 : 12, P = lpGridPos(T, C), L = Object.keys(P).map((k) => Object.assign({ id: k }, P[k]));
        let rows = T.gfit === false ? 0 : (+T.grows || 12); L.forEach((o) => { rows = Math.max(rows, o.y + o.h); });
        lpGFill(L, C, rows);
        L.forEach((o) => { const x = (T.sections || []).filter((q) => q.id === o.id)[0]; if (x) x[pv ? 'gm' : 'g'] = { x: o.x, y: o.y, w: o.w, h: o.h }; });
        if (pv) T.gm_own = true;
      });
      if (act === 'gmauto') return editTab((T) => { delete T.gm_own; (T.sections || []).forEach((x) => { delete x.gm; }); });
      if (act === 'coltab') return editTab((T) => { T.columns = LP_DEFAULT_COLS.slice();  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coleq') return editTab((T) => { const w = lpWeights(T), sum = w.reduce((a, b) => a + b, 0); T.columns = w.map(() => Math.round(sum / w.length * 100) / 100);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const sc = g('[data-scol]');
      if (sc) return editSec((S) => { S.col = +sc.getAttribute('data-scol'); delete S.sub; });
      const cr = g('[data-cr]');
      if (cr) { const v = +cr.getAttribute('data-cr'); return editSec((S) => { if (v) S.cam_refresh = v; else delete S.cam_refresh; }); }
      const cc = g('[data-cc]');
      if (cc) { const v = +cc.getAttribute('data-cc'); return editSec((S) => { if (v) S.cam_columns = v; else delete S.cam_columns; }); }
      const tc = g('[data-tc]');
      if (tc) return editSec((S) => { S.tile_columns = +tc.getAttribute('data-tc'); });
      const pfb = g('[data-pf]');
      if (pfb) { this._pf = pfb.getAttribute('data-pf'); this.shadowRoot.querySelectorAll('[data-pf]').forEach((b) => b.classList.toggle('on', b === pfb)); this._refreshPick(); return; }
      const lk = g('[data-look]');
      if (lk) return editSec((S) => { const v = lk.getAttribute('data-look'); if (v === 'tile') delete S.look; else S.look = v; });
      const sfb = g('[data-sfill]');
      if (sfb) return editSec((S) => { if (sfb.getAttribute('data-sfill')) S.fill = true; else delete S.fill; });
      const sgb = g('[data-sgap]');
      if (sgb) return editSec((S) => { const v = sgb.getAttribute('data-sgap'); if (v === '') delete S.gap; else S.gap = +v; });
      const sab = g('[data-salign]');
      if (sab) return editSec((S) => { const v = sab.getAttribute('data-salign'); if (v) S.align = v; else delete S.align; });
      const bcb = g('[data-bc]');
      if (bcb) return editSec((S) => { S.bar_columns = +bcb.getAttribute('data-bc'); });
      const imb = g('[data-im]');
      if (imb) { const i = +imb.getAttribute('data-im'), L = (sec && sec.entities) || []; if (L[i] !== undefined) this._imOpen(i, L[i], false); return; }
      const hlp = g('[data-help]');
      if (hlp) { e.preventDefault(); e.stopPropagation(); this._help = hlp.getAttribute('data-help'); return this._render(); }
      if (g('[data-hlpx]') || (g('[data-hlpov]') && e.target === g('[data-hlpov]'))) { this._help = null; return this._render(); }
      const mdb = g('[data-mode]');
      if (mdb) { try { localStorage.setItem('lhd-admin-mode', mdb.getAttribute('data-mode')); } catch (x) {} return this._render(); }
      if (g('[data-advon]')) { try { localStorage.setItem('lhd-admin-mode', 'adv'); } catch (x) {} return this._render(); }
      const isw = g('[data-imsw]');
      if (isw && this._im) { const p = isw.getAttribute('data-imsw').split(':'); this._im.f[p[0]] = p[1]; return this._render(); }
      if (g('[data-imsc]') && this._im) { this._im.f.scOn = !this._im.f.scOn; return this._render(); }
      if (g('[data-imscadd]') && this._im) { this._im.f.scRows.push(['', '#28BE64']); return this._render(); }
      const icl = g('[data-imclr]');
      if (icl && this._im) { this._im.f[icl.getAttribute('data-imclr')] = ''; return this._render(); }
      if (g('[data-imzone]') && this._im) { this._im.f.zOn = !this._im.f.zOn; return this._render(); }
      const itg = g('[data-imtg]');
      if (itg && this._im) { const kk = itg.getAttribute('data-imtg'); this._im.f[kk] = !this._im.f[kk]; return this._render(); }
      if (g('[data-ceopen]') && this._im) {
        let c; try { c = lhdYamlParse(this._im.f.card || ''); } catch (x) { c = null; }
        return this._ceOpen(c && c.type ? c : { type: 'markdown', content: '' }, this._im);
      }
      const cpi = g('[data-cpk]');
      if (cpi) return this._cpPick(cpi.getAttribute('data-cpk'));
      if (g('[data-cpyaml]')) { this._modal = null; return this._imOpen(-1, { card: { type: 'markdown', content: '' } }, true); }
      const cev = g('[data-cev]');
      if (cev && this._ce) { this._ceSetView(cev.getAttribute('data-cev')); return; }
      if (g('[data-cesave]') && this._ce) return this._ceSave();
      if (g('[data-ceback]') && this._ce) { const back = this._ce.im; this._ce = null; if (back) { this._im = back; this._modal = 'item'; } else this._modal = 'cardpick'; return this._render(); }
      const isg = g('[data-imseg]');
      if (isg && this._im) { const p = isg.getAttribute('data-imseg').split(':'); this._im.f[p[0]] = p[1]; return this._render(); }
      if (g('[data-imvis]') && this._im) { this._im.f.visOn = !this._im.f.visOn; return this._render(); }
      const dl = g('[data-del]');
      if (dl) { const i = +dl.getAttribute('data-del'); return editSec((S) => { (S.entities || []).splice(i, 1); }); }
      const pk = g('[data-pk]');
      if (pk && !pk.classList.contains('dis')) {
        const id = pk.getAttribute('data-pk'), k = this._picked.indexOf(id);
        if (k >= 0) this._picked.splice(k, 1); else this._picked.push(id);
        pk.classList.toggle('on', k < 0);
        pk.querySelector('.ck').innerHTML = k < 0 ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '';
        const btn = R.querySelector('[data-a="pickadd"]'); btn.disabled = !this._picked.length; btn.textContent = this._t('addN', { n: this._picked.length });
        return;
      }
      if (g('[data-news]')) { e.preventDefault(); this._newsFrom = this._modal; this._newsAll = false; this._modal = 'news'; return this._render(); }
      if (g('[data-gx]')) return this._guideClose();
      const gs = g('[data-gi]'); if (gs) { this._gi = +gs.getAttribute('data-gi'); this._render(); const b = this.shadowRoot.querySelector('.guide .gmain'); if (b) b.scrollTop = 0; return; }
      if (g('[data-newsall]')) { this._newsAll = true; return this._render(); }
      if (g('[data-newsclose]')) return this._newsClose();
      if (g('[data-updcheck]')) return this._updCheck();
      if (g('[data-wladd]')) { const W = this._walls(); W.push({}); this._wallDraft = W; return this._render(); }
      if (g('[data-wldel]')) { const W = this._walls(); W.splice(+g('[data-wldel]').getAttribute('data-wldel'), 1); this._wallDraft = null; const ok = W.filter((w) => w.switch && w.light); this._commit('walls', ok); return this._render(); }
      if (g('[data-updgo]')) return this._updInstall();
      if (g('[data-updrs]')) return this._updSet({ st: 'ask' });
      if (g('[data-updno]')) return this._updSet({ st: 'installed' });
      if (g('[data-updyes]')) return this._updRestart();
      const tcl = g('[data-tintc]');
      if (tcl) return this._setting('icon_tint', tcl.getAttribute('data-tintc'));
      const bgc = g('[data-bgcolor]');
      if (bgc) return this._bgSet({ mode: 'color', color: bgc.getAttribute('data-bgcolor') });
      const bgf = g('[data-bgfx]');
      if (bgf) return this._bgSet({ mode: 'fx', fx: bgf.getAttribute('data-bgfx') });
      const sot = g('[data-solt]');
      if (sot) { const k = sot.getAttribute('data-solt'), s0 = lpEnSolar(), n = Object.assign({}, s0, { sun: lpEnSunOn(s0), bat: lpEnBatOn(s0) }); n[k] = !n[k]; n.on = n.sun || n.bat; return this._enSetMany({ solar: n }); }
      const emt = g('[data-enmeter]');
      if (emt) return this._enSetMany({ meter: this._enMeterAuto(emt.getAttribute('data-enmeter')) });
      if (act === 'enmeterdel') return this._enSetMany({ meter: null });
      const tfm = g('[data-tfmode]');
      if (tfm) { const m = tfm.getAttribute('data-tfmode'); return this._enSetMany(m === 'sktt' ? { sktt_on: true } : { sktt_on: false, price_mode: m }); }
      const st = g('[data-set]');
      if (st) {
        const path = st.getAttribute('data-set'), v = st.getAttribute('data-val');
        if (path === 'bgmode') {
          if (v === 'img') { this._bgImg = true; this._bgBad = false; this._render(); const i = this.shadowRoot.querySelector('[data-bgurl]'); if (i) i.focus(); return; }
          this._bgImg = false; this._bgBad = false;
          const cur = this._settings().bg || {};
          if (v === 'dark') return this._bgSet({ mode: 'dark' });
          if (v === 'black') return this._bgSet({ mode: 'black' });
          if (v === 'color') return this._bgSet({ mode: 'color', color: cur.color || LHD_BG_COLORS[1] });
          if (v === 'fx') return this._bgSet({ mode: 'fx', fx: cur.fx || 'zen' });
        }
        return this._setting(path, v === 'auto' ? null : v);
      }
      const tgl = g('[data-tg]');
      if (tgl) {
        const path = tgl.getAttribute('data-tg'); const cur = tgl.classList.contains('on');
        if (path === 'lec_nav' || path === 'icon_tint_light' || path === 'phone.sheet') return this._setting(path, cur ? false : null);   // varsayılan açık: kapatınca false saklanır
        return this._setting(path, cur ? null : true);
      }
    });

    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir (yazarken odak kaybolmasın)
    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir. Yazı alanları "soft" kaydedilir: panel yeniden
    // çizilmez (odak ve hemen arkasından basılan düğme kaybolmasın); görünen ilgili yazılar yerinde güncellenir, önizleme kendisi güncellenir.
    app.addEventListener('change', (e) => {
      const el = e.target;
      if (el.hasAttribute && el.hasAttribute('data-pkproto')) { if (this._pk) { this._pk.proto = el.value; this._render(); } return; }
      if (el.hasAttribute && el.hasAttribute('data-imf')) { if (this._im) { this._im.f[el.getAttribute('data-imf')] = el.value; if (el.tagName === 'SELECT' || (el.type === 'color' && /^(color|color_on|bg)$/.test(el.getAttribute('data-imf')))) this._render(); } return; }
      if (el.hasAttribute && (el.hasAttribute('data-phtn') || el.hasAttribute('data-phti'))) {
        const isN = el.hasAttribute('data-phtn'), id = el.getAttribute(isN ? 'data-phtn' : 'data-phti'), v = el.value.trim();
        if (!isN && v && !/^[a-z]+:[a-z0-9-]+$/.test(v)) { el.value = ''; return; }
        return this._phEdit((p) => { const m = isN ? p.tabs.names : p.tabs.icons; if (v) m[id] = isN ? v.slice(0, 40) : v; else delete m[id]; }, true);
      }
      if (el.hasAttribute && (el.hasAttribute('data-scrw') || el.hasAttribute('data-scrh'))) {   // özel ekran çözünürlüğü
        const R0 = this.shadowRoot, wI = R0.querySelector('[data-scrw]'), hI = R0.querySelector('[data-scrh]'), w = Math.round(+(wI && wI.value) || 0), hh = Math.round(+(hI && hI.value) || 0);
        if (w >= 200 && hh >= 200 && w <= 8000 && hh <= 8000) { try { localStorage.setItem('lhd-preview-custom', w + 'x' + hh); } catch (x) {} }
        // telefon/tablet değişmediyse yalnız ölçekle; değiştiyse yeniden çiz ve odağı kullanıcının geçtiği kutuya geri ver
        setTimeout(() => { const R1 = this.shadowRoot; if (!R1) return; const a = R1.activeElement, k = a && a.hasAttribute ? (a.hasAttribute('data-scrw') ? 'data-scrw' : a.hasAttribute('data-scrh') ? 'data-scrh' : '') : '';
          if (this._pvPh === this._scrPh('custom')) { this._fit(); return; }
          this._render(); if (k) { const n = this.shadowRoot.querySelector('[' + k + ']'); if (n) { n.focus(); try { n.select(); } catch (x) {} } } }, 0);
        return;
      }
      if (el.hasAttribute && el.hasAttribute('data-phgn')) {   // katlanır grubun adı
        const j = +el.getAttribute('data-phgn'), v = el.value.trim().slice(0, 40), tb = this._curTab(this._work()), sc = this._curSec(tb), sid = sc && sc.id; if (!sid) return;
        return this._phEdit((p) => { const o = p.secs[sid]; const G = o && Array.isArray(o.folds) ? o.folds[j] : null; if (G) G.name = v; }, true);
      }
      if (el.hasAttribute && el.hasAttribute('data-wl')) { const p = el.getAttribute('data-wl').split(':'); this._wallSet(+p[0], p[1], el.value); return; }
      if (el.hasAttribute && el.hasAttribute('data-bkfile')) { const f = el.files && el.files[0]; el.value = ''; if (f) this._backupRead(f); return; }
      const soft = el.tagName === 'INPUT';
      const f = el.getAttribute && el.getAttribute('data-f');
      if (f === 'tab.name') {
        const v = el.value.trim(); if (!v) { el.value = tab.name; return; }
        const lb = R.querySelector('.rb.on'); if (lb && lb.lastChild && lb.lastChild.nodeType === 3) lb.lastChild.textContent = v;
        // yeni açılmış adsız sekme ilk kez adlandırılınca adresi de addan gelsin (/pano/sekme → /pano/salon)
        if (/^(sekme|tab)(-\d+)?$/.test(tab.id)) {
          const base = lhdSlug(v) || tab.id, taken = {}; this._work().forEach((x) => { if (x.id !== tab.id) taken[x.id] = 1; });
          let nid = base, k = 2; while (taken[nid]) nid = base + '-' + (k++);
          if (nid !== tab.id) { this._tab = nid; return this._edit((T) => { const x = T.filter((y) => y.id === tabId)[0]; if (x) { x.name = v; x.id = nid; } }); }
        }
        return editTab((T) => { T.name = v; }, true);
      }
      if (f === 'tab.icon') {
        const v = el.value.trim() || 'mdi:door';
        const ic = R.querySelector('.rb.on .lic'); if (ic) ic.outerHTML = lpIcon(v);
        const pv = R.querySelector('.iconin .pv .lic'); if (pv) pv.outerHTML = lpIcon(v);
        return editTab((T) => { T.icon = v; }, true);
      }
      if (f === 'tab.area') return editTab((T) => { T.area = el.value || null; });
      if (f === 'sec.title') {
        const lb = R.querySelector('.si.on .nm b'); if (lb) lb.textContent = el.value || this._t('t_' + (LHD_TYPES[sec.type] ? sec.type : 'free'));
        return editSec((S) => { S.title = el.value; }, true);
      }
      const itf = el.getAttribute && el.getAttribute('data-if');
      if (itf) {
        const p = itf.split('.'), i = +p[0], key = p[1], v = el.value.trim();
        if (key === 'color') { const ic = el.parentNode.querySelector('.ico ha-icon'); if (ic) ic.style.color = v; }
        return editSec((S) => {
          let it = S.entities[i]; if (it === undefined) return;
          if (it && typeof it === 'object' && !it.entity) { if (v) it[key] = v; else if (key !== 'name') delete it[key]; return; }   // düğme ya da boş karo
          if (typeof it === 'string') { it = { entity: it }; S.entities[i] = it; }
          if (key === 'link') { if (v) it.entities = [v].concat((it.entities || []).slice(1).filter((x) => x !== v)); else delete it.entities; }
          else if (v && !(key === 'kind' && v === 'auto')) it[key] = v; else delete it[key];
          if (it.entity && Object.keys(it).length === 1) S.entities[i] = it.entity;   // sade kalsın
        }, soft);
      }
      if (el.hasAttribute && el.hasAttribute('data-bgpick')) return this._bgSet({ mode: 'color', color: el.value }, true);
      if (this._ak && el.hasAttribute && el.hasAttribute('data-akpick')) { this._ak.bg = 'color'; this._ak.bgColor = el.value; return this._render(); }
      if (this._ak && el.hasAttribute && el.hasAttribute('data-akurl')) { this._ak.bg = 'img'; this._ak.bgUrl = el.value.trim(); return this._render(); }
      if (el.hasAttribute && el.hasAttribute('data-tintpick')) return this._setting('icon_tint', el.value);
      const sf = el.getAttribute && el.getAttribute('data-sf');
      if (sf === 'energy.meter.power' && el.value && !(lpEnMeter() && lpEnMeter().energy)) return this._enSetMany({ meter: this._enMeterAuto(el.value) });
      if (sf && sf.indexOf('energy.') === 0 && el.type === 'number' && parseFloat(String(el.value).replace(',', '.')) < 0) { this._toast(this._t('enENeg'), false); return this._render(); }
      if (sf === 'energy.low' || sf === 'energy.high') { const o = sf === 'energy.low' ? lpEnNumOf(lpEnCfg().high) : lpEnNumOf(lpEnCfg().low), v2 = parseFloat(String(el.value).replace(',', '.')); if (o > 0 && v2 > 0 && (sf === 'energy.low' ? v2 > o : v2 < o)) this._toast(this._t('enTierOrder'), false); }
      if (sf) { const v = el.type === 'number' ? (el.hasAttribute('data-dec') ? (parseFloat(String(el.value).replace(',', '.')) || null) : (parseInt(el.value, 10) || null)) : el.value.trim(); const en = sf.indexOf('energy.') === 0, sel = el.tagName === 'SELECT'; this._setting(sf, v, !en || !sel); if (en && !sel) this._enLater(); return; }   // enerji sayfasında hesaplar yenilensin (yazı alanında biraz sonra: basılan düğme kaybolmasın)   // enerji sayfasında hesaplar yenilensin
      // yazı ve sayı alanı: yalnız taslağa yazılır, hesap yerinde yenilenir (tam çizim, alandan çıkarken basılan düğmenin tıklamasını yutuyordu)
      if (el.hasAttribute && el.hasAttribute('data-enpick') && this._enE) { this._enErr = ''; if (el.value) this._enAuto(el.value); return this._render(); }
      if (el.hasAttribute && el.hasAttribute('data-enf') && this._enE) { const k = el.getAttribute('data-enf'); this._enE.f[k] = el.value; this._enErr = ''; if (el.tagName === 'SELECT') return this._render(); if (k === 'entity') { if (!this._enE.id && this._hass.states[el.value]) { this._enAuto(el.value); return this._render(); } return this._enLater(); } if (k === 'name') this._enE.f._auto = ''; if (k === 'len' || k === 'cap' || k === 'lenref') this._enLater(); return this._enCalc(); }
      if (el.hasAttribute && el.hasAttribute('data-lrf') && this._lrn) { const k = el.getAttribute('data-lrf'); if (k === 'plug') { this._lrn.plug = el.value; this._lrn.ts = []; this._lrn.iv = 0; this._lrn.tested = 0; this._lrn.testMsg = ''; this._lrnWatch(); } else if (k === 'len' || k === 'cap') { const v = parseFloat(String(el.value).replace(',', '.')); this._lrn[k] = v > 0 && v <= (k === 'len' ? 50 : 2000) ? v : 0; } else this._lrn[k] = !!el.checked; return this._render(); }
      if (el.hasAttribute && el.hasAttribute('data-lrlen') && this._lrn) { this._lrn.lens[el.getAttribute('data-lrlen')] = String(el.value).replace(',', '.'); return; }
      if (el.hasAttribute && el.hasAttribute('data-lrap') && this._lrn) { this._lrn.apply[el.getAttribute('data-lrap')] = !!el.checked; return; }
      if (el.hasAttribute && el.hasAttribute('data-enstrip') && this._enE) { this._enE.f.strip = !!el.checked; return this._render(); }
      if (el.hasAttribute && el.hasAttribute('data-enst') && this._enE) { this._enE.f.st[el.getAttribute('data-enst')] = el.value; this._enErr = ''; return this._enCalc(); }
      if (el.hasAttribute && el.hasAttribute('data-encf') && this._enC) { this._enC[el.getAttribute('data-encf')] = el.value; return; }
      if (el.hasAttribute && el.hasAttribute('data-encm') && this._enC) { this._enC.m[el.getAttribute('data-encm')] = el.checked; return this._render(); }
      if (el.hasAttribute && el.hasAttribute('data-enlim')) { const L = lpEnLim().slice(), v = parseFloat(String(el.value).replace(',', '.')); if (v > 0) L[+el.getAttribute('data-enlim')] = v; L.sort((x, y) => x - y); return this._setting('energy.limits', L[0] < L[1] && L[1] < L[2] ? L : null, true); }
      if (el.hasAttribute && el.hasAttribute('data-bgurl')) {
        const u = el.value.trim();
        // resim gerçekten açılıyor mu: açılmazsa uyarı (zemin yine kaydedilir, dosya sonradan konabilir)
        if (u) { const im = new Image(); im.onload = () => { if (this._bgBad) { this._bgBad = false; this._render(); } }; im.onerror = () => { this._bgBad = true; if (this._modal === 'settings') this._render(); }; im.src = u; }
        return this._bgSet(u ? { mode: 'img', url: u } : null, true);
      }
    });
    app.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('inp') && e.target.tagName === 'INPUT') e.target.blur(); });
    // simge alanında yazarken önizleme
    app.addEventListener('input', (e) => {
      const el = e.target;
      if (el.hasAttribute && el.hasAttribute('data-iq')) { this._iq = el.value; this._refreshIcons(); return; }
      if (el.hasAttribute && el.hasAttribute('data-pkq')) { if (this._pk) { this._pk.q = el.value; const gr = R.querySelector('.pkgrid'); if (gr) gr.innerHTML = this._pkCards(); } return; }
      if (el.hasAttribute && el.hasAttribute('data-enq')) { this._enQ = el.value; return this._render(); }
      if (el.hasAttribute && el.hasAttribute('data-cpq')) { this._cpq = el.value; const l = R.querySelector('.cplist'); if (l) { const tmp = document.createElement('div'); tmp.innerHTML = this._cpHtml(); const nl = tmp.querySelector('.cplist'); if (nl) l.innerHTML = nl.innerHTML; } return; }
      if (el.hasAttribute && el.hasAttribute('data-ceyaml')) { if (this._ce) { this._ce.yaml = el.value; clearTimeout(this._ce.yT); const C = this._ce; C.yT = setTimeout(() => { try { const c = lhdYamlParse(C.yaml); if (c && c.type) { C.cfg = c; this._cePreview(); } } catch (e) {} }, 500); } return; }
      if (el.hasAttribute && el.hasAttribute('data-imsr')) { if (this._im) { const p = el.getAttribute('data-imsr').split(':'); this._im.f.scRows[+p[0]][+p[1]] = el.value; } return; }
      if (el.hasAttribute && el.hasAttribute('data-imf')) {
        if (this._im) { const key = el.getAttribute('data-imf'); this._im.f[key] = el.value; if (/icon/.test(key)) { const pv = el.closest('.iconin'); const ic = pv && pv.querySelector('.pv .lic'); if (ic && /^[a-z]+:[a-z0-9-]+$/.test(el.value.trim())) ic.outerHTML = lpIcon(el.value.trim()); } }
        return;
      }
      if (el.hasAttribute && el.hasAttribute('data-repq')) { if (this._rep) { this._rep.text = el.value; this._rep.copied = false; } return; }
      if (el.hasAttribute && el.hasAttribute('data-q')) { this._q = el.value; const pl = R.querySelector('.plist'); if (pl) { pl.innerHTML = this._pickList(sec); pl.querySelectorAll('ha-state-icon[data-eid]').forEach((x) => { x.hass = this._hass; x.stateObj = this._hass.states[x.getAttribute('data-eid')]; }); } return; }
      const f = el.getAttribute && (el.getAttribute('data-f') || el.getAttribute('data-if') || '');
      if (/icon$/.test(f)) { const pv = el.closest('.iconin, .it'); const ic = pv && pv.querySelector('.pv .lic, .ico .lic'); if (ic && /^[a-z]+:[a-z0-9-]+$/.test(el.value.trim())) ic.outerHTML = lpIcon(el.value.trim()); }
    });
    const q = R.querySelector('[data-q]'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }

    // sürükle bırak: sekmeler (yatay), bölümler, öğeler
    R.querySelectorAll('[data-dl]').forEach((list) => {
      list.addEventListener('pointerdown', (e) => {
        const h = e.target.closest ? e.target.closest('[data-handle]') : null;
        if (!h || e.button !== 0) return;
        const item = h.closest('[data-di]'); if (!item || item.parentNode !== list) return;
        const items = Array.prototype.filter.call(list.children, (x) => x.hasAttribute('data-di'));
        const from = items.indexOf(item), horiz = list.getAttribute('data-dir') === 'x';
        const sx = e.clientX, sy = e.clientY;
        let started = false, ghost = null, gr = null;
        this._dragged = false;
        const home = item.nextSibling;
        // canlı sıralama: tutulan satır (kopyası) imleci izler, yerinde soluk hali kalır, öteki satırlar kayıp yer açar
        const move = (ev) => {
          if (!started && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
          if (!started) {
            started = true; item.classList.add('dragging'); try { list.setPointerCapture(e.pointerId); } catch (x) {}
            gr = item.getBoundingClientRect();
            ghost = item.cloneNode(true); ghost.classList.remove('dragging', 'on'); ghost.classList.add('dlghost');
            ghost.removeAttribute('data-di');
            ghost.style.left = gr.left + 'px'; ghost.style.top = gr.top + 'px'; ghost.style.width = gr.width + 'px'; ghost.style.height = gr.height + 'px';
            R.appendChild(ghost);
          }
          ghost.style.transform = 'translate(' + (horiz ? ev.clientX - sx : 0) + 'px,' + (horiz ? 0 : ev.clientY - sy) + 'px)';
          const pos = horiz ? ev.clientX : ev.clientY;
          const rest = Array.prototype.filter.call(list.children, (x) => x.hasAttribute('data-di') && x !== item);
          let ref = null;
          for (let i = 0; i < rest.length; i++) { const r = rest[i].getBoundingClientRect(); if (pos < (horiz ? r.left + r.width / 2 : r.top + r.height / 2)) { ref = rest[i]; break; } }
          if (!ref) { const last = rest[rest.length - 1]; ref = last ? last.nextSibling : null; }
          if (ref !== item && item.nextSibling !== ref) list.insertBefore(item, ref);
        };
        const up = () => {
          window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          item.classList.remove('dragging'); if (ghost) ghost.remove();
          if (!started) return;
          this._dragged = true; setTimeout(() => { this._dragged = false; }, 0);
          const dest = Array.prototype.filter.call(list.children, (x) => x.hasAttribute('data-di')).indexOf(item);
          try { list.insertBefore(item, home && home.parentNode === list ? home : null); } catch (x) {}   // kaydedilince liste yeniden çizilir
          if (dest < 0 || dest === from) return;
          const kind = list.getAttribute('data-dl');
          if (kind === 'tabs' && this._phEd()) { const W0 = this._work(), ids = lhdOrderBy(W0, this._phTabs().order).map((x) => x.id); lhdMove(ids, from, dest); const def = W0.map((x) => x.id).join(); return this._phEdit((p) => { p.tabs.order = ids.join() === def ? [] : ids; }); }
          if (kind === 'tabs') this._edit((T) => lhdMove(T, from, dest));
          if (kind === 'secs' && this._phEd() && tabId) {
            const T0 = (this._work() || []).filter((x) => x.id === tabId)[0]; if (!T0) return;
            const ids = lhdPhoneOrder(T0, this._phOrd(T0)).map((x) => x.id); lhdMove(ids, from, dest);
            const def = lhdPhoneOrder(T0, null).map((x) => x.id).join();
            return this._phEdit((p) => { if (ids.join() === def) delete p.order[tabId]; else p.order[tabId] = ids; });
          }
          if (kind === 'secs') editTab((T) => lhdMove(T.sections, from, dest));
          if (kind === 'items') editSec((S) => lhdMove(S.entities, from, dest));
        };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
    });
  }

  // --- öğe ayarları penceresi: ad, simge, açık/kapalı simgeleri, dokununca / basılı tutunca, düğmenin eylemi, gömülü kart, koşullu görünürlük ---
  // Alanlar taslakta (this._im.f) tutulur; "Kaydet"e basınca öğeye yazılır (YAML hatalıysa pencere açık kalır, hata gösterilir).
  // öğe ayarlarındaki enerji kartı (önizleme için): kayıttaki gibi, görünüm hariç
  // enerji değerinin bölüme uyan görünümü: iklim/süpürge kartlarının yanında Halo, düğmelerin yanında düğme, ışıkların yanında karo
  _enFit(S) {
    const k = lhdKinds(S || {});
    if (k.climate || k.vacuum) return 'halo';
    if ((k.scene || 0) > (k.tile || 0)) return 'button';
    return '';
  }
  // Enerji kartı menüsündeki değerler: önce sekmenin odası, sonra ev geneli, sonra öteki odalar
  _enVals() {
    const h = this._hass, S = (h && h.states) || {}, tab = this._curTab(this._work()), area = tab && tab.area, out = [];
    const fmt = (st) => { if (!st || st.state === 'unavailable') return '–'; const n = parseFloat(st.state), u = st.attributes.unit_of_measurement; return (isNaN(n) ? st.state : n.toLocaleString(this._lang === 'tr' ? 'tr-TR' : 'en-GB', { maximumFractionDigits: 2 })) + (u ? ' ' + u : ''); };
    const push = (id, room) => { const st = S[id]; if (st) out.push({ id: id, name: st.attributes.friendly_name || id, icon: st.attributes.icon || 'mdi:flash', val: fmt(st), room: room }); };
    if (area) ['power', 'energy'].forEach((k) => push(lpEnRoomId(area, k), true));
    ['sensor.lhd_ev_power', 'sensor.lhd_ev_energy'].forEach((id) => push(id, false));
    LP_EN_VIRT.forEach((x) => push('sensor.lhdx_' + x[0], false));
    Object.keys(S).filter((id) => /^sensor\.lhd_oda_.+_(power|energy)$/.test(id) && !(area && S[id].attributes.area === area)).sort().forEach((id) => push(id, true));
    return out;
  }
  // küçük resimler için öğelerin simge ve adları (en çok 3)
  _thItems(list) {
    const S = (this._hass && this._hass.states) || {}, out = [];
    (list || []).forEach((raw) => {
      if (out.length >= 3) return;
      const it = typeof raw === 'string' ? { entity: raw } : raw || {};
      if (it.subtitle || it.card) return;
      const st = it.entity && S[it.entity];
      const nm = it.name || (it.entity ? this._ename(it.entity) : it.energy ? lpEnT(this._lang, 'k_' + it.energy) : '');
      out.push({ ic: st ? lpIcon(lpEntIcon(st, it.icon), 's16') : lpIcon(it.icon || 'mdi:lightbulb-outline', 's16'), nm: nm });
    });
    if (!out.length) out.push({ ic: lpIcon('mdi:lightbulb-outline', 's16'), nm: this._t('lookTile') });
    return out;
  }
  _enFormIt(f) {
    const ty = f.enK, it = { energy: ty };
    if (ty === 'halo') { if (!f.enChips) it.chips = false; if (!f.enBars) it.bars = false; }
    if (ty === 'cats') { if (f.enLoose === false) it.loose = false; if (f.enSort === 'w') it.sort = 'w'; if (f.enCols) it.cols = +f.enCols; if (f.enChart) it.chart = f.enChart; }
    if (ty === 'top') { if (f.enCount) it.count = +f.enCount; if (f.enCat) it.cat = f.enCat; if (f.enIdle) it.hide_idle = true; }
    if (ty === 'week') { if (f.enDays === '30') it.days = 30; if (f.enUnit === 'cost') it.unit = 'cost'; }
    if (ty === 'day' && f.enMode === 'total') it.mode = 'total';
    if (ty === 'nav') { const sh = LP_ER_ANA.filter((x) => f['enA_' + x] !== false); if (sh.length && sh.length < LP_ER_ANA.length) it.show = sh; }
    return it;
  }
  _imOpen(idx, raw, isNew) {
    const tab = this._curTab(this._work()), sec = this._curSec(tab);
    if (!tab || !sec) return;
    const it = typeof raw === 'string' ? { entity: raw } : lhdClone(raw || {});
    const f = { name: it.name || '', icon: it.icon || '', icon_on: it.icon_on || '', icon_off: it.icon_off || '', size: it.size || '', icon_size: it.icon_size || '', text_size: it.text_size || '',
      look: it.look || '', color: it.color || '', color_on: it.color_on || '', bg: it.bg || '', height: it.height ? String(it.height) : '', subtitle: it.subtitle || '',
      swap: !!it.swap, refresh: it.refresh ? String(it.refresh) : '', cover: it.cover || '', cover_dir: it.cover_dir || '', tilt_entity: it.tilt_entity || '', cfm: !!it.confirm, cfmText: typeof it.confirm === 'string' ? it.confirm : '' };
    const tw = it.entity && STORE.data && STORE.data.twins && STORE.data.twins[it.entity];
    f.twin = (tw && tw.backup) || '';
    const s2 = it.secondary || '';
    f.secK = !s2 ? '' : s2 === 'state' || s2 === 'last_changed' ? s2 : s2.indexOf('attr:') === 0 ? 'attr' : 'tpl';
    f.secAttr = f.secK === 'attr' ? s2.slice(5) : ''; f.secTpl = f.secK === 'tpl' ? s2 : '';
    const sc = it.state_colors && typeof it.state_colors === 'object' ? it.state_colors : null;
    f.scOn = !!sc; f.scE = (sc && sc.entity) || '';
    f.scRows = sc && sc.map ? Object.keys(sc.map).map((x) => [x, lhdIsObj(sc.map[x]) ? (sc.map[x].color || '') : sc.map[x]]) : [];
    f.scX = {}; if (sc && sc.map) Object.keys(sc.map).forEach((x) => { if (lhdIsObj(sc.map[x])) f.scX[x] = sc.map[x]; });   // renk dışındaki ayarlar (v0.35)
    while (f.scRows.length < 4) f.scRows.push(['', LHD_SC_DEF[f.scRows.length % LHD_SC_DEF.length]]);
    const z = it.zones && typeof it.zones === 'object' ? it.zones : null;
    f.zOn = !!z;
    for (let q = 0; q < 4; q++) f['zt' + q] = z && z.t && z.t[q] !== undefined && z.t[q] !== null ? String(z.t[q]) : String(LHD_ZONE_DEF.t[q]);
    for (let q = 0; q < 5; q++) f['zc' + q] = (z && z.c && z.c[q]) || LHD_ZONE_DEF.c[q];
    const ai = (pre, a, scene) => {
      const o = {};
      if (scene && (a === null || a === undefined)) o.K = 'none';
      else if (a === undefined || a === null || a === '') o.K = 'def';
      else if (typeof a === 'string') o.K = ['more-info', 'toggle', 'none'].indexOf(a) >= 0 ? a : 'def';
      else if (a.popup && typeof a.popup === 'object') { o.K = 'popup'; o.Title = a.popup.title || ''; o.Card = a.popup.card ? lhdYamlDump(a.popup.card) : ''; }
      else {
        const sv = a.service || a.perform_action, tg = a.target;
        const simpleT = tg === undefined || typeof tg === 'string' || (tg && typeof tg === 'object' && !Array.isArray(tg) && Object.keys(tg).length === 1 && typeof tg.entity_id === 'string');
        const ks = Object.keys(a).filter((k) => ['service', 'perform_action', 'target', 'data', 'action'].indexOf(k) < 0);
        if (typeof sv === 'string' && simpleT && !ks.length && (!a.action || a.action === 'perform-action' || a.action === 'call-service')) {
          o.K = 'service'; o.Sv = sv; o.Tg = typeof tg === 'string' ? tg : (tg ? tg.entity_id : ''); o.Data = a.data && Object.keys(a.data).length ? lhdYamlDump(a.data) : '';
        } else if (!sv && (a.action === 'more-info' || a.action === 'toggle' || a.action === 'none') && !a.entity) o.K = a.action;
        else { o.K = 'yaml'; o.Y = lhdYamlDump(a); }
      }
      Object.keys(o).forEach((k) => { f[pre + k] = o[k]; });
    };
    ai('tap', it.tap); ai('hold', it.hold);
    if (!it.entity && Object.prototype.hasOwnProperty.call(it, 'action')) ai('act', it.action, true);
    if (it.card) f.card = lhdYamlDump(it.card);
    if (typeof it.energy === 'string') Object.assign(f, { enK: it.energy, enCols: it.cols ? String(it.cols) : '', enChart: it.chart || '', enCount: it.count ? String(it.count) : '', enCat: it.cat || '',
      enIdle: !!it.hide_idle, enDays: +it.days === 30 ? '30' : '', enUnit: it.unit === 'cost' ? 'cost' : '', enMode: it.mode === 'total' ? 'total' : '', enChips: it.chips !== false, enBars: it.bars !== false, enLook: it.look || '', enSort: it.sort === 'w' ? 'w' : '', enLoose: it.loose !== false });
    if (it.energy === 'nav') LP_ER_ANA.forEach((x) => { f['enA_' + x] = !Array.isArray(it.show) || it.show.indexOf(x) >= 0; });
    if (Object.prototype.hasOwnProperty.call(it, 'pet')) {
      const P = ((STORE.data && STORE.data.pets) || {})[it.pet] || {}, fd = P.feeder || {};
      Object.assign(f, { pName: P.name || '', pKind: P.kind || 'cat', pIcon: P.icon || '', pMode: P.mode === 'times' ? 'times' : 'interval', pEvery: String(P.every_h || 12),
        pTimes: (P.times || ['08:00', '20:00']).join(', '), pSoon: String(P.soon_min || 60), pGrace: String(P.grace_min || 30), pNotify: P.notify || '', pFeedSv: fd.service || '', pFeedTg: fd.target || '' });
    }
    const v = it.visible && typeof it.visible === 'object' ? it.visible : null;
    f.visOn = !!(v && v.entity); f.visE = (v && v.entity) || '';
    f.visM = v && v.not !== undefined ? 'not' : (v && v.states !== undefined ? 'in' : 'eq');
    const vl = v ? (v.not !== undefined ? v.not : (v.states !== undefined ? v.states : v.state)) : null;
    f.visV = vl === null || vl === undefined ? '' : [].concat(vl).join(', ');
    this._im = { tab: tab.id, sec: sec.id, idx: idx, isNew: !!isNew, raw: it, f: f, err: '' };
    this._modal = 'item'; this._menu = null; this._render();
  }
  _imHtml() {
    const M = this._im; if (!M) return '';
    const t = (k, v) => esc(this._t(k, v)), f = M.f, it = M.raw, S = this._hass.states;
    const k = lhdKind(it), st = it.entity ? S[it.entity] : null, d = it.entity ? it.entity.split('.')[0] : '';
    const adv = this._adv(), hb = (x) => this._hb(x);   // basit modda gelişmiş ayarlar gizli (silinmez)
    const inp = (key, ph, list) => '<input class="inp" data-imf="' + key + '" value="' + esc(f[key] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + (list ? ' list="lhdents"' : '') + ' spellcheck="false">';
    const ta = (key, rows, ph) => '<textarea class="inp ta" data-imf="' + key + '" rows="' + rows + '" spellcheck="false"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(f[key] || '') + '</textarea>';
    const fld = (label, html, cls) => '<div class="fld' + (cls ? ' ' + cls : '') + '"><label>' + label + '</label>' + html + '</div>';
    const icf = (key, label, ph) => fld(label, '<div class="iconin"><div class="pv">' + lpIcon(f[key] || ph || 'mdi:shape-outline') + '</div>' + inp(key, ph) + '<button class="btn sm ic" data-ip="im:' + key + '" title="' + t('iconPick') + '"><ha-icon class="s16" icon="mdi:shape-outline"></ha-icon></button></div>');
    // eylem seçici: pre = tap | hold | act
    const actF = (pre, label, defLabel, opts) => {
      const K = f[pre + 'K'] || (opts[0] === 'def' ? 'def' : opts[0]);
      if (!adv) { opts = opts.filter((o) => ['def', 'more-info', 'toggle', 'none'].indexOf(o) >= 0); if (opts.indexOf(K) < 0) return ''; }   // basit: yalnız temel eylemler
      const names = { def: defLabel, 'more-info': this._t('a_more'), toggle: this._t('a_tog'), none: this._t('a_none'), service: this._t('a_svc'), popup: this._t('a_pop'), yaml: this._t('a_yaml') };
      let h = '<select class="inp" data-imf="' + pre + 'K">' + opts.map((o) => '<option value="' + o + '"' + (o === K ? ' selected' : '') + '>' + esc(names[o]) + '</option>').join('') + '</select>';
      if (K === 'service') h += '<div class="row2">' + fld(t('svc'), inp(pre + 'Sv', 'timer.start')) + fld(t('tgt'), inp(pre + 'Tg', 'timer.balik_besleme', true)) + '</div>' + fld(t('svcData'), ta(pre + 'Data', 3, 'duration: "00:10:00"'));
      if (K === 'popup') h += fld(t('popTitle') + hb('popup'), inp(pre + 'Title', this._t('popTitle'))) + fld(t('cardY'), ta(pre + 'Card', 8, 'type: custom:...\nentity: ...'));
      if (K === 'yaml') h += fld(t('actY'), ta(pre + 'Y', 6, 'action: perform-action\nperform_action: script.turn_on'));
      return '<div class="imact">' + fld(label + hb('actions'), h) + '</div>';
    };
    let body = '';
    if (k === 'pet') {
      const sgp = (key, opts) => '<div class="seg">' + opts.map((o) => '<button data-imseg="' + key + ':' + o[0] + '"' + (f[key] === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const nts = Object.keys((this._hass.services && this._hass.services.notify) || {}).sort();
      body += fld(t('name'), inp('pName', 'Pamuk')) +
        fld(t('petKind'), sgp('pKind', Object.keys(LP_PET_KINDS).map((x) => [x, this._t('pk_' + x)]))) +
        icf('pIcon', t('icon'), LP_PET_KINDS[f.pKind] || 'mdi:paw') +
        fld(t('petSched') + hb('pet'), sgp('pMode', [['interval', this._t('pm_interval')], ['times', this._t('pm_times')]])) +
        (f.pMode === 'times' ? fld(t('petTimes'), inp('pTimes', '08:00, 20:00')) : fld(t('petEvery'), '<input class="inp" type="number" min="0.5" step="0.5" data-imf="pEvery" value="' + esc(f.pEvery) + '">')) +
        '<div class="row2">' + fld(t('petSoon'), '<input class="inp" type="number" min="0" step="5" data-imf="pSoon" value="' + esc(f.pSoon) + '">') + fld(t('petGrace'), '<input class="inp" type="number" min="0" step="5" data-imf="pGrace" value="' + esc(f.pGrace) + '">') + '</div>' +
        fld(t('petNotify'), '<select class="inp" data-imf="pNotify"><option value="">' + t('petNoNotify') + '</option>' + nts.map((x) => '<option value="notify.' + esc(x) + '"' + (f.pNotify === 'notify.' + x ? ' selected' : '') + '>notify.' + esc(x) + '</option>').join('') + '</select>') +
        (!adv ? '' : fld(t('petFeeder'), '<div class="row2">' + inp('pFeedSv', 'button.press') + inp('pFeedTg', 'button.yemlik', true) + '</div><div class="hint">' + t('petFeederT') + '</div>')) +
        '<div class="hint">' + esc(this._t('petEnt', { n: f.pName || '…' })) + '</div>';
    }
    if (k === 'card') body += '<button class="btn sm" data-ceopen><ha-icon class="s16" icon="mdi:pencil-box-outline"></ha-icon>' + t('ceEdit') + '</button>' + (!adv ? '' : fld(t('cardY') + hb('card'), ta('card', 12, 'type: markdown\ncontent: ...'))) + (!adv ? '' :
      fld(t('heightL'), '<div class="seg">' + [['', this._t('sz_auto')], ['1', this._t('h_rows', { n: 1 })], ['1.5', this._t('h_rows', { n: '1,5' })], ['2', this._t('h_rows', { n: 2 })]].map((o) => '<button data-imseg="height:' + o[0] + '"' + (f.height === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>') +
      actF('tap', t('tapL'), this._t('a_defCard'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']) + actF('hold', t('holdL'), this._t('a_defCard'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']));
    else if (k === 'sub') body += fld(t('subText'), inp('subtitle', 'BAĞLANTI'));
    else if (k === 'energy') {
      const sgE = (key, opts) => '<div class="seg">' + opts.map((o) => '<button data-imseg="' + key + ':' + o[0] + '"' + ((f[key] || '') === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const tgE = (key, label, sub) => '<div class="srow"><div class="t"><b>' + label + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</div><button class="tg' + (f[key] ? ' on' : '') + '" data-imtg="' + key + '"></button></div>';
      const K = f.enK, M = LP_EN.m;
      // kart türü: simgeli kutucuklar ve ne gösterdiği; görünüm: her seçenek canlı küçük önizlemeyle
      LP_EL_MINI.h = this._hass; LP_EL_MINI.lang = this._lang;
      body += fld(t('enKind') + hb('energy'), '<div class="enkp">' + LP_EN_TYPES.map((x) => '<button data-imseg="enK:' + x + '"' + (K === x ? ' class="on"' : '') + '><ha-icon icon="' + esc(LP_EN_IC[x]) + '"></ha-icon><b>' + esc(lpEnT(this._lang, 'k_' + x)) + '</b><span>' + esc(lpEnT(this._lang, 'd_' + x)) + '</span></button>').join('') + '</div>');
      const LK = LP_EL_LOOKS[K] || [''], LN = lpElNames(K, this._lang), lkCur = LK.indexOf(f.enLook || '') >= 0 ? f.enLook || '' : '';
      if (LK.length > 1) body += fld(t('enLook') + ' · ' + esc(LN[LK.indexOf(lkCur)] || ''), '<div class="lkg2">' + LK.map((x, i) => '<button data-imseg="enLook:' + x + '"' + (lkCur === x ? ' class="on"' : '') + '><div class="mk"><lhd-en-mini k="' + esc(K) + '" look="' + esc(x) + '" it="' + esc(JSON.stringify(this._enFormIt(f))) + '"></lhd-en-mini></div><span><i>' + (i + 1) + '</i>' + esc(LN[i] || x) + '</span></button>').join('') + '</div>');
      if (K === 'halo') body += tgE('enChips', t('enChips'), t('enChipsT')) + tgE('enBars', t('enBars'), t('enBarsT'));
      if (K === 'cats') body += tgE('enLoose', t('enLoose'), t('enLooseT')) + fld(t('enSort'), sgE('enSort', [['', this._t('enSortFix')], ['w', this._t('enSortW')]])) + fld(t('enCols'), sgE('enCols', [['', this._t('phColsAuto')], ['2', '2'], ['3', '3'], ['4', '4']])) + fld(t('enChart'), sgE('enChart', [['', this._t('enC24')], ['7d', this._t('enC7')], ['none', this._t('enChNone')]]));
      if (K === 'top') {
        const cats = (M && M.cats) || [];
        body += fld(t('enCount'), sgE('enCount', [['3', '3'], ['5', '5'], ['', '6'], ['8', '8'], ['10', '10']])) +
          (cats.length || f.enCat ? fld(t('enCat'), '<select class="inp" data-imf="enCat"><option value="">' + t('enAll') + '</option>' + cats.map((c) => '<option value="' + esc(c.id) + '"' + (f.enCat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') + '</select>') : '') +
          tgE('enIdle', t('enIdle'), t('enIdleT'));
      }
      if (K === 'week') body += fld(t('enDays'), sgE('enDays', [['', '7'], ['30', '30']])) + fld(t('enUnit'), sgE('enUnit', [['', this._t('enKwh')], ['cost', this._t('enCost')]])) + (f.enUnit === 'cost' && !lpEnPrice() ? '<div class="hint">' + t('enCostT') + '</div>' : '');
      if (K === 'day') body += fld(t('enMode'), sgE('enMode', [['', this._t('enModeCats')], ['total', this._t('enModeTot')]]));
      if (K === 'standby') body += '<div class="hint">' + t('enSbT') + '</div>';
      if (K === 'nav') { LP_ER_ANA.forEach((x) => { if (f['enA_' + x] === undefined) f['enA_' + x] = true; }); body += fld(lpErT(this._lang, 'show'), LP_ER_ANA.map((x) => tgE('enA_' + x, esc(lpEnT(this._lang, 'k_' + x)), esc(lpEnT(this._lang, 'd_' + x)))).join('')); }
      body += '<div class="hint">' + t('enSrcT') + '</div>';
    }
    else if (k !== 'pet') {
      body += '<div class="row2">' + fld(t('name') + (adv ? hb('tpl') : ''), inp('name', it.entity ? this._ename(it.entity) : this._t('name'))) + '</div>';
      if (k !== 'climate' && k !== 'vacuum' && k !== 'media' && k !== 'camera') body += icf('icon', t('icon'), it.entity ? lpEntIcon(st) : 'mdi:lightbulb-outline');
      if (d === 'cover') {
        // tasarım seçimi küçük çizimlerle: her kart perdenin o tasarımda nasıl görüneceğini gösterir
        const cs = f.cover || '', cd = f.cover_dir || '', auto = lpCovStyle(st, {}), eff = cs || auto;
        const card = (key, val, on, style, dir, label) => '<button class="cvp' + (on ? ' on' : '') + '" data-imseg="' + key + ':' + val + '">' + lpCovMini(style, dir) + '<span>' + esc(label) + '</span></button>';
        body += fld(t('covL'), '<div class="cvps">' + card('cover', '', !cs, auto, lpCovDir(auto, {}), this._t('covAuto') + ' · ' + this._t('cov_' + auto)) +
          LP_COV_STYLES.map((x) => card('cover', x, cs === x, x, lpCovDir(x, { cover_dir: cs === x ? cd : '' }), this._t('cov_' + x))).join('') + '</div><div class="hint">' + t('covT') + '</div>');
        const dirs = eff === 'vert' ? [['', 'c', 'covDc'], ['l', 'l', 'covDl'], ['r', 'r', 'covDr']] : eff === 'side' ? [['', 'l', 'covDl'], ['r', 'r', 'covDr']] : null;
        if (dirs && cs) body += fld(t('covDir'), '<div class="cvps">' + dirs.map((o) => card('cover_dir', o[0], lpCovDir(eff, { cover_dir: cd }) === o[1], eff, o[1], this._t(o[2]))).join('') + '</div>');
        // kanat açısı ayrı motordaysa (dikey stor, jaluzi): ikinci perde varlığı
        if (eff === 'vert' || eff === 'blind') body += fld(t('covTiltE'), inp('tilt_entity', 'cover.dikey_stor_aci', true) + '<div class="hint">' + t('covTiltET') + '</div>');
      }
      if (k === 'camera') body += fld(t('camRef'), '<div class="seg">' + [['5', '5 sn'], ['', '10 sn'], ['30', '30 sn'], ['60', '1 dk']].map((o) => '<button data-imseg="refresh:' + o[0] + '"' + ((f.refresh || '') === o[0] ? ' class="on"' : '') + '>' + esc(this._lang === 'tr' ? o[1] : o[1].replace('sn', 's').replace('dk', 'min')) + '</button>').join('') + '</div><div class="hint">' + t('camRefT') + '</div>');
      if (adv && k === 'value' && LP_VAL_ONOFF.indexOf(d) >= 0) body += '<div class="row2">' + icf('icon_on', t('iconOn'), 'mdi:bluetooth-connect') + icf('icon_off', t('iconOff'), 'mdi:bluetooth-off') + '</div>';
      // görünüm: eylem düğmesi karo/satır, varlık düğme/satır, sayısal değer Halo kartı
      const sg = (key, opts) => lhdSegX((v) => 'data-imseg="' + key + ':' + v + '"', f[key] || '', opts, key);
      const thMe = this._thItems([it]);
      const lks = k === 'scene' ? [['', 'lk_button'], ['tile', 'lk_tile'], ['row', 'lk_row']]
        : k === 'value' ? [['', 'lk_tile'], ['button', 'lk_button'], ['row', 'lk_row']].concat(LP_HALO_DOMAINS.indexOf(d) >= 0 ? [['halo', 'lk_halo']] : [])
          : (k === 'tile' && it.entity) ? [['', 'lk_tile'], ['button', 'lk_button'], ['row', 'lk_row']] : null;
      const lks2 = lks && !adv ? lks.filter((x) => x[0] !== 'halo' || f.look === 'halo' || lpEnIsVal(it.entity)) : lks;
      if (lks2) body += fld(t('lookL') + hb('look'), sg('look', lks2.map((x) => [x[0], this._t(x[1]), '', lhdThLook('i' + x[1].slice(3), thMe)])));
      const L0 = f.look || '';
      const inGrid = (k === 'tile' || k === 'ph' || k === 'value') && !L0 || (k === 'scene' && L0 === 'tile');
      if (adv && inGrid) body += fld(t('sizeL') + hb('size'), sg('size', [['', '1×1'], ['2x1', '2×1'], ['1x2', '1×2'], ['2x2', '2×2'], ['row', this._t('sz_row')]]));
      if (adv && L0 === 'halo') body += fld(t('heightL') + hb('halo'), sg('height', [['', this._t('sz_auto')], ['1', this._t('h_rows', { n: 1 })], ['1.5', this._t('h_rows', { n: '1,5' })], ['2', this._t('h_rows', { n: 2 })]]));
      if (adv && (inGrid || k === 'scene' || L0 === 'button' || L0 === 'row' || L0 === 'halo')) {
        const so = [['', this._t('sz_auto')], ['s', this._t('sz_s')], ['m', this._t('sz_m')], ['l', this._t('sz_l')]];
        body += fld(t('icSizeL'), sg('icon_size', so)) + fld(t('txSizeL'), sg('text_size', so));
      }
      // yedek kontrol: lambanın ikinci kopyası (ör. Matter); yalnız gelişmiş modda ve ikinci kopya bulunursa
      if (adv && it.entity && LHD_TWIN_DOMAINS.indexOf(d) >= 0) {
        const cands = this._twinCands(it.entity);
        if (f.twin && cands.indexOf(f.twin) < 0) cands.unshift(f.twin);
        if (cands.length) body += fld(t('twinL') + hb('twin'), '<select class="inp" data-imf="twin"><option value="">' + t('twinNone') + '</option>' +
          cands.map((x) => '<option value="' + esc(x) + '"' + (f.twin === x ? ' selected' : '') + '>' + esc(this._ename(x)) + ' (' + esc(x) + ')</option>').join('') + '</select><div class="hint">' + t('twinT') + '</div>');
      }
      // renkler: simge rengi, açıkken renk, arka plan; sayısal değerde değere göre renk
      if (adv && (k === 'tile' || k === 'value') && it.entity) {
        const two = k === 'tile' || LP_VAL_ONOFF.indexOf(d) >= 0;
        // renk alanı: Yok, Halo renkleri (hazır), serbest renk
        const sw = (key) => Object.keys(LP_HALO_RGB).map((n) => '<button class="hsw' + ((f[key] || '').toUpperCase() === LP_HALO_RGB[n] ? ' on' : '') + '" data-imsw="' + key + ':' + LP_HALO_RGB[n] + '" style="background:' + LP_HALO_RGB[n] + '" title="' + n + '"></button>').join('');
        const cf = (key, label) => '<div class="fld clrf"><label>' + label + '</label><div class="seg"><button data-imclr="' + key + '"' + (f[key] ? '' : ' class="on"') + '>' + t('cNone') + '</button>' + sw(key) +
          '<input type="color" data-imf="' + key + '" value="' + esc(LP_HALO_RGB[f[key]] || f[key] || '#FFC24A') + '"' + (f[key] ? ' class="set"' : '') + '></div></div>';
        body += L0 === 'halo' ? fld(t('colorsL') + hb('colors'), cf('color', t('cFixed'))) : fld(t('colorsL') + hb('colors'), cf('color', t('cIcon')) + (two ? cf('color_on', t('cOn')) : '') + (L0 === 'row' || L0 === 'button' ? '' : cf('bg', t('cBg'))));
        // duruma göre renk (metin değerler de)
        body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('scL') + hb('statecol') + '</b><span>' + t('scT') + '</span></div><button class="tg' + (f.scOn ? ' on' : '') + '" data-imsc></button></div>' +
          (f.scOn ? fld(t('scE'), inp('scE', it.entity, true)) + '<div class="scrows">' + f.scRows.map((r, q) => '<div class="scr"><input class="inp" data-imsr="' + q + ':0" value="' + esc(r[0]) + '" placeholder="' + t('scState') + '">' +
            '<input type="color" data-imsr="' + q + ':1" value="' + esc(LP_HALO_RGB[r[1]] || r[1] || '#28BE64') + '"></div>').join('') + '</div><button class="btn sm" data-imscadd>+ ' + t('scAdd') + '</button>' : '') + '</div>';
        if (k === 'value' && !two && L0 !== 'halo') {
          body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('zonesL') + hb('zones') + '</b><span>' + t('zonesT') + '</span></div><button class="tg' + (f.zOn ? ' on' : '') + '" data-imzone></button></div>' +
            (f.zOn ? '<div class="zones">' + [0, 1, 2, 3, 4].map((q) => '<input type="color" data-imf="zc' + q + '" value="' + esc(f['zc' + q]) + '">' + (q < 4 ? '<input class="inp" type="number" step="any" data-imf="zt' + q + '" value="' + esc(f['zt' + q]) + '" title="' + esc(this._t('zLim', { n: q + 1 })) + '">' : '')).join('') + '</div>' : '') + '</div>';
        }
      }
      if (k === 'value') body += actF('tap', t('tapL'), this._t('a_defMore'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']) + (!adv ? '' : actF('hold', t('holdL'), this._t('a_defMore'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']));
      if (k === 'tile' && it.entity) body += actF('tap', t('tapL'), this._t('a_defTog'), ['def', 'more-info', 'service', 'popup', 'none', 'yaml']) + (!adv ? '' : actF('hold', t('holdL'), this._t('a_defHold'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']));
      // ikinci satır (gelişmiş), değer öğesinde ad/değer yer değiştirme, onay sorusu (basit modda da)
      if (adv && (k === 'tile' || k === 'value' || k === 'scene') && L0 !== 'halo') {
        const attrs = st ? Object.keys(st.attributes || {}).filter((x) => ['friendly_name', 'icon', 'entity_picture', 'supported_features', 'supported_color_modes'].indexOf(x) < 0) : [];
        const opts = [['', 'sc_none']].concat(it.entity ? [['state', 'sc_state'], ['last_changed', 'sc_lc']] : []).concat(attrs.length ? [['attr', 'sc_attr']] : []).concat([['tpl', 'sc_tpl']]);
        body += fld(t('secL') + hb('tpl'), '<select class="inp" data-imf="secK">' + opts.map((o) => '<option value="' + o[0] + '"' + (f.secK === o[0] ? ' selected' : '') + '>' + t(o[1]) + '</option>').join('') + '</select>' +
          (f.secK === 'attr' ? '<select class="inp" data-imf="secAttr">' + attrs.map((x) => '<option' + (f.secAttr === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select>' : '') +
          (f.secK === 'tpl' ? inp('secTpl', "{{ states('sensor.x') }}") : ''));
        if (k === 'value' && (!L0 || L0 === 'tile')) body += '<div class="srow"><div class="t"><b>' + t('swapL') + '</b></div><button class="tg' + (f.swap ? ' on' : '') + '" data-imtg="swap"></button></div>';
      }
      // hâle görünümünde de ad/değer yer değiştirme (v0.35)
      if (adv && k === 'value' && L0 === 'halo') body += '<div class="srow"><div class="t"><b>' + t('swapL') + '</b></div><button class="tg' + (f.swap ? ' on' : '') + '" data-imtg="swap"></button></div>';
      if ((k === 'scene' || ((k === 'tile' || k === 'value') && it.entity)) && L0 !== 'halo') {
        body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('cfmL') + '</b><span>' + t('cfmT') + '</span></div><button class="tg' + (f.cfm ? ' on' : '') + '" data-imtg="cfm"></button></div>' +
          (f.cfm ? fld(t('cfmText'), inp('cfmText', '')) : '') + '</div>';
      }
      if (adv && k === 'scene' && !it.entity && !lpLecKind(it)) body += actF('act', t('actL'), '', ['none', 'service', 'popup', 'yaml']);
    }
    // koşullu görünürlük (gelişmiş)
    const vs = f.visE && S[f.visE] ? S[f.visE].state : null;
    if (!adv && lhdItemAdv(it)) body = '<div class="advnote"><ha-icon icon="mdi:tune-variant"></ha-icon><span>' + t('advHas') + '</span><button class="btn sm" data-advon>' + t('modeAdv') + '</button></div>' + body;
    if (adv) body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('visL') + hb('visible') + '</b><span>' + t('visT') + '</span></div><button class="tg' + (f.visOn ? ' on' : '') + '" data-imvis></button></div>' +
      (f.visOn ? '<div class="row2">' + fld(t('visE'), inp('visE', 'sensor.balik_yem_durumu', true)) +
        fld('&nbsp;', '<select class="inp" data-imf="visM">' + ['eq', 'in', 'not'].map((m) => '<option value="' + m + '"' + (f.visM === m ? ' selected' : '') + '>' + t('v_' + m) + '</option>').join('') + '</select>', 'nar') + '</div>' +
        fld(t('visV'), inp('visV', 'aktif')) + (vs !== null ? '<div class="hint">' + t('visNow', { s: vs }) + '</div>' : '') : '') + '</div>';
    const ents = Object.keys(S).sort();
    return '<div class="ov" data-ovl><div class="dlg sm imdlg"><div class="dh"><div class="di"><ha-icon icon="mdi:cog-outline"></ha-icon></div><h2>' + t('imT') + (it.entity ? ' · ' + esc(this._ename(it.entity)) : '') + '</h2>' +
      '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="db">' + body + '</div>' +
      (M.err ? '<div class="imerr">' + esc(M.err) + '</div>' : '') +
      '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="imsave">' + t('imSave') + '</button></div></div>' +
      '<datalist id="lhdents">' + ents.map((id) => '<option value="' + esc(id) + '">').join('') + '</datalist></div>';
  }
  // taslaktan eylemi kur (hatalıysa Error); undefined: alan silinir (varsayılan davranış)
  _imAct(pre, scene) {
    const f = this._im.f, K = f[pre + 'K'] || (scene ? 'none' : 'def'), T = (k, v) => this._t(k, v);
    const y = (txt) => { try { return lhdYamlParse(txt); } catch (e) { throw new Error(e.line ? T('yamlErrL', { n: e.line }) : T('yamlErr', { e: e.message })); } };
    if (K === 'def') return undefined;
    if (K === 'none') return scene ? null : 'none';
    if (K === 'more-info' || K === 'toggle') return K;
    if (K === 'service') {
      const sv = String(f[pre + 'Sv'] || '').trim(), tg = String(f[pre + 'Tg'] || '').trim();
      if (!/^[a-z0-9_]+\.[a-z0-9_]+$/.test(sv)) throw new Error(T('svcNeed'));
      const o = { service: sv };
      if (tg) o.target = tg;
      const dt = String(f[pre + 'Data'] || '').trim();
      if (dt) { const v = y(dt); if (v && typeof v === 'object' && !Array.isArray(v)) o.data = v; else throw new Error(T('yamlErr', { e: 'data' })); }
      return o;
    }
    if (K === 'popup') {
      const c = y(f[pre + 'Card'] || '');
      if (!c || typeof c !== 'object' || !c.type) throw new Error(T('cardNoType'));
      const p = { card: c }, ti = String(f[pre + 'Title'] || '').trim();
      if (ti) p.title = ti;
      return { popup: p };
    }
    if (K === 'yaml') { const v = y(f[pre + 'Y'] || ''); if (!v) return undefined; return v; }
    return undefined;
  }
  _imSave() {
    const M = this._im; if (!M) return;
    const f = M.f, k = lhdKind(M.raw);
    let it = lhdClone(M.raw);
    const setS = (key, v) => { v = String(v || '').trim(); if (v) it[key] = v; else delete it[key]; };
    try {
      if (k === 'pet') {
        const name = String(f.pName || '').trim();
        if (!name) throw new Error(this._t('petNeedName'));
        const pets = lhdClone((STORE.data && STORE.data.pets) || {});
        let id = it.pet;
        if (!id) { const base = lhdSlug(name) || 'pet'; id = base; let q = 2; while (pets[id]) id = base + '_' + (q++); it.pet = id; }
        const num = (x, d, hi) => { const v = parseFloat(String(x).replace(',', '.')); return v >= 0 ? Math.min(v, hi || 1440) : d; };
        const P = { name: name, kind: f.pKind || 'other', mode: f.pMode === 'times' ? 'times' : 'interval', every_h: num(f.pEvery, 12, 720) || 12,
          times: String(f.pTimes || '').split(/[,;\s]+/).map((x) => x.trim()).filter((x) => /^\d{1,2}:\d{2}$/.test(x)).slice(0, 24),
          soon_min: num(f.pSoon, 60), grace_min: num(f.pGrace, 30) };
        if (String(f.pIcon || '').trim()) P.icon = String(f.pIcon).trim();
        if (f.pNotify) P.notify = f.pNotify;
        const fsv = String(f.pFeedSv || '').trim();
        if (fsv && !lhdSafeFeederSvc(fsv)) throw new Error(this._t('petFeederBad', { d: LHD_FEEDER_DOMAINS.join(', ') }));
        if (fsv) { P.feeder = { service: fsv }; if (String(f.pFeedTg || '').trim()) P.feeder.target = String(f.pFeedTg).trim(); }
        pets[id] = P;
        this._commit('pets', pets);
      }
      if (k === 'sub') { it.subtitle = String(f.subtitle || '').trim(); }
      if (k === 'energy') {
        const ty = LP_EN_TYPES.indexOf(f.enK) >= 0 ? f.enK : 'halo';
        it = it.visible ? { energy: ty, visible: it.visible } : { energy: ty };
        if (ty === 'halo' && !f.enChips) it.chips = false;
        if (ty === 'halo' && !f.enBars) it.bars = false;
        if (ty === 'cats') { if (f.enLoose === false) it.loose = false; if (f.enSort === 'w') it.sort = 'w'; if (f.enCols) it.cols = +f.enCols; if (f.enChart) it.chart = f.enChart; }
        if (ty === 'top') { if (f.enCount) it.count = +f.enCount; if (f.enCat) it.cat = f.enCat; if (f.enIdle) it.hide_idle = true; }
        if (ty === 'week') { if (f.enDays === '30') it.days = 30; if (f.enUnit === 'cost') it.unit = 'cost'; }
        if (ty === 'day' && f.enMode === 'total') it.mode = 'total';
        if (ty === 'nav') { const sh = LP_ER_ANA.filter((x) => f['enA_' + x] !== false); if (sh.length && sh.length < LP_ER_ANA.length) it.show = sh; }
        if (f.enLook && (LP_EL_LOOKS[ty] || []).indexOf(f.enLook) > 0) it.look = f.enLook;
      }
      if (k === 'card') {
        setS('height', f.height);
        ['tap', 'hold'].forEach((pre) => { const v = this._imAct(pre); if (v === undefined) delete it[pre]; else it[pre] = v; });
        let c; try { c = lhdYamlParse(f.card || ''); } catch (e) { throw new Error(e.line ? this._t('yamlErrL', { n: e.line }) : this._t('yamlErr', { e: e.message })); }
        if (!c || typeof c !== 'object' || !c.type) throw new Error(this._t('cardNoType'));
        it.card = c;
      } else if (k !== 'pet' && k !== 'sub' && k !== 'energy') {
        setS('name', f.name);
        if (k !== 'climate' && k !== 'vacuum' && k !== 'media' && k !== 'camera') setS('icon', f.icon);
        if (k === 'camera') setS('refresh', f.refresh ? parseFloat(f.refresh) : '');
        if (it.entity && it.entity.split('.')[0] === 'cover') {
          setS('cover', f.cover);
          // yön yalnız tek yönden açılan perde ve dikey storda anlamlı; varsayılan (sola / iki yana) kaydedilmez
          setS('cover_dir', f.cover === 'side' && f.cover_dir === 'r' ? 'r' : f.cover === 'vert' && (f.cover_dir === 'l' || f.cover_dir === 'r') ? f.cover_dir : '');
          const ce = f.cover || lpCovStyle(this._hass.states[it.entity], {}), te = String(f.tilt_entity || '').trim();
          setS('tilt_entity', (ce === 'vert' || ce === 'blind') && /^cover\.[a-z0-9_]+$/.test(te) && te !== it.entity ? te : '');
        }
        if (k === 'value') { setS('icon_on', f.icon_on); setS('icon_off', f.icon_off); }
        if (k === 'tile' || k === 'ph' || k === 'value' || k === 'scene') setS('size', f.size);
        if (k === 'tile' || k === 'value' || k === 'scene') {
          const sv2 = f.secK === 'attr' ? (f.secAttr ? 'attr:' + f.secAttr : '') : f.secK === 'tpl' ? String(f.secTpl || '').trim() : f.secK;
          setS('secondary', sv2);
          if (k === 'value' && f.swap) it.swap = true; else delete it.swap;
          if (f.cfm) it.confirm = String(f.cfmText || '').trim() || true; else delete it.confirm;
        }
        if (k === 'scene' || k === 'value' || (k === 'tile' && it.entity)) setS('look', f.look);
        if ((k === 'tile' || k === 'value') && it.entity) {
          setS('color', f.color); setS('color_on', f.color_on); setS('bg', f.bg);
          if (f.look === 'halo') { delete it.color_on; delete it.bg; delete it.zones; setS('height', f.height); } else delete it.height;
          const rows = f.scRows.filter((r) => String(r[0]).trim());
          if (f.scOn && rows.length) { const m = {}; rows.forEach((r) => { const k0 = String(r[0]).trim(), X = f.scX && f.scX[k0]; m[k0] = X ? Object.assign({}, X, { color: r[1] }) : r[1]; }); it.state_colors = { map: m }; if (String(f.scE || '').trim()) it.state_colors.entity = String(f.scE).trim(); } else delete it.state_colors;
          if (k === 'value' && f.zOn) {
            const tt = [0, 1, 2, 3].map((q) => { const v = parseFloat(String(f['zt' + q]).replace(',', '.')); return isNaN(v) ? null : v; });
            it.zones = { t: tt, c: [0, 1, 2, 3, 4].map((q) => f['zc' + q]) };
          } else delete it.zones;
        }
        if (k === 'tile' || k === 'ph' || k === 'value' || k === 'scene') { setS('icon_size', f.icon_size); setS('text_size', f.text_size); }
        if (k === 'value' || (k === 'tile' && it.entity)) {
          ['tap', 'hold'].forEach((pre) => { const v = this._imAct(pre); if (v === undefined) delete it[pre]; else it[pre] = v; });
        }
        if (k === 'scene' && !it.entity && !lpLecKind(it)) it.action = this._imAct('act', true);
      }
      if (f.visOn && String(f.visE || '').trim()) {
        const vals = String(f.visV || '').split(',').map((x) => x.trim()).filter((x) => x !== '');
        const v = { entity: String(f.visE).trim() };
        if (f.visM === 'not') v.not = vals;
        else if (f.visM === 'in' || vals.length > 1) v.states = vals;
        else if (vals.length) v.state = vals[0];
        it.visible = v;
      } else delete it.visible;
    } catch (e) { M.err = e.message; this._render(); return; }
    // yedek kontrol bütün ev için tutulur (öğeye değil lambaya bağlı)
    if (it.entity && LHD_TWIN_DOMAINS.indexOf(it.entity.split('.')[0]) >= 0) {
      const T = lhdClone((STORE.data && STORE.data.twins) || {}), cur = (T[it.entity] && T[it.entity].backup) || '';
      if ((f.twin || '') !== cur) { if (f.twin) T[it.entity] = { backup: f.twin }; else delete T[it.entity]; this._commit('twins', T); }
    }
    if (it.entity && Object.keys(it).length === 1) it = it.entity;   // sade kalsın
    this._modal = null; this._im = null;
    this._edit((T) => {
      const x = T.filter((y) => y.id === M.tab)[0], S = x && (x.sections || []).filter((z) => z.id === M.sec)[0]; if (!S) return;
      S.entities = S.entities || [];
      if (M.isNew) S.entities.push(it); else if (M.idx < S.entities.length) S.entities[M.idx] = it;
    });
  }

  // ---- kart seçici (D1, D2) ve kart düzenleyici ----
  // Liste: Halo kartları (panonun gömülü kopyası), Home Assistant kartları, kurulu özel kartlar (window.customCards).
  // Seçilen kartın örnek ayarı kartın kendisinden (getStubConfig) alınır, düzenleyicisi (getConfigElement) açılır, yanında canlı önizleme.
  _cpList() {
    const L = this._lang === 'tr' ? 0 : 1, out = [];
    LHD_HALO_CARDS.forEach((x) => out.push({ g: 'halo', key: 'custom:lemur-hd-' + x[0] + '-card', name: x[L + 1], desc: x[L + 3], icon: x[5] }));
    LHD_HA_CARDS.forEach((x) => out.push({ g: 'ha', key: x[0], name: x[L + 1], icon: x[3] }));
    (window.customCards || []).forEach((c) => { if (!c || !c.type || /^lemur-hd-/.test(c.type)) return; out.push({ g: 'custom', key: 'custom:' + c.type, name: c.name || c.type, desc: c.description || '', icon: 'mdi:puzzle-outline' }); });
    return out;
  }
  _cpHtml() {
    const t = (k, v) => esc(this._t(k, v)), q = (this._cpq || '').toLowerCase();
    const L = this._cpList().filter((x) => !q || (x.name + ' ' + x.key + ' ' + (x.desc || '')).toLowerCase().indexOf(q) >= 0);
    const grp = (g, title) => { const a = L.filter((x) => x.g === g); return a.length ? '<div class="pg">' + title + '</div><div class="cpg">' + a.map((x) => '<button class="cpi" data-cpk="' + esc(x.key) + '">' + lpIcon(x.icon) + '<span><b>' + esc(x.name) + '</b>' + (x.desc ? '<i>' + esc(x.desc) + '</i>' : '') + '</span></button>').join('') + '</div>' : ''; };
    return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="mdi:card-plus-outline"></ha-icon></div><h2>' + t('cpT') + this._hb('card') + '</h2>' +
      '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-cpq placeholder="' + t('cpSearch') + '" value="' + esc(this._cpq || '') + '"></div>' +
      '<div class="db"><div class="cplist">' + grp('halo', t('cpHalo')) + grp('ha', t('cpHa')) + grp('custom', t('cpCustom')) + '</div></div>' +
      (this._adv() ? '<div class="df"><button class="btn" data-cpyaml><ha-icon class="s16" icon="mdi:code-braces"></ha-icon>' + t('cpYaml') + '</button></div>' : '') + '</div></div>';
  }
  // kartın sınıfı (yüklenene kadar bekler; en çok 4 sn)
  _cardClass(type) {
    const tag = type.indexOf('custom:') === 0 ? type.slice(7) : 'hui-' + type + '-card';
    const now = customElements.get(tag);
    if (now) return Promise.resolve(now);
    return lpCardHelpers().then((H) => {
      if (H && H.createCardElement && type.indexOf('custom:') !== 0) { try { H.createCardElement({ type: type }); } catch (e) {} }
      return Promise.race([customElements.whenDefined(tag).then(() => customElements.get(tag)), new Promise((r) => setTimeout(() => r(null), 4000))]);
    });
  }
  _cpPick(type) {
    const ents = Object.keys(this._hass.states);
    this._cardClass(type).then((C) => {
      let p = Promise.resolve({});
      try { if (C && C.getStubConfig) p = Promise.resolve(C.getStubConfig(this._hass, ents, ents)); } catch (e) {}
      return p.catch(() => ({}));
    }).then((stub) => {
      const cfg = Object.assign({ type: type }, stub || {}, { type: type });
      this._ceOpen(cfg, null);
    });
  }
  _ceOpen(cfg, im) {
    this._ce = { cfg: lhdClone(cfg), im: im, view: 'visual', ed: null, edFor: null, noEd: false, yaml: lhdYamlDump(cfg), err: '' };
    if (im) { this._imKeep = im; }
    this._modal = 'cardedit'; this._render();
  }
  _ceHtml() {
    const C = this._ce; if (!C) return '';
    const t = (k) => esc(this._t(k)), vis = C.view === 'visual' && !C.noEd;
    return '<div class="ov" data-ovl><div class="dlg cedlg"><div class="dh"><div class="di"><ha-icon icon="mdi:pencil-box-outline"></ha-icon></div><h2>' + t('ceT') + ' · ' + esc(C.cfg.type) + '</h2>' +
      '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="cebody"><div class="cel"><div class="seg">' + [['visual', 'ceVisual'], ['yaml', 'ceYaml']].map((x) => '<button data-cev="' + x[0] + '"' + ((vis ? 'visual' : 'yaml') === x[0] ? ' class="on"' : '') + (x[0] === 'visual' && C.noEd ? ' disabled' : '') + '>' + t(x[1]) + '</button>').join('') + '</div>' +
      (C.noEd ? '<div class="hint">' + t('ceNoEd') + '</div>' : '') +
      (vis ? '<div class="ceed" data-ceed><div class="hint">' + t('ceLoad') + '</div></div>' : '<textarea class="inp ta" data-ceyaml rows="16" spellcheck="false">' + esc(C.yaml) + '</textarea>') +
      (C.err ? '<div class="imerr" style="margin:8px 0 0">' + esc(C.err) + '</div>' : '') + '</div>' +
      '<div class="cer"><div class="lbl">' + t('cePv') + '</div><div class="cepv" data-cepv></div></div></div>' +
      '<div class="df"><button class="btn" data-ceback>' + t('ceBack') + '</button><span class="grow"></span><button class="btn pri" data-cesave>' + t('imSave') + '</button></div></div></div>';
  }
  // render sonrası: düzenleyici ve önizleme öğeleri (yeniden çizimde kaybolmasınlar diye saklanır, yerine takılır)
  _ceMount() {
    const C = this._ce; if (!C || this._modal !== 'cardedit') return;
    const R = this.shadowRoot, slot = R.querySelector('[data-ceed]'), pv = R.querySelector('[data-cepv]');
    if (pv) {
      if (!C.pvHost) { C.pvHost = document.createElement('div'); C.pvHost.className = 'cepvh'; this._cePreview(); }
      pv.appendChild(C.pvHost);
    }
    if (!slot) return;
    if (C.ed && C.edFor === C.cfg.type) { slot.innerHTML = ''; slot.appendChild(C.ed); try { C.ed.hass = this._hass; } catch (e) {} return; }
    const type = C.cfg.type;
    const tag = type.indexOf('custom:') === 0 ? type.slice(7) : 'hui-' + type + '-card';
    this._cardClass(type).then((K) => (K && K.getConfigElement ? Promise.resolve(K.getConfigElement()) : null)).then((ed) => {
      if (this._ce !== C) return;
      // kartın verdiği düzenleyici tanımsızsa (ör. gömülü Halo kopyası) kartın adıyla kayıtlı düzenleyici
      if ((!ed || typeof ed.setConfig !== 'function') && customElements.get(tag + '-editor')) ed = document.createElement(tag + '-editor');
      if (ed && typeof ed.setConfig !== 'function') ed = null;
      if (!ed) { C.noEd = true; C.view = 'yaml'; return this._render(); }
      C.ed = ed; C.edFor = type;
      try { ed.hass = this._hass; ed.lovelace = { config: { views: [] }, editMode: true }; } catch (e) {}
      try { ed.setConfig(lhdClone(C.cfg)); } catch (e) { C.noEd = true; C.view = 'yaml'; return this._render(); }
      ed.addEventListener('config-changed', (ev) => {
        ev.stopPropagation();
        const c = ev.detail && ev.detail.config; if (!c) return;
        C.cfg = lhdClone(c); C.yaml = lhdYamlDump(C.cfg); C.err = '';
        clearTimeout(C.pvT); C.pvT = setTimeout(() => this._cePreview(), 250);
      });
      const s2 = this.shadowRoot && this.shadowRoot.querySelector('[data-ceed]');
      if (s2) { s2.innerHTML = ''; s2.appendChild(ed); }
    }).catch(() => { C.noEd = true; C.view = 'yaml'; this._render(); });
  }
  _cePreview() {
    const C = this._ce; if (!C || !C.pvHost) return;
    lpMountCard(C.pvHost, lhdClone(C.cfg), () => this._hass, this._lang, (el) => { C.pvEl = el; });
  }
  _ceSetView(v) {
    const C = this._ce;
    if (v === 'visual' && C.view === 'yaml') {
      try { const c = lhdYamlParse(C.yaml); if (!c || !c.type) throw new Error(this._t('cardNoType')); C.cfg = c; if (C.ed) { try { C.ed.setConfig(lhdClone(c)); } catch (e) {} } C.err = ''; }
      catch (e) { C.err = e.line ? this._t('yamlErrL', { n: e.line }) : e.message; return this._render(); }
      this._cePreview();
    }
    if (v === 'yaml') C.yaml = lhdYamlDump(C.cfg);
    C.view = v; this._render();
  }
  _ceSave() {
    const C = this._ce;
    if (C.view === 'yaml') {
      try { const c = lhdYamlParse(C.yaml); if (!c || !c.type) throw new Error(this._t('cardNoType')); C.cfg = c; }
      catch (e) { C.err = e.line ? this._t('yamlErrL', { n: e.line }) : e.message; return this._render(); }
    }
    const cfg = C.cfg, im = C.im;
    this._ce = null;
    if (im) { im.f.card = lhdYamlDump(cfg); this._im = im; this._modal = 'item'; return this._render(); }   // öğe ayarlarına dön (Kaydet orada)
    this._modal = null;
    const tab = this._curTab(this._work()), sec = this._curSec(tab); if (!tab || !sec) return this._render();
    const tid = tab.id, sid = sec.id;
    this._edit((T) => { const x = T.filter((y) => y.id === tid)[0], S = x && (x.sections || []).filter((z) => z.id === sid)[0]; if (S) { S.entities = S.entities || []; S.entities.push({ card: cfg }); } });
  }

  // iklim cihazı eklenirken aynı alandaki harici sıcaklık/nem sensörü önerilir (otomatik düzendeki kural)
  _climateItem(id) { return lpClimateItem(this._hass, id); }
}
