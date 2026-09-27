# Proje kuralları

Bu proje nest-starter'ın web istemcisi ve BFF'idir. İş kuralı, yetki ve
sınırların sahibi Nest'tir; Next onları kopyalamaz, kullanıcıya taşır. Next.js
ile ilgili her iddiayı `node_modules/next/dist/docs/` ve kaynak koddan doğrula.

## Mimari

- `server/` sunucu altyapısıdır, domain bilmez (Nest'teki `core/`). `lib/`
  istemci ile sunucunun ortak dilidir (Nest'teki `common/`). `components/`
  ortak UI'dır. `features/<ad>/` bir Nest modülünün karşılığıdır. `app/`,
  `proxy.ts` ve `instrumentation.ts` bunları birleştirir.
- Bağımlılık yönü `lib ← server ← features ← app` ve `components ← features ←
app`; `.oxlintrc.json` zorlar.
- Bir parça nereye ait?
  - Bir modülün mantığı → o özellik.
  - Domain bilmeyen, yalnızca sunucuda çalışan → `server/`.
  - Domain bilmeyen, istemcinin de kullandığı → `lib/`.
  - UI parçası → `components/`.
  - Bağlamak → `app/`.
- `features/` yalnızca Nest'te karşılığı olan modüller içindir. Domain bilmeyen
  bir mekanizmanın istemci parçası varsa sunucu tarafı `server/`'a, prop alan
  bileşeni `components/`'e gider, `app/` bağlar. Server Action prop olarak
  geçer; `components` `server`'ı import etmez.
- Özelliğin dışa açık yüzeyi:
  - `<ad>.data.ts`, `<ad>.actions.ts`, `<ad>.queries.ts`, `components/`, `use-*.ts`;
  - `<ad>.constants.ts`, `<ad>.messages.ts`, `<ad>.schemas.ts`.

  Gerisi iç iştir. Başka bir özellik yalnızca bu yüzeye bağlanır; döngü
  kurulmaz, kırmanın bedeli küçük bir tekrarsa kabul edilir.

- Nest'in sınırı (uzunluk, tür, rol, boyut) Next'te sabit olarak yazılmaz;
  üretilen zod şemasından okunur ya da Nest'e bırakılır. Nest'in dışarıya
  verdiği adlar (hata kodu, olay, dosya amacı) özellik sabitlerinde birebir
  aynalanır.

## Dosya ve adlandırma

- Dosya adı türü söyler (`*.data.ts`, `*.actions.ts`, `*.schemas.ts`,
  `*.util.ts`, `*.cookie.ts`, `use-*.ts` …). Aynı türden iki ya da daha fazla
  dosya klasörde toplanır, tek dosya üst klasörde kalır; istisna yok. `lib/`
  türe, `server/` mekanizmaya göre gruplanır.
- Özellik klasörü Nest modülünün adını taşır. DAL fonksiyonu Nest'teki
  `operationId`'dir, action'ı `…Action` (`revokeSession` →
  `revokeSessionAction`).
- Şema üretilen `z*` şemasından türer. Tek dosyanınsa o dosyada export
  edilmeden durur, iki ya da daha fazla dosyanınsa `<ad>.schemas.ts`'e çıkar.
- Tip, onu üreten fonksiyonun ya da şemanın yanında durur. Tek üreticisi yoksa
  `<ad>.types.ts`'e, katmanlar arasındaysa `lib/types/`'a gider.
- Dışarıya verilen adlar `<ad>.constants.ts`'te `UPPER_SNAKE` olarak durur.
  Dosyanın iç sabiti o dosyada export edilmeden kalır. Genel birimler (zaman,
  HTTP durumu) `lib/constants/`'tan alınır, çıplak sayı yazılmaz.
- Yalnızca başka bir dosyanın kullandığı ya da dışa açık bir imzada görünen ad
  export edilir.
- Kullanıcıya görünen metinler `*.messages.ts`'tedir: `<AD>_ERROR_MESSAGES`
  (anahtar Nest'in hata kodu), `<AD>_FLASH_MESSAGES`, `…Label()`. Bir ekrana
  özgü başlık ve buton metni bileşende kalır.
- Yol `ROUTE`'tan alınır. Nest'in ürettiği bağlantının hedefi Nest'teki yolla
  aynıdır.
- SDK namespace olarak import edilir (`import * as api from '@/lib/api'`);
  `src/lib/api/` elle değiştirilmez.

## Katmanlar

- DAL (`server-only`) Nest'i çağırır ve veri döner. Nest çağrısının zorunlu
  yerel sonucu da orada olur (Nest oturumu kapattıysa cookie'yi silmek). Form,
  mesaj ve yönlendirme bilmez.
- Action incedir: doğrula, DAL'ı çağır, sonra `refresh()`, `setFlash()` ya da
  `redirect()`.
- Hesaplama ve dönüştürme util'de ya da hook'tadır, bileşende değil.
- Yardımcı fonksiyon şu üçünden birini sağlamalı: iki ya da daha fazla çağrı
  yeri, adının kodun söylemediğini söylemesi, çağıranı tek soyutlama
  seviyesinde tutması.
- Yan yana aynı tipte iki parametre tek nesneye toplanır.

## Veri okuma

- Okuma varsayılan olarak sunucudadır. Tarayıcı ancak veriyi kendisi çekmek
  zorundaysa okur (daha fazla yükle, yazarken arama, periyodik yenileme):
  - query `<ad>.queries.ts`'te durur;
  - ilk veri sunucuda DAL ile yüklenip `HydrationBoundary` ile aktarılır; bu
    `await` `catch`'sizdir, yoksa DAL'ın `redirect`'i yutulur;
  - sonraki istekler `/api/v1` GET vekilinden geçer.
- Tarayıcı Nest'e doğrudan gitmez ve token görmez. Vekil yalnızca `GET`
  iletir, cookie iletmez, `private, no-store` döner.
- Cookie, `headers()` ya da env okuyan her şey `<Suspense>` içindedir. Env
  yalnızca istek sırasında okunur; modül yüklenirken, prerender'da ya da
  `'use cache'` içinde okunmaz, env'e bağlı nesne ilk kullanımda kurulur. Build
  env olmadan da geçmelidir. Kullanıcıya özgü veri yalnızca
  `'use cache: private'` ile önbelleğe girer.
- Cursor sayfalama "daha fazla yükle", offset sayfalama sayfa linkleridir.
  Filtre ve sayfa URL'de durur; `next/form` GET gönderir, `parseSearchParams`
  alanları ayrı doğrular ve geçersiz alanı sorguya koymaz.
- Tarih `APP_TIMEZONE`'da gösterilir ve filtrelenir; sunucu ve tarayıcı aynı
  metni üretmelidir.

## Veri yazma ve geri bildirim

- Her yazma Server Action'dır. Formdan çağrılıyorsa `formAction`, koddan
  çağrılıyorsa `serverAction` (`ActionResult`). Beklenen hata fırlatılmaz,
  sonuç olarak döner.
- Tek butonlu işlem de formdur; hedef kimliği gizli alanla gelir ve doğrulanır.
- `echoFields` geri gönderilecek alanların izin listesidir; şifre ve token
  hiçbir zaman geri gönderilmez.
- Yazmadan sonra önbelleksiz veri `refresh()`, etiketli `'use cache'` verisi
  `updateTag`, TanStack önbelleği `invalidateQueries` ile yenilenir.
- Sayfada kalan action başarıyı form durumundan gösterir, yönlendiren action
  `redirect()`'ten önce `setFlash` çağırır. Ağır sonuçlu işlem onay
  diyaloğundan geçer.
- Tarayıcının doğrulama balonu hiçbir formda görünmez (`noValidate`).
- URL'den girdi alan sayfa değeri `<Suspense>` içinde okur, forma gizli alan
  olarak geçirir; action yeniden doğrular. Değer yoksa form yerine mesaj
  gösterilir.
- Dosya Next'ten geçmez; tarayıcı imzalı URL ile depoya yükler
  (`useFileUpload`). Kayda bağlamak, dosyayı kullanan özelliğin action'ıdır.

## Kimlik doğrulama ve yetki

- Token'lar yalnızca sunucuda, şifreli `__Host-` cookie'de durur; tarayıcıya
  ve loga girmez.
- Token yenileme yalnızca `proxy.ts`'tedir. Server Component cookie yazamaz;
  başka yerde yenilenen token kaydedilemez ve Nest bütün oturumları kapatır.
- Giriş gerektiren çağrı `sessionClient()` ile yapılır (401 → giriş),
  gerektirmeyen `apiClient()` ile.
- Sayfalar varsayılan olarak korumalıdır; açık sayfa `PUBLIC_ROUTES`'a eklenir.
- Özelliği kimin göreceği o özelliğin `<AD>_ROLES` sabitidir. Sayfa veriye
  dokunmadan önce `requireRole(<AD>_ROLES)` çağırır, link `hasRole` ile
  gösterilir. Asıl yetkili Nest'tir.
- İşlemi yapan her zaman oturumdan gelir; formdan ya da URL'den gelen kimlik
  yalnızca hedeftir.

## Güvenlik

- Gizli alan da bind edilmiş argüman da istemcinin değiştirebileceği değerdir;
  şemayla doğrulanır. Dönüş adresi yalnızca `internalPath()`'ten geçer.
- Güvenlik başlıkları ve CSP `proxy.ts`'tedir, çünkü CSP env'e bağlıdır. Yeni
  bir dış köken env'e ve CSP'nin ilgili direktifine eklenir.
- `script-src 'unsafe-inline'` bilinçlidir: nonce PPR ile çalışmaz, SRI Next'in
  inline RSC verisini kapsamaz. Katı CSP isteyen proje `cacheComponents`'ı
  kapatıp proxy'de nonce üretir.
- `dangerouslySetInnerHTML` yalnızca kullanıcı verisi içermeyen sabit script
  için kullanılır.
- `__Host-` cookie'ler `HOST_COOKIE_OPTIONS`'ı kullanır; hiçbir ortamda
  gevşetilmez.

## Hata yönetimi ve loglama

- Nest hatası `ApiError`'a çevrilir. Metin koda göre seçilir: özelliğin
  mesajları, ortak mesajlar, genel metin. Nest'in kendi mesajı gösterilmez.
- Yeni bir Nest hata kodu özelliğin sabitlerine ve mesajlarına birer satır
  olarak eklenir.
- İstemcide bilinmeyen hata `errorMessageOf` ile metne çevrilir.
- Log `await requestLogger()` ile yazılır, her satır `requestId` taşır; aynı id
  Nest'e gider. Hata `log.error({ err }, 'mesaj')`.

## Tuzaklar

- **Route handler proxy'nin yazdığı cookie'yi görmez.** Yenilenen oturum
  isteğin `cookie` başlığına da yazılmalıdır.
- **Client component'in render ettiği inline `<script>` çalışmaz** (React 19).
- **`next.config`'teki `headers()` build'de sabitlenir.** Env'e bağlı başlık
  orada tanımlanmaz.
- **PPR'da `notFound()` durum kodunu değiştiremez** (200 + `noindex`), ve
  JavaScript'siz form gönderimi action durumunu kaybeder.
- **`instrumentation.ts` Edge için de derlenir.** `node:*` kullanan modül yalnızca
  `nodejs` dalında dinamik import edilir.
- **typedRoutes `redirect()`'i de tipler.** Değişken hedef `as Route` ile
  verilir.
- **Nest'te sözleşme değişince** `pnpm api:generate` çalıştırılmadan derleme
  eski tiplerle geçer.
