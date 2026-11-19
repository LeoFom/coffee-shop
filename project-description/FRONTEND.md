# Фронтенд — coffee-shop

Next.js-приложение в этой папке. UI магазина Coffeo + тонкий BFF к Fastify.

Бэкенд описан в [BACKEND.md](./BACKEND.md). Общая картина — [PROJECT.md](./PROJECT.md). Баги — [BUGS.md](./BUGS.md).

---

## Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js (App Router), React 19 |
| Стили | Tailwind CSS 3, shadcn/ui (Radix), lucide-react |
| Формы | react-hook-form, Zod |
| Состояние | Redux Toolkit (`cart`, `products`, `auth`) + React Context (`AuthProvider`) |
| Тосты | sonner |
| Auth (живой) | Fastify JWT через BFF, HttpOnly cookies |
| Auth (мёртвый) | `@supabase/ssr`, `@supabase/supabase-js` — пакеты и клиенты есть, в боевых флоу не используются |
| Шрифты | Geist, Inter, Playfair Display |

Скрипты: `npm run dev` / `build` / `start` / `lint`. Тестов нет.

---

## Структура каталогов

```
app/
  (public)/          публичные страницы (группа не влияет на URL)
  (protected)/       кабинет; layout редиректит на /auth/login
  (admin)/           leftover starter, конфликт с app/page.tsx на /
  api/               BFF → Fastify
components/          UI магазина, checkout, dashboard, leftover tutorial
hooks/               useDebounce
lib/
  auth/getUser.ts    серверная проверка сессии
  features/api/      клиентские обёртки над /api/*
  nodejs/fetcher.ts  серверный fetch на :3001
  nodejs/proxy.ts    неподключённый «middleware»
  supabase/          мёртвый код
  data/              моки и константы форм
store/               Redux
types/               products, checkout, orders, dashboard
utils/
```

---

## Маршруты

Группы `(public)`, `(protected)`, `(admin)` — только папки, URL без префикса.

### Публичные

| URL | Файл | Статус |
|---|---|---|
| `/` | `app/page.tsx` | Главная Coffeo |
| `/shop` | `app/(public)/shop/page.tsx` | Каталог, реальный API |
| `/shop/[slug]` | `app/(public)/shop/[slug]/page.tsx` | Карточка товара |
| `/checkout` | `app/(public)/checkout/page.tsx` | UI готов, submit бьёт в несуществующий `/api/orders` |
| `/auth/login` | `app/(public)/auth/login/page.tsx` | Fastify login |
| `/auth/sign-up` | `app/(public)/auth/sign-up/page.tsx` | Форма есть, BFF register сломан |
| `/auth/sign-up-success` | `.../sign-up-success/page.tsx` | Leftover Supabase |
| `/auth/forgot-password` | `.../forgot-password/page.tsx` | Сломан (см. BUGS) |
| `/auth/update-password` | `.../update-password/page.tsx` | Сломан |
| `/auth/error` | `.../error/page.tsx` | Leftover |
| `/admin` | `app/(public)/admin/page.tsx` | Starter-kit, не админка магазина |
| `/task-api` | `app/(public)/task-api/page.tsx` | Dev-кнопка на `/api/tasks` |

Хедер ссылается на `/products` — такой страницы нет (404). Каталог живёт на `/shop`.

### Protected

`app/(protected)/layout.tsx` вызывает `getUser()`. Нет пользователя → редирект на `/auth/login`.

| URL | Файл | Данные |
|---|---|---|
| `/dashboard` | `app/(protected)/dashboard/page.tsx` | Товары — API; остальное мок/заглушка |
| `/orders` | `app/(protected)/orders/page.tsx` | Мок `MOCK_ORDERS` |
| `/membership` | `app/(protected)/membership/page.tsx` | Мок `MOCK_MEMBER` |
| `/profile` | `app/(protected)/profile/page.tsx` | Захардкожен «Oleksandr Developer»; `GET /api/profile/me` не вызывается |
| `/protected` | `app/(protected)/protected/page.tsx` | Starter demo |

### Конфликт маршрута `/`

Одновременно существуют:

- `app/page.tsx` — Coffeo home
- `app/(admin)/page.tsx` — Supabase starter home

Next.js не может отдать оба. Starter нужно удалить.

Next `middleware.ts` в проекте нет. Логика в `lib/nodejs/proxy.ts` (`updateSession`) нигде не импортируется.

---

## BFF (`app/api/*`)

Паттерн: Route Handler читает cookies через `nodejsFetch` (`lib/nodejs/fetcher.ts`) и проксирует на Fastify.

```ts
const url = `http://127.0.0.1:3001${path}`
```

Login — единственный хендлер, который смотрит на `NEXT_PUBLIC_API_URL`. Остальные игнорируют env.

| BFF | Методы | Fastify | Заметки |
|---|---|---|---|
| `/api/auth/log-in` | POST | `/auth/log-in` | Форвардит `Set-Cookie` |
| `/api/auth/register` | POST | `/auth/register` | Сломан: double stringify + сырой `Response` |
| `/api/auth/logout` | POST | `/auth/logout` | Форвардит cookie; URL бэка захардкожен |
| `/api/auth/me` | GET | `/auth/me` | Ок |
| `/api/auth/refresh` | POST | `/auth/refresh` | На бэке маршрут закомментирован |
| `/api/cart` | GET, POST, PATCH | `/cart` | POST/PATCH форвардят cookie |
| `/api/cart/[id]` | GET, DELETE | GET → **`/products/:id`** (баг); DELETE → `/cart/:id` | |
| `/api/products` | GET, POST | `/products` | GET иногда отдаёт сырой Response |
| `/api/products/[id]` | GET, PATCH | `/products/:id` | Ок |
| `/api/products/slug/[slug]` | GET, PATCH | slug GET ок; PATCH путает `id`/`slug` | |
| `/api/profile` | POST | `/profile` | `Response.json(Response)` |
| `/api/profile/me` | GET | `/profile/me` | Ок, UI профиля не использует |
| `/api/nova-poshta/cities` | GET | `/nova-poshta/cities` | Ок |
| `/api/nova-poshta/warehouses` | GET | `/nova-poshta/warehouses` | Ок |
| `/api/tasks` | GET, PATCH | `/tasks` | Leftover, хендлер кривой |

**Нет, но UI ждёт:**

- `/api/orders` — submit checkout
- `/api/auth/forgot-password`, `/api/auth/reset-password`

Клиентские обёртки: `lib/features/api/{cart,products,tasks}/`.

Серверная сессия: `lib/auth/getUser.ts` → `GET ${NEXT_PUBLIC_URL}/api/auth/me` с прокинутым `cookie`.

---

## Состояние

### Redux — `store/store.ts`

| Слайс | Файл | Поля | Кто читает |
|---|---|---|---|
| `cart` | `store/cart/cartSlice.ts` | `items: CartItem[]` | CartModal, Header, checkout |
| `products` | `store/products/productSlice.ts` | `items` | Таблица товаров в dashboard |
| `auth` | `store/auth/authSlice.ts` | `isAuthenticated: boolean` | Ставится при логине; logout не сбрасывает |

`CartItem` в слайсе:

```ts
{ id?: string; product: ProductsType; quantity: number; priceAtAdding: number }
```

`removeFromCart` фильтрует по `product.id`. CartModal после DELETE диспатчит `data.id` (id строки корзины) — товар может не исчезнуть из UI.

Количество в модалке меняется только в Redux, PATCH на API нет.

### AuthProvider — `components/providers/AuthProvider.tsx`

Контекст `{ user, setUser }`. Тип пользователя: `{ id: string; email: string }`.

Корневой layout передаёт `initialUser` из `getUser()`. Если пользователя нет, подставляется `{ id: undefined, name: undefined }` — это не совпадает с типом Context.

Два источника правды: Context (объект user) и Redux (булев флаг). Route guard использует только серверный `getUser()`.

---

## Страницы по доменам

### Главная

`app/page.tsx` + `components/sections/home-page/*`: Hero, Features, WeekendSpecials, PromoBanner, Newsletter, Ticker. Карусель спецпредложений опирается на моки.

Отдельно лежит starter-герой `components/hero.tsx` — не используется главной.

### Магазин

- Листинг: `components/shop/page.tsx` ← `lib/features/api/products/getProducts.ts` ← `GET /api/products`.
- Нужен `NEXT_PUBLIC_URL` (обычно `http://localhost:3000`).
- `FilterSidebar.tsx` — UI фильтров, фильтрация закомментирована: `filteredProducts = productsData || []`.
- Сортировка без обработчика.
- Категории в сайдбаре из `lib/data/mockProducts.ts` (`Beans`, `Merch`, `Equipment`, `Instant`) не совпадают с API enum (`Coffee`, `Equipment`, `Merchandise`).
- Карточка: `ProductDetails` → `getProductsBySlug` → `ProductInfo` + `ProductActions`.

### Корзина

- Гидратация: `Header` при маунте → `GET /api/cart` → `setCartItems`.
- Добавление: `ProductActions`, `CatalogProductCard` — optimistic Redux + `POST /api/cart`.
- Гость: `userId: user?.id ?? ''` → бэкенд отвечает `Invalid UUID`. Локальный Redux живёт, сервер нет.
- Удаление: `CartModal` → `DELETE /api/cart/[id]`.
- Кнопка «Make a purchase» без `href` на `/checkout`.
- Мёртвый `utils/addProductToCart.ts` (хук на уровне модуля, неопределённые переменные).
- `lib/features/api/cart/addToCart.ts` постит в `/api/products`, не в `/api/cart`.

### Checkout

Файл: `app/(public)/checkout/page.tsx` (`'use client'`).

Секции:

| Компонент | Назначение |
|---|---|
| `ContactDetailsSection` | Имя, фамилия, телефон; валидация `+380` |
| `DeliverySection` | Nova Poshta (город + отделение) или курьер |
| `PaymentSection` | UI способа оплаты, платёжного шлюза нет |
| `CommentSection` | Комментарий |
| `OrderSummary` | Итог + submit |

Nova Poshta: `/api/nova-poshta/cities` и `/warehouses`, `SearchableSelect` + `useDebounce`. Постомат/отделение фильтруются на клиенте по `categoryOfWarehouse`.

Submit:

```ts
fetch('/api/orders', { method: 'POST', ... items: cartItems.map(item => ({
  productId: item.product.id,
  quantity: item.quantity,
  price: item.price, // в слайсе поле priceAtAdding
}))})
```

Маршрута нет. Ветка `data.success` пустая: нет редиректа и очистки корзины.

Старые файлы: `CheckoutForm.tsx`, `OrderSummaryOld.tsx`, моки в `lib/data/checkout.data.ts`.

### Dashboard

`components/dashboard/page/DashboardPage.tsx`, вкладки из `lib/data/dashboard.data.ts`.

| Вкладка | Статус |
|---|---|
| Overview | Хардкод цифр (`DashboardStats`) |
| Products | Живой CRUD: таблица, форма (`react-hook-form`), create/update через API |
| Orders / Customers / Analytics | «Coming soon» |
| Activity / Newsletter / Settings | Вкладки объявлены, контента нет |

`ProductStats` показывает выдуманные числа (124 товара и т.д.), не выборку из API.

Роли на фронте нет: любой залогиненный пользователь открывает dashboard. На бэке мутации товаров тоже без admin-guard.

### Заказы, membership, профиль

Только оболочки. Профиль не вызывает `GET /api/profile/me`. Membership — QR через `api.qrserver.com` (разрешён в `next.config.ts`).

---

## Auth на клиенте

| Действие | Компонент | Куда |
|---|---|---|
| Login | `components/login-form.tsx` | `POST /api/auth/log-in` |
| Register | `components/sign-up-form.tsx` | `POST /api/auth/register` |
| Logout | `components/logout-button.tsx` | хардкод `http://localhost:3000/api/auth/logout` |
| Me | `lib/auth/getUser.ts` | `GET /api/auth/me` |

Login не проверяет `response.ok` до `json()`. Forgot/reset — клиентские компоненты импортируют `nodejsFetch` (`next/headers`) и зовут несуществующие `/api/auth/forgot-password` и `/reset-password`.

---

## Типы

Два мира, они не сведены.

| Тема | Файлы | Расхождение |
|---|---|---|
| Товар | `types/products.types.ts` vs `lib/data/mockProducts.ts` | Другие категории, другая форма |
| Корзина | `cartSlice.CartItem` vs `types/checkout.types.ts` | В checkout-типе нет `priceAtAdding` |
| Checkout | старый `CheckoutForm` vs `CheckoutFormState` | Старый не используется новой страницей |
| Заказы | `types/orders.types.ts` | Завязан на мок-`Product` |
| User | AuthProvider vs `getUser()` vs layout fallback | `email` vs `name` vs `undefined` |

---

## Leftover starter-kit

Удалено в фазе 8: tutorial, Supabase-клиенты, `/admin`, `/protected`, `/task-api`, forgot/reset, `lib/nodejs/proxy.ts`, `@supabase/*`. Главная и metadata — Coffeo.

---

## Env фронта

| Переменная | Где нужна |
|---|---|
| `NEXT_PUBLIC_URL` | `getUser`, запросы шопа к своему BFF |
| `NEXT_PUBLIC_API_URL` | Только login BFF; остальной прокси игнорирует |
| `NEXT_PUBLIC_SUPABASE_*` | Starter, в живых флоу не нужны |

Не класть service-role ключ в `NEXT_PUBLIC_*` (`lib/supabase/fetcher.ts` так назван).
