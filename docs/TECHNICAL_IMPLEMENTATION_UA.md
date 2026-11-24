# Технічні рішення для завершення Coffeo

Дата: 24 листопада 2026 року. Документ уточнює [план реалізації](IMPLEMENTATION_PLAN_UA.md) і визначає цільову поведінку, а не описує вже написаний код. Вихідний стан зафіксований в [аудиті](PROJECT_AUDIT_UA.md).

Стек залишається Next.js 16, Fastify 5, Prisma 7 і PostgreSQL 17. Оновлення безпеки всередині сумісних ліній перевіряються окремо. Приклади з поточної документації іншого major Prisma не копіюються механічно: у цьому проєкті використовується `prisma.$transaction`, а не новий API `db.transaction`.

## 1. Зафіксовані рішення і межі

| Питання              | Рішення для першого релізу                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ринок і гроші        | Україна, лише UAH для нових продажів; історичні валюти незмінні                                                                                                       |
| Гість                | Каталог відкритий; кошик/checkout після входу за ADR-002                                                                                                              |
| Ціна                 | API визначає всі суми; клієнт передає ID/кількість та посилання на quote                                                                                              |
| Знижки               | Membership вимкнений до кроку 10; початкова quote-знижка 0. Звичайні акції додаються лише окремим реалізованим правилом                                               |
| Доставка             | Відділення/поштомат Нової пошти; кур'єр прихований до окремого погодження                                                                                             |
| Вартість перевезення | Базова пропозиція: отримувач оплачує перевізнику окремо. Власник підтверджує це перед релізом; quote містить цю політику явно                                         |
| Оплата               | COD; позначення Paid тільки після підтвердження фактично отриманих коштів                                                                                             |
| Запас                | stockQuantity = доступні до нового замовлення одиниці; checkout одразу зменшує цей лічильник                                                                          |
| Резерв COD           | До обробки/скасування менеджером; без автоматичного TTL у першому релізі. Прострочені Pending позначаються в черзі, не звільняються приховано                         |
| Фото                 | Для мінімального релізу — погоджені HTTPS URL із контрольованого host allowlist і placeholder. Upload — окремий квиток, не зберігання на Render-диску                 |
| Дані без БД          | Можливий перегляд статичного/кешованого публічного контенту; вхід, залишки й оформлення потребують БД. Локальний «успішний» order без запису на сервер не створюється |

Цифрові ліміти нижче — стартова конфігурація для реалізації, а не результати вимірювання навантаження. Їх змінюють централізовано й перевіряють тестами. Нові можливості активуються лише після готовності API, UI і відповідних міграцій.

## 2. Межі модулів і файли

Всі шляхи в цій таблиці — від кореня відповідного GitHub-репозиторію.

| Область                | API fastify-prisma-app                                                                               | Frontend coffee-shop                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Конфігурація й помилки | `src/app.ts`, нові `src/config/env.schema.ts`, `src/shared/errors/*`                                 | `lib/nodejs/fetcher.ts`, нові `lib/api/result.ts`, `app/error.tsx`                     |
| Контракти              | нові `src/contracts/v1/*`, `openapi/coffeo.v1.json`                                                  | нові `lib/contracts/v1/*`; `types/*` поступово замінюються DTO                         |
| Сесії                  | `modules/auth/*`, `shared/plugins/auth.ts`, `shared/plugins/admin.ts`                                | `lib/auth/*`, `AuthProvider.tsx`, auth route handlers, нова сторінка auth/continue     |
| Каталог                | `modules/product/*`, нові serializers і `modules/inventory/*`                                        | `components/dashboard/products/*`, `components/shop/*`, нові admin BFF routes          |
| Гроші та checkout      | нові `shared/money/*`, `modules/checkout/*`; `modules/cart/*`, `modules/order/*`                     | `utils/addProductToCart.ts`, cart slice, `CartModal.tsx`, checkout page й OrderSummary |
| Обробка замовлень      | нові admin order routes/service, `order.transitions.ts`                                              | нові `app/(protected)/dashboard/orders/*`, `app/(protected)/orders/[id]/page.tsx`      |
| Доставка               | `modules/nova-poshta/*`, typed delivery DTO                                                          | `DeliverySection.tsx`, `SearchableSelect.tsx`, BFF cities/warehouses                   |
| Пошта                  | нові `modules/notifications/*`, `modules/auth/password-reset.*`; старий helper замінюється адаптером | нові forgot/reset/change password сторінки й BFF handlers                              |
| Зберігання             | `prisma/schema.prisma`, нові `prisma/migrations/*`                                                   | Prisma/DB credentials на фронт не додаються                                            |
| Перевірки              | `tests/unit/*`, `tests/integration/*`, існуючий deployment test                                      | нові `tests/e2e/*`, `playwright.config.ts`, вибіркові component tests                  |

Контролер виконує parsing/HTTP mapping, service — доменні правила й транзакцію, repository — запити через переданий `tx` або Prisma client. Repository не починає вкладену незалежну транзакцію всередині checkout service. Усі записи однієї операції використовують один `tx`.

## 3. Контракт API та доставка змін у два репозиторії

### 3.1. Версія й загальні правила

Для нового узгодженого DTO використовувати Fastify `/v1/*` і Next `/api/v1/*`. `/health/live` та `/health/ready` залишаються без версії. Поточні маршрути без `/v1` тимчасово залишаються через окремі compatibility serializers до переключення фронтенду; їхні security fixes застосовуються одразу. Checkout v2 не можна знову обійти через старий create-order route: при переключенні новий сервіс обслуговує обидва або старий POST відключається контрольованою відповіддю.

API-репозиторій є власником OpenAPI. Генератор виводить DTO та JSON-схеми для response validation; обидва артефакти мають версію й checksum. Фронтенд зберігає згенеровані артефакти з посиланням на commit API. Типи вручну не дублювати. CI генерує їх повторно й перевіряє, що немає diff. Генератор OpenAPI/Zod обирається після перевірки сумісності з поточною Zod; це не причина замінювати ORM.

Успішна відповідь: `{ data: T }`, список: `{ data: T[], page: { number, size, total } }`. Помилка:

```json
{
  "error": {
    "code": "CART_CHANGED",
    "message": "Кошик змінився. Перевірте замовлення ще раз.",
    "fieldErrors": {},
    "requestId": "opaque-request-id"
  }
}
```

Схеми write-запитів strict: не приймати `role`, `userId`, client price чи невідомі поля мовчки. Не повертати passwordHash, token hash, mail payload або внутрішні помилки драйвера. Для PATCH: omitted означає «не змінювати», null — «очистити», тільки де схема це дозволяє.

BFF пересилає лише allowlist headers: auth cookies, JSON content type, correlation ID, перевірений Idempotency-Key і серверний INTERNAL_API_KEY. Клієнтський internal key завжди ігнорується/перезаписується. `Retry-After`, `Idempotency-Replayed` і доменний code передаються клієнту. Всі Set-Cookie залишаються окремими заголовками. Private responses мають `Cache-Control: no-store`.

Нормалізовані фрагменти DTO:

```typescript
type Money = { amountMinor: number; currency: 'UAH' }
type CartDTO = {
  id: string
  revision: number
  items: { id: string; productId: string; quantity: number; unitPriceMinor: number }[]
}
type QuoteDTO = {
  id: string
  cartRevision: number
  expiresAt: string // ISO UTC
  currency: 'UAH'
  subtotalMinor: number
  discountMinor: number
  shippingMinor: number
  totalMinor: number
  deliveryChargeMode: 'recipient_pays_carrier'
  carrierEstimateMinor: null
}
type CreateOrderInput = {
  quoteId: string
  contact: { firstName: string; lastName: string; phone: string; email: string }
  delivery: { method: 'np_warehouse' | 'np_postomat'; cityRef: string; warehouseRef: string }
  payment: { method: 'cash_on_delivery' }
  comment?: string
}
```

Це фрагменти для пояснення; остаточна OpenAPI також містить повні line items, delivery labels, request limits і responses. У CreateOrderInput немає userId, ціни чи total. Приналежність quote та фактичні суми читаються із сервера.

### 3.2. Нові й уточнені маршрути

Нижче вказані маршрути Fastify; браузер використовує відповідні `/api/v1/...`. Public означає відсутність user session, але з'єднання Vercel→Render однаково захищене internal key.

| Метод і маршрут                                  | Доступ                    | Основні параметри/дія                                                |
| ------------------------------------------------ | ------------------------- | -------------------------------------------------------------------- |
| POST `/v1/auth/register`                         | Public + limit            | email, password; роль завжди Customer                                |
| POST `/v1/auth/log-in`                           | Public + limit            | Вхід; cookies + UserDTO, без JWT у JSON                              |
| GET `/v1/auth/me`                                | Session                   | UserDTO; прострочений access — ACCESS_EXPIRED                        |
| POST `/v1/auth/refresh`                          | Refresh cookie + limit    | Єдине місце ротації cookies                                          |
| POST `/v1/auth/logout`                           | Current cookies           | Відкликання сесії; повторний вихід безпечний                         |
| POST `/v1/auth/forgot-password`                  | Public + limit            | Завжди нейтральний 202 для валідного email, якщо операцію прийнято   |
| POST `/v1/auth/reset-password`                   | Одноразовий token + limit | token, newPassword; атомарна зміна/відкликання сесій                 |
| POST `/v1/auth/change-password`                  | Session                   | currentPassword, newPassword                                         |
| GET/PATCH `/v1/profile/me`                       | Session                   | firstName/lastName/phone; phone:null очищає поле                     |
| GET `/v1/products`                               | Public                    | q/category/roast/sort/page/pageSize; лише active                     |
| GET `/v1/products/slug/:slug`                    | Public                    | ProductDTO; справжній 404 при відсутності/архівації                  |
| GET/POST `/v1/admin/products`                    | Admin                     | Пошук усіх статусів; створення Product+CoffeeDetails                 |
| GET/PATCH `/v1/admin/products/:id`               | Admin                     | revision, змінені поля; 409 при конфлікті                            |
| POST `/v1/admin/products/:id/archive`            | Admin                     | revision; повтор не знищує товар та історію                          |
| POST `/v1/admin/products/:id/stock-adjustments`  | Admin                     | delta, reason, operationId; ідемпотентний рух запасу                 |
| GET `/v1/cart`                                   | Session                   | CartDTO, revision і актуальні серверні ціни                          |
| POST `/v1/cart/items`                            | Session                   | productId, quantity, expectedRevision; додати кількість              |
| PATCH `/v1/cart/items/:id`                       | Session/owner             | quantity, expectedRevision; встановити кількість                     |
| DELETE `/v1/cart/items/:id`                      | Session/owner             | expectedRevision через документований header/query, без ціни         |
| POST `/v1/checkout/quotes`                       | Session                   | cartRevision, delivery refs; чинний QuoteDTO                         |
| GET `/v1/checkout/requests/:key`                 | Session/owner             | Результат власної спроби після timeout/reload                        |
| POST `/v1/orders`                                | Session                   | quoteId, contact, delivery, comment; Idempotency-Key                 |
| GET `/v1/orders`                                 | Session                   | Лише свої замовлення, pagination                                     |
| GET `/v1/orders/:id`                             | Session/owner             | Деталі й дозволена частина історії                                   |
| GET `/v1/admin/orders`                           | Admin                     | number/status/date/page; глобальна черга                             |
| GET `/v1/admin/orders/:id`                       | Admin                     | Менеджерські деталі без технічних секретів                           |
| POST `/v1/admin/orders/:id/transitions`          | Admin                     | expectedRevision, action, reason, operationId                        |
| PUT `/v1/admin/orders/:id/shipment`              | Admin                     | expectedRevision, trackingNumber, operationId; без купівлі накладної |
| POST `/v1/admin/orders/:id/payments/confirm-cod` | Admin                     | operationId, expectedRevision, amountMinor, reason                   |
| GET `/v1/nova-poshta/cities`                     | Public + limit            | q мінімум 2 символи; normalized cities                               |
| GET `/v1/nova-poshta/warehouses`                 | Public + limit            | cityRef, kind, q; normalized warehouses                              |
| GET `/v1/admin/notifications`                    | Admin                     | Невдалі/невизначені доставки без raw token body                      |
| POST `/v1/admin/notifications/:id/retry`         | Admin                     | Лише дозволений retry; operationId                                   |

PUT додається до allowlist BFF FetchOptions; інакше shipment endpoint не запрацює. Усі приватні маршрути беруть власника з verified session, не з тіла запиту. UUID/slug/query валідуються до ORM. Загальний list limit: pageSize 1–50, default 20; sort лише з enum, стабільний tie-breaker за id. Admin counts не обчислюються завантаженням усього каталогу в браузер.

### 3.3. Поведінка HTTP

| Ситуація                        | Відповідь і дія UI                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| Немає/відкликана сесія          | 401 SESSION_REQUIRED; login зі safe returnTo                                                       |
| Access закінчився               | 401 ACCESS_EXPIRED; один explicit refresh і контрольований повтор                                  |
| Немає ролі                      | 403 FORBIDDEN; повтор не допоможе                                                                  |
| Немає чужого/архівного ресурсу  | 404 NOT_FOUND, без розкриття існування чужого order                                                |
| Некоректний JSON/поля           | 400/422 VALIDATION_FAILED; fieldErrors і фокус першої помилки                                      |
| Ревізія/quote змінилися         | 409 CART_CHANGED/QUOTE_CHANGED/REVISION_CONFLICT; завантажити новий стан, не оформляти автоматично |
| Той самий ключ із іншим запитом | 409 IDEMPOTENCY_KEY_REUSED                                                                         |
| Перевищено ліміт                | 429 RATE_LIMITED; Retry-After, без нескінченного автоповтору                                       |
| БД/провайдер недоступний        | 503 SERVICE_UNAVAILABLE; форма лишається; create-order повторюється тільки з тим самим ключем      |

## 4. Гроші та валідація

### 4.1. Конкретна модель

Зберегти наявні DB Decimal(10,2) на цьому етапі, щоб не переписувати історію. Новий HTTP-контракт і всі обчислення використовують цілі копійки: `priceMinor`, `unitPriceMinor`, `subtotalMinor`, `discountMinor`, `shippingMinor`, `totalMinor`, `currency: 'UAH'`.

- DB → minor: Decimal множиться на 100 і перевіряється на ціле; не використовувати `Number(db.price) * 100` для обчислення.
- minor → DB: перевірене safe integer перетворюється на Decimal і ділиться на 100. Форматована строка ніколи не парситься назад як сума.
- Початкові межі: unit price 1–100000000 коп., order total до 1000000000 коп., кількість 1–99 на рядок, до 50 різних позицій. Перевищення — 422 до запису.
- Публічний UI форматує `minor / 100` через Intl.NumberFormat('uk-UA', {style:'currency', currency:'UAH'}). Арифметику знижок у React не дублювати.
- Для майбутньої акції discountBps 0–10000. Лінія: gross = unitPriceMinor × quantity; discount = floor((gross × bps + 5000) / 10000). Це одне округлення half-up на лінію; total = сума net lines + shippingMinor. У COD MVP bps=0.
- Для «доставка отримувачем» shippingMinor=0 означає лише суму, яку збирає магазин. Quote окремо містить `deliveryChargeMode: 'recipient_pays_carrier'`, `carrierEstimateMinor: null` і пояснення. Не показувати «доставка безкоштовна».

### 4.2. Product та CoffeeDetails

Product write DTO: name 2–160, description null/до 10000 символів звичайного тексту, sku null/1–64, imageUrl null/HTTPS до 2048 із allowlist, category з чинного enum, priceMinor, currency UAH, isActive. initialStockQuantity дозволено лише при створенні; далі — stock-adjustment action з причиною й operationId. Невідоме `stockQuantity` у звичайному PATCH не ігнорувати, а відхиляти.

CoffeeDetails — вкладений DTO за чинною Prisma-моделлю: coffeeType обов'язковий для Coffee; roast/processingMethod/brewingMethods з enum; weightGrams — додатне ціле, altitudeMin/Max — цілі й min≤max; scaScore — Decimal 0–100 із не більш ніж 2 знаками; arabicaPercent/robustaPercent — 0–100, якщо задані обидва, сума 100. Межі сенсорних оцінок і caffeineLevel спочатку зафіксувати в одному словнику/контракті та погодити з власником; не вигадувати перерахунок наявних даних.

PATCH CoffeeDetails: omitted — зберегти; object — змінити вказані поля; null — видалити тільки якщо цільова category не Coffee. Зміна Coffee→Equipment в одній транзакції очищає непридатні coffee details після явного підтвердження UI. Відповідь завжди читається з include після успішної транзакції. SKU/slug collisions повертають контрольований 409; для автоматично генерованого slug дозволені обмежені retries.

## 5. Модель БД і порядок міграцій

Не створювати ці таблиці під час підготовки плану. Назви нижче — ціль для нових Prisma migrations; колонкам не потрібне масове перейменування чинної схеми.

| Крок | Зміна                                                                                                  | Ключі, індекси та правила                                                                                                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Session: current hash/jti/issuedAt, previous hash/validUntil, rotationVersion, revokedAt, signingKeyId | Уже є id: повторний session ID не додавати. userId FK; unique current hash; index expiresAt/revokedAt; абсолютний expiresAt                                                                                                |
| 1    | User email normalization                                                                               | До unique-normalized перевірити lower(trim(email)) collisions; акаунти/замовлення не зливати автоматично                                                                                                                   |
| 2    | Product revision; constraints цін/stock                                                                | revision int; stock≥0; price≥0; опрацьовані SKU/slug unique. Індекси під фактичні category/active/sort queries                                                                                                             |
| 2–3  | StockMovement                                                                                          | productId, orderId?, actorId?, kind, delta, balanceAfter, movementKey unique, manualOperationId? unique, actionHash?, createdAt; журнал не редагується                                                                     |
| 3    | Cart                                                                                                   | id, userId unique, revision, createdAt/updatedAt. CartItem лишається прив'язаним до userId для простого backfill; усі зміни блокують Cart цього user                                                                       |
| 3    | CheckoutQuote                                                                                          | id, userId, cartRevision, pricingFingerprint, typed delivery snapshot, totals, expiresAt; індекс userId/expiresAt. Без raw payload провайдера                                                                              |
| 3    | CheckoutRequest                                                                                        | userId, key, canonicalRequestHash, orderId unique, completedAt; unique(userId,key), FK без каскадної втрати order history. У першому релізі success records не очищаються автоматично                                      |
| 3    | Order inventoryState, revision, snapshot-поля                                                          | Reserved/Committed/Released/LegacyUntracked; первинний OrderItem snapshot незмінний                                                                                                                                        |
| 3–4  | OrderEvent                                                                                             | Мінімальний created event вводиться разом із checkout; крок 4 додає transition actions. orderId, actorId?, action, from/to state, operationId unique, actionHash, reason, createdAt. Без копіювання повної адреси/телефону |
| 5    | Delivery data                                                                                          | method, settlementRef/cityRef/warehouseRef, назви/адреса snapshot, trackingNumber, chargeMode. method/refs nullable тільки для legacy                                                                                      |
| 6    | PasswordResetToken                                                                                     | userId, tokenHash unique, expiresAt, usedAt; індекс expiry; raw token не в таблиці                                                                                                                                         |
| 6    | NotificationOutbox                                                                                     | eventKey unique, orderId?/resetTokenId?, templateVersion, encrypted sensitive payload коли потрібний, state, attempts, nextAttemptAt, leaseUntil, claimToken, providerMessageId?, createdAt                                |
| 9    | PaymentAttempt, ProviderEvent                                                                          | merchant idempotency key unique, provider event ID unique; history attempts не затирається єдиним Payment                                                                                                                  |
| 10   | MembershipLedger, Consent/Suppression, Settings revisions                                              | Окремі event/operation keys; немає безконтрольної зміни stamps або відписки імпортом                                                                                                                                       |

Для outbox-sensitive payload потрібен окремий server encryption key; логи/адмінський список його не розшифровують. Це особливо стосується reset URL: hash у PasswordResetToken не допомагає відновити raw token для листа після рестарту. Вибір: короткоживучий encrypted outbox payload з видаленням після send/expiry. Токен не можна зберігати відкритим у Json або писати в console.

Для sessions чинну колонку `refreshToken` з хешем можна використати як currentRefreshHash через Prisma @map, замість дублювання старого хеша в новій таблиці. Нові jti/issuedAt додаються окремо; legacy rows без нового формату завершуються контрольовано.

### 5.1. Безпечний backfill

1. Створити additive columns/tables із nullable/default станом, не міняючи старі суми.
2. Для існуючих user створити Cart і revision=0; старі CartItem зберегти. Переключити всі cart writers на спільне блокування до ввімкнення нового checkout.
3. Нові quote — тільки UAH. Існуючі USD products показати адміну як такі, що потребують нової ціни; не застосовувати довільний курс і не робити mass currency rename.
4. Існуючим замовленням поставити LegacyUntracked: вони не робили stock reservation старим кодом. Їхнє скасування не має додавати запас, який не віднімався. Доставку зі старих addressLine2 не парсити евристично без перевірки.
5. Нові sessions використовують новий формат із sid; перехід допускає один контрольований повторний login. Небезпечний старий middleware не тримати безстроково заради сумісності.
6. Прогнати перевірки даних, потім додати NOT NULL/CHECK де інваріант уже виконується. Зміни на великих таблицях оцінити окремо; не виконувати довгі data migrations при старті кожного instance.
7. Спочатку API зі старим і новим читанням, потім frontend на новому DTO, потім відключення legacy write routes. При проблемі зупинити нові checkout, не відкочувати на старий небезпечний checkout поверх нового stock.

DDL і backfill проходять disposable PostgreSQL та upgrade fixture. Runtime — pooled DATABASE_URL; migrations/dump/restore — direct DIRECT_URL. Для ізоляції використовувати існуючий тестовий проєкт/branch; не створювати інший production-проєкт лише для цього плану.

## 6. Протокол кошика, quote і checkout

### 6.1. Єдине блокування кошика

У кожній POST/PATCH/DELETE cart операції: почати транзакцію → забезпечити Cart(userId) → `SELECT ... FOR UPDATE` Cart → порівняти expectedRevision → перевірити власника row та quantity/product → змінити CartItem → збільшити revision → commit. Відповісти повним CartDTO. Паралельна зміна старої ревізії отримує 409, а не перезаписує новий стан.

UI серіалізує мутації одного кошика й використовує revision із останньої успішної відповіді. При 409 перечитує CartDTO і показує конфлікт; при невідомому network result перечитує стан, а не повторює increment із новою revision автоматично. Повторний намір користувача — окрема дія. Це усуває гонку швидких натискань «+» і приховане подвоєння кількості після timeout.

Блокування session-level advisory lock не використовувати: runtime працює через transaction pooler. Tagged `$queryRaw` для row locks параметризує values; таблиці/колонки не беруться із запиту користувача. Не виконувати raw SQL із конкатенованими рядками.

### 6.2. Створення quote

1. Прочитати/перевірити delivery refs через нормалізований довідник поза DB-транзакцією; network timeout — 503, а не пусте місто.
2. У короткій транзакції заблокувати Cart, звірити revision, завантажити до 50 позицій із Product і потрібними details.
3. Відхилити порожній кошик, архівні/не-UAH товари, некоректні кількості й недостатній запас. Quote не резервує товар і не обіцяє наявність до checkout.
4. Обчислити minor-суму; fingerprint містить відсортовані productId/quantity, ціни, правило знижки, валюту й delivery policy/refs. Поточну загальну кількість stock до fingerprint не включати: інша покупка не змінює ціну, якщо запасу ще достатньо.
5. Зберегти Quote з userId, revision і expiresAt=now+10 хв; повернути QuoteDTO. Після зміни кошика/доставки UI отримує новий quote. Quote не зберігає дані платежної картки чи raw Nova Poshta response.

### 6.3. Клієнтський ключ і повтор

На перше підтвердження UI створює UUID Idempotency-Key і тримає його разом із незмінним submitted payload у пам'яті до встановлення результату. У sessionStorage можна зберігати тільки key/quoteId, без контактів. При timeout/network error повтор надсилає те саме тіло й той самий ключ. При редагуванні даних після відомої відмови — новий quote/ключ. Подвійне натискання блокує UI, але сервер усе одно перевіряє ідемпотентність.

Після reload UI спочатку шукає результат свого key через авторизований endpoint `/v1/checkout/requests/:key`; він повертає orderId/receipt або 404. Це endpoint читання власного результату, не витік по чужому ключу. Якщо успішного запису немає, нова спроба можлива тільки з контрольованою ревізією; випадково генерувати новий key після невідомого результату не можна.

### 6.4. Порядок однієї транзакції checkout

```text
validate identity + strict body + UUID key
normalize contact/delivery; hash canonical submitted fields (not JSON property order)
BEGIN, lock Cart(userId)
  find CheckoutRequest(userId, key)
  if exists:
    compare request hash; mismatch -> 409
    return existing order receipt BEFORE checking empty cart / quote expiry
  load owned quote, check expiry and Cart.revision
  lock Product rows in ascending UUID order
  re-read active/currency/prices and recompute fingerprint
  changed quote -> 409; insufficient stock -> 409 OUT_OF_STOCK
  for each product:
    UPDATE ... SET stockQuantity = stockQuantity - quantity
    WHERE id = productId AND isActive AND stockQuantity >= quantity
    require affected row count == 1
  create Order + OrderItems + delivery snapshot + COD Payment(Pending)
  create StockMovement(Reserve) and initial OrderEvent
  create CheckoutRequest(userId,key,hash,orderId)
  delete bought CartItems under locked Cart; increment Cart.revision
COMMIT
return 201 + immutable order receipt
```

Row locks діють до кінця транзакції. Ідемпотентний повтор повертає 200 та той самий orderId/receipt з `Idempotency-Replayed: true`; це не нова операція. Поточний змінний стан замовлення читається окремим GET. У CheckoutRequest достатньо orderId, не треба дублювати персональний JSON-відгук.

Усі cart writers використовують те саме Cart lock: додавання в іншій вкладці або завершується до checkout і робить старий quote нечинним, або після commit стає новим кошиком. Таке правило дозволяє безпечно очистити прочитані рядки. Старий writer, який обходить lock, залишати не можна.

OrderNumber залишається unique. Підвищити ентропію його випадкової частини до щонайменше 80 біт; конфлікт саме цього unique key допускає bounded повтор відкатаної транзакції. Не трактувати кожен Prisma unique error як дозвіл повторити будь-яку бізнес-операцію. Quote cleanup видаляє лише прострочені тимчасові записи, які не потрібні recovery; історичні Order/CheckoutRequest/StockMovement він не зачіпає.

Транзакція не викликає Нову пошту/mail/PSP. Початковий бюджет: maxWait 2 с, transaction timeout 5 с, lock wait до 1 с, не більше 3 спроб для підтверджених serialization/deadlock errors із jitter. Передавати SQL settings через transaction-local механізм, не `SET` на pooled session. Timeout відповіді клієнта не означає відкат commit. Після неоднозначного network error результат шукається за key; не починати неконтрольований другий checkout.

Перед реалізацією перевірити доступні isolation/timeout options у встановленій Prisma 7 і її pg adapter. Набір locked transactions починати з ReadCommitted + явних locks; Serializable не додається як заміна ідемпотентності. Стабільний lock order для stock-actions/status transitions теж ascending product UUID. Реальні concurrency tests обов'язкові.

## 7. Запас, статуси та історія

### 7.1. Облік stock

| Подія                         | Зміна доступного запасу                              | Order.inventoryState                |
| ----------------------------- | ---------------------------------------------------- | ----------------------------------- |
| Checkout COD                  | -quantity, StockMovement Reserve                     | Reserved                            |
| Processing                    | Немає                                                | Reserved                            |
| Shipped                       | Немає повторного списання                            | Committed                           |
| Delivered                     | Немає                                                | Committed                           |
| Cancelled до Shipped          | +quantity один раз, Release                          | Released                            |
| Повернення після відправлення | Тільки окрема дія підтвердженого фізичного приймання | Не маскувати як звичайний Cancelled |
| Legacy order                  | Автоматичного stock movement немає                   | LegacyUntracked                     |

Не вводити паралельно друге незалежне reservedQuantity без узгодженого алгоритму: у MVP запас уже зменшений при reservation. Manual adjustment використовує delta, reason, operationId; не дозволяти від'ємний доступний запас. Перевірка журналу починається з baseline movement на дату введення нового обліку.

Один checkout створює кілька StockMovement, тому його загальний request operationId не може бути unique у кожному рядку ledger. Для reserve/release movementKey генерується сервером із orderId/productId/kind; один ключ на один рядок. Групову дію представляє OrderEvent. Для однотоварної ручної stock-adjustment client operationId зберігається в nullable unique manualOperationId; повтор порівнює actionHash (product/delta/reason/actor), не додає другий рух і не приймає інше тіло під тим самим ID. Так забезпечується ідемпотентність без конфлікту багатотоварного замовлення.

### 7.2. Дозволені переходи

| From               | Action            | To                       | Передумова                                            |
| ------------------ | ----------------- | ------------------------ | ----------------------------------------------------- |
| Pending            | accept            | Processing               | Admin, збігається revision                            |
| Pending/Processing | cancel            | Cancelled                | Причина; release тільки Reserved                      |
| Processing         | ship              | Shipped                  | Є валідна ТТН/доставка; inventory Reserved            |
| Shipped            | deliver           | Delivered                | Підтвердження менеджера або довірена подія провайдера |
| Delivered          | confirmCodPayment | Delivered + Payment.Paid | Повна очікувана UAH-сума, payment Pending             |

Payment Paid не ставить Order Paid у новому COD-потоці: цей legacy enum лишається для старих записів до окремої міграції. Refunded не доступний як довільний status PATCH. Повернення грошей і фізичне повернення товару — різні операції. Для першого релізу нестандартні післявідправні ситуації обробляє менеджер із записаною причиною; вони не запускають автоматичне поповнення stock.

Кожна дія: lock Order → expectedRevision → validate transition → locks products у стабільному порядку якщо потрібні → updates + OrderEvent + operation key → commit. Повтор operationId з тим самим запитом повертає результат, з іншим — 409. Для цього зберігати canonical action hash поряд із operationId. Ручне коригування оплати не затирає попередній запис без історії.

Видалення/архівація Product не змінює OrderItem. Для Order.user FK базове рішення — RESTRICT замість CASCADE, а акаунт деактивується. Видалення користувачем PII — окремий процес анонімізації/зберігання, узгоджений власником; публічний DELETE user поки не додається. До зміни FK окремо змінити teardown тестів: синтетичні orders видаляються перед synthetic users, інакше чинний deployment test почне падати при cleanup.

## 8. Сесії без гонок і запису cookies в RSC

### 8.1. Ідентичність і строки

Одна Session на один login, а не на refresh. Access claims: userId, sid, email, tokenType=access, iss/aud, iat/exp; refresh claims: userId, sid, jti, tokenType=refresh, iss/aud, iat/exp. Алгоритм HS256 задається явно, ключі access/refresh незалежні. Термін access — до 15 хв, refresh/session — абсолютні 7 діб від login; rotation не подовжує абсолютний строк.

У БД — hash refresh та метадані випуску, не raw JWT. Session.id уже існує. Поточна роль читається з User, sid перевіряється на revoked/expiry. Logout/reset відкликає session у БД, тому старий access не дає ще 15 хв приватного доступу. Збій читання БД — 503 без очищення валідних cookies.

Cookies: HttpOnly, Secure production, SameSite=Lax, Path=/, явний Max-Age до expiry. userId cookie не є доказом входу; після переключення контракту її можна прибрати. На logout очищати чинні та legacy cookie names.

### 8.2. Атомарна ротація з коротким вікном повтору

1. Перевірити signature/algorithm/type/audience/expiry, потім row-lock Session за sid, звірити userId і hash.
2. Для current refresh, який уже достатньо старий, створити новий random jti й fixed issuedAt; зберегти previousHash з validUntil=now+10 с, нові current hash/jti/issuedAt і rotationVersion в одній транзакції.
3. Для previousHash у межах 10 с повернути той самий current refresh, не створювати ще одну генерацію. Поточний токен віком до 10 с теж не ротувати повторно. Це запобігає «перегонам» відповідей кількох вкладок.
4. Відтворювати current JWT через один canonical signing helper з фіксованими claims/exp/keyId; перевіряти, що hash відтвореного JWT дорівнює currentHash. Raw token для цього не треба зберігати в БД.
5. Коректно підписаний старий token поза вікном — replay: відкликати його session і 401. Непідписаний/підроблений token не може відкликати чужу session тільки за sid.
6. При logout/reset перевірка revoked має перевагу над grace window. Абсолютний expiresAt не змінюється.

10-секундне вікно — явний компроміс: старий викрадений токен може бути прийнятий у цьому короткому інтервалі. Це рішення потрібно записати в ADR та перевірити тестом втраченої відповіді/двох вкладок; IP або userAgent не використовувати як доказ власності. Невизначений signing key при ротації секретів означає контрольоване завершення відповідних sessions, а не зберігання raw tokens назавжди.

### 8.3. Next та відновлення браузерної сесії

З нового auth middleware прибрати приховану ротацію під час будь-якого GET. При expired access API повертає ACCESS_EXPIRED, не змінює cookie в RSC-відповіді. `/api/v1/auth/refresh` — Route Handler, який реально пересилає Set-Cookie браузеру.

- `getUser` повертає типізований стан authenticated / needsRefresh / anonymous / unavailable, не просто null для всіх помилок.
- Серверні приватні сторінки використовують `requireUser(returnTo)` до приватних запитів. needsRefresh переводить на `/auth/continue?next=...`; client recovery робить POST refresh і повертається на дозволений локальний маршрут. Не передавати приватні дані в recovery UI.
- При client API ACCESS_EXPIRED спільний helper робить single-flight refresh і один повтор запиту. Мутацію повторювати лише коли auth guard гарантовано не запускав handler; network timeout create-order повторюється тільки за Idempotency-Key.
- returnTo приймає лише allowlist локальних шляхів, без `//`, зовнішнього host чи auth-loop. Після невдалої сесії — login; при 503 — retry екран без втрати форми.
- При зміні user.id скинути Redux cart/products, перечитати власний кошик; не зберігати JWT в Redux/localStorage.

Створення User+Profile — одна транзакція. email trim/lowercase застосовується однаково на register/login/reset; legacy collisions обробляються до unique migration. Новий пароль: мінімум 12 символів, максимум 72 UTF-8 байти для bcrypt; login не застосовує новий min до старих коректних паролів. Зміна політики не повинна раптом заборонити вхід усім старим користувачам.

Оновити також `app/(protected)/layout.tsx` і products admin layout: старе правило «будь-який null → login» несумісне з needsRefresh/unavailable. Всі приватні data loaders перевіряють typed auth state, а наявність refresh-cookie лише дозволяє спробу recovery, не відкриває доступ. Expired/missing access із refresh-cookie може перейти в recovery; лише успішний API refresh встановлює authenticated.

## 9. Нова пошта та поштові повідомлення

### 9.1. Нова пошта

Adapter повертає власні CityDTO/WarehouseDTO, не сирий JSON. Зберігати settlementRef окремо від DeliveryCity/cityRef: вони можуть мати різне призначення. WarehouseDTO містить ref, cityRef, kind, number, label, shortAddress. Не визначати поштомат лише за текстом назви.

Точні methodProperties і типи warehouse перевірити за офіційною документацією та реальним ключем до написання адаптера. Мережеві параметри: timeout 5 с; максимум один retry для безпечного lookup при network/5xx; business error HTTP 200 не повторюється без причини. Додати нормалізацію success/errors/warnings і schema validation response.

Початковий кеш у bounded in-memory LRU: міста до 24 год, відділення до 1 год, ліміт 500 ключів; ключ містить normalized query/cityRef/kind. Втрата кешу при рестарті безпечна. Перед checkout refs мають бути підтверджені свіжим snapshot у межах TTL; якщо перевірка недоступна й свіжого кешу немає — 503. Не блокувати stock/Cart під час network lookup.

UI має debounce 350 мс, AbortController для старого пошуку, окремі empty/error/loading, скидає warehouse після зміни міста. На сервері перевіряти city↔warehouse і kind. ТТН зберігати структуровано та валідовувати за фактичним форматом провайдера; URL tracking будується з allowlist origin, а не довільного введеного URL. API генерації накладних не викликається.

### 9.2. Transactional outbox

Outbox event створюється в тій самій транзакції, що й бізнес-подія. До кроку 6 notification hook лишається вимкненим; не створювати посилання на таблицю, якої ще немає. При активації mail для нових order events додати unique eventKey, templateVersion і мінімальні дані для повідомлення.

Dispatcher бере невелику batch через `FOR UPDATE SKIP LOCKED`, присвоює leaseUntil та random claimToken, commit; потім робить network send поза транзакцією. Завершення записує result тільки якщо claimToken іще збігається. Це не дозволяє старому worker позначити результат іншого claim. Lease довший за provider timeout. Прострочений Sending після рестарту повертається до retry лише з provider idempotency/reconciliation; для SMTP без такого доказу він стає DeliveryUnknown, бо попередній send міг завершитися.

Для order notification первинну спробу можна запускати після commit із явним await і коротким timeout; невдача не відкочує order. Forgot-password HTTP flow має окремий однаковий для всіх email шлях, описаний нижче; він не чекає mail send і не виконує user lookup перед відповіддю. Pending queue відновлюється на старті API, менеджерському retry і під час активної роботи процесу. Таймер — лише додатковий механізм: стан зберігається в БД, а на сплячому Render немає гарантії негайного retry. Для гарантованого часу доставки потрібен окремо погоджений scheduler/worker; його налаштування й SLA — умова відкритого запуску, якщо manual recovery недостатній власнику. Постійний keep-alive заради обходу Free sleep не використовувати.

Стани: Pending → Sending → Sent; TransientFailed → Pending(nextAttemptAt); PermanentFailed; DeliveryUnknown; Skipped для непотрібного/простроченого повідомлення. Для ідемпотентного mail API передавати eventKey як provider idempotency key в межах його документованого retention. SMTP не гарантує ідемпотентності: timeout після приймання листа може означати вже доставлене повідомлення. Такий випадок — DeliveryUnknown і ручне/провайдерське звіряння, не сліпий автоповтор із обіцянкою exactly-once.

Forgot-password: після однакової validation/rate limit вставити durable PasswordResetRequest outbox event з encrypted normalized-email payload і повернути 202. Lookup User і send не виконувати синхронно лише для відомої адреси: інакше час відповіді видаватиме існування акаунта. Claim worker розв'язує адресата; невідомий email завершується приватним Skipped без листа. Для відомого user worker атомарно створює ResetToken та підмінює encrypted payload на готовий URL; повтор claim використовує збережений token, а не створює новий. Заявки старші 30 хв пропускаються. Несправність БД до збереження заявки — 503 для всіх адрес, а не неправдивий 202.

Reset-token: 32 random bytes, hash у ResetToken, TTL 30 хв від генерації, usedAt; raw URL лише в короткоживучому encrypted outbox payload. Операція reset: validation/rate limit → обчислити bcrypt hash поза довгою DB-транзакцією → lock user/token та повторна перевірка hash/expiry/usedAt → позначити використаним → змінити passwordHash → відкликати sessions і інші tokens цього user → commit. Для change-password currentPassword перевіряється з повторною перевіркою версії user перед commit. Лист не містить пароль. Нова password-reset заявка не повинна приховано продовжувати старий token.

Encryption adapter використовує стандартний authenticated encryption, наприклад AES-256-GCM із новим random nonce на кожен payload, окремим OUTBOX_ENCRYPTION_KEY та eventKey як associated data; key version зберігається поряд із ciphertext. Ключ не береться із JWT/Cookie secrets. Після Sent/expiry secret payload очищається. GET reset сторінки не споживає token: поштові сканери не повинні скидати пароль. Рекомендований reset URL містить token у fragment, client читає його в пам'ять, прибирає з адресного рядка й надсилає тільки в POST; сторінка не має third-party analytics та використовує no-referrer. Поведінку fragment у вибраному mail provider/link tracking перевірити перед релізом.

## 10. Безпека, ліміти й операційні дії

- Завжди Customer при register, незалежно від env/body; bootstrap не підвищує довільну зареєстровану адресу. Регресійний тест встановлює старий ADMIN_EMAIL навмисно.
- Початковий rate limit login: 20 спроб на normalized-email HMAC за 15 хв; forgot: 3/год на email; refresh: 60/5 хв на sid. Пороги винести в конфігурацію. Не зберігати plaintext email як rate-limit key і не створювати безмежні counters. Доповнити контрольованим глобальним лімітом register/lookup; очищати expired buckets.
- API бачить Vercel як proxy. Не вмикати `trustProxy: true` і не довіряти довільному X-Forwarded-For. IP-ліміти додавати після перевірки платформи: BFF бере тільки документований trusted client address і перезаписує власний службовий header; API приймає його лише за internal key. Без перевіреної адреси не об'єднувати всіх покупців під IP Render proxy.
- BFF strict Origin для browser mutations лишається. Майбутні jobs/webhooks мають окремі server endpoints, signature/secret та окремі auth rules; не послаблювати глобальний browser guard заради cron.
- Технічні логи: requestId, route code, result code, тривалість, retries. Не логувати order contact, mail/reset URL, cookies або raw Prisma error. Адмінський бізнес-аудит відокремлений і має контроль доступу.
- Security headers перевіряти на справжній Vercel-відповіді; CSP спочатку в Report-Only із Next-compatible правилами, потім enforce після перевірки fonts/images/hydration. Не додавати випадковий nonce лише в response, не передавши його рендереру.
- Фото/посилання: HTTPS, host allowlist, limits, placeholder; не додавати довільний backend fetch URL за даними адміна. Файловий upload потребує окремого storage adapter і validation.

## 11. Тести, збої та критерії доказу

Зберегти node:test для API. Unit tests грошей/правил не підключають БД. DB integration tests працюють із справжньою PostgreSQL 17; in-memory fake не доводить надійність lock/unique/rollback. Playwright у web перевіряє browser→BFF→API→test DB. Mail і Nova Poshta замінюються синтетичними HTTP fixtures; окремий ручний live lookup дозволений із ключем, без створення реальної доставки.

Для дешевого локального E2E стартувати Next у development і API з NODE_ENV=test; production build перевіряти окремо. Не послаблювати production HTTPS validation лише щоб Next start міг звернутися до HTTP localhost. Перед релізом виконати окремий HTTPS staging smoke production bundle з тестовими даними або довірений локальний TLS harness. Dev E2E не зараховується як перевірка production Secure cookies/HTTPS. Тестові секрети — синтетичні й окремі від хмарних.

| ID       | Тест                                                          | Очікуваний доказ                                                                                               |
| -------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| SEC-01   | register з role=Admin та ADMIN_EMAIL                          | strict payload/Customer; немає підвищення ролі                                                                 |
| SEC-02   | Customer викликає admin routes; чужі cart/order IDs           | 403/404; дані не змінилися                                                                                     |
| SEC-03   | Зовнішній Origin, підроблені forwarded/internal headers       | Немає browser mutation/довіреної підміни                                                                       |
| AUTH-01  | Два login в одну секунду                                      | Різні sid/jti й обидві сесії працездатні                                                                       |
| AUTH-02  | Два refresh з одним cookie, різний порядок відповідей         | Одна актуальна генерація; обидва результати узгоджені                                                          |
| AUTH-03  | Втрачено refresh response, повтор у grace / поза ним          | У вікні — recovery; після — визначена replay policy                                                            |
| AUTH-04  | Logout/reset після refresh                                    | Відкликаний access не відкриває private routes                                                                 |
| AUTH-05  | Expired access у direct SSR navigation                        | recovery через Route Handler; cookie реально з'являється в браузері                                            |
| AUTH-06  | БД недоступна, cookies валідні                                | 503, cookies не стерті як «неправильний пароль»                                                                |
| CAT-01   | Create/edit Coffee з усіма підтриманими полями                | Після reload поля збережені; public DTO не видає зайвого                                                       |
| CAT-02   | Archive, stock=0, довільний image URL                         | Правильні видимість/покупка/validation/placeholder                                                             |
| CAT-03   | Два edits старої revision / однаковий SKU/slug                | Один контрольований success; conflict без втрати даних                                                         |
| MONEY-01 | 0.01, fractional Decimal, великі суми, quantity 99            | Точні minor totals або 422, ніколи NaN/float drift                                                             |
| MONEY-02 | Клієнтські price/discount/currency; змішані валюти            | Не змінюють quote/не приймаються                                                                               |
| CART-01  | Дві вкладки PATCH однієї revision                             | Конфлікт контрольований; сервер і UI збігаються                                                                |
| ORDER-01 | Дві паралельні спроби з одним key                             | Один Order, одна група stock movements, один receipt                                                           |
| ORDER-02 | Два keys на один Cart revision                                | Один checkout; другий — conflict/empty за контрактом                                                           |
| ORDER-03 | Два users купують останню одиницю                             | Рівно один success; запас не від'ємний                                                                         |
| ORDER-04 | Після commit втрачено відповідь; повтор key                   | Знаходить той самий order до перевірки порожнього кошика                                                       |
| ORDER-05 | Однаковий key з іншим contact/quote                           | 409; старе замовлення не змінене                                                                               |
| ORDER-06 | Зміна ціни або архівація між quote/submit                     | 409, потрібне нове підтвердження                                                                               |
| ORDER-07 | Add-to-cart одночасно з checkout                              | Новий рядок не губиться; порядок lock узгоджений                                                               |
| ORDER-08 | Exception перед commit, lock timeout/deadlock                 | Повний rollback; bounded retry; немає напівзамовлення                                                          |
| STATE-01 | Подвійне cancel/confirm-cod operationId                       | Немає повторного stock credit/PaymentEvent                                                                     |
| STATE-02 | Ship без ТТН; Cancel після Shipped                            | Заборонена дія; історія незмінна                                                                               |
| STATE-03 | Скасування LegacyUntracked                                    | Немає автоматичного додавання stock                                                                            |
| NP-01    | HTTP 200 із success=false; timeout; невалідний city↔warehouse | Видима помилка; некоректна адреса не записана                                                                  |
| NP-02    | Поштомат/відділення, зміна міста, прострочений кеш            | Правильний type, warehouse скидається/перевіряється                                                            |
| MAIL-01  | Outbox crash до send/після acceptance/до запису Sent          | Немає втрати order; lease recovery/DeliveryUnknown згідно провайдера                                           |
| MAIL-02  | Два dispatchers на ту саму batch                              | Один claim; старий claimToken не може завершити чужу спробу                                                    |
| RESET-01 | Два reset з одним token; expiry; old sessions                 | Один success; token одноразовий; sessions відкликані                                                           |
| RESET-02 | Forgot для відомого/невідомого email; worker crash            | Однаковий HTTP-шлях; жодного lookup/send до 202; durable request і той самий підготовлений token після повтору |
| UI-01    | Акаунт A → logout → B без reload                              | Відсутні cart/products A; header/auth/cart B правильні                                                         |
| UI-02    | Mobile/keyboard/dialog/long values                            | 360/390/768/1440 px, Escape/focus return, немає втраченої навігації                                            |
| UI-03    | 404 / 503 / empty; checkout timeout                           | Справжні HTTP стани, різні екрани, збережений draft і key                                                      |
| OPS-01   | Fresh migrations та upgrade fixture зі старими USD/orders     | Дві успішні перевірки; history totals незмінні                                                                 |
| OPS-02   | Restore незалежного backup в іншу БД                          | Фактично відновлено order/items/events; production не змінена                                                  |

Для concurrency tests використовувати дві незалежні connection/transaction і керовані barriers; не сподіватися, що випадковий Promise.all один раз створить потрібну гонку. Окремо симулювати затримку HTTP-відповіді після commit. Жоден із цих нових тестів не вважається виконаним лише через його опис у плані.

## 12. Реліз, відкат і відкриті рішення власника

Релізний manifest фіксує API commit, web commit, contract checksum і migration version. `dev` не має без перевірки застосовувати руйнівну схему до production. Нинішній startCommand виконує db:deploy: перед data migrations перейти до окремого контрольованого migration step із direct connection і deploy lock; звичайний рестарт API не запускає довгий backfill.

Порядок: test migration/upgrade → additive production migration → сумісний API → сумісний frontend → read-only smoke → activation checkout → контрольований пілот. Не прибирати старі колонки в тому самому релізі, де переключається читання. Відкат коду не відкочує schema/data автоматично. За невідомого стану вимкнути створення нових замовлень, зберегти читання й перевірити CheckoutRequest/stock ledger перед повтором.

Перед запуском власник підтверджує: реальні ціни/stock, платника доставки, бізнес-строк обробки Pending, дозволені контент/фото, домен і поштового відправника, отримувачів службових повідомлень, прийнятний час retry листа на Free, строки backup/retention і допустимий простій. У плані це release gates, а не прихований дозвіл на платні послуги. Базовий backup target — щоденна зашифрована незалежна копія й test restore; якщо допустима втрата менше доби, потрібна інша частота/ресурсне рішення.

План кроків 9–10 деталізує інтеграційні межі, але не вигадує конкретного платіжного/mail-провайдера без перевірки його API/умов і вибору власником. Наявні tokens не публікуються, live payment і реальна купівля накладних не виконуються як перевірка документації.

## 13. Первинні джерела

- [Prisma 7.8 runtime API](https://github.com/prisma/prisma/blob/7.8.0/packages/client/src/runtime/getPrismaClient.ts): версійний орієнтир для встановленого major; локальні generated types є остаточною перевіркою доступних options.
- [PostgreSQL 17 row locks і deadlocks](https://www.postgresql.org/docs/17/explicit-locking.html): транзакційна семантика блокувань; конкретний порядок Coffeo визначений цим дизайном.
- [Next.js cookies](https://nextjs.org/docs/app/api-reference/functions/cookies): розділення читання cookies в Server Components та запису в Route Handlers/Server Functions.
- [RFC 9700, refresh-token replay protection](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14): загальні принципи ротації/відкликання. Coffeo має власну JWT-схему; це не твердження про повну OAuth-сумісність або про стандартизоване grace window.
- [Neon connection pooling](https://neon.com/docs/connect/connection-pooling): direct для міграцій/backup; pooled для звичайного runtime.
- [Render Free](https://render.com/docs/free): sleep та ephemeral filesystem впливають на вибір dispatcher/storage, не на збереження order у зовнішній БД.
