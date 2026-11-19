# Phase 1 — JWT user contract

## 2026-09-07 — `{ userId, email }` locked

ADR: [docs/decisions/001-jwt-payload-userid-email.md](../docs/decisions/001-jwt-payload-userid-email.md)

**Backend (`fastify-todo-api`)**

- Access JWT and `request.user`: `{ userId, email }`
- Refresh JWT: `{ userId }` only; email loaded from `User` on refresh
- `findSessionByToken` / `deleteSessionByToken` receive `hashToken(rawCookie)` (middleware was the bug)
- `POST /auth/refresh` is live; sets `accessToken`, `refreshToken`, `userId`
- Logout clears those three cookies
- Register response no longer includes `passwordHash`

**Frontend (`coffee-shop`)**

- `User` = `{ id, email }`; guest is `null` (no `{ id: undefined, name: undefined }`)
- Logout: `POST /api/auth/logout` (relative), `setUser(null)`, `setIsAuthenticated(false)`
- `GET /api/auth/me` forwards `Set-Cookie` so silent refresh can rotate access through the BFF
- `POST /api/auth/refresh` no longer double-stringifies the body

**Verified (HTTP, after local Postgres was up)**

- Login → three cookies, JSON has `user.id` / `user.email`, no tokens in body
- `/api/auth/me` 200 with `{ id, email }`
- `POST /api/auth/refresh` 200, three `Set-Cookie`, `/me` still ok
- Expired access + live refresh → Fastify and BFF `/me` 200, new `accessToken` cookie
- Logout → three clear-cookie headers, `/me` 401

**Not verified in Cursor browser** — no browser MCP in this session. Form clicks (wrong password UI, `/dashboard` after logout) were not driven in a real page.

**Out of scope (Phase 2):** BFF login still returns 200 when Fastify returns 500; register BFF still broken; `getUser()` still falls back to `localhost:3000`.
