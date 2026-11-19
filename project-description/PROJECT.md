# Coffee Shop — описание проекта

Интернет-магазин кофе **Coffeo**: витрина, корзина, оформление заказа, личный кабинет и админка товаров.

Система состоит из двух репозиториев. Браузер работает только с фронтом; бэкенд спрятан за BFF-прокси Next.js.

| Репозиторий | Роль | Стек | Порт |
|---|---|---|---|
| `coffee-shop` (эта папка) | UI + BFF | Next.js App Router, React 19, Redux Toolkit, Tailwind | `3000` |
| [`fastify-todo-api`](/Users/leo/WebstormProjects/fastify-todo-api) | API + БД | Fastify 5, Prisma 7, PostgreSQL | `3001` |

Связанные документы:

- [FRONTEND.md](./FRONTEND.md) — маршруты, состояние, BFF, страницы
- [BACKEND.md](./BACKEND.md) — модули Fastify, Prisma, auth, пробелы домена
- [BUGS.md](./BUGS.md) — баги и дыры безопасности фронт + бэк
- [ROADMAP.md](./ROADMAP.md) — порядок работ
- [SKILLS_USE.md](./SKILLS_USE.md) — какие Cursor-скилы читать и на какой фазе

---

## Зачем это существует

Пользователь смотрит каталог кофе, кладёт товар в корзину, указывает контакт и отделение Новой Почты, оформляет заказ. Залогиненный пользователь видит профиль, историю заказов и карту лояльности. Админ управляет товарами из dashboard.

Сейчас **витрина и CRUD товаров живые**. Покупка не замыкается: checkout-форма есть, модуля заказов нет. Часть кабинета — моки. Auth переведён с Supabase на свой JWT, но starter-kit не вычищен.

---

## Как устроен поток запроса

```
Браузер (:3000)
  ├─ React-страницы (App Router)
  ├─ Redux (корзина, товары админки, флаг auth)
  └─ fetch('/api/...')
        │
        ▼
Next.js Route Handlers  =  BFF
  lib/nodejs/fetcher.ts  →  http://127.0.0.1:3001/...
  прокидывает Cookie / Set-Cookie
        │
        ▼
Fastify (:3001)
  /auth  /profile  /products  /cart  /nova-poshta  /tasks
        │
        ├─ Prisma → PostgreSQL
        └─ Nova Poshta HTTP API
```

CORS между `:3000` и `:3001` не нужен для UI: браузер не бьёт в Fastify напрямую. Cookies живут на origin фронта, потому что BFF форвардит `Set-Cookie`.

Исключение: URL бэка захардкожен в `lib/nodejs/fetcher.ts` как `http://127.0.0.1:3001` (login смотрит на `NEXT_PUBLIC_API_URL`).

---

## Домен

Целевой поток из [DATABASE_SCHEMAS.md](./DATABASE_SCHEMAS.md) и Prisma-схемы бэка:

1. Пользователь смотрит `products`.
2. Кладёт в `cart_items`.
3. Оформляет заказ → `orders` + `order_items` (+ адрес, платёж).
4. Параллельно обновляются `membership_passes` и пишется `activity_events`.

| Сущность | Смысл | Реализация |
|---|---|---|
| Product (+ CoffeeDetails, Brand) | Что продаём | Базовый CRUD товара. Детали кофе / бренд — только схема |
| User / Session / Profile | Кто покупает | Register, login, logout, me. Refresh сломан |
| CartItem | Корзина до заказа | CRUD есть, без JWT, гость ломается |
| Order / OrderItem / Shipping / Payment | Факт покупки | Схема + UI checkout. API нет |
| MembershipPass | Лояльность, штампы, QR | Мок на фронте |
| NewsletterSubscriber | Рассылка | Нет |
| ActivityEvent | Лог действий | Нет |
| Task | Учебный leftover | Маршруты есть, к магазину не относятся |

---

## Auth (как задумано)

Свой JWT, не Supabase.

- Логин: `POST /api/auth/log-in` → Fastify `POST /auth/log-in`.
- Cookies: `accessToken` (15 мин), `refreshToken` (7 дней), `userId`. Все HttpOnly, `sameSite=lax`, `secure` только в production.
- Access проверяет `@fastify/jwt` по cookie. Если протух — middleware пытается обновить по refresh.
- Refresh в БД хранится как SHA-256. На практике middleware ищет сырой токен — silent refresh не работает. Подробности: [BUGS.md](./BUGS.md), [BACKEND.md](./BACKEND.md).

Защита `(protected)/*` на фронте: серверный `layout.tsx` → `getUser()` → `GET /api/auth/me`. Next `middleware.ts` нет.

---

## Что готово / что нет

| Фича | Статус |
|---|---|
| Главная Coffeo | Готово (часть блоков на моках) |
| Каталог и карточка товара | Готово, реальный API |
| Фильтры / сортировка шопа | UI есть, логика не подключена |
| Корзина UI | Готово |
| Синхронизация корзины | Частично; гость падает на пустом UUID |
| Checkout UI + Nova Poshta | Форма готова |
| Создание заказа | Нет (`/api/orders` не существует) |
| Login / logout / me | В целом работает |
| Регистрация | BFF сломан |
| Сброс пароля | Нет |
| Dashboard: товары | Готово (без роли admin) |
| Заказы / membership / профиль | Моки |
| Supabase starter, `/tasks` | Наследие |

---

## Состояние (фронт)

Два источника правды:

- **React Context** `AuthProvider` — объект пользователя.
- **Redux Toolkit** — `cart`, `products` (админка), `auth.isAuthenticated` (ставится при логине, не сбрасывается при логауте).

Protected-страницы опираются на серверный `getUser()`, не на Redux.

---

## Происхождение кода

Фронт начат с [Next.js + Supabase Starter Kit](https://github.com/vercel/next.js/tree/canary/examples/with-supabase). Auth уехал на Fastify, пакеты `@supabase/ssr` и `@supabase/supabase-js` ещё стоят. README и metadata страницы всё ещё про starter.

Бэкенд начат как todo-API (`fastify-todo-api`). Модуль `/tasks` и зависимость `mongoose` остались.

---

## Локальный запуск

Нужны оба процесса.

**Бэкенд** (`fastify-todo-api`):

```bash
# .env: DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
#       COOKIE_SECRET, NOVA_POSHTA_API_KEY
npm run dev   # :3001
```

**Фронт** (`coffee-shop`):

```bash
# .env.local: NEXT_PUBLIC_URL=http://localhost:3000
#             NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
npm run dev   # :3000
```

Практически BFF всё равно бьёт в `127.0.0.1:3001`, кроме login.

---

## Принципы, которые уже есть и их стоит сохранить

- Слои на бэке: routes → controller → service → repository, Zod на входе.
- BFF, чтобы HttpOnly-cookies жили на том же origin, что и UI.
- Снапшот цены в `CartItem.priceAtAdding` и в будущих `OrderItem` (название, slug, цена на момент покупки).
- Refresh-токен в БД хешируется — чинить нужно lookup, не саму идею.
- Пароли: bcrypt, cost 12.

Что не стоит масштабировать: `userId` из cookie/body вместо JWT; публичные мутации товаров; моки рядом с живым API без пометки; хардкод `127.0.0.1:3001`.
