# План работ

Последовательность шагов. Не прыгать через фазы: каждая опирается на предыдущую.

Контекст: [PROJECT.md](./PROJECT.md) · фронт [FRONTEND.md](./FRONTEND.md) · бэк [BACKEND.md](./BACKEND.md) · дефекты [BUGS.md](./BUGS.md) · скилы [SKILLS_USE.md](./SKILLS_USE.md).

Пути бэка — относительно `/Users/leo/WebstormProjects/fastify-todo-api`.  
Пути фронта — относительно корня `coffee-shop` (не этой папки `project-description`).

Критерий фазы: можно проверить руками по чеклисту в конце блока, не оставляя систему хуже, чем было.

**Скилы.** Перед фазой прочитать указанные `SKILL.md` из `.cursor/skills/<name>/`. Не подключать весь каталог. Если скила нет в блоке фазы — его не открывать. Сводка и запреты: [SKILLS_USE.md](./SKILLS_USE.md).

---

## Фаза 0 — гигиена секретов

Сделать **до** любой публичной ветки / деплоя.

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| До правок | `auditing-security` | Найти все захардкоженные секреты, `NEXT_PUBLIC_*` с service-role, tracked `.env` |
| Если `git grep` что-то нашёл, а файл «не тот» | `parallel-exploring` | Параллельно прочесать фронт и `fastify-todo-api` |
| После удаления `env.ts` | `auto-type-checking` | Убедиться, что никто не импортировал файл |
| Конец фазы | `saving-workspace-context` | Записать: какие ключи ротировали, что осталось в `.env.example` |

Не использовать `incident-response` — это не прод-инцидент, это гигиена репо. Секреты в чат и в коммит не класть.

1. Удалить `fastify-todo-api/src/config/env.ts` из дерева и из git (`git rm`). Файл не импортируется, но секреты в истории.
2. Ротировать: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`, пароль БД, пароль почты, ключ Nova Poshta, если они светились в этом файле. Баг [B6](./BUGS.md).
3. Оставить только `.env` / `.env.example` без реальных значений. На старте по-прежнему throw, если нет `JWT_ACCESS_SECRET` и `COOKIE_SECRET`; добавить проверку `JWT_REFRESH_SECRET` и `DATABASE_URL`.

Проверка: `git grep` по старым секретам в рабочем дереве пустой; приложение стартует с `.env`.

---

## Фаза 1 — контракт пользователя (JWT)

Без этого checkout и корзина будут писать не в того user. Баги [B2](./BUGS.md), [B3](./BUGS.md), [F9](./BUGS.md).

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| Старт | `parallel-exploring` | Одновременно: `auth.service`, `auth.ts` middleware, `fastify.d.ts`, BFF `/api/auth/*`, `AuthProvider` |
| Если refresh «почти работает» | `systematic-debugging` | Воспроизвести: протухший access + живой refresh. Гипотеза: сырой токен vs `hashToken` |
| После смены payload | `auto-type-checking` | Оба репо: `userId` vs `id` |
| Проверка флоу | `form-testing` | Логин ок / неверный пароль / logout / повторный заход на `/dashboard` |
| Проверка cookies | `network-request-auditing` | `Set-Cookie` на login, refresh, logout; нет утечки токена в JSON |
| Конец | `auditing-security` | Refresh в БД только хеш; logout чистит три cookie |
| Конец | `architecture-decision-records` + `saving-workspace-context` | Зафиксировать контракт `{ userId, email }` — больше не обсуждать |

Не использовать `adding-auth` — не ставить Auth.js поверх своего JWT.

### 1.1 Один payload

Везде одно поле: `{ userId: string, email: string }`.

- Логин: `src/modules/auth/auth.service.ts` — уже `userId`.
- Refresh в `src/shared/plugins/auth.ts` — сейчас `{ id, email }` → заменить на `{ userId, email }`.
- Access при refresh: email брать из сессии/юзера в БД, не из refresh-JWT (там только `userId`).
- `src/types/fastify.d.ts` и `/auth/me` — читать `request.user.userId`.
- Фронт `AuthProvider` и fallback в `app/layout.tsx` — один тип `{ id, email }`, без `name` / `undefined`.

### 1.2 Сессия по хешу

- `findSessionByToken` / `deleteSessionByToken` всегда принимают уже `hashToken(rawCookie)`.
- Middleware и logout прогоняют cookie через `hashToken` до запроса в БД.
- Не класть сырой refresh в Prisma.

### 1.3 Явный refresh

- Раскомментировать `POST /auth/refresh` в `auth.routes.ts`.
- Контроллер вызывает существующий `AuthService.refresh()`, ставит новые cookies, ротирует сессию.
- BFF `app/api/auth/refresh/route.ts` уже есть — прогнать руками, убедиться что `Set-Cookie` доходит до браузера.

### 1.4 Logout

- Чистить три cookies: `accessToken`, `refreshToken`, `userId`.
- На фронте: сбрасывать Redux `isAuthenticated` и `AuthProvider.user`; не хардкодить `localhost:3000` в `logout-button.tsx`.

Проверка:

- Логин → `/auth/me` ок.
- Подождать/подменить access на протухший → silent refresh или `POST /api/auth/refresh` → снова `/me` ок.
- Logout → cookies пустые, `/me` 401, повторный заход на `/dashboard` → `/auth/login`.

---

## Фаза 2 — починить BFF

Иначе следующие фазы бьются в кривые хендлеры. Баги [F1](./BUGS.md), [F2](./BUGS.md), [F8](./BUGS.md), [F15](./BUGS.md), [F16](./BUGS.md), [D4](./BUGS.md).

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| Старт | `finding-dev-server-url` | Оба процесса живы: Next `:3000`, Fastify `:3001` |
| Порт занят | `detecting-port-conflicts` | Не поднимать второй Next на другом порту «на глаз» |
| После правок хендлеров | `api-smoke-testing` | Пройти все `app/api/*`; register не 500; `GET /api/cart/:id` не отдаёт product |
| После smoke | `network-request-auditing` | Тело register — один JSON, не строка-в-строке; status проксируется |
| Логин-форма | `form-testing` | Неверный пароль → ошибка, не «успех» ([F8](./BUGS.md)) |
| Типы | `auto-type-checking` | `nodejsFetch` принимает object, не `string` дважды |
| Если lint/build красные | `grinding-until-pass` | До зелёного, не оставлять «потом» |
| 2–3 раза правите один шаблон BFF | `suggesting-cursor-rules` | Правило: не `Response.json(Response)`, форвардить `set-cookie` |

1. Один helper URL бэка: `process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001'`. Подставить в `lib/nodejs/fetcher.ts` и `app/api/auth/logout/route.ts`. Серверному коду лучше `API_URL` без `NEXT_PUBLIC_`.
2. Шаблон хендлера: `nodejsFetch` → если `!ok`, вернуть status и body как есть → иначе `json` + форвард `set-cookie` когда бэк его шлёт. Не делать `Response.json(Response)`.
3. `app/api/auth/register/route.ts`: передавать в `nodejsFetch` объект `body`, не `JSON.stringify(body)`. Отдавать JSON клиенту.
4. `app/api/cart/[id]/route.ts` GET: `/cart/${id}`, не `/products/${id}`.
5. `app/api/products/slug/[slug]/route.ts` PATCH: param `slug`.
6. Починить `app/api/profile/route.ts` (и tasks, если модуль ещё жив).
7. `login-form.tsx`: если `!response.ok` — ошибка, не «успех».
8. `getUser()` / logout-button: относительные `/api/...` или `NEXT_PUBLIC_URL`.

Проверка: register возвращает JSON 201; GET `/api/cart/:id` не отдаёт товар; login с неверным паролем показывает ошибку.

---

## Фаза 3 — идентичность на корзине и профиле

Баги [B5](./BUGS.md), [F3](./BUGS.md), [F4](./BUGS.md), [F5](./BUGS.md), [F6](./BUGS.md), [F10](./BUGS.md). Контракт корзины: [BACKEND.md](./BACKEND.md), [FRONTEND.md](./FRONTEND.md).

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| До кода, выбор A vs B | `architecture-decision-records` | Записать решение. По умолчанию **A** (только логин). Не кодить оба варианта |
| Старт | `parallel-exploring` | `cart.controller` + `cartSlice` + `CartModal` + `ProductActions` + profile routes |
| После JWT на `/cart` | `auditing-security` | IDOR: чужой `userId` в body игнорируется; DELETE чужой строки → 403/404 |
| UI корзины | `visual-qa-testing` | Добавить / qty / удалить / кнопка на `/checkout` |
| Гость и залогиненный | `form-testing` + `verifying-in-browser` | A: гость → логин. Залогиненный: 2× add → qty 2 на сервере |
| Сеть | `network-request-auditing` | PATCH qty уходит; нет POST с `userId: ''` |
| Конец | `saving-workspace-context` | Контракт CartItem: `priceAtAdding`, какой id для remove |

Не чинить гостя через пустой UUID. Не открывать `database-design` ради варианта B в этой фазе.

### 3.1 Бэк: JWT, не cookie/body

- На все `/cart` и мутации `/profile` повесить `authMiddleware`.
- `userId` только из `request.user.userId`. Игнорировать body/cookie.
- POST корзины: **upsert** по `(userId, productId)` — увеличить quantity, не падать на unique.
- PATCH/DELETE: сначала найти строку, сверить `item.userId === request.user.userId`, иначе 404/403.
- GET `/cart/` — корзина текущего JWT-пользователя.

Решение по гостю (выбрать одно и зафиксировать в коде):

- **A (проще, рекомендуется сейчас):** добавлять в корзину только залогиненным; на 401 фронт зовёт `/auth/login`.
- **B:** анонимная сессия (отдельная таблица / cookie `cartSession`) и merge при логине. Не делать, пока нет заказов.

### 3.2 Фронт: один CartItem

- Везде `priceAtAdding`, не `item.price` и не литерал `1.2`. Скидка: `price * (1 - percent/100)` либо явно задокументировать формат `memberDiscountPercent`.
- `removeFromCart` — по `product.id` **или** по id строки, но один способ на слайс и CartModal.
- +/- quantity → `PATCH /api/cart/:id`.
- Удалить или починить мёртвые `utils/addProductToCart.ts` и `lib/features/api/cart/addToCart.ts` (сейчас POST в `/api/products`).
- Кнопка покупки в `CartModal` → `/checkout`.

Проверка: дважды «в корзину» один sku → quantity 2 на сервере; чужим id строка не удаляется; гость либо редирект на логин, либо осознанный merge (если выбрали B).

---

## Фаза 4 — заказы (закрыть покупку)

Это продуктовый смысл проекта. Баг [B1](./BUGS.md). Модели уже в Prisma — см. [BACKEND.md](./BACKEND.md) и [DATABASE_SCHEMAS.md](../DATABASE_SCHEMAS.md).

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| До модуля | `database-design` | Использовать **существующие** Order / OrderItem / ShippingAddress / Payment. Не плодить таблицы |
| Старт | `parallel-exploring` | Prisma schema + checkout page + BFF-шаблон фазы 2 |
| После `POST /orders` | `api-smoke-testing` | 401 без cookie; 400 без города НП; 201 с корзиной |
| Форма checkout | `form-testing` | Валидный НП / курьер / битый телефон / пустая корзина |
| Сеть | `network-request-auditing` | Клиент не шлёт итоговую цену как истину; после 201 корзина пустая |
| UI | `visual-qa-testing` + `responsive-testing` | Desktop и mobile: секции, тосты ошибок, редирект «дякуємо» |
| Конец флоу | `verifying-in-browser` | 2 товара → заказ в БД → `/orders` снапшот; цена в админке не меняет чек |
| Перед мержем | `reviewing-code` или `parallel-code-review` | Транзакция, снапшот, auth, нет membership в этом PR |
| Если типы/lint | `grinding-until-pass` | |

Не использовать `adding-stripe` — Payment.status = Pending, шлюза нет. `adding-api-docs` — после стабильного контракта, не в этом же PR.

### 4.1 Модуль на бэке

Создать `src/modules/order/` по тому же шаблону, что product/cart.

`POST /orders` (`authMiddleware`):

1. Zod: контакт, delivery (НП или курьер), payment method, comment, **не** доверять ценам с клиента.
2. Транзакция:
   - прочитать `cart_items` пользователя + продукты;
   - посчитать subtotal / shipping / discount / total на сервере;
   - создать `Order` (`orderNumber` уникальный), `OrderItem` **снапшотом** (name, slug, image, category, unitPrice, quantity);
   - `ShippingAddress` из delivery;
   - `Payment` со статусом Pending;
   - удалить `cart_items` пользователя.
3. Пока без платёжного шлюза: метод из формы, статус Pending.
4. Зарегистрировать в `app.ts`: `prefix: '/orders'`.
5. Минимум ещё: `GET /orders` (список своих), `GET /orders/:id`.

Не тащить в этот PR membership stamps и `activity_events`, если не успевается — пустые хуки лучше сломанной транзакции.

### 4.2 BFF и UI

- `app/api/orders/route.ts` — POST/GET, cookie + JSON по шаблону фазы 2.
- Checkout submit: `priceAtAdding` не слать как истину; достаточно `productId` + `quantity` (бэк сам посчитает). Контакт/доставка/комментарий — да.
- Успех: очистить Redux-корзину, редирект на `/orders` или страницу «дякуємо».
- Ошибки валидации (нет города НП и т.д.) — тост, не молчаливый `catch`.

Проверка: положить 2 товара → checkout НП → заказ в БД, корзина пустая, `/orders` показывает снапшот. Сменить цену товара в админке → старый заказ не меняется.

---

## Фаза 5 — авторизация админки товаров

Баг [B4](./BUGS.md). Делать после стабильного JWT (фаза 1).

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| До миграции роли | `database-design` | `Customer` \| `Admin` на User vs отдельная таблица — один вариант, миграция |
| После `adminMiddleware` | `auditing-security` | GET `/products` публичный; POST/PATCH/DELETE без Admin → 403. Не «скрыть кнопку» |
| Проверка | `api-smoke-testing` | Два токена: customer и admin |
| UI dashboard | `visual-qa-testing` | Customer не видит вкладку Products / форму create |
| Перед мержем | `reviewing-code` | Middleware порядок: сначала auth, потом admin |

1. В Prisma: роль на `User` (`Customer` | `Admin`) или отдельная таблица. Миграция, одному email выдать Admin.
2. `adminMiddleware` после `authMiddleware`: не Admin → 403.
3. Навесить на POST/PATCH/DELETE `/products`. GET оставить публичным.
4. Фронт: dashboard products только для admin; остальные `/dashboard` вкладки можно спрятать. Не полагаться на «скрытую ссылку».

Проверка: обычный юзер — 403 на create; админ создаёт товар, он появляется в `/shop`.

---

## Фаза 6 — кабинет на живых данных

Когда есть заказы и JWT.

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| Старт | `parallel-exploring` | ProfileForm, OrdersList, типы `orders.types.ts` vs реальный API |
| После замены моков | `verifying-in-browser` | `/profile`, `/orders`, dashboard цифры |
| Форма профиля | `form-testing` | PATCH имени/телефона, релоад — данные с сервера |
| Сеть | `network-request-auditing` | Больше нет хардкода «Oleksandr Developer» в ответе |
| Адаптив кабинета | `responsive-testing` | |
| Конец | `auto-type-checking` | `types/orders.types.ts` отвязан от мок-`Product` |

1. `/profile` — `GET/PATCH /api/profile/me` (на бэке сначала повесить middleware, см. фазу 3). Убрать «Oleksandr Developer».
2. `/orders` — `GET /api/orders` вместо `MOCK_ORDERS`. Обновить `types/orders.types.ts` под API, не под мок-`Product`.
3. Membership оставить моком **или** завести `GET /profile/membership` по модели `MembershipPass` — отдельным маленьким PR, не смешивать с заказами.
4. `DashboardStats` / `ProductStats` — считать из API или убрать цифры.

---

## Фаза 7 — витрина

Не блокирует покупку, но стыдно оставлять.

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| После фильтров | `verifying-in-browser` + `visual-qa-testing` | Категории = Prisma enum; фильтр реально режет список |
| Сетка карточек | `responsive-testing` | Mobile / tablet / desktop |
| Ссылка в хедере | руками + browser | `/products` больше нет, `/shop` открывается |
| Если правите токены/тайпографику | `using-ui-stack` | Не изобретать новую палитру |
| Пустые состояния фильтра | `form-testing` | Нет результатов ≠ белый экран |

1. Хедер: `/products` → `/shop`. Баг [F13](./BUGS.md).
2. Включить фильтры/сорт в `components/shop/page.tsx`. Категории — Prisma enum из [FRONTEND.md](./FRONTEND.md), не `Beans/Instant` из моков.
3. Выкинуть или явно пометить `lib/data/mockProducts.ts`, если шоп больше не зависит от него.

---

## Фаза 8 — вычистить наследие

Когда живые флоу не опираются на starter. Список файлов: [FRONTEND.md](./FRONTEND.md) (секция leftover), [BACKEND.md](./BACKEND.md) (tasks, mongoose).

### Скилы

| Когда | Скил | Зачем |
|---|---|---|
| Старт | `parallel-exploring` | Найти все импорты supabase / tasks / tutorial до удаления |
| После удаления | `auto-type-checking` + `grinding-until-pass` | Билд не должен ссылаться на удалённые файлы |
| Конфликт `/` | `verifying-in-browser` | Главная — Coffeo, не starter |
| Если оставляете forgot/reset | `form-testing` | Иначе удалить страницы, не оставлять мёртвые формы |
| Документация | `verifying-markdown-formatting` | README, metadata, ссылки в `project-description/` |
| Повторные конвенции | `suggesting-cursor-rules` | «не возвращать starter», «не звать Fastify из браузера» |

1. Удалить `app/(admin)/page.tsx` (конфликт `/`, [F18](./BUGS.md)).
2. Удалить tutorial, supabase-компоненты, `/admin` starter, `/protected` demo, `/task-api`, `app/api/tasks`, `lib/supabase`, `lib/nodejs/proxy.ts` если так и не подключили.
3. Снять `@supabase/ssr`, `@supabase/supabase-js`.
4. На бэке удалить модуль `tasks` (или закрыть auth, если нужен как песочница). Выкинуть `mongoose`, `cheerio`, `axios`, `decimal.js`.
5. README и `metadata` в `app/layout.tsx` переписать под Coffeo.
6. Forgot/reset: либо реализовать (BFF + бэк + письмо), либо убрать ссылки и страницы, чтобы не было мёртвых форм ([F7](./BUGS.md)).

Отдельно, не обязательно в этой фазе: кэш Nova Poshta, rate limit на `/auth/log-in`, CSRF если появятся кросс-сайт сценарии ([D9](./BUGS.md), [D10](./BUGS.md)).

---

## Порядок, если времени мало

Минимум, чтобы «можно купить кофе»:

0 → 1 → 2 → 3 (вариант A: только логин) → 4 → кнопка из корзины на checkout.

Админку товаров закрыть фазой 5 в том же спринте, если API торчит в интернет.

Не начинать с membership, newsletter, activity_events, coffee details — схема подождёт, см. таблицу домена в [PROJECT.md](./PROJECT.md).

---

## После каждой закрытой фазы

1. `auto-type-checking` на затронутых репо.
2. Чеклист фазы руками (или `verifying-in-browser`, если был UI).
3. Коммит — `writing-commit-messages` (тип + фаза в scope, например `fix(auth): hash refresh lookup`).
4. Если просят PR — `creating-pr`; пока открыт — `babysitting-pr`.
5. Крупные фазы (1, 3, 4, 5) перед мержем — `reviewing-code` или `parallel-code-review`.

---

## Что не делать по дороге

- Не звать Fastify из браузера в обход BFF — сломаете cookies.
- Не слать итоговую цену заказа с клиента как истину.
- Не чинить guest-корзину через `userId: ''` или случайный UUID без таблицы сессий.
- Не коммитить `.env`.
- Не подключать `lib/nodejs/proxy.ts` как middleware, пока redirect-логика не дописана (сейчас она редиректит на тот же URL).
