# Phase 3 — cart and profile identity

## 2026-09-07

ADR: [docs/decisions/002-cart-requires-login.md](../docs/decisions/002-cart-requires-login.md) — **Option A**, login required.

**Backend**

- All `/cart` routes: `authMiddleware`; `userId` from `request.user.userId` only
- POST upsert on `(userId, productId)` increments `quantity`
- GET/PATCH/DELETE by row id: 404 if missing or not owned (no IDOR leak)
- Profile POST/PATCH/DELETE now have `authMiddleware` + Zod parse

**Frontend**

- Guest add → `401` → `/auth/login`; no `userId: ''` in POST body
- `CartItem.id` is the cart row id (same id for remove, qty PATCH, DELETE)
- Totals use `priceAtAdding`; `memberDiscountPercent` is percent off (`price * (1 - percent/100)`)
- `PATCH /api/cart/:id` for quantity; checkout button → `/checkout`
- Live helper: `utils/addProductToCart.ts`; deleted dead `lib/features/api/cart/addToCart.ts`

**Verified (HTTP)**

- Guest GET/POST `/api/cart` → 401
- Same sku twice → quantity 2 on one row
- Spoofed `userId` in body ignored
- Other user DELETE/GET row → 404; owner still sees it
- Guest profile POST/PATCH/DELETE → 401

**Not clicked in a browser** — no browser MCP this session.
