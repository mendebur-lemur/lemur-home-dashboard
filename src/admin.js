// lemur-home-dashboard-admin: sol menüdeki yönetim paneli.
// Düzen Light Effect Card'ın kontrol paneliyle aynı aile: üstte sekme şeridi (seçili sekmenin ayarları altında birleşik),
// solda panonun canlı önizlemesi (tıklayınca bölüm seçilir), sağda bölüm düzenleyici. Her değişiklik anında kaydedilir,
// açık bütün tabletler canlı güncellenir; "Geri al" (Ctrl+Z) son değişiklikleri geri alır.
// Ayar yokken pano otomatik düzendedir; ilk değişiklikte o düzen kopyalanıp kaydedilir.

const ADM = {
  tr: {
    title: 'Lemur Home Dashboard', auto: 'Otomatik düzen', autoT: 'Pano şu an evin alanlarından kendiliğinden kuruluyor. İlk değişiklikte bu düzen kaydedilir, sonra her şey buradan düzenlenir.',
    undo: 'Geri al', undoK: 'Geri al (Ctrl+Z)', settings: 'Ayarlar', more: 'Diğer işlemler', saved: 'Kaydedildi', undone: 'Geri alındı', err: 'Kaydedilemedi: {e}',
    tabName: 'Sekme adı', icon: 'Simge', area: 'Alan', noArea: 'Alan yok', cols: 'Kolonlar', colAdd: 'Kolon ekle', colDel: 'Son kolonu kaldır', colTab: 'Tablet düzeni', colEq: 'Eşit', colHint: 'Genişliği önizlemede kolonların arasındaki çizgiyi sürükleyerek ayarla.', delTab: 'Sekmeyi sil', sure: 'Emin misin?',
    refill: 'Alandan yeniden doldur', refillT: 'Bu sekmenin bölümleri seçili alanın cihazlarıyla baştan kurulur.', addTab: 'Sekme', newTab: 'Yeni sekme', emptyTab: 'Boş sekme', fromArea: 'Alandan sekme',
    preview: 'Önizleme', pvHint: 'Kutuyu ⠿ tutamağından, öğeyi kendisinden sürükle · çizgilerden boyutlandır', splits: 'Kolon içi sütun', splitsT: 'Bir kolonu eşit genişlikte 2-3 sütuna böler (ör. yan yana iki senaryo bölümü). Kolon dar ise yer açmak için kendiliğinden genişler.', splitNarrow: 'Bu kadar sütun ekrana sığmaz: önce kolon sayısını azalt', sub: 'Sütun', sections: 'Bölümler', addSec: 'Bölüm ekle', noSec: 'Bu sekmede bölüm yok.',
    secTitle: 'Başlık', column: 'Kolon', colL: 'Sol', colM: 'Orta', colR: 'Sağ', tileCols: 'Satırdaki karo', look: 'Görünüm', lookTile: 'Karo', lookBar: 'Kaydırmalı', lookPhone: 'Telefonda otomatik', lookTileT: 'Kare karolar: dokun aç/kapat, basılı tut pencere', lookBarT: 'Yatay çubuklar: dokun aç/kapat, sağa-sola kaydır parlaklık, basılı tut pencere', lookPhoneT: 'Tablette karo, telefonda kaydırmalı çubuk', barCols: 'Satırdaki çubuk', delSec: 'Bölümü sil',
    t_values: 'Değerler', t_cards: 'Kartlar', t_subs: 'Alt başlık', t_free: 'Boş bölüm', t_lights: 'Işıklar', t_scenes: 'Senaryolar', t_climate: 'İklim', t_vacuum: 'Süpürge', t_media: 'Medya', d_free: 'Başlıksız boş kutu', secFree: 'Bölüm türü sadece başlangıç: her bölüme her şey eklenebilir, her öğe kendi türüne göre görünür.', pfAll: 'Tümü', pfTile: 'Işık ve anahtar', titleOpt: 'Başlık (isteğe bağlı)',
    d_lights: 'Işık, priz, perde karoları', d_scenes: 'Script, sahne ve otomasyon düğmeleri', d_climate: 'Klima ve petek kartları (Yaz/Kış)', d_vacuum: 'Robot süpürge kartları', d_media: 'TV ve hoparlörler',
    n_items: '{n} öğe', addDev: 'Ekle', addPh: 'Boş karo', addScene: 'Düğme ekle', name: 'Ad', target: 'Çalıştırılacak', noItems: 'Henüz öğe yok.',
    tSensor: 'Sıcaklık sensörü', hSensor: 'Nem sensörü', fromDevice: 'Cihazdan', noOutdoor: 'Dış sıcaklık yok', noLink: 'Birlikte kontrol yok', linkT: 'Birlikte kontrol edilen cihaz (ör. aynı odadaki ikinci petek)', outdoorT: 'Dış sıcaklık sensörü (petek kartı ısıtma ihtiyacını gösterir)', addScPh: 'Boş düğme', kind: 'Tür', k_auto: 'Otomatik', k_ac: 'Klima', k_radiator: 'Petek',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Geniş 16:9', scr_phone: 'Telefon', scr_here: 'Bu ekran',
    pickT: 'Ekle', search: 'Ara: ad, alan ya da varlık kimliği', cancel: 'Vazgeç', addN: 'Ekle ({n})', added: 'Ekli', noArea2: 'Alanı olmayanlar', nothing: 'Eşleşen cihaz yok.',
    sHelp: 'Yardım', repT: 'Sorun bildir', repS: 'Sürüm ve cihaz bilgisiyle GitHub\'da kayıt açar; ne olduğunu yazman yeter', repQ: 'Ne oldu?', repPh: 'Ne yaptın, ne bekliyordun, ne oldu? Örnek: Salon sekmesinde ışık çubuğunu kaydırınca parlaklık değişmiyor.', repInfo: 'Kayda eklenecek bilgiler', repInfoS: 'Kişisel bilgi yok: oda, cihaz ve kişi adları, adresin ya da hesabın eklenmez.', repNoGh: 'GitHub hesabın yoksa metni kopyalayıp geliştiriciye ilet.', repCopy: 'Metni kopyala', repCopied: 'Kopyalandı', repGh: 'GitHub\'da aç', rWhat: 'Ne oldu?', rInfoH: 'Bilgiler', rPanel: 'Pano', rInt: 'entegrasyon', rHa: 'Home Assistant', rBrowser: 'Tarayıcı', rApp: 'HA uygulaması', rScreen: 'Ekran', rTouch: 'dokunmatik', rNoTouch: 'dokunmatik değil', rCanvas: 'kanvas', rLang: 'Dil', rLayout: 'Düzen', rAuto: 'otomatik', rTabs: 'sekme', rSecs: 'bölüm', rItems: 'öğe', rKinds: 'Öğe türleri', rLook: 'Görünüm', rLec: 'Light Effect Card', rErr: 'Son hatalar', rNoErr: 'yok', sBackup: 'Yedek', bkDown: 'Yedeği indir', bkDownS: 'Sekmeler, bölümler ve ayarlar tek dosyada', bkUp: 'Yedekten geri yükle', bkUpS: 'Bir yedek dosyası seç; önce onay sorulur, şu anki düzenin yerine geçer', bkQ: 'Yedek geri yüklensin mi?', bkW: '{d} tarihli yedek (v{v}): {n} sekme, {s} bölüm. Şu anki sekmeler, bölümler ve ayarlar bu yedekle değiştirilir. Geri al ile dönebilirsin.', bkVer: 'Yedek v{v} ile alınmış; yine de yüklenebilir.', bkSvc: 'Bu yedekteki hayvanlar şu servisleri kendiliğinden çalıştırır:', twinL: 'Yedek kontrol', twinNone: 'Yok', twinT: 'Lamba cevap vermezse komut buradan da gönderilir', sWalls: 'Duvar anahtarları', wallsT: 'Röle yalnız sinyal veriyorsa elle basınca seçilen lamba açılır/kapanır', wallSw: 'Anahtar', wallLight: 'Lamba', wallBr: 'Parlaklık %', wallK: 'Kelvin', wallAdd: 'Anahtar ekle', wallDel: 'Kaldır', wallPick: 'Seç…', wallNone: 'Henüz duvar anahtarı yok.', wallAuto: 'Bu anahtar için HA\'da ayrıca bir otomasyon varsa kapat: {n}', bkYes: 'Geri yükle', bkSaved: 'Yedek indirildi', bkOk: 'Yedek geri yüklendi', bkErr: 'Bu dosya bir pano yedeği değil', newsT: 'Yenilikler', newsV: 'v{v} ile gelenler', newsOld: 'Önceki sürümler', newsAll: 'Bütün notlar GitHub\'da', newsOk: 'Tamam', newsLink: 'Yenilikler', sVer: 'Sürüm ve güncelleme', updT: 'Sürüm', updInst: 'Yüklü: v{v}', updCheck: 'Güncellemeleri denetle', updChecking: 'Denetleniyor…', updOk: 'güncel', updAt: 'son kontrol {t}', updNew: 'v{v} hazır', updNotes: 'Yenilikler', updNoHacs: 'HACS ile kurulmadığı için buradan yüklenemiyor', updGo: 'Güncelle', updGh: 'GitHub’da aç', updIng: 'v{v} indiriliyor…', updDone: 'v{v} indirildi. Home Assistant yeniden başlayınca devreye girer.', updRestart: 'Yeniden başlat', updAsk: 'Home Assistant yeniden başlasın mı? Bir iki dakika ışık kontrolü ve otomasyonlar durur.', updYes: 'Evet, yeniden başlat', updRest: 'Yeniden başlatılıyor… Açılınca sayfa kendiliğinden yenilenir.', updErr: 'Denetlenemedi: {e}', updAgain: 'Tekrar denetle', s_board: 'Pano', s_look: 'Görünüm', s_screen: 'Ekran', s_info: 'Bilgi',
    lang: 'Dil', lAuto: 'Otomatik', season: 'Mevsim', seasonT: 'İklim bölümünde Yaz klimaları, Kış petekleri gösterir. Otomatik: Mayıs-Eylül yaz.', sAuto: 'Otomatik', sSum: 'Yaz', sWin: 'Kış',
    bg: 'Arka plan', bgT: 'Koyu: tablet panosundaki zemin. Renk: istediğin düz renk. Efekt (varsayılan, Meditasyon): Light Effect Card\'ın efekt renkleriyle yumuşak ışıltı. Resim: /local/zemin.jpg gibi bir adres.', bgDark: 'Koyu', bgBlack: 'Siyah', bgColor: 'Renk', bgFx: 'Efekt', bgImg: 'Resim', bgUrl: 'Resim adresi', bgBad: 'Bu adreste resim açılmadı: dosyayı HA\'nın config/www klasörüne koy, adresi /local/dosya.jpg diye yaz.',
    theme: 'HA teması', themeT: 'Boş bırakılabilir; açılır pencereler bu temayla gelir.', kHeader: 'Üst barı gizle', kHeaderT: 'Bu panoda HA\'nın başlık çubuğu görünmez.',
    kSide: 'Yan menüyü gizle', kSideT: 'Bu panoda HA\'nın sol menüsü görünmez.', canvas: 'Kanvas', canvasT: 'Tasarım genişliği ve referans yüksekliği (px). Pano ekrana bu oranla ölçeklenir.',
    navAl: 'Oda düğmelerini kolona hizala', navAlT: 'Üst şeritteki oda düğmeleri seçilen kolonun sağ kenarında biter ve aradaki alanı eşit paylaşır. Her ekran boyutunda aynı hizada kalır.', navNo: 'Kapalı', navCol: '{n}. kolona kadar', navFx: 'Efektler de hizalı alanda', navFxT: 'Açıkken Efektler düğmesi oda düğmeleriyle birlikte hizalanır; kapalıyken saatin yanında durur.', navSz: 'Oda düğmelerinin boyutu', navSzT: 'Genişlik ve yükseklik (piksel). Boş bırakılırsa 235 × 155.', navSzA: 'Yükseklik (piksel). Kolona hizalıyken genişlik kendiliğinden ayarlanır. Boş bırakılırsa 155.', navW: 'Genişlik', navH: 'Yükseklik', clSt: 'İklim ve süpürge kartları', clStT: 'Halo: büyük, halkalı kartlar. Sade: tek satır; iklimde durum, sıcaklık ve hedef, süpürgede durum, pil, başlat ve istasyon. Karta dokununca genişler: hedef − +, aç/kapat, mod, fan, salınım ya da durdur, bul, emiş gücü (cihaz destekliyorsa).', clHalo: 'Halo', clRows: 'Sade', s_phone: 'Telefon', phNav: 'Gezinme', phNavT: 'Altta kategoriler (önerilen): altta Işıklar, İklim, Senaryolar; ışıklarda odalar arasında sağa sola kaydırarak geçilir. Altta odalar: oda düğmeleri ekranın altında, uygulama gibi. Üstte odalar: eski düzen, oda düğmeleri üstte.', phTop: 'Üstte odalar', phRooms: 'Altta odalar', phCats: 'Altta kategoriler', phLights: 'Işıklar', phLightsT: 'Bölüm ayarındaki gibi, hep karo ya da tek sıra (her ışık bir satır; dokun aç/kapat, sağa sola kaydır parlaklık).', phLAuto: 'Bölümdeki gibi', phLTiles: 'Karo', phLRows: 'Tek sıra', phSheet: 'Işık penceresi alttan', phSheetT: 'Basılı tutunca açılan pencere ekranın altından gelir; aşağı çekince kapanır. Tablet etkilenmez.', akT: 'Otomatik kur', akHint: 'Pano HA\'daki alanlardan ve cihazlardan kurulur. Seç, aşağıda sonucu gör, Uygula.', akRooms: 'Odalar (her biri bir sekme)', akHome: 'Ev sekmesi', akHomeT: 'Bütün evin özeti: odalardan sırayla ışıklar, senaryolar, iklim', akOther: 'Diğer sekmesi', akOtherT: 'Seçilmeyen odaların ve alanı olmayan cihazların sekmesi', akWhat: 'Neler dahil olsun', akL: 'Işıklar', akS: 'Senaryolar', akC: 'İklim', akV: 'Süpürge', akM: 'Medya', akLook: 'Görünüm', akLights: 'Işıklar', akTiles: 'Karo', akBars: 'Kaydırmalı çubuk', akPhoneBars: 'Telefonda çubuk', akRes: 'Sonuç · {n} sekme', akSum: '{l} ışık · {s} senaryo · {c} kart', akNone: 'Seçimle hiç sekme oluşmuyor.', akWarn: 'Uygula mevcut sekmelerin yerine geçer. Beğenmezsen üstteki geri al ile dönebilirsin; ayarların kalır.', akGo: 'Uygula', akOk: 'Pano otomatik kuruldu', akNoAreas: 'HA\'da henüz alan (oda) yok. Ayarlar → Alanlar\'dan oda ekleyince burada çıkar.', akRoomsT: 'Senin evindeki alanlar; seçilenler birer sekme olur. Önizleme hayali bir evden.', akTabs: 'Sekmeler', akTilesT: 'Kare karolar, tablet gibi', akBarsT: 'Dokun aç/kapat, kaydır parlaklık', akPhoneBarsT: 'Tablette karo, telefonda çubuk', akHaloT: 'Büyük, halkalı kartlar', akRowsT: 'Tek satır, dokununca açılır', akBgZen: 'Meditasyon', akBgAur: 'Kutup ışığı', akBgSun: 'Gün batımı', akBgOce: 'Okyanus', akPhone: 'Telefon', akPhoneT: 'Önizlemede Telefon\'a geçince görünür', akCatsT: 'Altta Işıklar, İklim, Senaryolar', akRoomsBT: 'Oda düğmeleri altta', akTopT: 'Oda düğmeleri üstte', akPvTab: 'Tablet', akPvPh: 'Telefon', akPvNote: 'Hayali bir ev: senin panon seçtiğin odalarla, kendi cihazlarından kurulur. Önizlemeye dokunup deneyebilirsin.', akTablet: 'Tablet', akTabletT: 'Önizleme tablete geçer', akPLSame: 'Tabletteki gibi', akPLSameT: 'Bölümün ayarı geçerli', akSheetOn: 'Alttan açılsın', akSheetOnT: 'Aşağı çekince kapanır', akSheetOff: 'Ortada açılsın', akSheetOffT: 'Tabletteki gibi pencere', akBgKeep: 'Seçmezsen şimdiki arka planın kalır', akLec: 'Işık efektleri', akLecT: 'Lemur Light Effect Card ile · sende kurulu değil', akLecTOk: 'Lemur Light Effect Card sende kurulu: Efektler düğmesini açıp kapatabilirsin. Kurulu olmayanlar burada kartın ne işe yaradığını ve nasıl kurulduğunu görür.', akLecOn: 'Efektler açık', akLecOnT: 'Üst şeritte Efektler düğmesi; ışık penceresinde Efekt sekmesi', akLecOff: 'Efektler gizli', akLecWhy: 'Işıklarına hareketli efektler: ateş, kutup ışığı, gökkuşağı ve onlarcası', akLecHow: 'İsteğe bağlı. HACS\'tan Lemur Light Effect Card\'ı indir, Ayarlar → Cihazlar ve servisler\'den entegrasyonu ekle, HA\'yı yeniden başlat. Pano onu kendisi tanır, ayar gerekmez: Efektler düğmesi, ışık penceresindeki Efekt sekmesi ve senaryolardaki efekt düğmeleri kendiliğinden açılır. Kaldırırsan bunlar gizlenir, pano bozulmaz.', akLecGet: 'HACS\'ta aç', akST: 'Stil seç', akSHint: 'Sekmelerine dokunulmaz; görünüm ayarları topluca değişir. Önizlemede dene, beğenirsen Uygula.', akSrcMine: 'Benim evim', akSrcDemo: 'Örnek ev', akPvMine: 'Kendi panon. Önizlemede dokunuşlar cihazlarına gitmez.', akResS: 'Sekmelerin aynı kalır', akWarnS: 'Işık görünümü, iklim kartları, arka plan, telefon ve efekt ayarları değişir. Beğenmezsen geri al ile dönebilirsin.', akOkS: 'Stil uygulandı', stlT: 'Arka plan, ışık ve iklim görünümü, telefon düzeni ve Efektler düğmesi burada. Önizlemede dene, beğenirsen tek dokunuşla uygula.', stlGo: 'Stil seç', akImgT: 'HA\'nın www klasöründeki bir resim (/local/...) ya da bir internet adresi.', akPop: 'Işık penceresi', version: 'Sürüm', lec: 'Lemur Light Effect Card', lecOn: 'Kurulu ({v}). Efekt ekranı üst şeritten, ışık penceresinden ve senaryo düğmelerinden açılır.', lecOff: 'Kurulu değil. Işık efektleri için isteğe bağlı olarak kurulabilir; kurulunca Efektler düğmesi Stil seç\'ten açılıp kapanır.', lecNav: 'Üst şeritte Efektler', lecNavT: 'Panonun üst şeridinde, oda düğmelerinin yanında efekt ekranını açan düğme', lecInfoT: 'Lemur Light Effect Card kurulu', lecInfo: 'Panonun üst şeridine Efektler düğmesi eklendi: dokununca efekt ekranı o sekmenin odasıyla açılır. Senaryo bölümlerine tek tek efekt düğmesi de ekleyebilirsin (bölümü seç → Düğme ekle → Işık efektleri). Işık penceresindeki Efekt sekmesi de efekt ekranını açar.', ok: 'Tamam', iconPick: 'Simge seç', iconSug: 'Önerilen', iconAll: 'Arama sonuçları', iconSearch: 'Ara (ör. lamba, sofa, tavan)', iconMore: 'İlk {n} sonuç gösteriliyor, aramayı daralt', iconNone: 'Bulunamadı. Simgenin adını mdi:... diye yazabilirsin.', iconLoading: 'Simgeler yükleniyor…', icCol: 'Simgeler', iconEvery: 'Tüm simgeler', icColNone: 'Simgeler yüklenemedi.', icStyle: 'Simge stili', icStyleT: 'Otomatik: kapalı cihazlar gri, açıklar renkli. Renkli: hepsi renkli. Düz: hepsi gri. Tek renk: çizgiler tek tonda; kapalılar gri, açıklar seçtiğin renkte.', icAuto: 'Otomatik', icFlat: 'Düz', icColor: 'Renkli', icTint: 'Tek renk', icTintC: 'Renk seç', icTintL: 'Işıkta ışığın rengi', icTintLT: 'Tek renk stilinde açık ışığın simgesi lambanın kendi renginde görünür.', icLec: 'Efekt simgeleri', icLecNone: 'Efekt simgeleri yüklenemedi.', hold: 'Işığa basılı tutunca', holdT: 'Işık karosuna basılı tutunca açılan pencere', hPop: 'Işık penceresi', hHa: 'HA penceresi', hLec: 'Efekt ekranı', lecOpen: 'Efekt ekranı', lecStop: 'Efekti durdur', lecGroup: 'Işık efektleri · {r}', lecLoading: 'Efektler yükleniyor…', tOpen: 'Efekt ekranı · {r}', tPlay: 'Efekt: {e} · {r}', tStop: 'Efekti durdur · {r}', roomByTab: 'sekmenin odası', lecNa: 'Lemur Light Effect Card kurulu değil: bu düğme panoda görünmez',
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
    close: 'Kapat', notLoaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.', editNote: 'Not: Bu panoda HA\'nın kendi düzenleyicisinde "kontrolü al" dersen pano bu panelden kopar.'
  },
  en: {
    title: 'Lemur Home Dashboard', auto: 'Automatic layout', autoT: 'The dashboard is currently built from your areas. Your first change saves this layout, then everything is edited here.',
    undo: 'Undo', undoK: 'Undo (Ctrl+Z)', settings: 'Settings', more: 'More', saved: 'Saved', undone: 'Undone', err: 'Could not save: {e}',
    tabName: 'Tab name', icon: 'Icon', area: 'Area', noArea: 'No area', cols: 'Columns', colAdd: 'Add column', colDel: 'Remove last column', colTab: 'Tablet layout', colEq: 'Equal', colHint: 'Set widths by dragging the line between columns in the preview.', delTab: 'Delete tab', sure: 'Sure?',
    refill: 'Refill from area', refillT: 'Rebuilds this tab\'s sections from the devices of the chosen area.', addTab: 'Tab', newTab: 'New tab', emptyTab: 'Empty tab', fromArea: 'Tab from area',
    preview: 'Preview', pvHint: 'Drag boxes by their ⠿ handle, items by themselves · drag lines to resize', splits: 'Columns inside', splitsT: 'Splits a column into 2-3 equal sub-columns (e.g. two scene sections side by side).', splitNarrow: 'This many sub-columns will not fit: use fewer columns first', sub: 'Sub-column', sections: 'Sections', addSec: 'Add section', noSec: 'This tab has no sections.',
    secTitle: 'Title', column: 'Column', colL: 'Left', colM: 'Middle', colR: 'Right', tileCols: 'Tiles per row', look: 'Look', lookTile: 'Tiles', lookBar: 'Sliders', lookPhone: 'Auto on phone', lookTileT: 'Square tiles: tap to toggle, hold for the window', lookBarT: 'Horizontal bars: tap to toggle, swipe sideways for brightness, hold for the window', lookPhoneT: 'Tiles on a tablet, slider bars on a phone', barCols: 'Sliders per row', delSec: 'Delete section',
    t_values: 'Values', t_cards: 'Cards', t_subs: 'Subtitle', t_free: 'Empty section', t_lights: 'Lights', t_scenes: 'Scenes', t_climate: 'Climate', t_vacuum: 'Vacuum', t_media: 'Media', d_free: 'An empty box without a title', secFree: 'The section type is only a start: anything can go into any section, and each item shows in its own way.', pfAll: 'All', pfTile: 'Lights and switches', titleOpt: 'Title (optional)',
    d_lights: 'Light, plug and cover tiles', d_scenes: 'Script, scene and automation buttons', d_climate: 'Air conditioner and radiator cards (summer/winter)', d_vacuum: 'Robot vacuum cards', d_media: 'TVs and speakers',
    n_items: '{n} items', addDev: 'Add', addPh: 'Empty tile', addScene: 'Add button', name: 'Name', target: 'Runs', noItems: 'No items yet.',
    tSensor: 'Temperature sensor', hSensor: 'Humidity sensor', fromDevice: 'From device', noOutdoor: 'No outdoor temperature', noLink: 'No linked device', linkT: 'Device controlled together (e.g. a second radiator in the same room)', outdoorT: 'Outdoor temperature sensor (radiator card shows heating demand)', addScPh: 'Empty button', kind: 'Type', k_auto: 'Automatic', k_ac: 'Air conditioner', k_radiator: 'Radiator',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Wide 16:9', scr_phone: 'Phone', scr_here: 'This screen',
    pickT: 'Add', search: 'Search: name, area or entity id', cancel: 'Cancel', addN: 'Add ({n})', added: 'Added', noArea2: 'No area', nothing: 'No matching device.',
    sHelp: 'Help', repT: 'Report a problem', repS: 'Opens a GitHub issue with the version and device details; you only write what happened', repQ: 'What happened?', repPh: 'What did you do, what did you expect, what happened? Example: swiping a light bar on the Living room tab does not change the brightness.', repInfo: 'Details added to the issue', repInfoS: 'Nothing personal: no room, device or person names, address or account.', repNoGh: 'No GitHub account? Copy the text and send it to the developer.', repCopy: 'Copy text', repCopied: 'Copied', repGh: 'Open on GitHub', rWhat: 'What happened?', rInfoH: 'Details', rPanel: 'Dashboard', rInt: 'integration', rHa: 'Home Assistant', rBrowser: 'Browser', rApp: 'HA app', rScreen: 'Screen', rTouch: 'touch', rNoTouch: 'no touch', rCanvas: 'canvas', rLang: 'Language', rLayout: 'Layout', rAuto: 'automatic', rTabs: 'tabs', rSecs: 'sections', rItems: 'items', rKinds: 'Item kinds', rLook: 'Look', rLec: 'Light Effect Card', rErr: 'Recent errors', rNoErr: 'none', sBackup: 'Backup', bkDown: 'Download backup', bkDownS: 'Tabs, sections and settings in one file', bkUp: 'Restore a backup', bkUpS: 'Pick a backup file; you are asked first, then it replaces the current layout', bkQ: 'Restore this backup?', bkW: 'Backup from {d} (v{v}): {n} tabs, {s} sections. The current tabs, sections and settings are replaced by it. Undo brings them back.', bkVer: 'The backup was made with v{v}; it can still be restored.', bkSvc: 'The pets in this backup run these services on their own:', twinL: 'Backup control', twinNone: 'None', twinT: 'If the lamp does not answer, the command is also sent through this', sWalls: 'Wall switches', wallsT: 'If the relay only gives a signal, pressing it by hand toggles the chosen lamp', wallSw: 'Switch', wallLight: 'Lamp', wallBr: 'Brightness %', wallK: 'Kelvin', wallAdd: 'Add switch', wallDel: 'Remove', wallPick: 'Pick…', wallNone: 'No wall switches yet.', wallAuto: 'If HA also has an automation for this switch, turn it off: {n}', bkYes: 'Restore', bkSaved: 'Backup downloaded', bkOk: 'Backup restored', bkErr: 'This file is not a dashboard backup', newsT: 'What\'s new', newsV: 'New in v{v}', newsOld: 'Earlier versions', newsAll: 'All notes on GitHub', newsOk: 'OK', newsLink: 'What\'s new', sVer: 'Version and updates', updT: 'Version', updInst: 'Installed: v{v}', updCheck: 'Check for updates', updChecking: 'Checking…', updOk: 'up to date', updAt: 'checked {t}', updNew: 'v{v} is ready', updNotes: 'What’s new', updNoHacs: 'Not installed with HACS, so it cannot be installed from here', updGo: 'Update', updGh: 'Open on GitHub', updIng: 'Downloading v{v}…', updDone: 'v{v} is downloaded. It takes effect when Home Assistant restarts.', updRestart: 'Restart', updAsk: 'Restart Home Assistant? Light control and automations stop for a minute or two.', updYes: 'Yes, restart', updRest: 'Restarting… The page reloads by itself when it is back.', updErr: 'Could not check: {e}', updAgain: 'Check again', s_board: 'Dashboard', s_look: 'Appearance', s_screen: 'Screen', s_info: 'About',
    lang: 'Language', lAuto: 'Automatic', season: 'Season', seasonT: 'The climate section shows air conditioners in summer, radiators in winter. Automatic: May-September is summer.', sAuto: 'Automatic', sSum: 'Summer', sWin: 'Winter',
    bg: 'Background', bgT: 'Dark: the tablet dashboard background. Colour: any solid colour. Effect (default, Meditation): a soft glow in the effect colours of Light Effect Card. Image: an address like /local/background.jpg.', bgDark: 'Dark', bgBlack: 'Black', bgColor: 'Colour', bgFx: 'Effect', bgImg: 'Image', bgUrl: 'Image address', bgBad: 'No image opens at this address: put the file in HA\'s config/www folder and write /local/file.jpg.',
    theme: 'HA theme', themeT: 'Optional; dialogs open with this theme.', kHeader: 'Hide the top bar', kHeaderT: 'Home Assistant\'s header is hidden on this dashboard.',
    kSide: 'Hide the sidebar', kSideT: 'Home Assistant\'s sidebar is hidden on this dashboard.', canvas: 'Canvas', canvasT: 'Design width and reference height (px). The dashboard scales to the screen with this ratio.',
    navAl: 'Align room buttons to a column', navAlT: 'The room buttons in the top bar end at the right edge of the chosen column and share the space evenly. They stay aligned on every screen size.', navNo: 'Off', navCol: 'Up to column {n}', navFx: 'Effects inside the aligned area', navFxT: 'When on, the Effects button is aligned together with the room buttons; when off it sits next to the clock.', navSz: 'Room button size', navSzT: 'Width and height (pixels). Empty means 235 × 155.', navSzA: 'Height (pixels). While aligned to a column the width is set automatically. Empty means 155.', navW: 'Width', navH: 'Height', clSt: 'Climate and vacuum cards', clStT: 'Halo: the large cards with a ring. Simple: one row; for climate the status, temperature and target, for vacuums the status, battery, start and dock. Tap the card to expand it: target − +, power, mode, fan, swing or stop, locate, suction (when the device supports them).', clHalo: 'Halo', clRows: 'Simple', s_phone: 'Phone', phNav: 'Navigation', phNavT: 'Categories at the bottom (recommended): Lights, Climate, Scenes at the bottom; in lights, swipe left and right to move between rooms. Rooms at the bottom: room buttons at the bottom of the screen, like an app. Rooms on top: the old layout with room buttons on top.', phTop: 'Rooms on top', phRooms: 'Rooms at the bottom', phCats: 'Categories at the bottom', phLights: 'Lights', phLightsT: 'As set in the section, always tiles, or one per row (each light a row; tap to toggle, swipe for brightness).', phLAuto: 'As in the section', phLTiles: 'Tiles', phLRows: 'One per row', phSheet: 'Light window from the bottom', phSheetT: 'The window opened by holding a light slides up from the bottom; pull it down to close. Tablets are not affected.', akT: 'Auto setup', akHint: 'The dashboard is built from your HA areas and devices. Choose, see the result below, Apply.', akRooms: 'Rooms (one tab each)', akHome: 'Home tab', akHomeT: 'A summary of the whole home: lights, scenes and climate taken from the rooms in turn', akOther: 'Other tab', akOtherT: 'A tab for rooms you did not pick and devices without an area', akWhat: 'What to include', akL: 'Lights', akS: 'Scenes', akC: 'Climate', akV: 'Vacuum', akM: 'Media', akLook: 'Look', akLights: 'Lights', akTiles: 'Tiles', akBars: 'Slider bars', akPhoneBars: 'Bars on phones', akRes: 'Result · {n} tabs', akSum: '{l} lights · {s} scenes · {c} cards', akNone: 'This selection gives no tabs.', akWarn: 'Apply replaces your current tabs. If you don\'t like it, use undo at the top; your settings stay.', akGo: 'Apply', akOk: 'Dashboard set up automatically', akNoAreas: 'There are no areas (rooms) in HA yet. Add rooms in Settings → Areas and they show up here.', akRoomsT: 'The areas in your home; each one you pick becomes a tab. The preview is a made-up home.', akTabs: 'Tabs', akTilesT: 'Square tiles, like a tablet', akBarsT: 'Tap to toggle, swipe for brightness', akPhoneBarsT: 'Tiles on tablets, bars on phones', akHaloT: 'Large cards with a ring', akRowsT: 'One row, opens on tap', akBgZen: 'Meditation', akBgAur: 'Aurora', akBgSun: 'Sunset', akBgOce: 'Ocean', akPhone: 'Phone', akPhoneT: 'Switch the preview to Phone to see it', akCatsT: 'Lights, Climate, Scenes at the bottom', akRoomsBT: 'Room buttons at the bottom', akTopT: 'Room buttons on top', akPvTab: 'Tablet', akPvPh: 'Phone', akPvNote: 'A made-up home: your dashboard is built from your own devices in the rooms you pick. Tap the preview to try it.', akTablet: 'Tablet', akTabletT: 'The preview switches to tablet', akPLSame: 'Same as tablet', akPLSameT: 'The section setting applies', akSheetOn: 'From the bottom', akSheetOnT: 'Pull down to close', akSheetOff: 'In the middle', akSheetOffT: 'A window, like on tablets', akBgKeep: 'If you pick none, your current background stays', akLec: 'Light effects', akLecT: 'With Lemur Light Effect Card · not installed', akLecTOk: 'Lemur Light Effect Card is installed: you can turn the Effects button on or off. Without it, this step explains what the card does and how to install it.', akLecOn: 'Effects on', akLecOnT: 'Effects button in the top bar; Effect tab in the light window', akLecOff: 'Effects hidden', akLecWhy: 'Moving effects for your lights: fire, aurora, rainbow and dozens more', akLecHow: 'Optional. Download Lemur Light Effect Card from HACS, add the integration in Settings → Devices & services and restart HA. The dashboard detects it on its own, no setup needed: the Effects button, the Effect tab in the light window and effect buttons in scenes appear by themselves. If you remove it they are hidden and the dashboard keeps working.', akLecGet: 'Open in HACS', akST: 'Choose a style', akSHint: 'Your tabs stay as they are; only the look changes, all at once. Try it in the preview and Apply if you like it.', akSrcMine: 'My home', akSrcDemo: 'Example home', akPvMine: 'Your own dashboard. Taps in the preview do not reach your devices.', akResS: 'Your tabs stay the same', akWarnS: 'Light look, climate cards, background, phone and effect settings change. If you don\'t like it, use undo to go back.', akOkS: 'Style applied', stlT: 'Background, light and climate look, phone layout and the Effects button live here. Try them in the preview and apply with one tap.', stlGo: 'Choose a style', akImgT: 'An image in HA\'s www folder (/local/...) or a web address.', akPop: 'Light window', version: 'Version', lec: 'Lemur Light Effect Card', lecOn: 'Installed ({v}). The effect screen opens from the top bar, the light window and scene buttons.', lecOff: 'Not installed. Optional, for light effects; once it is installed, the Effects button is turned on or off in Choose a style.', lecNav: 'Effects in the top bar', lecNavT: 'A button next to the room buttons at the top that opens the effect screen', lecInfoT: 'Lemur Light Effect Card is installed', lecInfo: 'An Effects button was added to the top bar of the dashboard: it opens the effect screen for that tab\'s room. You can also add single effect buttons to scene sections (select the section → Add button → Light effects). The Effect tab in the light window opens the effect screen too.', ok: 'OK', iconPick: 'Choose icon', iconSug: 'Suggested', iconAll: 'Search results', iconSearch: 'Search (e.g. lamp, sofa, ceiling)', iconMore: 'Showing the first {n} results, narrow the search', iconNone: 'Nothing found. You can type the icon name as mdi:...', iconLoading: 'Loading icons…', icCol: 'Icons', iconEvery: 'All icons', icColNone: 'Could not load the icons.', icStyle: 'Icon style', icStyleT: 'Automatic: devices that are off are grey, devices that are on are colourful. Colourful: all colourful. Flat: all grey. Single colour: one tone; devices that are off are grey, devices that are on are in the colour you pick.', icAuto: 'Automatic', icFlat: 'Flat', icColor: 'Colourful', icTint: 'Single colour', icTintC: 'Pick a colour', icTintL: 'Light colour on lights', icTintLT: 'In single colour style, a light that is on shows its icon in the lamp\'s own colour.', icLec: 'Effect icons', icLecNone: 'Could not load the effect icons.', hold: 'Holding a light', holdT: 'What opens when you hold a light tile', hPop: 'Light window', hHa: 'HA dialog', hLec: 'Effect screen', lecOpen: 'Effect screen', lecStop: 'Stop effect', lecGroup: 'Light effects · {r}', lecLoading: 'Loading effects…', tOpen: 'Effect screen · {r}', tPlay: 'Effect: {e} · {r}', tStop: 'Stop effect · {r}', roomByTab: 'the tab\'s room', lecNa: 'Lemur Light Effect Card is not installed: this button is hidden on the dashboard',
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
    close: 'Close', notLoaded: 'The Lemur Home Dashboard integration is not loaded.', editNote: 'Note: if you "take control" of this dashboard in Home Assistant\'s own editor, it disconnects from this panel.'
  }
};
// Bölüm türleri sadece başlangıç (başlık ve simge); her bölüme her şey eklenebilir. domains: seçicideki süzgeç
const LHD_TYPES = {
  free: { icon: 'mdi:view-grid-plus-outline', domains: null, col: 0 },
  lights: { icon: 'mdi:lightbulb-group-outline', domains: ['light', 'switch', 'cover', 'fan', 'input_boolean'], col: 0 },
  scenes: { icon: 'mdi:gesture-tap-button', domains: ['script', 'scene', 'automation'], col: 1 },
  climate: { icon: 'mdi:thermostat', domains: ['climate'], col: 2 },
  vacuum: { icon: 'mdi:robot-vacuum', domains: ['vacuum'], col: 2 },
  media: { icon: 'mdi:television', domains: ['media_player'], col: 2 }
};
// Renk zemini için hazır koyu tonlar (açık renkler de seçilebilir ama yazılar beyaz)
const LHD_TINT_COLORS = ['#FFC24A', '#E6ECF5', '#5B8DEF', '#4FD1C5', '#7BD83A', '#FF7AB0', '#B07CFF', '#FF8A4A'];
const LHD_BG_COLORS = ['#0b0e15', '#0e1726', '#101418', '#0f1a14', '#1a1024', '#1d0f12', '#1a160e', '#0d1b1e'];
const LHD_ALL_DOMAINS = ['light', 'switch', 'cover', 'fan', 'input_boolean', 'lock', 'script', 'scene', 'automation', 'button', 'input_button', 'climate', 'vacuum', 'media_player'].concat(LHD_VALUE_DOMAINS);
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
const LHD_KIND_KEY = { tile: 't_lights', scene: 't_scenes', climate: 't_climate', vacuum: 't_vacuum', media: 't_media', value: 't_values', card: 't_cards', pet: 't_pets', sub: 't_subs' };
// Önizleme ekranları: pano gerçekte ekranın oranına göre ölçeklenir (scale.js); önizleme seçilen ekranı aynı hesapla taklit eder.
const LHD_SCREENS = [['tab16', 1600, 1000], ['tab43', 1024, 768], ['wide', 1920, 1080], ['phone', 390, 844], ['here', 0, 0]];
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
  set narrow(v) { this._narrow = v; }
  set panel(p) { this._panelCfg = p; }
  connectedCallback() {
    if (!this._key) {
      this._key = (e) => {
        const typing = e.composedPath && e.composedPath()[0] && /INPUT|SELECT|TEXTAREA/.test(e.composedPath()[0].tagName || '');
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && this._undo.length) { e.preventDefault(); this._undoIt(); }
        if (e.key === 'Escape' && (this._modal || this._menu)) { this._modal = null; this._menu = null; this._render(); }
      };
    }
    window.addEventListener('keydown', this._key);
    if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => this._fit());
    if (!this._leciUnsub) this._leciUnsub = lpLecIconsSub(() => { if (this._hass && STORE.data) this._render(); });
    if (!this._mdicUnsub) this._mdicUnsub = lpMdicSub(() => { if (this._hass && STORE.data) { this._render(); if (this._modal === 'icon') this._refreshIcons(); } });
    if (this._hass && STORE.data) { this._sub(); this._render(); }
  }
  disconnectedCallback() {
    window.removeEventListener('keydown', this._key);
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
    return STORE.set(key, value).catch((e) => this._toast(this._t('err', { e: (e && e.message) || e }), false));
  }
  _snap() {
    this._undo.push({ tabs: lhdClone((STORE.data && STORE.data.tabs) || []), settings: lhdClone(this._settings()) });
    if (this._undo.length > 40) this._undo.shift();
  }
  _undoIt() {
    const u = this._undo.pop(); if (!u) return;
    // sadece değişen anahtar gönderilir (ikisi birden gönderilince ara yankı geri alınanı bir an geri getiriyordu)
    if (JSON.stringify(u.settings) !== JSON.stringify(this._settings())) this._commit('settings', u.settings);
    if (JSON.stringify(u.tabs) !== JSON.stringify((STORE.data && STORE.data.tabs) || [])) this._commit('tabs', u.tabs);
    this._render();
    this._toast(this._t('undone'), false);
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
    const out = { format: 'lemur-home-dashboard-backup', version: PANEL_VERSION, date: new Date().toISOString(), data: { tabs: d.tabs || [], settings: d.settings || {}, profiles: d.profiles || {}, pets: d.pets || {} } };
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
      (rest.length ? (this._newsAll ? rest.map((c) => one(c, false)).join('') : '<button class="lnk" data-newsall>' + t('newsOld') + ' ›</button>') : '') + '</div>' +
      '<div class="df"><a class="btn" href="https://github.com/mendebur-lemur/lemur-home-dashboard/releases" target="_blank" rel="noopener">' + t('newsAll') + '</a><span style="flex:1"></span><button class="btn pri" data-newsclose>' + t('newsOk') + '</button></div></div></div>';
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
    let h = '<div class="sh">' + t('sWalls') + this._hb('walls') + '</div><div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><span>' + t('wallsT') + '</span></div>';
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
    // yalnız HACS'in oluşturduğu güncelleme varlığı (başka bir entegrasyon aynı adresi taklit edemesin)
    const S = this._hass.states, E = this._hass.entities || {};
    const hacs = (s) => !!s && s.entity_id.indexOf('update.') === 0 && !!E[s.entity_id] && E[s.entity_id].platform === 'hacs';
    return Object.values(S).find((s) => hacs(s) && LHD_REPO_URL.test(String(s.attributes.release_url || ''))) || (hacs(S['update.lemur_home_dashboard_update']) ? S['update.lemur_home_dashboard_update'] : null);
  }
  async _updCheck() {
    const c = this._hass.connection, vnum = (v) => String(v || '').replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
    const newer = (a, b) => { const x = vnum(a), y = vnum(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
    this._updSet({ st: 'checking', err: null });
    try {
      let cur = PANEL_VERSION; try { cur = (await c.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version || cur; } catch (e) {}
      // HACS: menüsündeki "Bilgileri güncelle" ile aynı; güncelleme varlığı en yeni sürümü öğrensin
      try { const L = await c.sendMessagePromise({ type: 'hacs/repositories/list' }); const r = (L || []).filter((x) => /^mendebur-lemur\/lemur-home-dashboard$/i.test(x.full_name || ''))[0]; if (r) { await c.sendMessagePromise({ type: 'hacs/repository/refresh', repository: String(r.id) }); await new Promise((z) => setTimeout(z, 900)); } } catch (e) {}
      const ent = this._updEnt();
      let latest = ent && ent.attributes.latest_version, url = ent && ent.attributes.release_url;
      if (!latest) { const g = await fetch('https://api.github.com/repos/mendebur-lemur/lemur-home-dashboard/releases/latest').then((r) => r.json()); latest = g.tag_name; url = g.html_url; }
      latest = String(latest || '').replace(/^v/i, '');
      if (!LHD_REPO_URL.test(String(url || ''))) url = null;   // bağlantı yalnız projenin GitHub sayfasına
      const at = new Date().toLocaleTimeString(this._lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
      this._updSet(newer(latest, cur) ? { st: 'new', cur: cur, latest: latest, url: url, ent: ent ? ent.entity_id : null, at: at } : { st: 'ok', cur: cur, latest: latest, url: url, at: at });
    } catch (e) { this._updSet({ st: 'err', err: (e && (e.message || e.code)) || String(e) }); }
  }
  async _updInstall() {
    const U = this._upd || {}; if (!U.ent) return;
    this._updSet({ st: 'installing', pct: null });
    try { await this._hass.callService('update', 'install', { entity_id: U.ent }); }
    catch (e) { return this._updSet({ st: 'err', err: (e && e.message) || String(e) }); }
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
  // yeniden başlat; yeni sürüm cevap verince sayfayı bir kez yenile (o ana kadar bellekte eski kod var)
  _updRestart() {
    const want = (this._upd || {}).latest; this._updSet({ st: 'restarting' });
    this._hass.callService('homeassistant', 'restart').catch(() => {});
    const t0 = Date.now(); let down = false;
    const poll = async () => {
      if (Date.now() - t0 > 600000) return;
      try {
        const v = (await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version;
        if (v === want || (down && v)) { await Promise.resolve(window.__LEMUR_HD_HEAL && window.__LEMUR_HD_HEAL()); return location.reload(); }
      } catch (e) { down = true; }
      setTimeout(poll, 3000);
    };
    setTimeout(poll, 8000);
  }
  // üst şerit ayarları (ayar nav): oda düğmelerinin boyu ve kolona hizalama (src/panel-card.js lpNavCfg)
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
      '<div class="srow"><div class="t"><b>' + t('phSheet') + '</b><span>' + t('phSheetT') + '</span></div>' + tg('phone.sheet', pc.sheet) + '</div>';
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
      types: { lights: true, scenes: true, climate: true, vacuum: true, media: true }, look: nb > nt ? 'bar' : 'tiles', clim: stil && lpClimStyle() === 'rows' ? 'rows' : 'halo',
      bg: bg, bgColor: (m === 'color' && st.bg.color) || LHD_BG_COLORS[1], bgUrl: (m === 'img' && st.bg.url) || url, nav: pc.nav, plights: pc.lights, sheet: pc.sheet, lec: st.lec_nav !== false, pv: 'tablet' };
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
    s.lec_nav = K.lec;
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
  _undoBtn() { const u = this.shadowRoot && this.shadowRoot.querySelector('[data-a="undo"]'); if (u) u.disabled = !this._undo.length; }
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
      '<div class="seg modeseg" title="' + t('modeT') + '"><button data-mode="simple"' + (this._adv() ? '' : ' class="on"') + '>' + t('modeSimple') + '</button><button data-mode="adv"' + (this._adv() ? ' class="on"' : '') + '>' + t('modeAdv') + '</button></div>' + this._hb('mode') +
      '<button class="btn ic" data-a="undo" title="' + t('undoK') + '"' + (this._undo.length ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:undo"></ha-icon></button>' +
      '<button class="btn stl" data-a="stilsec" title="' + t('akSHint') + '"><ha-icon class="s16" icon="mdi:palette-outline"></ha-icon>' + t('akST') + '</button>' +   // stil seç göze çarpsın: ayarların yanında
      '<button class="btn" data-a="settings"><ha-icon class="s16" icon="mdi:cog-outline"></ha-icon>' + t('settings') + '</button>' +
      '<button class="btn ic" data-a="more" title="' + t('more') + '"><ha-icon class="s16" icon="mdi:dots-horizontal"></ha-icon></button></div>';

    const rooms = '<div class="rooms" data-dl="tabs" data-dir="x">' + tabs.map((x) => '<div class="rb' + (x.id === this._tab ? ' on' : '') + '" data-di data-tab="' + esc(x.id) + '" data-handle>' + lpIcon(x.icon || 'mdi:door') + esc(x.name) + '</div>').join('') +
      '<div class="rb add" data-a="addtab"><ha-icon class="s18" icon="mdi:plus"></ha-icon>' + t('addTab') + '</div></div>';
    const areaOpts = '<option value="">' + t('noArea') + '</option>' + Object.keys(this._hass.areas || {}).map((a) => '<option value="' + esc(a) + '"' + (tab && tab.area === a ? ' selected' : '') + '>' + esc(this._area(a)) + '</option>').join('');
    const W = tab ? lpWeights(tab) : LP_DEFAULT_COLS, wsum = W.reduce((a, b) => a + b, 0), SP = lpSplits(tab, W.length);
    const rpanel = tab ? '<div class="rpanel' + (tabs[0] && tabs[0].id === tab.id ? ' first' : '') + '">' +
      '<div class="fld" style="flex:1 1 180px"><label>' + t('tabName') + '</label><input class="inp" data-f="tab.name" value="' + esc(tab.name || '') + '"></div>' +
      '<div class="fld" style="flex:1 1 200px"><label>' + t('icon') + '</label><div class="iconin"><div class="pv">' + lpIcon(tab.icon || 'mdi:door') + '</div><input class="inp" data-f="tab.icon" value="' + esc(tab.icon || '') + '" placeholder="mdi:sofa-outline"><button class="btn sm ic" data-ip="tab" title="' + t('iconPick') + '"><ha-icon class="s16" icon="mdi:shape-outline"></ha-icon></button></div></div>' +
      '<div class="fld" style="flex:1 1 160px"><label>' + t('area') + '</label><select class="inp" data-f="tab.area">' + areaOpts + '</select></div>' +
      '<div class="fld"><label title="' + t('colHint') + '">' + t('cols') + ' · ' + W.map((x) => Math.round(x / wsum * 100)).join(' / ') + '</label><div class="acts">' +
        '<button class="btn sm ic" data-a="coldel" title="' + t('colDel') + '"' + (W.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:minus"></ha-icon></button>' +
        '<span class="btn sm" style="pointer-events:none;min-width:38px">' + W.length + '</span>' +
        '<button class="btn sm ic" data-a="coladd" title="' + t('colAdd') + '"' + (W.length >= LHD_MAXCOLS ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:plus"></ha-icon></button>' +
        (W.length === 3 ? '<button class="btn sm" data-a="coltab">' + t('colTab') + '</button>' : '') + '<button class="btn sm" data-a="coleq">' + t('colEq') + '</button></div></div>' +
      (!this._adv() ? '' : '<div class="fld"><label title="' + t('splitsT') + '">' + t('splits') + this._hb('splits') + '</label><div class="acts">' + SP.map((v, i) => '<div class="seg"><button disabled style="opacity:.6">' + esc(this._colName(i, W.length)) + '</button>' + [1, 2, 3].map((n) => '<button data-split="' + i + ':' + n + '"' + (v === n ? ' class="on"' : (!lhdCanSplit(tab, i, n, this._cw()) ? ' disabled title="' + esc(t('splitNarrow')) + '"' : '')) + '>' + n + '</button>').join('') + '</div>').join('') + '</div></div>') +
      (tab.area ? '<button class="btn sm" data-a="refill" title="' + t('refillT') + '"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('refill') + '</button>' : '') +
      '<button class="btn sm dan' + (this._ask === 'deltab' ? ' ask' : '') + '" data-a="deltab"' + (tabs.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'deltab' ? t('sure') : t('delTab')) + '</button></div>' : '';

    const ncols = W.length;
    const colName = (s) => this._colName(Math.min(s.col || 0, ncols - 1), ncols) + (SP[Math.min(s.col || 0, ncols - 1)] > 1 ? ' · ' + (Math.min(s.sub || 0, SP[Math.min(s.col || 0, ncols - 1)] - 1) + 1) : '');
    // özet: içindeki öğe türleri ("Işıklar 7 · İklim 2"); boşsa "0 öğe"
    const summary = (s) => { const k = lhdKinds(s), ks = Object.keys(k); return ks.length ? ks.map((x) => this._t(LHD_KIND_KEY[x]) + ' ' + k[x]).join(' · ') : this._t('n_items', { n: 0 }); };
    const secList = tab && (tab.sections || []).length ? '<div class="sl" data-dl="secs">' + tab.sections.map((s) => '<div class="si' + (s.id === this._sec ? ' on' : '') + '" data-di data-sec="' + esc(s.id) + '">' +
      '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span><div class="ti"><ha-icon icon="' + esc((LHD_TYPES[s.type] || {}).icon || 'mdi:shape') + '"></ha-icon></div>' +
      '<div class="nm"><b>' + esc(s.title || this._t('t_' + (LHD_TYPES[s.type] ? s.type : 'free'))) + '</b><span>' + esc(summary(s)) + '</span></div><span class="cb">' + colName(s) + '</span></div>').join('') + '</div>'
      : '<div class="empty">' + t('noSec') + '</div>';

    const ins = '<div class="ins"><div class="sc">' +
      '<h3>' + t('sections') + '<span class="grow"></span><button class="btn sm" data-a="addsec"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addSec') + '</button></h3>' + secList +
      (sec ? this._secEditor(tab, sec, ncols) : '') +
      (this._isAuto() ? '<div class="hint">' + t('autoT') + ' <button class="btn sm" data-a="autokur"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('akT') + '</button></div>' : '') + '<div class="hint">' + t('editNote') + '</div></div></div>';

    const scr = this._screenKey();
    const pv = '<div class="pvw"><div class="pvh"><ha-icon class="s16" icon="mdi:eye-outline"></ha-icon><b>' + t('preview') + '</b><span class="pvhint">· ' + t('pvHint') + '</span>' +
      '<div class="seg">' + LHD_SCREENS.map((x) => '<button data-scr="' + x[0] + '"' + (x[0] === scr ? ' class="on"' : '') + '>' + t('scr_' + x[0]) + '</button>').join('') + '</div></div><div class="pvbox"><div class="pvc"></div></div></div>';

    // yeniden çizimde odaktaki alan ve imleç korunur
    const act = R.activeElement, keyOf = (el) => { if (!el || !el.getAttribute) return null; const n = ['data-f', 'data-if', 'data-sf', 'data-q', 'data-bgurl', 'data-imf'].filter((k) => el.hasAttribute(k))[0]; return n ? '[' + n + (el.getAttribute(n) ? '="' + el.getAttribute(n) + '"' : '') + ']' : null; };
    const focusKey = keyOf(act), selS = act && act.selectionStart, selE = act && act.selectionEnd;
    // LEC kuruluysa bir kez: efektlerin nerede olduğunu anlatan bilgi kutusu ("Tamam" deyince kaybolur)
    const st0 = this._settings();
    const lecInfo = LEC.installed(this._hass) && !st0.lec_seen ? '<div class="lecinfo" data-lecinfo><ha-icon icon="mdi:creation"></ha-icon><div class="t"><b>' + t('lecInfoT') + '</b><span>' + t('lecInfo') + '</span></div>' +
      '<button class="btn sm" data-a="settings">' + t('settings') + '</button><button class="btn sm pri" data-a="lecok">' + t('ok') + '</button></div>' : '';
    // yeniden çizimde kaydırma yerleri korunsun (ayarlarda bir şey değişince pencere başa atlamasın)
    const SCR = ['.akr2', '.ov .db', '.dock .db', '.ins .sc', '.main', '.rooms', '.plist', '.ilist'], scrKeep = {};
    SCR.forEach((q) => { const el = R.querySelector(q); if (el && (el.scrollTop || el.scrollLeft)) scrKeep[q] = [el.scrollTop, el.scrollLeft]; });
    // Ayarlar önizlemenin üstünü kapatmaz: sağdaki panelin yerinde açılır, önizleme değişiklikleri canlı gösterir
    let modal = this._modalHtml(tabs, tab, sec), dock = '';
    const OV = '<div class="ov" data-ovl><div class="dlg sm">';
    if (this._modal === 'settings' && modal.indexOf(OV) === 0) { dock = '<div class="dlg sm dock">' + modal.slice(OV.length, modal.length - 6); modal = ''; }
    R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app' + (narrow ? ' narrowv' : '') + '">' + top + lecInfo +
      '<div class="rblock">' + rooms + rpanel + '</div><div class="main">' + pv + (dock || ins) + '</div>' +
      this._menuHtml() + modal + this._helpHtml() +
      '<div class="toast"><span></span><button data-a="undo">' + t('undo') + '</button></div></div>';

    Object.keys(scrKeep).forEach((q) => { const el = R.querySelector(q); if (el) { el.scrollTop = scrKeep[q][0]; el.scrollLeft = scrKeep[q][1]; } });
    this._mountPreview(tab, sec);
    if (this._modal === 'auto') this._akMount();
    this._ceMount();
    this._bind(tabs, tab, sec);
    if (focusKey) { const el = R.querySelector(focusKey); if (el && el.focus) { el.focus(); try { if (selS !== null && selS !== undefined) el.setSelectionRange(selS, selE); } catch (x) {} } }
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
      ('<button class="btn sm dash" data-a="addcard" title="' + t('addCardT') + '"><ha-icon class="s16" icon="mdi:card-text-outline"></ha-icon>' + t('addCard') + '</button>') +
      (LEC.installed(this._hass) ? '<button class="btn sm" data-a="addlec"><ha-icon class="s16" icon="mdi:creation"></ha-icon>' + t('lecOpen') + '</button>' : '') + '</div>';
    // karo görünümü: bölümde karo varsa (ya da bölüm boşsa) gösterilir
    const kinds = lhdKinds(s), tilesHere = !!kinds.tile || !list.length;
    const lookHtml = tilesHere ? '<div class="fld"><label>' + t('look') + '</label><div class="seg">' + [['tile', 'lookTile'], ['bar', 'lookBar'], ['phone', 'lookPhone']].map((x) => '<button data-look="' + x[0] + '" title="' + t(x[1] + 'T') + '"' + ((s.look || 'tile') === x[0] ? ' class="on"' : '') + '>' + t(x[1]) + '</button>').join('') + '</div></div>' +
      '<div class="row2">' + (s.look !== 'bar' ? '<div class="fld" style="flex:0 0 auto"><label>' + t('tileCols') + '</label><div class="seg">' + [2, 3, 4, 5, 6].map((n) => '<button data-tc="' + n + '"' + ((s.tile_columns || 5) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') +
      (s.look === 'bar' || s.look === 'phone' ? '<div class="fld" style="flex:0 0 auto"><label>' + t('barCols') + '</label><div class="seg">' + [1, 2, 3].map((n) => '<button data-bc="' + n + '"' + ((s.bar_columns || ((kinds.tile || 0) > 12 ? 3 : 2)) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') + '</div>' : '';
    return '<div class="ed"><div class="row2"><div class="fld"><label>' + t('secTitle') + '</label><input class="inp" data-f="sec.title" value="' + esc(s.title || '') + '" placeholder="' + t('titleOpt') + '"></div>' +
      '<div class="fld" style="flex:0 0 auto"><label>' + t('column') + '</label>' + colSeg + '</div>' + subSeg + '</div>' +
      lookHtml + (this._adv() ? this._secBoxHtml(s) : '') + body + '<div class="acts"><span class="grow"></span><button class="btn sm dan' + (this._ask === 'delsec' ? ' ask' : '') + '" data-a="delsec"><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'delsec' ? t('sure') : t('delSec')) + '</button></div></div>';
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
    const seg = (attr, cur, opts) => '<div class="seg">' + opts.map((o) => '<button ' + attr + '="' + o[0] + '"' + (cur === o[0] ? ' class="on"' : '') + (o[2] ? ' title="' + esc(o[2]) + '"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
    return '<div class="row2"><div class="fld" style="flex:0 0 auto"><label>' + t('fillL') + this._hb('fill') + '</label>' + seg('data-sfill', s.fill ? '1' : '', [['', this._t('fillC')], ['1', this._t('fillF'), this._t('fillT')]]) + '</div>' +
      (s.fill ? '' : '<div class="fld" style="flex:0 0 auto"><label>' + t('alignL') + '</label>' + seg('data-salign', s.align === 'center' || s.align === 'spread' ? s.align : '', [['', this._t('alTop')], ['center', this._t('alCenter')], ['spread', this._t('alSpread')]]) + '</div>') +
      '<div class="fld" style="flex:0 0 auto"><label>' + t('gapL') + '</label>' + seg('data-sgap', typeof s.gap === 'number' ? String(s.gap) : '', [['', this._t('gapAuto')], ['0', '0'], ['6', '6'], ['12', '12'], ['18', '18'], ['24', '24']]) + '</div></div>';
  }

  _menuHtml() {
    const m = this._menu; if (!m) return '';
    const t = (k) => esc(this._t(k));
    let inner = '';
    if (m.kind === 'more') inner = '<button data-a="autokur"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('akT') + '</button><button data-a="stilsec"><ha-icon class="s16" icon="mdi:palette-outline"></ha-icon>' + t('akST') + '</button><hr><button class="dan" data-a="reset"><ha-icon class="s16" icon="mdi:restore"></ha-icon>' + t('resetAll') + '</button>';
    if (m.kind === 'addtab') {
      const used = {}; this._work().forEach((x) => { if (x.area) used[x.area] = 1; });
      const areas = Object.keys(this._hass.areas || {}).filter((a) => !used[a]);
      inner = '<button data-newtab=""><ha-icon class="s16" icon="mdi:tab-plus"></ha-icon>' + t('emptyTab') + '</button>' +
        (areas.length ? '<hr><div class="mh">' + t('fromArea') + '</div>' + areas.map((a) => '<button data-newtab="' + esc(a) + '">' + lpIcon((this._hass.areas[a].icon) || 'mdi:door', 's16') + esc(this._area(a)) + '</button>').join('') : '');
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
        '<div class="seg pf" style="margin-top:8px">' + [['all', 'pfAll'], ['lights', 'pfTile'], ['scenes', 't_scenes'], ['values', 't_values'], ['climate', 't_climate'], ['vacuum', 't_vacuum'], ['media', 't_media']].map((x) => '<button data-pf="' + x[0] + '"' + ((this._pf || 'all') === x[0] ? ' class="on"' : '') + '>' + t(x[1]) + '</button>').join('') + '</div></div>' +
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
    if (md === 'item') return this._imHtml();
    if (md === 'cardpick') return this._cpHtml();
    if (md === 'cardedit') return this._ceHtml();
    if (md === 'report') return this._reportHtml();
    if (md === 'restore') return this._restoreHtml();
    if (md === 'settings') {
      const s = this._settings();
      const seg = (path, cur, opts) => '<div class="seg">' + opts.map((o) => '<button data-set="' + path + '" data-val="' + esc(o[0]) + '"' + (cur === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const tg = (path, on) => '<button class="tg' + (on ? ' on' : '') + '" data-tg="' + path + '"></button>';
      const k = s.kiosk || {}, cv = s.canvas || {};
      const lec = !!(this._hass.config && (this._hass.config.components || []).indexOf('lemur_light_effects') >= 0);
      return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di"><ha-icon icon="mdi:cog-outline"></ha-icon></div><h2>' + t('settings') + '</h2><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="db">' +
        '<div class="sh">' + t('sVer') + '</div>' + this._updRow() +   // en üstte (Light Effect Card ile aynı)
        '<div class="sh">' + t('s_board') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lang') + '</b></div>' + seg('language', s.language || 'auto', [['auto', this._t('lAuto')], ['tr', 'Türkçe'], ['en', 'English']]) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('season') + '</b><span>' + t('seasonT') + '</span></div>' + seg('season', s.season || 'auto', [['auto', this._t('sAuto')], ['summer', this._t('sSum')], ['winter', this._t('sWin')]]) + '</div>' +
        '<div class="sh">' + t('s_look') + '</div>' +
        // arka plan, ışık ve iklim görünümü, telefon ve efekt düğmesi Stil seç'te (önizlemeyle); burada yalnız oraya giden kart
        '<div class="srow stl"><div class="stli"><ha-icon icon="mdi:palette-outline"></ha-icon></div><div class="t"><b>' + t('akST') + '</b><span>' + t('stlT') + '</span></div><button class="btn pri" data-a="stilsec">' + t('stlGo') + '</button></div>' +
        '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('icStyle') + '</b><span>' + t('icStyleT') + '</span></div>' + seg('icon_style', lpIconMode(), [['auto', this._t('icAuto')], ['full', this._t('icColor')], ['mono', this._t('icFlat')], ['tint', this._t('icTint')]]) +
          (lpIconMode() === 'tint' ? '<div class="bgsw" style="width:100%">' + LHD_TINT_COLORS.map((c) => '<button class="bgc' + (lpIconTint().toLowerCase() === c.toLowerCase() ? ' on' : '') + '" data-tintc="' + c + '" style="background:' + c + '" title="' + c + '"></button>').join('') + '<label class="bgc pick" title="' + t('icTintC') + '"><input type="color" data-tintpick value="' + esc(lpIconTint()) + '"><ha-icon class="s16" icon="mdi:eyedropper-variant"></ha-icon></label></div>' : '') + '</div>' +
        (lpIconMode() === 'tint' ? '<div class="srow"><div class="t"><b>' + t('icTintL') + '</b><span>' + t('icTintLT') + '</span></div>' + tg('icon_tint_light', lpIconTintLight()) + '</div>' : '') +
        this._navRows(seg, tg, lec && s.lec_nav !== false) +
        '<div class="srow"><div class="t"><b>' + t('theme') + '</b><span>' + t('themeT') + '</span></div><input class="inp w" data-sf="theme_name" value="' + esc(s.theme_name || '') + '" placeholder="ios-dark-mode-blue-red"></div>' +
        '<div class="sh">' + t('s_screen') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kHeader') + '</b><span>' + t('kHeaderT') + '</span></div>' + tg('kiosk.hide_header', !!k.hide_header) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kSide') + '</b><span>' + t('kSideT') + '</span></div>' + tg('kiosk.hide_sidebar', !!k.hide_sidebar) + '</div>' +
        (!this._adv() ? '' : '<div class="srow"><div class="t"><b>' + t('canvas') + '</b><span>' + t('canvasT') + '</span></div><input class="inp" type="number" min="800" max="3000" data-sf="canvas.width" value="' + esc(cv.width || 1280) + '" style="width:90px"><input class="inp" type="number" min="500" max="2500" data-sf="canvas.ref_height" value="' + esc(cv.ref_height || 1075) + '" style="width:90px"></div>') +
        '<div class="sh">' + t('s_info') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lec') + '</b><span>' + (lec ? t('lecOn', { v: LEC.version || '?' }) : t('lecOff')) + '</span></div></div>' +
        '<div class="srow"><div class="t"><b>' + t('hold') + '</b><span>' + t('holdT') + '</span></div>' + seg('hold', lpHoldMode() === 'lec' && !lec ? 'popup' : lpHoldMode(), [['popup', this._t('hPop')], ['ha', this._t('hHa')]].concat(lec ? [['lec', this._t('hLec')]] : [])) + '</div>' +
        (this._adv() ? this._wallsHtml() : '') +
        '<div class="sh">' + t('sHelp') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('repT') + '</b><span>' + t('repS') + '</span></div><button class="btn" data-a="report">' + t('repT') + '</button></div>' +
        '<div class="sh">' + t('sBackup') + '</div>' +
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
          step(t('akWhat'), '', '<div class="akgrid">' + [['lights', 'akL', 'mdi:lightbulb-group'], ['scenes', 'akS', 'lhd:scene-switch'], ['climate', 'akC', 'mdi:thermostat'], ['vacuum', 'akV', 'mdi:robot-vacuum'], ['media', 'akM', 'mdi:speaker']].map((x) => opt('type:' + x[0], K.types[x[0]], x[2], t(x[1]))).join('') + '</div>')) +
        step(t('akTablet'), t('akTabletT'),
          sub(t('akLights')) + '<div class="akgrid">' + opt('look:tiles', K.look === 'tiles', 'mdi:view-grid-outline', t('akTiles'), t('akTilesT')) + opt('look:bar', K.look === 'bar', 'mdi:view-sequential-outline', t('akBars'), t('akBarsT')) + '</div>' +
          sub(t('clSt')) + '<div class="akgrid">' + opt('clim:halo', K.clim === 'halo', 'mdi:circle-slice-8', t('clHalo'), t('akHaloT')) + opt('clim:rows', K.clim === 'rows', 'mdi:format-list-bulleted', t('clRows'), t('akRowsT')) + '</div>') +
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
    const pf = this._pf || 'all', doms = pf === 'all' ? LHD_ALL_DOMAINS : pf === 'values' ? LHD_VALUE_DOMAINS : (pf === 'lights' ? LHD_TYPES.lights.domains.concat(['lock']) : LHD_TYPES[pf].domains.concat(pf === 'scenes' ? ['button', 'input_button'] : []));
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
    const ids = Object.keys(S).filter((id) => doms.indexOf(id.split('.')[0]) >= 0 && !(ents[id] && (ents[id].hidden || ents[id].entity_category)))
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
    const sec = this._curSec(tab), secId = sec && sec.id, i = ip.idx;
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
      this._pv.addEventListener('lhd-addsec', (e) => {
        // tıklama olayı panele ulaştıktan sonra aç (yoksa "dışarı tıklandı" sayılıp hemen kapanır)
        const d = e.detail; setTimeout(() => { const rr = this.shadowRoot.querySelector('.app').getBoundingClientRect(); this._menu = { kind: 'addsec', x: Math.max(8, Math.min(d.x - rr.left, rr.width - 280)), y: Math.min(d.y - rr.top + 8, rr.height - 320), target: { col: d.col, sub: d.sub } }; this._render(); }, 0);
      });
      this._pv.addEventListener('lhd-change', (e) => { const nt = e.detail.tab; this._edit((T) => { const i = T.map((x) => x.id).indexOf(nt.id); if (i >= 0) { lhdFitSplits(nt, this._cw()); T[i] = nt; } }); });
    }
    const cfg = { type: 'custom:lemur-home-dashboard-card', tab: tab.id, edit: true, selected: sec ? sec.id : '', phone: this._screenKey() === 'phone' || (this._screenKey() === 'here' && lpPhoneScreen()) };
    if (!this._pvCfg || JSON.stringify(this._pvCfg) !== JSON.stringify(cfg)) { this._pvCfg = cfg; this._pv.setConfig(cfg); }
    box.appendChild(this._pv);
    this._pv.hass = this._hass;
    const s = this._settings();
    box.style.background = lpBgOf(s);
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
    const sw = sc[1] || window.innerWidth, sh = sc[2] || window.innerHeight;
    const ph = sc[0] === 'phone' || (sc[0] === 'here' && lpPhoneScreen());
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
      if (g('[data-ovl]') && e.target === g('[data-ovl]')) { if (this._modal === 'news') return this._newsClose(); if (this._modal === 'item' || this._modal === 'cardedit') return; if (this._modal === 'icon' && this._ip && this._ip.kind === 'im' && this._im) { this._ip = null; this._modal = 'item'; return this._render(); } this._modal = null; this._render(); return; }   // öğe ayarları dışarı tıklayınca kapanmaz (yazılan kaybolmasın)
      if (act !== 'deltab' && act !== 'delsec' && this._ask) { this._ask = null; }
      const at = (el) => { const r = el.getBoundingClientRect(), rr = app.getBoundingClientRect(); return { x: Math.min(r.left - rr.left, rr.width - 260), y: r.bottom - rr.top + 6 }; };
      if (act === 'undo') return this._undoIt();
      if (act === 'settings') {
        this._modal = 'settings'; this._menu = null; this._render();
        // dar ekranda (telefon) yan panel önizlemenin altında kalıyordu: Ayarlar'a basınca bir şey olmuyor gibiydi
        if (this._narrowNow) { const d = this.shadowRoot.querySelector('.dlg.dock'); if (d && d.scrollIntoView) d.scrollIntoView({ block: 'start' }); }
        return;
      }
      if (act === 'more' || act === 'addtab' || act === 'addsec') { const p = at(a); this._menu = this._menu && this._menu.kind === act ? null : { kind: act, x: p.x, y: p.y }; return this._render(); }
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
            S.entities.push(d === 'climate' ? this._climateItem(id) : id);
          });
        });
      }
      const ipb = g('[data-ip]');
      if (ipb) {
        const v = ipb.getAttribute('data-ip'), tabs0 = this._work(), tab0 = this._curTab(tabs0), sec0 = this._curSec(tab0);
        let cur = '';
        if (v === 'tab') cur = tab0 && tab0.icon;
        else if (v.indexOf('im:') === 0) cur = this._im ? this._im.f[v.slice(3)] : '';
        else { const i = +v.split(':')[1], L = sec0 && sec0.entities; const it = L && L[i]; cur = it && typeof it === 'object' ? it.icon : ''; }
        this._ip = v === 'tab' ? { kind: 'tab', cur: cur } : v.indexOf('im:') === 0 ? { kind: 'im', key: v.slice(3), cur: cur } : { kind: 'item', idx: +v.split(':')[1], cur: cur };
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
        const L = this._lang, titles = { free: '', lights: t(L, 'lights'), scenes: t(L, 'scenes'), climate: tab.area ? upper(L, this._area(tab.area)) : t(L, 'control'), vacuum: upper(L, this._t('t_vacuum')), media: t(L, 'media') };
        const ncol = lpWeights(tab).length;
        const s = { id: id, type: type, title: titles[type], col: tgt ? tgt.col : Math.min(LHD_TYPES[type].col, ncol - 1) };
        if (tgt && tgt.sub) s.sub = tgt.sub;
        s.entities = [];
        // karo sayısı yerin genişliğine göre: geniş kolonda 5, dar sütunda daha az (tablet panosunda 56'lık kolonda 5 karo)
        if (type === 'lights' || type === 'free') { const w = lpWeights(tab), sum = w.reduce((a, b) => a + b, 0), sp = lpSplits(tab, w.length)[s.col] || 1;
          s.tile_columns = Math.max(2, Math.min(5, Math.round(w[s.col] / sum / sp * 9))); }
        this._sec = id;
        return editTab((T) => { T.sections.push(s); });
      }
      const tb = g('[data-tab]');
      if (tb && !this._dragged) { this._tab = tb.getAttribute('data-tab'); this._sec = null; return this._render(); }
      const si = g('.si[data-sec]');
      if (si && !this._dragged && !g('[data-handle]')) { this._sec = si.getAttribute('data-sec'); return this._render(); }
      const sb = g('[data-scr]');
      if (sb) { try { localStorage.setItem('lhd-preview-screen', sb.getAttribute('data-scr')); } catch (x) {} return this._render(); }
      // kolonlar: ekle / son kolonu kaldır (bölümleri bir soldakine geçer) / tablet düzeni / eşit. Toplam oran korunur, bölümler yerinde kalır.
      if (act === 'coladd') return editTab((T) => { const w = lpWeights(T), n = w.length, sum = w.reduce((a, b) => a + b, 0); T.columns = w.map((x) => Math.round(x * n / (n + 1) * 100) / 100).concat([Math.round(sum / (n + 1) * 100) / 100]); if (T.splits) T.splits = lpSplits(T, n + 1);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coldel') return editTab((T) => { const w = lpWeights(T), n = w.length; if (n < 2) return; const sum = w.reduce((a, b) => a + b, 0), keep = w.slice(0, -1), ks = keep.reduce((a, b) => a + b, 0);
        T.columns = keep.map((x) => Math.round(x * sum / ks * 100) / 100); T.sections.forEach((s) => { if ((s.col || 0) > n - 2) { s.col = n - 2; delete s.sub; } });
        if (T.splits) T.splits = lpSplits(T, n - 1); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const spb = g('[data-split]');
      if (spb) { const p = spb.getAttribute('data-split').split(':'), i = +p[0], v = +p[1];
        return editTab((T) => { const sp = lpSplits(T, lpWeights(T).length); sp[i] = v; T.splits = sp; T.sections.forEach((s) => { if ((s.col || 0) === i && (s.sub || 0) > v - 1) { if (v > 1) s.sub = v - 1; else delete s.sub; } }); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); }); }
      const ssb = g('[data-ssub]');
      if (ssb) { const v = +ssb.getAttribute('data-ssub'); return editSec((S) => { if (v) S.sub = v; else delete S.sub; }); }
      if (act === 'coltab') return editTab((T) => { T.columns = LP_DEFAULT_COLS.slice();  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coleq') return editTab((T) => { const w = lpWeights(T), sum = w.reduce((a, b) => a + b, 0); T.columns = w.map(() => Math.round(sum / w.length * 100) / 100);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const sc = g('[data-scol]');
      if (sc) return editSec((S) => { S.col = +sc.getAttribute('data-scol'); delete S.sub; });
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
      if (el.hasAttribute && el.hasAttribute('data-imf')) { if (this._im) { this._im.f[el.getAttribute('data-imf')] = el.value; if (el.tagName === 'SELECT' || (el.type === 'color' && /^(color|color_on|bg)$/.test(el.getAttribute('data-imf')))) this._render(); } return; }
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
      if (sf) { const v = el.type === 'number' ? (parseInt(el.value, 10) || null) : el.value.trim(); return this._setting(sf, v, true); }
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
        let to = from, started = false;
        this._dragged = false;
        const clear = () => items.forEach((x) => x.classList.remove('dropb', 'dropa'));
        const move = (ev) => {
          if (!started && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
          if (!started) { started = true; item.classList.add('dragging'); try { list.setPointerCapture(e.pointerId); } catch (x) {} }
          const pos = horiz ? ev.clientX : ev.clientY;
          to = items.length;
          for (let i = 0; i < items.length; i++) { const r = items[i].getBoundingClientRect(); if (pos < (horiz ? r.left + r.width / 2 : r.top + r.height / 2)) { to = i; break; } }
          clear();
          if (to < items.length) items[to].classList.add('dropb'); else items[items.length - 1].classList.add('dropa');
        };
        const up = () => {
          window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          clear(); item.classList.remove('dragging');
          if (!started) return;
          this._dragged = true; setTimeout(() => { this._dragged = false; }, 0);
          const dest = to > from ? to - 1 : to;
          if (dest === from) return;
          const kind = list.getAttribute('data-dl');
          if (kind === 'tabs') this._edit((T) => lhdMove(T, from, dest));
          if (kind === 'secs') editTab((T) => lhdMove(T.sections, from, dest));
          if (kind === 'items') editSec((S) => lhdMove(S.entities, from, dest));
        };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
    });
  }

  // --- öğe ayarları penceresi: ad, simge, açık/kapalı simgeleri, dokununca / basılı tutunca, düğmenin eylemi, gömülü kart, koşullu görünürlük ---
  // Alanlar taslakta (this._im.f) tutulur; "Kaydet"e basınca öğeye yazılır (YAML hatalıysa pencere açık kalır, hata gösterilir).
  _imOpen(idx, raw, isNew) {
    const tab = this._curTab(this._work()), sec = this._curSec(tab);
    if (!tab || !sec) return;
    const it = typeof raw === 'string' ? { entity: raw } : lhdClone(raw || {});
    const f = { name: it.name || '', icon: it.icon || '', icon_on: it.icon_on || '', icon_off: it.icon_off || '', size: it.size || '', icon_size: it.icon_size || '', text_size: it.text_size || '',
      look: it.look || '', color: it.color || '', color_on: it.color_on || '', bg: it.bg || '', height: it.height ? String(it.height) : '', subtitle: it.subtitle || '',
      swap: !!it.swap, cfm: !!it.confirm, cfmText: typeof it.confirm === 'string' ? it.confirm : '' };
    const tw = it.entity && STORE.data && STORE.data.twins && STORE.data.twins[it.entity];
    f.twin = (tw && tw.backup) || '';
    const s2 = it.secondary || '';
    f.secK = !s2 ? '' : s2 === 'state' || s2 === 'last_changed' ? s2 : s2.indexOf('attr:') === 0 ? 'attr' : 'tpl';
    f.secAttr = f.secK === 'attr' ? s2.slice(5) : ''; f.secTpl = f.secK === 'tpl' ? s2 : '';
    const sc = it.state_colors && typeof it.state_colors === 'object' ? it.state_colors : null;
    f.scOn = !!sc; f.scE = (sc && sc.entity) || '';
    f.scRows = sc && sc.map ? Object.keys(sc.map).map((x) => [x, sc.map[x]]) : [];
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
    else if (k !== 'pet') {
      body += '<div class="row2">' + fld(t('name') + (adv ? hb('tpl') : ''), inp('name', it.entity ? this._ename(it.entity) : this._t('name'))) + '</div>';
      if (k !== 'climate' && k !== 'vacuum' && k !== 'media') body += icf('icon', t('icon'), it.entity ? lpEntIcon(st) : 'mdi:lightbulb-outline');
      if (adv && k === 'value' && LP_VAL_ONOFF.indexOf(d) >= 0) body += '<div class="row2">' + icf('icon_on', t('iconOn'), 'mdi:bluetooth-connect') + icf('icon_off', t('iconOff'), 'mdi:bluetooth-off') + '</div>';
      // görünüm: eylem düğmesi karo/satır, varlık düğme/satır, sayısal değer Halo kartı
      const sg = (key, opts) => '<div class="seg">' + opts.map((o) => '<button data-imseg="' + key + ':' + o[0] + '"' + ((f[key] || '') === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const lks = k === 'scene' ? [['', 'lk_button'], ['tile', 'lk_tile'], ['row', 'lk_row']]
        : k === 'value' ? [['', 'lk_tile'], ['button', 'lk_button'], ['row', 'lk_row']].concat(LP_HALO_DOMAINS.indexOf(d) >= 0 ? [['halo', 'lk_halo']] : [])
          : (k === 'tile' && it.entity) ? [['', 'lk_tile'], ['button', 'lk_button'], ['row', 'lk_row']] : null;
      const lks2 = lks && !adv ? lks.filter((x) => x[0] !== 'halo' || f.look === 'halo') : lks;
      if (lks2) body += fld(t('lookL') + hb('look'), sg('look', lks2 .map((x) => [x[0], this._t(x[1])])));
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
      if (k === 'card') {
        setS('height', f.height);
        ['tap', 'hold'].forEach((pre) => { const v = this._imAct(pre); if (v === undefined) delete it[pre]; else it[pre] = v; });
        let c; try { c = lhdYamlParse(f.card || ''); } catch (e) { throw new Error(e.line ? this._t('yamlErrL', { n: e.line }) : this._t('yamlErr', { e: e.message })); }
        if (!c || typeof c !== 'object' || !c.type) throw new Error(this._t('cardNoType'));
        it.card = c;
      } else if (k !== 'pet' && k !== 'sub') {
        setS('name', f.name);
        if (k !== 'climate' && k !== 'vacuum' && k !== 'media') setS('icon', f.icon);
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
          if (f.scOn && rows.length) { const m = {}; rows.forEach((r) => { m[String(r[0]).trim()] = r[1]; }); it.state_colors = { map: m }; if (String(f.scE || '').trim()) it.state_colors.entity = String(f.scE).trim(); } else delete it.state_colors;
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
