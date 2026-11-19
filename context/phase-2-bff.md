# Phase 2 — BFF proxy

## 2026-09-07

All `app/api/*` handlers go through `proxyToBackend` in `lib/nodejs/fetcher.ts`.

**Contract**

- Backend URL: `API_URL ?? NEXT_PUBLIC_API_URL ?? http://127.0.0.1:3001` (`getBackendUrl`)
- `nodejsFetch` body is an object; stringify happens once inside the helper
- `proxyToBackend` returns upstream status + body as-is and forwards `Set-Cookie` when present
- Never `Response.json(Response)` and never `JSON.stringify` before `nodejsFetch`

**Fixes**

- Register: object body, JSON 201, no `passwordHash`
- Login BFF proxies Fastify status (bad password is no longer a fake 200)
- `login-form.tsx` bails on `!response.ok`
- `GET /api/cart/:id` → `/cart/:id` (same UUID on `/api/products/:id` still returns a product)
- PATCH `/api/products/slug/[slug]` reads param `slug`
- `getUser()` calls Fastify `/auth/me` via `nodejsFetch` (no `localhost:3000` self-fetch)
- Logout button already relative from Phase 1

**Smoke (HTTP)**

- `POST /api/auth/register` 201 object
- `POST /api/auth/log-in` wrong password 500, `success` not true (Fastify still throws 500 for invalid credentials — form treats any `!ok` as error)
- Good login 200 + three cookies; `/me` 200
- `GET /api/cart/:productId` is not a product
- `GET /api/tasks` 500 leftover (F17, Phase 8)

**Not clicked in a browser** — no browser MCP this session. Login error path verified at the BFF/JSON layer.
