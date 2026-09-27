# Next.js Starter

[nest-starter](https://github.com/berkaydenizyilmaz/nest-starter) için hazırlanmış web istemcisi ve BFF (backend
for frontend). Tarayıcı Nest'le hiç doğrudan konuşmaz: token'lar şifreli bir
cookie'de sunucuda durur, okumalar ve yazmalar Next sunucusundan geçer. Giriş,
oturumlar, şifre akışları, profil, hesap silme, avatar yükleme, güvenlik
günlüğü ve admin denetim kaydı hazır gelir; Nest'teki her endpoint'in bir
karşılığı vardır. Sen yalnızca kendi özelliklerini eklersin.

**Next.js 16** (App Router, Cache Components / PPR, typed routes) ·
**React 19** + React Compiler · **TypeScript** · **Zod 4** ·
**Hey API** (üretilen SDK) · **TanStack Query 5** · **iron-session** ·
**Tailwind 4** + **shadcn** (Base UI) · **pino** · **oxlint**

## İçindekiler

- [Hızlı başlangıç](#hızlı-başlangıç)
- [Proje yapısı](#proje-yapısı)
- [Yeni özellik eklemek](#yeni-özellik-eklemek)
- [Nest ile sözleşme](#nest-ile-sözleşme)
- [Veri okuma](#veri-okuma)
- [Veri yazma ve geri bildirim](#veri-yazma-ve-geri-bildirim)
- [Kimlik doğrulama ve oturumlar](#kimlik-doğrulama-ve-oturumlar)
- [Dosya yükleme](#dosya-yükleme)
- [Güvenlik başlıkları ve CSP](#güvenlik-başlıkları-ve-csp)
- [Loglama ve istek bağlamı](#loglama-ve-istek-bağlamı)
- [Yapılandırma](#yapılandırma)
- [Komutlar](#komutlar)
- [Kapsam dışı](#kapsam-dışı)
- [Bilinen tuzaklar](#bilinen-tuzaklar)

## Hızlı başlangıç

**Gerekenler:** Node.js **24 LTS**, pnpm ve `http://localhost:3000`'de çalışan
bir [nest-starter](https://github.com/berkaydenizyilmaz/nest-starter).

İki repo aynı klasörün içinde yan yana durmalı. `pnpm api:generate` Nest'in
spec'ini varsayılan olarak `../nest-starter/openapi.json` yolundan okur:

```
projeler/
├── nest-starter/
└── next-starter/
```

Nest'i onun [README'sindeki](https://github.com/berkaydenizyilmaz/nest-starter#hızlı-başlangıç)
adımlarla ayağa kaldır, sonra:

```bash
cd next-starter
pnpm install
cp .env.example .env.local
openssl rand -base64 32       # çıktıyı .env.local'daki SESSION_SECRET'a yaz
                              # STORAGE_PUBLIC_ORIGIN ve STORAGE_UPLOAD_ORIGIN'i doldur

pnpm dev
```

Uygulama `http://localhost:3001` adresinde açılır.

Nest tarafında üç ayar bu adrese göre olmalı:

- `APP_URL=http://localhost:3001`: şifre sıfırlama mailindeki bağlantı buraya
  gider.
- `CORS_ORIGINS=http://localhost:3001`.
- Private bucket'ın CORS kuralı `http://localhost:3001` için `PUT`'a izin
  vermeli. Tarayıcı dosyayı depoya doğrudan yükler; kural yoksa avatar
  yüklemesi "Dosya gönderilemedi" der.

İlk admin Nest'te veritabanından atanır (bkz.
[nest-starter: Hızlı başlangıç](https://github.com/berkaydenizyilmaz/nest-starter#hızlı-başlangıç)). Rolü
`ADMIN` olan kullanıcı header'da "Yönetim" linkini görür.

## Proje yapısı

```
src/
├── proxy.ts          Her istekte: request id, token yenileme, sayfa koruması, güvenlik başlıkları
├── instrumentation.ts Açılışta env doğrulaması, yakalanmayan hataların loglanması
├── app/              Rotalar ve layout'lar; özellikleri birleştirir
│   ├── (app)/            Giriş gerektiren sayfalar (hesap, admin)
│   ├── (auth)/           Giriş, kayıt, şifremi unuttum, şifre sıfırlama
│   └── api/v1/[...path]/ Tarayıcı okumaları için Nest'e GET vekili
├── server/           Sunucu altyapısı; domain bilmez (Nest'teki core/)
│   ├── api.client.ts     Nest istemcisi, zaman aşımı, başlık aktarımı, GET vekili
│   ├── action/           formAction ve serverAction sarmalayıcıları
│   ├── flash/            Yönlendirme sonrası bildirim cookie'si
│   ├── env.ts · logger.ts · request-context.ts · security-headers.ts · host-cookie.ts
├── lib/              İstemci ve sunucunun ortak dili (Nest'teki common/)
│   ├── api/              Nest'in OpenAPI spec'inden üretilen SDK ve zod şemaları
│   ├── clients/          Tarayıcı API istemcisi ve TanStack QueryClient
│   ├── constants/ · messages/ · types/ · utils/
│   └── api.error.ts      ApiError ve hata sınıflandırması
├── components/       Ortak UI: shadcn bileşenleri (ui/), form parçaları, tema
└── features/         Nest modüllerinin karşılıkları
    ├── auth/             Oturum cookie'si, proxy adımı, giriş/kayıt/şifre, oturumlar, rol kapısı
    ├── user/             Profil, avatar, hesap silme, güvenlik günlüğü
    ├── file/             Doğrudan depoya yükleme (useFileUpload)
    └── audit-log/        Admin denetim kaydı, URL filtreleri
```

**Bağımlılık yönü:** `lib ← server ← features ← app` ve `components ← features
← app`. `lib` hiçbir katmanı bilmez, `server` özellikleri bilmez, `components`
sunucu kodunu ve özellikleri bilmez. Kurallar `.oxlintrc.json`'da
`no-restricted-imports` ile zorlanır; ihlal `pnpm lint`'te hata verir.

**Bir özelliğin içi** (`features/<ad>/`):

| Dosya                                                | Görevi                                                     | Dışa açık |
| ---------------------------------------------------- | ---------------------------------------------------------- | --------- |
| `<ad>.data.ts`                                       | Sunucu okuma ve yazmaları (DAL), Nest'teki servis          | ✓         |
| `<ad>.actions.ts`                                    | İnce Server Action'lar, adları `…Action`                   | ✓         |
| `<ad>.queries.ts`                                    | Tarayıcıdan yapılan okumalar için TanStack query tanımları | ✓         |
| `components/`                                        | Özelliğin UI'ı                                             | ✓         |
| `use-*.ts`                                           | İstemci hook'ları                                          | ✓         |
| `<ad>.constants.ts` · `<ad>.messages.ts`             | Hata kodları, adlar, Türkçe metinler                       | ✓         |
| diğerleri (`*.util.ts`, `*.cookie.ts`, `*.proxy.ts`) | Özelliğin iç işi                                           |           |

Bir özellik başka bir özelliğe yalnızca dışa açık dosyaları üzerinden
bağlanır.

**Bir sayfa isteğinin yolculuğu:**

1. `proxy.ts` istek id'sini üretir ya da devralır.
2. Oturum cookie'si açılır. Access token bir dakika içinde bitecekse Nest'ten
   yenilenir ve yeni cookie hem tarayıcıya hem bu isteğin geri kalanına
   yazılır.
3. Korumalı bir sayfada oturum yoksa `/login?next=…` adresine yönlendirilir.
4. Güvenlik başlıkları ve CSP eklenir.
5. Sayfanın statik kabuğu hemen gider (PPR). Kullanıcıya bağlı bölümler
   `<Suspense>` içinde sunucuda DAL'ı çağırır ve akışla gelir.
6. Nest hata dönerse `ApiError`'a çevrilir. 401 oturumu bitirir ve girişe
   gönderir, diğer hatalar `error.tsx`'e düşer ya da action'dan Türkçe mesaj
   olarak döner.

## Yeni özellik eklemek

Yeni bir Nest modülünün sayfalarını eklerken sıra şöyle:

1. Nest'te endpoint'leri yaz, `pnpm openapi:export` ile spec'i güncelle.
   Burada `pnpm api:generate` çalıştır.
2. `src/features/<ad>/` aç. Nest modülünün hata kodlarını `<ad>.constants.ts`'e,
   Türkçe karşılıklarını `<ad>.messages.ts`'e yaz.
3. `<ad>.data.ts`: her endpoint için bir fonksiyon. Adı Nest'teki
   `operationId`; istemci giriş gerektiriyorsa `sessionClient()`, gerektirmiyorsa
   `apiClient()`.
4. Okuma sayfası: sunucu bileşeni DAL'ı çağırır ve render eder. Tarayıcının
   kendisi veri çekmesi gerekiyorsa (daha fazla yükle, yazarken arama) query
   tanımını `<ad>.queries.ts`'e koy (bkz. [Veri okuma](#veri-okuma)).
5. Yazma: form ise `formAction`, koddan çağrılıyorsa `serverAction`. Şema
   üretilen zod şemasından türer (`zCreateXRequest`).
6. Rotayı `lib/constants/route.constants.ts`'teki `ROUTE`'a ekle. Giriş
   gerektirmeyecekse `PUBLIC_ROUTES`'a da ekle.
7. Sayfayı `app/` altında kur. Kullanıcıya bağlı her şey bir `<Suspense>`
   içinde olmalı. Rol gerekiyorsa özelliğin sabitlerine `<AD>_ROLES` yaz,
   sayfada `requireRole(<AD>_ROLES)`, linklerde `hasRole(user, <AD>_ROLES)`
   kullan.

## Nest ile sözleşme

`src/lib/api/`, Nest'in `openapi.json`'ından üretilir ve repoda tutulur; elle
değiştirilmez. `pnpm api:generate` varsayılan olarak `../nest-starter/openapi.json`'ı
okur (`OPENAPI_INPUT` ile değiştirilebilir) ve şunları üretir:

- Tipler (`api.Me`, `api.Session` …) ve her endpoint için bir SDK fonksiyonu
  (`api.getMe`, `api.listSessions` …).
- Her şema için bir zod şeması (`zLoginRequest`, `zListAuditLogsQuery` …).
  Form ve URL şemaları bunlardan türer; sınırlar ve kurallar iki yerde yazılmaz.

SDK her zaman namespace olarak import edilir: `import * as api from '@/lib/api'`.

Nest'in hata cevabı `ApiError`'a çevrilir (`code`, `status`, alan hataları,
`retryAfterSeconds`). Kullanıcıya gösterilen metin koda göre seçilir: önce
özelliğin mesajları, sonra ortak mesajlar (`lib/messages/error.messages.ts`),
yoksa genel bir metin. 429'da "N saniye sonra tekrar deneyebilirsin" eklenir.
Nest'in kendi mesajları İngilizce ve geliştiriciye yöneliktir, kullanıcıya
gösterilmez.

## Veri okuma

- **Varsayılan: sunucu.** Sunucu bileşeni DAL'ı çağırır, sonucu render eder.
  Sayfa, profil, oturumlar ve admin denetim kaydı böyle.
- **Tarayıcının veri çekmesi gerekiyorsa: TanStack Query.** Güvenlik
  günlüğündeki "daha fazla yükle" böyle. İlk sayfa sunucuda yüklenip
  `HydrationBoundary` ile aktarılır, sonraki sayfalar tarayıcıdan
  `/api/v1/...`'e gider.
  - `app/api/v1/[...path]/route.ts` yalnızca `GET` kabul eden bir vekildir.
    Oturum varsa access token ekler, yoksa isteği anonim iletir.
  - Tarayıcının cookie'leri Nest'e hiç gitmez. Cevap `private, no-store`
    döner.
  - Tarayıcıda 401 gelirse kullanıcı girişe yönlendirilir.
- **Listeler:**
  - Cursor sayfalama → "daha fazla yükle" (TanStack).
  - Offset sayfalama → sayfa linkleri (`components/pagination-nav.tsx`).
- **Filtreler URL'de durur.** `next/form` ile GET formu kurulur,
  `parseSearchParams(schema, searchParams)` her alanı ayrı doğrular. Geçersiz
  bir alan sorguya girmez ve formda Türkçe hata olarak görünür. Tarihler URL'de
  `YYYY-MM-DD` olarak tutulur, Nest'e `APP_TIMEZONE`'da günün başı ve sonu
  olarak gider.
- Tarihler her yerde `formatDateTime` ile `Europe/Istanbul` saatinde gösterilir;
  sunucu ve tarayıcı aynı çıktıyı üretir.

## Veri yazma ve geri bildirim

Bütün yazmalar Server Action'dır, tarayıcı Nest'e yazmaz.

- **`formAction`** (`server/action/form-action.ts`), formlar için:
  1. FormData'yı şemayla doğrular; Türkçe alan hataları döner.
  2. Handler'ı çalıştırır.
  3. Nest'in 422'sindeki alan hatalarını ilgili alana yerleştirir.

  `useActionState` ile kullanılır. JavaScript kapalıyken de çalışır. Tek
  butonlu işlemler de gizli alanlı bir formdur (ör. oturumu kapat).

- **`serverAction`** (`server/action/server-action.ts`), koddan çağrılan
  action'lar için. Tipli girdiyi doğrular ve `ActionResult` döner:
  `{ ok, data }` ya da `{ ok: false, code, message, retryable }`. Beklenen
  hatalar fırlatılmaz, sonuç olarak döner.
- **Yazma sonrası:** Sayfadaki veriyi yenilemek için action içinde `refresh()`
  çağrılır.
- **Geri bildirim:**
  - Sayfada kalan action başarıyı form durumundan gösterir
    (`<FormAlert variant="default">`).
  - Yönlendiren action `redirect()`'ten önce `setFlash({ kind, message })`
    çağırır. Mesaj hedef sayfada toast olarak çıkar, sonra silinir.
- Tehlikeli işlemler (hesap silme) onay diyaloğundan geçer.
- Tarayıcının kendi doğrulama balonları hiç çıkmaz: formlar `noValidate` ile
  kurulur, hatalar sayfada gösterilir.

## Kimlik doğrulama ve oturumlar

- **Cookie:** Nest'in token çifti iron-session ile şifrelenip
  `__Host-session` cookie'sinde tutulur (`HttpOnly`, `Secure`, `SameSite=Lax`).
  Ömrü refresh token'ınki kadardır.
- **Token yenileme yalnızca `proxy.ts`'te yapılır.** Server Component cookie
  yazamaz; orada yenileme yapılırsa yeni token kaydedilemez ve Nest'in yeniden
  kullanım tespiti bütün oturumları kapatır.
  - Aynı refresh token için eşzamanlı istekler tek bir yenilemeyi paylaşır.
  - Yeni cookie, route handler'lara da iletilecek şekilde isteğin `cookie`
    başlığına yazılır (`applySessionCookie`).
- **Giriş gerektiren Nest çağrıları** `sessionClient()` ile yapılır. Nest 401
  dönerse kullanıcı girişe gönderilir.
- **Kullanıcı bilgisi:** `getCurrentUser()` ve `getCurrentUserOrNull()`
  (`'use cache: private'`, istek başına bir kez) rolü her istekte Nest'ten taze
  okur.
- **Sayfa koruması:** Sayfalar varsayılan olarak korumalıdır. Açık sayfalar
  `PUBLIC_ROUTES`'tadır. Girişli kullanıcı `/login` ve `/register`'dan ana
  sayfaya yönlendirilir; şifre sıfırlama sayfaları girişliyken de açılır.
- **Rol kapısı:** `requireRole(roles)` uymayan kullanıcıya `notFound()`
  gösterir. Asıl yetkili Nest'tir; Next yalnızca sayfayı hiç göstermez.
- **Hesabın yeniden açılması:** Silinmiş hesap geri alma süresi içinde giriş
  yaparsa hesap açılır ve bir bildirim görünür.

## Dosya yükleme

Dosya Next'ten de Nest'ten de geçmez; tarayıcı imzalı URL ile doğrudan depoya
`PUT` eder. Akış `features/file/use-file-upload.ts`'te:

1. `createUploadAction`: Nest tür, rol ve boyutu denetleyip bir yükleme bileti
   döner.
2. `putToStorage`: Dosya depoya gönderilir. `412` "zaten yüklendi" demektir ve
   akış devam eder.
3. `completeUploadAction`: Nest dosyayı doğrular ve işler.
4. `onUploaded`: Dosyayı kayda bağlayan, özelliğin kendi action'ı (ör.
   `updateMyAvatarAction`).

`503` gibi tekrarlanabilir bir hatada `retry()` akışı 3. adımdan sürdürür,
dosya yeniden yüklenmez. Kullanımı:

```ts
const { upload, retry, isPending, error, canRetry } = useFileUpload({
  purpose: USER_FILE_PURPOSE.USER_AVATAR,
  onUploaded: (file) => updateMyAvatarAction({ fileId: file.id }),
});
```

`purpose` adı ve `<input accept>` türleri Nest'teki tanımın kopyasıdır; tür ve
boyut denetiminin sahibi Nest'tir. Görseller Nest'in ürettiği WebP
varyantlarıyla, `next/image` olmadan gösterilir.

## Güvenlik başlıkları ve CSP

Başlıklar `proxy.ts`'te eklenir (`server/security-headers.ts`). CSP depolama
adreslerini env'den aldığı için `next.config`'te tanımlanamaz: orada tanımlanan
başlıklar build sırasında sabitlenir.

| Başlık                                                        | Değer                                            |
| ------------------------------------------------------------- | ------------------------------------------------ |
| `Content-Security-Policy`                                     | aşağıda                                          |
| `Strict-Transport-Security`                                   | 2 yıl, `includeSubDomains` (yalnızca production) |
| `X-Content-Type-Options`                                      | `nosniff`                                        |
| `Referrer-Policy`                                             | `strict-origin-when-cross-origin`                |
| `X-Frame-Options`                                             | `DENY`                                           |
| `Permissions-Policy`                                          | kamera, mikrofon ve konum kapalı                 |
| `Cross-Origin-Opener-Policy` · `Cross-Origin-Resource-Policy` | `same-origin`                                    |

CSP'nin öne çıkan kuralları:

- `img-src` public depolama adresine, `connect-src` yükleme adresine izin
  verir.
- `form-action 'self'`, `frame-ancestors 'none'`, `object-src 'none'`.
- `'unsafe-eval'` yalnızca geliştirmede; React hata ayıklamada kullanıyor.

**Bilinçli ödünleşim:** `script-src 'self' 'unsafe-inline'`. Next, sayfaya
gömdüğü RSC verisini inline script olarak basıyor. Bu script'lere izin
vermenin katı yolları şunlar, ikisi de bizim kurulumumuzla çalışmıyor:

- **Nonce:** Her sayfayı dinamik render'a zorlar ve PPR ile uyumsuzdur (Next'in
  CSP rehberi).
- **Hash (SRI):** Yalnızca dış JS dosyalarını kapsar, her istekte değişen inline
  veriyi kapsamaz.

Uyumluluk gereken bir projede yol belli: `cacheComponents` kapatılır,
`proxy.ts`'te her istek için nonce üretilir.

## Loglama ve istek bağlamı

- **Logger:** Sunucu logları pino ile yazılır. Geliştirmede okunabilir
  biçimde, production'da JSON olarak çıkar.
- **İstek id'si:** Her istek bir `x-request-id` taşır; gelmediyse `proxy.ts`
  üretir. Nest'e aynı id gider, Next ve Nest logları bu id ile eşleşir.
  `await requestLogger()` o isteğin id'sini her log satırına ekler.
- **Nest'e iletilen başlıklar:** user agent, cihaz adı ve güvenilen
  `X-Forwarded-For` (bkz. `TRUST_PROXY_HOPS`). Böylece Nest'teki oturum ve
  denetim kayıtlarında kullanıcının gerçek IP'si ve cihazı görünür.
- **Hatalar:** Nest'e ulaşılamaması ve zaman aşımı `error` seviyesinde
  loglanır. Yakalanmayan hatalar `instrumentation.ts` üzerinden loglanır.
- **Sırlar loglanmaz.** Token, şifre ve cookie değerleri log satırlarına
  girmez.

## Yapılandırma

Env `src/server/env.ts`'te zod ile doğrulanır. Uygulama açılırken geçersiz bir
değer varsa süreç durur. Geliştirmede değerler `.env.local`'da tutulur.

| Değişken                | Varsayılan | Açıklama                                                                                                                            |
| ----------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `API_URL`               | zorunlu    | Nest'in kök adresi                                                                                                                  |
| `SESSION_SECRET`        | zorunlu    | Oturum cookie'sini şifreleyen anahtar, en az 32 karakter                                                                            |
| `STORAGE_PUBLIC_ORIGIN` | zorunlu    | Nest'teki `STORAGE_PUBLIC_URL`; CSP `img-src`                                                                                       |
| `STORAGE_UPLOAD_ORIGIN` | zorunlu    | Nest'in döndürdüğü `uploadUrl`'in kökeni; R2'de `https://<private-bucket>.<account_id>.r2.cloudflarestorage.com`. CSP `connect-src` |
| `TRUST_PROXY_HOPS`      | `1`        | Next'in önünde `X-Forwarded-For`'a ekleme yapan proxy sayısı                                                                        |
| `LOG_LEVEL`             | `info`     | `error` · `warn` · `info` · `debug`                                                                                                 |
| `PORT`                  | `3000`     | `pnpm start`'ın portu; yerelde `3001` (Nest `3000`'de). Yayında platform verir                                                      |

Uygulama adı, dili ve saat dilimi `lib/constants/app.constants.ts`'te sabittir
(`APP_NAME`, `APP_LOCALE = 'tr'`, `APP_TIMEZONE = 'Europe/Istanbul'`).

## Komutlar

| Komut               | Ne yapar                                                       |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | Geliştirme sunucusu (`:3001`)                                  |
| `pnpm build`        | Production build; statik dosyaları standalone çıktıya kopyalar |
| `pnpm start`        | Standalone sunucuyu çalıştırır; yerelde `.env.local`'ı okur    |
| `pnpm lint`         | oxlint (type-aware), katman kuralları dahil                    |
| `pnpm format`       | Prettier                                                       |
| `pnpm api:generate` | Nest spec'inden `src/lib/api`'yi yeniden üretir                |

## Kapsam dışı

Bunlar bilerek eklenmedi; ihtiyaç duyan proje kendisi ekler:

- Docker, CI ve Next için ayrı bir sağlık endpoint'i
- Çoklu dil (metinler Türkçe, `APP_LOCALE` sabit)
- Test altyapısı
- Uyumluluk gerektiren katı CSP (nonce); geçiş yolu yukarıda
- Yükleme ilerleme çubuğu ve büyük dosyalar için parçalı yükleme

## Bilinen tuzaklar

- **Standalone çıktı statik dosyaları ve env dosyalarını içermez.** `pnpm build`
  `.next/static`'i (ve varsa `public/`'i) standalone klasörüne kopyalar;
  `next build`'i doğrudan çalıştırırsan sayfa JavaScript'siz ve stilsiz açılır.
  Env çıktıya kopyalanmaz: yerelde `pnpm start` `.env.local`'ı okur, yayında
  env'i platform verir. `next start` standalone ile çalışmaz.
- **Env yalnızca istek sırasında okunur.** Modül yüklenirken, prerender'da ya
  da `'use cache'` içinde env okuma. Build sırasında doğrulama atlanır ve değer
  `undefined` gelir; build env olmadan da geçmelidir.
- **Cookie okuyan her şey `<Suspense>` içinde olmalı.** Cache Components
  bölümün dışında bu tür okumalara izin vermez.
- **Rol kapısı 404 durum kodu döndürmez.** PPR statik kabuğu önce gönderdiği
  için `notFound()` gövdeyi değiştirir ama HTTP durumu 200 kalır. Sayfa
  `noindex` alır; asıl koruma Nest'tedir.
- **Client component inline `<script>` render etmemeli.** React 19 istemcide
  render edilen script'i çalıştırmaz. İlk boyamadan önce çalışması gereken kod
  (tema) kök layout'tadır.
- **`shadcn add` mevcut `button.tsx`'in üzerine yazmayı sorar.** "Hayır" de,
  ardından `pnpm format` çalıştır.
- **typedRoutes `redirect()`'i de tipler.** Değişken bir hedefi `as Route` ile
  vermek gerekir.
- **Nest'te sözleşme değiştiyse `pnpm api:generate` çalıştırmadan derleme eski
  tiplerle geçer.** Önce spec'i dışa aktar, sonra üret.
