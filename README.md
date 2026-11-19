# Coffeo

Online coffee shop: catalog, cart, checkout (Nova Poshta), orders, and an admin product dashboard.

The browser talks only to this Next.js app. Fastify lives behind the BFF at `/api/*` so JWT cookies stay on the same origin.

## Stack

- **Frontend:** Next.js App Router, React 19, Redux Toolkit, Tailwind, shadcn/ui
- **BFF:** Next.js Route Handlers in `app/api/*`
- **Backend:** `fastify-todo-api` (Fastify 5, Prisma, PostgreSQL) on port `3001`

## Local setup

Need both processes.

### Backend

```bash
cd /Users/leo/WebstormProjects/fastify-todo-api
# .env: DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET
# Optional: NOVA_POSHTA_API_KEY, ADMIN_EMAIL
npm run dev
```

### Frontend

```bash
cp .env.example .env
# NEXT_PUBLIC_URL=http://localhost:3000
# NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
# API_URL=http://127.0.0.1:3001
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth

JWT via Fastify, not Supabase. Login sets HttpOnly cookies (`accessToken`, `refreshToken`, `userId`) through the BFF. Protected pages use `getUser()` → `GET /api/auth/me`.

Do not call Fastify from the browser. Cookies would not attach to `:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
