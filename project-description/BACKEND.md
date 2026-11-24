> **HISTORICAL — не поточний стан Coffeo (позначено 24.11.2026).**
> Цей документ описує попередню версію. API вже має orders, auth/role guards і виправлення публічної реєстрації; наведені нижче твердження про їхню відсутність застаріли. Актуальні [аудит](../docs/PROJECT_AUDIT_UA.md), [план](../docs/IMPLEMENTATION_PLAN_UA.md) і [правила](../AGENTS.md) мають пріоритет. Старі списки фаз та інструкції скілів нижче не є поточним дорученням.

# Бэкенд — fastify-todo-api

API интернет-магазина. Репозиторий: [`/Users/leo/WebstormProjects/fastify-todo-api`](/Users/leo/WebstormProjects/fastify-todo-api).

Фронт ходит сюда только через BFF Next.js. Общая картина — [PROJECT.md](./PROJECT.md). Баги — [BUGS.md](./BUGS.md).

---

## Стек

| Слой        | Технология                                                                      |
| ----------- | ------------------------------------------------------------------------------- |
| HTTP        | Fastify 5                                                                       |
| БД          | PostgreSQL, Prisma 7 (`@prisma/adapter-pg`)                                     |
| Валидация   | Zod 4                                                                           |
| Auth        | `@fastify/jwt` + `jsonwebtoken` (два стека сразу), `@fastify/cookie`, bcrypt 12 |
| Почта       | nodemailer — файл `src/jobs/send-mail.job.ts` нигде не импортируется            |
| Nova Poshta | native `fetch` на `https://api.novaposhta.ua/v2.0/json/`                        |
| Логи        | pino-pretty                                                                     |
| Dev         | `ts-node-dev`                                                                   |

Имя пакета всё ещё `fastify-todo-api`. Тестов нет (`npm test` сразу exit 1).

Не используются, но стоят в `package.json`: `mongoose`, `cheerio`, `axios`, `decimal.js`.

---

## Точка входа

```
src/index.ts     listen на PORT || 3001, prisma.$connect()
src/app.ts       buildApp(): cookie, jwt, регистрация модулей
src/config/prisma.ts
src/config/env.ts     НЕ импортируется; в git лежат захардкоженные секреты — удалить и ротировать
src/shared/plugins/auth.ts     authMiddleware
src/shared/plugins/jwt.ts      не регистрируется
src/types/fastify.d.ts         JWT payload типизирован как { id, email }, рантайм часто { userId, email }
```

Префиксы из `app.ts`:

| Prefix         | Модуль      |
| -------------- | ----------- |
| `/auth`        | auth        |
| `/profile`     | profile     |
| `/products`    | product     |
| `/cart`        | cart        |
| `/nova-poshta` | nova-poshta |
| `/orders`      | order       |

Нет: `@fastify/cors`, CSRF, rate limit, глобальный error handler, ролей/admin-guard.

CORS сейчас не блокер: UI ходит через BFF. Понадобится, если браузер начнёт бить в `:3001` напрямую.

---

## Слои модуля

Типичный модуль:

```
*.routes.ts → *.controller.ts → *.service.ts → *.repository.ts
*.schema.ts (Zod)    *.types.ts
```

DI ручной: в `routes.ts` создаются repository → service → controller. Общего контейнера нет.

---

## Prisma: модели vs API

Схема: `prisma/schema.prisma`. Клиент генерируется в `src/generated/prisma`.

### Реализованы частично

**User** (`users`) — email unique, `passwordHash`. Связи: sessions, tasks, profile, orders, cartItems, membership, newsletter, activity.

**Session** (`sessions`) — `refreshToken` unique (в БД кладётся хеш), `expiresAt`, userAgent, ip.

**Profile** (`profiles`) — `userId` PK, firstName, lastName, phone, photoUrl. На регистрации создаётся с именами `"Coffee"` / `"Is great"`.

**Product** (`products`) — slug unique, sku, name, description, imageUrl, `ProductCategory`, price Decimal, currency USD, `memberDiscountPercent`, `stockQuantity`, `isActive`, optional brand. API Zod принимает только name, description, imageUrl, category, price.

**CartItem** (`cart_items`) — `@@unique([userId, productId])`, quantity, `priceAtAdding`. Guest-корзины нет: `userId` обязательный FK на User.

**Task** (`tasks`) — leftover todo.

### Только схема, кода нет

| Модель                 | Назначение                                                 |
| ---------------------- | ---------------------------------------------------------- |
| `CoffeeDetails`        | Обжарка, происхождение, SCA, brewing methods, flavor notes |
| `Brand`, `FlavorNote`  | Справочники                                                |
| `Order`                | Статусы Pending…Refunded, суммы, orderNumber               |
| `OrderItem`            | Снапшот имени, slug, цены, quantity; `productId` nullable  |
| `ShippingAddress`      | 1:1 к заказу                                               |
| `Payment`              | Card / PayPal / Cash, статус, transactionId                |
| `MembershipPass`       | passCode, stamps, memberDiscountPercent                    |
| `NewsletterSubscriber` | email unique, opt-in/out                                   |
| `ActivityEvent`        | LOGIN, LOGOUT, ORDER_CREATED, PRODUCT_VIEWED, CART_UPDATED |

Миграция checkout-моделей уже есть: `prisma/migrations/20260607210912_checkout_models/`.

---

## Auth

Файлы: `src/modules/auth/*`, `src/shared/plugins/auth.ts`, `src/utils/hash-token.ts`.

| Метод                 | Auth                | Поведение                                                |
| --------------------- | ------------------- | -------------------------------------------------------- |
| `POST /auth/register` | нет                 | Zod, bcrypt, юзер + профиль. **Не логинит**, токенов нет |
| `POST /auth/log-in`   | нет                 | Ставит `accessToken`, `refreshToken`, `userId`           |
| `POST /auth/logout`   | нет                 | Удаляет сессию по refresh cookie                         |
| `GET /auth/me`        | `authMiddleware`    | `{ id, email }` (читается `request.user.userId`)         |
| `POST /auth/refresh`  | **закомментирован** | `AuthService.refresh()` есть, контроллера нет            |

Cookies при логине: `httpOnly`, `sameSite: 'lax'`, `secure` если `NODE_ENV === 'production'`, `path: '/'`, без `domain`. Logout чистит access/refresh, **`userId` не чистит**.

Access: 15 минут, payload `{ userId, email }`, подпись `jsonwebtoken` + `JWT_ACCESS_SECRET`.  
Refresh: 7 дней, payload **только `{ userId }`**, в БД — `hashToken` (SHA-256).

`authMiddleware`:

1. `request.jwtVerify({ onlyCookie: true })`.
2. Если упало — берёт `refreshToken` cookie, `jwt.verify` с `JWT_REFRESH_SECRET`.
3. Ищет сессию через `findSessionByToken(refreshToken)` **сырым** токеном → не находит хеш в БД → 401.
4. Если бы нашёл — переподписал бы access как `{ id, email }`, а не `{ userId, email }`. У refresh-payload нет `email`.

Итог: пока access жив, `/auth/me` работает. После 15 минут сессия «умирает», пока пользователь не залогинится снова.

Старт приложения требует `JWT_ACCESS_SECRET` и `COOKIE_SECRET`. `JWT_REFRESH_SECRET` не проверяется при бутстрапе.

---

## Products

`src/modules/product/*`

| Метод                      | Auth          |        |
| -------------------------- | ------------- | ------ |
| `GET /products/`           | публичный     | список |
| `GET /products/:id`        | публичный     | UUID   |
| `GET /products/slug/:slug` | публичный     |        |
| `POST /products/`          | **публичный** | create |
| `PATCH /products/:id`      | **публичный** | update |
| `DELETE /products/:id`     | **публичный** | delete |

Роли нет. Админка фронта работает, но любой клиент может то же самое.

Slug: транслитерация + slugify, при коллизии суффикс. Полей stock / sku / isActive / brand / coffeeDetails в create-схеме нет.

---

## Cart

`src/modules/cart/*`

| Метод              | Auth | Идентификация          |
| ------------------ | ---- | ---------------------- |
| `GET /cart/`       | нет  | `req.cookies.userId`   |
| `GET /cart/:id`    | нет  | любая строка по id     |
| `POST /cart/`      | нет  | `userId` **в body**    |
| `PATCH /cart/:id`  | нет  | без проверки владельца |
| `DELETE /cart/:id` | нет  | без проверки владельца |

Пустой `userId` → 404 `userId is empty`. Не-UUID → 400. Unique `(userId, productId)` не обрабатывается как upsert: повторный POST того же товара → Prisma unique violation → 500.

`UpdateCartInput` выведен из `createCartsSchema`, не из `updateCartsSchema`.

---

## Profile

`src/modules/profile/*`

| Метод             | Middleware |                                       |
| ----------------- | ---------- | ------------------------------------- |
| `GET /profile/me` | да         | ок                                    |
| `POST /`          | **нет**    | контроллер ждёт `request.user.userId` |
| `PATCH /`         | **нет**    | то же                                 |
| `DELETE /`        | **нет**    | то же                                 |

Zod-схемы в `profile.schema.ts` контроллер не вызывает — сырой `request.body`.

---

## Nova Poshta

`src/modules/nova-poshta/*`

Ключ: `process.env.NOVA_POSHTA_API_KEY` в момент регистрации роутера. Если пустой — в NP уйдёт `undefined`, старт не падает.

| Метод                                         |                          |
| --------------------------------------------- | ------------------------ |
| `GET /nova-poshta/cities?query=`              | поиск населённых пунктов |
| `GET /nova-poshta/settlements?query=`         | дубль `getCities()`      |
| `GET /nova-poshta/warehouses?cityRef=&query=` | отделения города         |

Кэша нет. Каждый запрос с фронта (через BFF) идёт во внешний API. В service оставлены `console.log`. В repository неиспользуемые импорты Prisma.

---

## Tasks

`src/modules/tasks/*` — учебный модуль. `POST /` и `GET /` без `authMiddleware`, контроллер читает `request.user.userId` → падение. К магазину не относится. Repository умеет update/delete, маршрутов нет.

---

## Env бэка

Из `.env.example`:

| Переменная            | Обязательна                           |     |
| --------------------- | ------------------------------------- | --- |
| `JWT_ACCESS_SECRET`   | да, throw в `app.ts`                  |     |
| `COOKIE_SECRET`       | да, throw в `app.ts`                  |     |
| `JWT_REFRESH_SECRET`  | фактически да, без проверки на старте |     |
| `DATABASE_URL`        | да для Prisma                         |     |
| `PORT`                | нет, default 3001                     |     |
| `NODE_ENV`            | нет, влияет на `secure` cookie        |     |
| `NOVA_POSHTA_API_KEY` | для доставки                          |     |
| `NODEMAILER_*`        | нет, job мёртвый                      |     |
| `MONGO_URI`           | нет, наследие                         |     |

Типизированного env-схемы (zod/envalid) нет: везде `process.env`.

---

## Скрипты

```bash
npm run dev                 # ts-node-dev src/index.ts
npx prisma migrate dev      # npm run migration
npx prisma migrate reset    # npm run "migration reset"
npx prisma studio           # npm run prisma
```

---

## Что сознательно повторять в новых модулях

- Тот же расклад файлов и Zod в контроллере (как в product/cart).
- Идентичность пользователя **только из JWT** (`authMiddleware`), не из body/cookie.
- Для заказа: транзакция Prisma — создать Order + OrderItem (снапшот) + ShippingAddress + Payment, очистить cart_items.
- Снапшот товара в позиции заказа, чтобы смена цены в каталоге не переписывала чек.

Чего не копировать: публичные мутации, `userId` с клиента, сырой refresh в `findSessionByToken`, модуль tasks.
