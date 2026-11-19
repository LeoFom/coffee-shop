# Phase 4 — orders / checkout

## 2026-09-07

Closed B1: create order from cart, snapshot line items, clear cart.

**Backend** (`fastify-todo-api/src/modules/order/`)

- Existing Prisma models only: Order, OrderItem, ShippingAddress, Payment. No new tables. No membership stamps / activity_events.
- `POST /orders` + `GET /orders` + `GET /orders/:id`, all behind `authMiddleware`. `userId` from JWT.
- Prices from cart+product in a Prisma transaction; client `items` / `price` ignored. Totals: catalog `product.price`, `memberDiscountPercent` as percent off, shipping `0`, Payment.status `Pending`.
- NP warehouse/postomat requires city+warehouse objects; courier requires address. Phone: `+?380` + 9 digits.
- `orderNumber` like `CF-YYYYMMDD-XXXXXX`.
- Registered in `app.ts` with `prefix: '/orders'`.

**Frontend**

- BFF `app/api/orders` GET/POST and `app/api/orders/[id]` GET via `proxyToBackend`.
- Checkout POST sends contact/delivery/payment/comment only. Success: toast, `setCartItems([])`, `/orders`. Errors: sonner, 401 → login.
- `/orders` reads live `GET /orders` (RSC `nodejsFetch`); types are API snapshots, not mock `Product`.

**Prisma client**

- DB already had `checkout_models`. Generated client was stale (no `PaymentMethod`, no `shippingAddress`). Ran `npx prisma generate`. Needed for this module to boot.

**Verified (HTTP, no browser MCP)**

- POST `/api/orders` no cookie → 401; GET list no cookie → 401
- Empty cart → 400 `Cart is empty`
- NP without city → 400 validation
- Invalid phone → 400
- 2 products → 201, snapshot name/slug/category/unitPrice, cart `[]`
- Catalog price PATCH after order → order `unitPrice` unchanged
- Client `items` qty 99 / price 1 ignored; server cart qty/price used
- Courier + empty email → JWT email, Payment `Card`
- Other user GET `/orders/:id` → 404
- `/orders` HTML contains `orderNumber` + product snapshot

**Not clicked in a browser** — no browser MCP this session. Desktop/mobile visual QA of checkout not done.
