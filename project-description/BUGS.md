# Баги — фронт + бэк

Список известных дефектов. Архитектура: [PROJECT.md](./PROJECT.md), [FRONTEND.md](./FRONTEND.md), [BACKEND.md](./BACKEND.md). Порядок починки: [ROADMAP.md](./ROADMAP.md).

Фронт — эта папка. Бэк — `/Users/leo/WebstormProjects/fastify-todo-api`.

Легенда: **P0** ломает покупку/сессию или дыра в данных; **P1** ломает фичу; **P2** долг и расхождения контрактов.

---

## P0 — критично

### B1. Заказ нельзя создать

- **Где:** `app/(public)/checkout/page.tsx` → `POST /api/orders`; на Fastify нет `src/modules/order`
- **Что:** UI checkout и Prisma-модели (`Order`, `OrderItem`, `ShippingAddress`, `Payment`) есть. Маршрута нет. Success-ветка пустая.
- **Ещё:** в payload `price: item.price`, в слайсе поле `priceAtAdding` → даже после появления API цены будут `undefined`.

### B2. Silent refresh не находит сессию

- **Где бэк:** `src/modules/auth/auth.service.ts` (login кладёт `hashToken(refreshToken)`), `src/shared/plugins/auth.ts` (`findSessionByToken(refreshToken)` сырым)
- **Что:** после истечения access (15 мин) middleware не узнаёт валидный refresh → 401. Logout по сырому токену тоже может не стереть строку сессии.
- **Связано:** `POST /auth/refresh` закомментирован в `auth.routes.ts`.

### B3. JWT payload `userId` vs `id`

- **Где бэк:** login подписывает `{ userId, email }`; middleware refresh подписывает `{ id, email }`; `fastify.d.ts` — `{ id, email }`; `/auth/me` читает `request.user.userId`
- **Что:** refresh-JWT содержит только `{ userId }`, без `email`. После «успешного» refresh `/auth/me` может отдать пустой id.
- **Чинить вместе с B2**, иначе починенный refresh сломает `me`.

### B4. Мутации товаров без auth

- **Где бэк:** `src/modules/product/product.routes.ts` — POST/PATCH/DELETE публичные
- **Что:** любой клиент создаёт, меняет, удаляет товары. На фронте dashboard не проверяет роль.

### B5. Корзина: IDOR, userId с клиента

- **Где бэк:** `src/modules/cart/cart.controller.ts`, `cart.routes.ts`
- **Что:**
  - GET `/cart/` доверяет cookie `userId`, не JWT
  - POST берёт `userId` из body
  - PATCH/DELETE по id без проверки владельца
- Можно читать и менять чужую корзину, зная UUID пользователя или id строки.

### B6. Секреты в git

- **Где бэк:** `src/config/env.ts` (файл tracked, приложением не импортируется)
- **Что:** JWT, БД, почта захардкожены. Удалить файл, ротировать ключи, проверить историю git.

---

## P1 — ломает фичу

### F1. Регистрация через BFF

- **Где:** `app/api/auth/register/route.ts` + `lib/nodejs/fetcher.ts`
- **Что:** `nodejsFetch` сам делает `JSON.stringify(body)`, хендлер уже передаёт строку → двойной stringify. Возврат сырого `Response` вместо JSON. Set-Cookie нет (на бэке register и не логинит — это отдельно, см. ROADMAP).

### F2. `GET /api/cart/[id]` ходит в продукты

- **Где:** `app/api/cart/[id]/route.ts`
- **Что:** скопирован хендлер товара: `nodejsFetch(\`/products/${id}\`)`. DELETE проксирует `/cart/:id` правильно.

### F3. Гостевая корзина

- **Где:** `ProductActions.tsx` / карточки → `userId: user?.id ?? ''`; бэк `cart.controller.ts` валидирует UUID
- **Что:** гость получает `Invalid UUID`. Redux локально растёт, сервер нет. Prisma `CartItem.userId` обязателен — настоящей guest-корзины на бэке нет.

### F4. Quantity корзины не синкается

- **Где:** `components/cart/CartModal.tsx`
- **Что:** +/- только `updateQuantity` в Redux. `PATCH /api/cart/:id` с фронта не вызывается.

### F5. Удаление из корзины: разные id

- **Где:** `cartSlice.removeFromCart` фильтрует `product.id`; CartModal диспатчит `data.id` (id `CartItem`)
- **Что:** после успешного DELETE строка может остаться в UI.

### F6. Profile мутации без middleware

- **Где бэк:** `profile.routes.ts` — POST/PATCH/DELETE без `authMiddleware`, контроллер читает `request.user.userId`
- **Что:** 500 на вызове. Zod-схемы не используются.

### F7. Forgot / reset password

- **Где:** `forgot-password-form.tsx`, `update-password-form.tsx`
- **Что:** `'use client'` импортирует `nodejsFetch` (`next/headers`) — упадёт в браузере. BFF-маршрутов нет, на бэке эндпоинтов нет.

### F8. Login не проверяет `response.ok`

- **Где:** `components/login-form.tsx`
- **Что:** 401/500 парсятся как JSON и могут выглядеть как успешный логин.

### F9. Logout не чистит `userId` cookie

- **Где бэк:** `auth.controller.ts` logout
- **Что:** корзина продолжает считать пользователя залогиненным по cookie.

### F10. Повторное добавление того же товара → 500

- **Где бэк:** `CartItem @@unique([userId, productId])`, create без upsert
- **Что:** второй POST того же товара — Prisma unique violation.

### F11. Кнопка покупки в корзине никуда не ведёт

- **Где:** `CartModal.tsx`
- **Что:** нет `href` / `router.push('/checkout')`.

### F12. Фильтры и сортировка шопа

- **Где:** `components/shop/page.tsx`, `FilterSidebar.tsx`
- **Что:** фильтрация закомментирована, sort без handler. Категории моков ≠ enum Prisma.

### F13. Хедер ведёт на `/products`

- **Где:** `components/layout/Header.tsx`
- **Что:** страницы нет, каталог на `/shop`.

### F14. `priceAtAdding: 1.2` и скидка как множитель

- **Где:** `ProductActions.tsx`, `CatalogProductCard.tsx`
- **Что:** в API уходит захардкоженная цена. Скидка считается `price * discount`, не процент.

### F15. PATCH продукта по slug использует не тот param

- **Где:** `app/api/products/slug/[slug]/route.ts`
- **Что:** PATCH берёт имя параметра `id` при сегменте `slug`.

### F16. Кривые JSON в BFF

- **Где:** `app/api/profile/route.ts`, `app/api/tasks/route.ts`; иногда GET `/api/products`
- **Что:** `Response.json(data)`, где `data` уже `Response`.

### F17. Tasks на бэке падают

- **Где:** `task.routes.ts` без middleware, контроллер ждёт `request.user`
- **Что:** leftover. Либо удалить модуль, либо повесить auth.

### F18. Два `page.tsx` на `/`

- **Где:** `app/page.tsx` и `app/(admin)/page.tsx`
- **Что:** конфликт маршрута Next.js.

---

## P2 — долг и контракты

### D1. Нет Next middleware

- `lib/nodejs/proxy.ts` написан, не подключён. Redirect на логин закомментирован. Protected держится только на layout.

### D2. Два источника auth-состояния

- Context `user` vs Redux `isAuthenticated`. Флаг не сбрасывается на logout. Layout fallback `{ id, name }` ≠ тип `{ id, email }`.

### D3. Три модели товара / корзины / checkout

- `ProductsType` vs мок `Product`; `CartItem` слайса vs `types/checkout.types.ts`; старый `CheckoutForm` vs `CheckoutFormState`. `types/orders.types.ts` завязан на мок.

### D4. Хардкод URL

| Место | URL |
|---|---|
| `lib/nodejs/fetcher.ts` | `http://127.0.0.1:3001` |
| `app/api/auth/logout/route.ts` | то же |
| `components/logout-button.tsx` | `http://localhost:3000/api/auth/logout` |
| `lib/auth/getUser.ts` | fallback `http://localhost:3000` |

### D5. Supabase leftover

- `lib/supabase/*`, tutorial-компоненты, `/admin`, `/protected`, README, metadata layout, пакеты `@supabase/*`.
- `lib/supabase/fetcher.ts` — service role в имени `NEXT_PUBLIC_*`.

### D6. Мёртвый код фронта

- `utils/addProductToCart.ts` — `useDispatch()` на уровне модуля
- `lib/features/api/cart/addToCart.ts` — POST в `/api/products`
- `CheckoutForm.tsx`, `OrderSummaryOld.tsx`
- закомментированные блоки в API-роутах

### D7. Dashboard цифры фейковые

- `DashboardStats`, `ProductStats` — хардкод, не API.

### D8. Профиль / заказы / membership не ходят в API

- Страницы рендерят моки. `GET /api/profile/me` существует и не используется.

### D9. Nova Poshta без кэша, settlements = cities

- Каждый кейстрок — внешний HTTP. `GET /settlements` дублирует cities.

### D10. Нет кэша / rate limit / CSRF на бэке

- Auth-эндпоинты без ограничения попыток. CSRF нет; `sameSite=lax` частично закрывает, для cookie-мутаций этого мало на будущее.

### D11. `userId` cookie как канал идентичности

- Ставится при логине (B5, F9). Корзина завязана на неё. Правильный канал — JWT.

### D12. Неиспользуемые зависимости бэка

- `mongoose`, `cheerio`, `axios`, `decimal.js`; `MONGO_URI` в `.env.example`.

### D13. Почта не подключена

- `src/jobs/send-mail.job.ts` + nodemailer. Подтверждение регистрации / newsletter нет.

### D14. Metadata и README про Supabase

- `app/layout.tsx` title: «Next.js and Supabase Starter Kit».

### D15. `UpdateCartInput` с не той Zod-схемы

- `cart.types.ts` infers create вместо update.

---

## Матрица «симптом → баги»

| Что видит пользователь | ID |
|---|---|
| Checkout крутится / 404 | B1 |
| Через ~15 мин выкидывает из кабинета | B2, B3 |
| Нельзя зарегистрироваться | F1 |
| Гость добавил в корзину — после релоада пусто / ошибка UUID | F3, B5 |
| Количество в корзине сбросилось | F4 |
| Товар не исчезает из модалки | F5 |
| Кнопка купить в корзине ничего не делает | F11 |
| Фильтры шопа не работают | F12 |
| Ссылка Products → 404 | F13 |
| Цена в корзине 1.20 | F14 |
| Forgot password белый экран | F7 |
