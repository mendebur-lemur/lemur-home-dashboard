// Yönetim panelindeki ? yardım pencereleri: [başlık, paragraflar...]. **kalın** yazılabilir. tr ve en.
// Her biri: ne işe yarar, nasıl ayarlanır, bir örnek.
const LHD_HELP = {
  mode: {
    tr: ['Basit ve Gelişmiş mod', 'Basit modda yalnız temel ayarlar görünür: sekme, bölüm, cihaz ekleme, ad, simge, görünüm ve dokununca ne olacağı.',
      'Gelişmiş modda boyutlar, renkler, koşullu görünürlük, özel eylemler, kartlar ve bölüm yerleşimi de açılır.',
      'Mod değişince hiçbir ayar silinmez: basit modda gizlenen ayarlar panoda çalışmaya devam eder. Seçim bu tarayıcıda hatırlanır.'],
    en: ['Simple and Advanced mode', 'Simple mode shows only the basics: tabs, sections, adding devices, name, icon, look and what a tap does.',
      'Advanced mode also opens sizes, colours, conditional visibility, custom actions, cards and section layout.',
      'Switching never deletes anything: settings hidden in simple mode keep working on the dashboard. The choice is remembered in this browser.'] },
  look: {
    tr: ['Görünüm', 'Öğenin panoda hangi şekilde çizileceği.', '**Karo**: kare kutu, ışıkların yanında. **Düğme**: yatay düğme (senaryolar gibi), adın altında durum. **Satır**: ince, tek satır; simge, ad ve değer, kutuya yan yana üç tane sığar. **Halo**: sayısal değer Halo sensör kartı olarak (gelişmiş).',
      'Örnek: Bluetooth bağlantı sensörlerini "Satır" yap, ışık kutusunun altında ince satırlar olarak dursunlar.'],
    en: ['Look', 'How the item is drawn on the dashboard.', '**Tile**: a square next to the lights. **Button**: a wide button (like scenes) with the state under the name. **Row**: a thin single line with icon, name and value; three fit side by side. **Halo**: a numeric value as a Halo sensor card (advanced).',
      'Example: make the Bluetooth connection sensors "Row" so they sit as thin lines under the lights.'] },
  size: {
    tr: ['Boyut', 'Karonun ızgarada kaç hücre kapladığı: 1×1 (normal), 2×1 (iki geniş), 1×2 (iki uzun), 2×2 ya da Satır boyu.', 'Geniş tek satırlık karoda simge ve yazı yan yana dizilir. Diğer karolar boşlukları kendiliğinden doldurur.',
      'Simge boyutu ve Yazı boyutu: Otomatik bugünkü ölçüdür; Küçük, Orta, Büyük.'],
    en: ['Size', 'How many cells the tile takes in the grid: 1×1 (normal), 2×1 (wide), 1×2 (tall), 2×2 or Full row.', 'A wide one-row tile puts icon and text side by side. Other tiles fill the gaps by themselves.',
      'Icon size and Text size: Auto is today\'s size; Small, Medium, Large.'] },
  colors: {
    tr: ['Renkler', '**Simge**: simgenin rengi; verilince simge tek renk çizilir. **Açıkken**: cihaz açıkken çerçeve ve simge rengi. **Arka plan**: karoya hafif renk tonu.', 'Yuvarlaklar Halo kartlarının renkleridir (yeşil, mavi, açık mavi, sarı, turuncu, kırmızı, mor, gri); en sağdaki kutudan istediğin rengi seçebilirsin. "Yok" rengi kaldırır.',
      'Halo görünümünde tek bir "Sabit renk" vardır: kartın halesi hep o renkte olur.'],
    en: ['Colours', '**Icon**: the icon colour; the icon is then drawn in one colour. **When on**: frame and icon colour while the device is on. **Background**: a light tint on the tile.', 'The dots are the Halo card colours (green, blue, light blue, yellow, orange, red, purple, grey); the box on the right picks any colour. "None" removes it.',
      'The Halo look has a single "Fixed colour": the card\'s halo always takes it.'] },
  zones: {
    tr: ['Değere göre renk', 'Sayısal bir değeri 4 sınırla 5 bölgeye ayırır; her bölgenin rengi var. Değer bir sınıra eşit ya da büyükse bir sonraki renge geçer.', 'Çerçeve, değer yazısı ve simge o bölgenin renginde olur.',
      'Örnek, akvaryum suyu: 22 / 24 / 28 / 30 sınırları ve açık mavi, mavi, yeşil, sarı, kırmızı renkleri. 26,8 °C yeşil, 31 °C kırmızı görünür.'],
    en: ['Colour by value', 'Splits a numeric value into 5 zones with 4 limits; each zone has a colour. When the value reaches a limit it moves to the next colour.', 'The frame, the value text and the icon take the zone\'s colour.',
      'Example, aquarium water: limits 22 / 24 / 28 / 30 with light blue, blue, green, yellow, red. 26.8 °C shows green, 31 °C red.'] },
  statecol: {
    tr: ['Duruma göre renk', 'Bir varlığın durumunu (yazısını) renge eşler. Metin değerlerde de çalışır, sayı gerekmez.', 'Varlık boşsa öğenin kendi varlığı kullanılır. Başka bir varlık da seçilebilir: kart bir şeyi gösterirken rengi başka bir sensörden alabilir.',
      'Örnek, yem kartı: Varlık sensor.balik_yem_durumu; aktif → yeşil, yem → sarı, uyari → turuncu, acil → kırmızı. Durum değişince kartın rengi de değişir.'],
    en: ['Colour by state', 'Maps an entity\'s state (its text) to a colour. Works for text values too, no number needed.', 'With the entity empty, the item\'s own entity is used. Another entity can be chosen: a card can show one thing and take its colour from another sensor.',
      'Example, feeding card: entity sensor.feeding_status; active → green, due → yellow, warning → orange, urgent → red. When the state changes, the card\'s colour follows.'] },
  visible: {
    tr: ['Sadece şu durumda göster', 'Öğe yalnız seçilen varlık belirli bir durumdayken görünür. Koşul sağlanmazsa panoda hiç çizilmez, yerinde boşluk kalmaz; yönetim panelinin önizlemesinde soluk görünür.',
      '**şuna eşitse**: tek durum. **şunlardan biriyse**: virgülle birkaç durum. **şunlar değilse**: bu durumlarda gizli.',
      'Örnek: aynı yem göstergesini dört kez ekle, her birini sensor.balik_yem_durumu = aktif / yem / uyari / acil durumunda göster; her an yalnız biri görünür.'],
    en: ['Only show when', 'The item shows only while the chosen entity is in a given state. Otherwise it is not drawn at all and leaves no gap; it shows faded in the admin preview.',
      '**equals**: one state. **is one of**: several states, comma separated. **is none of**: hidden in these states.',
      'Example: add the same feeding gauge four times and show each when sensor.feeding_status = active / due / warning / urgent; only one is visible at a time.'] },
  actions: {
    tr: ['Dokununca / Basılı tutunca', '**Varsayılan**: öğenin türüne göre (ışıkta aç/kapat, değerde cihaz penceresi). **Cihaz penceresi**, **Aç / kapat**, **Hiçbir şey** temel seçeneklerdir.',
      '**Servis çalıştır** (gelişmiş): ör. Servis timer.start, Hedef timer.balik_besleme. İstenirse Veri kutusuna YAML (duration: "00:10:00").',
      '**Pencerede kart aç** (gelişmiş): bir Home Assistant kartını panonun kendi penceresinde açar. **Gelişmiş (YAML)**: Home Assistant\'ın eylem biçimi aynen yazılır.'],
    en: ['On tap / On hold', '**Default**: by the item\'s kind (toggle for a light, more info for a value). **More info**, **Toggle**, **Nothing** are the basic choices.',
      '**Call a service** (advanced): e.g. Service timer.start, Target timer.fish_feeding. Optional YAML in Data (duration: "00:10:00").',
      '**Open a card in a window** (advanced): opens a Home Assistant card in the dashboard\'s own window. **Advanced (YAML)**: Home Assistant\'s action format as is.'] },
  popup: {
    tr: ['Pencerede kart aç', 'Düğmeye ya da karoya dokununca bir Home Assistant kartı, ışık penceresi gibi panonun kendi penceresinde açılır. Dışarı dokunmak, X ya da geri tuşu kapatır.',
      'Pencere başlığı ve kartın YAML\'ı yazılır. Kurulu özel kartlar da olur.', 'Örnek: Başlık "Akvaryum ışık programı", Kart: type: custom:akvaryum-program-card'],
    en: ['Open a card in a window', 'Tapping the button or tile opens a Home Assistant card in the dashboard\'s own window, like the light window. Tap outside, X or the back button closes it.',
      'Write the window title and the card\'s YAML. Installed custom cards work too.', 'Example: title "Aquarium light schedule", card: type: custom:aquarium-schedule-card'] },
  card: {
    tr: ['Kart (YAML)', 'Bölüme herhangi bir Home Assistant kartı eklenir: markdown, grafik, kurulu özel kartlar. Kartın YAML\'ı, Home Assistant\'ın kart düzenleyicisindeki "Kod düzenleyici" ile aynıdır.',
      'Kart yüklenemezse yerinde kısa bir uyarı çıkar, pano bozulmaz. Gelişmiş modda kartın yüksekliği ve dokununca ne olacağı da verilebilir.',
      'Örnek:\ntype: markdown\ncontent: "**Akvaryum** · Program: Gündüz"'],
    en: ['Card (YAML)', 'Adds any Home Assistant card to the section: markdown, graphs, installed custom cards. The YAML is the same as Home Assistant\'s card editor "Code editor".',
      'If the card can\'t load, a short warning shows in its place and the dashboard keeps working. In advanced mode you can also set its height and what a tap does.',
      'Example:\ntype: markdown\ncontent: "**Aquarium** · Schedule: Day"'] },
  halo: {
    tr: ['Halo görünümü', 'Sayısal bir değer (sensör, sayı) Halo sensör kartı olarak çizilir: solda simge, arkasında değere göre renk alan hale.',
      'Yükseklik: 1, 1,5 ya da 2 satır. Bölüm "Kutuyu doldur" ise kartlar kolona eşit yayılır. Simge ve yazı boyutu da büyütülebilir.',
      'Renk: Halo kendi bölgelerini kullanır (sıcaklık, nem, CO₂...). Sabit renk ya da Duruma göre renk verilirse hale o renkte olur.'],
    en: ['Halo look', 'A numeric value (sensor, number) is drawn as a Halo sensor card: the icon on the left with a halo coloured by the value.',
      'Height: 1, 1.5 or 2 rows. With the section set to "Fill the box", the cards share the column evenly. Icon and text can be made larger too.',
      'Colour: Halo uses its own zones (temperature, humidity, CO₂...). With a fixed colour or colour by state, the halo takes that colour.'] },
  pet: {
    tr: ['Besleme kartı', 'Evcil hayvan için besleme hatırlatıcısı. Zamanında yeşil, yaklaşınca sarı, zamanı gelince turuncu, gecikince kırmızı ve yanıp söner.',
      '**Her N saatte bir**: son beslemeden N saat sonra. **Günün belli saatlerinde**: ör. 08:00, 20:00; sıradaki saatten en çok "yaklaşıyor" süresi kadar önce verilen yem o saati karşılar.',
      'Karta dokununca "Besledim" kaydedilir (10 sn içinde yeniden dokununca geri alınır), basılı tutunca son beslemeler açılır. Home Assistant\'ta her hayvan için bir besleme durumu ve "besledim" düğmesi oluşur; otomasyonda, sesli asistanda ya da NFC etiketinde kullanılabilir.'],
    en: ['Feeding card', 'A feeding reminder for a pet. Green on time, yellow when due soon, orange when due, red and blinking when late.',
      '**Every N hours**: N hours after the last feeding. **At set times of day**: e.g. 08:00, 20:00; food given up to the "soon" time before the next slot covers that slot.',
      'Tap the card to record "Fed" (tap again within 10 s to undo), hold for recent feedings. Home Assistant gets a feeding status and a "fed" button for every pet, usable in automations, voice assistants or NFC tags.'] },
  fill: {
    tr: ['Doldurma, hizalama, aralık', '**İçeriğe göre**: öğeler kendi boylarında, kutunun üstünden başlar. **Kutuyu doldur**: düğmeler, karolar ve kartlar kutunun yüksekliğine eşit dağılır.',
      '**Hizalama** (içeriğe göre olan kutuda): Üst, Orta ya da Eşit dağıt. Başlık hep üstte kalır.', '**Aralık**: öğeler arasındaki boşluk (0-24 px). Otomatik: bugünkü (doldururken 12 px).'],
    en: ['Fill, alignment, spacing', '**Fit content**: items keep their size from the top of the box. **Fill the box**: buttons, tiles and cards share the box height evenly.',
      '**Alignment** (for fit content): Top, Middle or Spread evenly. The title always stays on top.', '**Spacing**: the gap between items (0-24 px). Auto: as before (12 px when filling).'] },
  tpl: {
    tr: ['Şablon metin ve ikinci satır', 'Ad ya da ikinci satır Home Assistant şablonu olabilir: {{ ... }} ve {% ... %}. Home Assistant hesaplar, değer değişince yazı kendiliğinden güncellenir.',
      '**İkinci satır**: Durum (cihazın durumu, birimiyle), Son değişim ("5 dk önce"), Öznitelik (ör. brightness, battery) ya da Şablon.',
      "Örnekler: {{ states('sensor.esp_wifi') }} dBm  ·  {% if is_state('binary_sensor.sol_baglanti', 'on') %}Bağlı{% else %}Bağlantı yok{% endif %}  ·  Çevrimiçi · {{ states('sensor.esp_wifi') }} dBm"],
    en: ['Template text and second line', "The name or the second line can be a Home Assistant template: {{ ... }} and {% ... %}. Home Assistant renders it and the text updates by itself.",
      '**Second line**: State (with unit), Last changed ("5 min ago"), Attribute (e.g. brightness, battery) or Template.',
      "Examples: {{ states('sensor.esp_wifi') }} dBm  ·  {% if is_state('binary_sensor.left_link', 'on') %}Connected{% else %}No connection{% endif %}  ·  Online · {{ states('sensor.esp_wifi') }} dBm"] },
  splits: {
    tr: ['Kolon içi sütun', 'Bir kolonu eşit genişlikte 2 ya da 3 sütuna böler; her bölüm hangi sütunda duracağını kendi ayarından seçer.', 'Örnek: orta kolonda yan yana iki senaryo bölümü. Kolon çok darsa bölünmez, önce kolon sayısını azalt.'],
    en: ['Sub-columns', 'Splits a column into 2 or 3 equal sub-columns; each section picks its sub-column in its own settings.', 'Example: two scene sections side by side in the middle column. A column that is too narrow can\'t be split; reduce the number of columns first.'] }
};
// Öğede basit modda görünmeyen bir ayar var mı (rozet ve uyarı için)
function lhdItemAdv(it) {
  if (!it || typeof it !== 'object') return false;
  const keys = ['size', 'icon_size', 'text_size', 'color_on', 'bg', 'zones', 'state_colors', 'visible', 'height', 'hold', 'icon_on', 'icon_off', 'card', 'subtitle'];
  for (let i = 0; i < keys.length; i++) if (Object.prototype.hasOwnProperty.call(it, keys[i])) return true;
  if (it.entity && it.color) return true;
  if (it.look === 'halo') return true;
  const basic = (a) => a === undefined || a === null || a === 'more-info' || a === 'toggle' || a === 'none';
  if (!basic(it.tap)) return true;
  if (!it.entity && it.action && (it.action.popup || it.action.action || it.action.perform_action)) return true;
  return false;
}
