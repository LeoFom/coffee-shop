# Phase 5 — product admin authorization

## 2026-09-07

ADR: [docs/decisions/003-user-role-on-user.md](../docs/decisions/003-user-role-on-user.md) — **Option A**, `UserRole` on `User`.

**Backend**

- Prisma `UserRole` (`Customer` | `Admin`), default Customer. Migration `20260907160319_add_user_role`.
- `adminMiddleware` after `authMiddleware`; role read from DB, not JWT (ADR-001 payload unchanged).
- POST/PATCH/DELETE `/products` require Admin. GET stays public.
- `/auth/me`, login, refresh, register return `role`.
- `ADMIN_EMAIL` in `.env.example`: that mailbox becomes Admin on register (email match) and on API start (`promoteConfiguredAdmin`). After generate, restart Fastify so the client sees `role`.

**Frontend**

- `User` is `{ id, email, role }`.
- BFF POST/PATCH/DELETE `/api/products` 401/403 via `requireAdminResponse` (GET public). DELETE BFF added.
- Products tab hidden for customers. `/dashboard/products` layout redirects non-admins to `/dashboard`.

**Verified (HTTP)**

- Unauthenticated GET `/api/products` → 200; POST → 401
- Customer POST/PATCH/DELETE → 403
- Admin POST → 201; product on `/shop`; DELETE works
- Customer `/dashboard` HTML has no Products tab / Add Product
- Customer `/dashboard/products` → 307 `/dashboard`
- Admin `/dashboard/products` has Add Product
- `/auth/me` role Customer vs Admin

**Not clicked in a browser** — no browser MCP this session.
