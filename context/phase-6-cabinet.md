# Phase 6 — cabinet on live data

## 2026-09-07

Cabinet pages read JWT-backed APIs. Membership stays a mock.

**Profile**

- `GET /api/profile/me` + `PATCH /api/profile/me` (BFF PATCH proxies to Fastify `PATCH /profile`).
- Page loads profile via `nodejsFetch`; email from `getUser()` / `/auth/me` (profile API has no email).
- Hardcoded Oleksandr / Developer / `hello@example.com` removed.
- Client `lib/features/api/profile/*`; type `types/profile.types.ts`.
- Register still seeds profile as `"Coffee"` / `"Is great"` until the user saves.

**Orders**

- `/orders` already used `getOrders()` → Fastify `GET /orders`.
- `types/orders.types.ts` is snapshot-shaped (`Order` + `OrderItemSnapshot`), not mock `Product`.
- Empty list → “haven't placed any orders”; live list shows `orderNumber` / `productName` / API category.

**Dashboard**

- Overview: Total Spent / Total Orders / Saved to Cart from `GET /orders` + `GET /cart`. No fake trends, no “Products Viewed”, no mock activity feed.
- Recent Orders = last 4 from the same list; link to `/orders`.
- Orders tab reuses `OrdersList`.
- `ProductStats` from Redux catalog: total count, with-discount count, average price. Dropped “Active Products” (no `isActive` on `ProductsType`).

**Membership**

- Left as `MOCK_MEMBER` in `MembershipCard`. No `GET /profile/membership` in this phase.

**Verified (HTTP, no browser MCP)**

- `GET /api/profile/me` 401 without cookie; 200 with `{ firstName, lastName, phone }` from DB
- `PATCH /api/profile/me` persists; `/profile` HTML has saved names, not Oleksandr
- `GET /api/orders` + `/orders` HTML: `CF-…`, product snapshot name, category `Coffee` (not mock `Beans` / `ORD-2026`)
- `/dashboard` HTML: `$18.00` / `1` after a real order; no `$342.50` / “Products Viewed”

**Not clicked in a browser** — no browser MCP this session. Form clicks and viewport screenshots not done. Client validation is in `ProfileForm`; Fastify still 500s on Zod `too_small` if a short name reaches the API.
