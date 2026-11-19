# Phase 8 — leftover cleanup

## 2026-09-07

Removed the Next.js + Supabase starter and the Fastify tasks tutorial. Live shop flows were rewritten first so deletes did not break login or the home hero.

**Frontend**

- Deleted: `lib/supabase`, tutorial, starter UI (`hero`, logos, deploy/env/auth-button, theme-switcher), `(admin)/` + `/admin`, `/protected` demo, `/task-api`, `/api/tasks`, `lib/nodejs/proxy.ts`, `mockProducts.ts`, forgot/reset + sign-up-success + auth/error pages.
- Login → `/dashboard`. Forgot-password link removed (no BFF/backend).
- Hero “Explore” → `/shop`; “Log in” → `/auth/login`. No `getTasks`.
- Register success → `/auth/login`. Supabase comments gone.
- Metadata and README are Coffeo. `.env.example` no longer lists `NEXT_PUBLIC_SUPABASE_*`.
- Removed `@supabase/ssr`, `@supabase/supabase-js`, `next-themes`.

**Backend** (`fastify-todo-api`)

- Deleted `src/modules/tasks/`. Unregistered from `app.ts`.
- Removed unused deps: `mongoose`, `axios`, `cheerio`, `decimal.js`.
- Dropped `MONGO_URI` from `.env.example`.
- Prisma `Task` model / `tasks` table left in place (no migration this phase).

**Kept**

- `components/logout-button.tsx` (JWT-wired; not in Header yet).

**Verified**

- `npx tsc --noEmit` and `npm run build` green. Routes: `/`, shop, checkout, auth, dashboard, orders, profile, BFF APIs. No `/admin`, `/protected`, `/task-api`, `/auth/forgot-password`, `/api/tasks`.
- `GET /` HTML: title `Coffeo — online coffee store`, heading COFFEO, no “Starter Kit” / Supabase.

**Cursor rules** (2026-09-07)

- `.cursor/rules/no-starter-kit.mdc` — always on: no Supabase/tutorial/`/protected`/dead forgot forms.
- `.cursor/rules/bff-only.mdc` — app/lib/components: browser only hits `/api/*`, not Fastify.

**Not clicked in a browser** — no browser MCP. Home/404s checked over HTTP.
