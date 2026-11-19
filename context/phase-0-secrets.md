# Phase 0 — secrets hygiene

## 2026-09-07 — What we did

Tracked `fastify-todo-api/src/config/env.ts` is gone from the tree and staged with `git rm`. It was not imported; secrets were still in git history.

**Rotated in local gitignored `.env` (backend):** `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET` (new 64-hex values). Existing JWT sessions are invalid until users log in again.

**Cleared in local `.env` because they had leaked in `env.ts`:** `MONGO_URI`, `NODEMAILER_PASSWORD`. Mail and leftover mongoose will not work until new credentials are set.

**Not rotated (did not appear in `env.ts`):** `NOVA_POSHTA_API_KEY`, Cloudflare R2 vars. They stay only in local `.env`.

**Local Postgres password** (`user` / `password` in docker-compose) left as-is to avoid wiping the local DB. Treat as a known local default, not a production secret. Change it if that Postgres is ever reachable from the network.

**Startup checks** in `fastify-todo-api/src/app.ts`: throw if missing `JWT_ACCESS_SECRET`, `COOKIE_SECRET`, `JWT_REFRESH_SECRET`, or `DATABASE_URL`. Smoke: app started with `.env`; `DATABASE_URL` was FOUND.

**`.env.example` (backend):** empty placeholders only. Comment marks the four required vars.

**`.env.example` (coffee-shop):** empty values. Comment: leftover Supabase keys (Phase 8); never put service-role or DB password in `NEXT_PUBLIC_*`.

**Working-tree grep** for old JWT placeholders and `mongodb+srv` is empty (excluding `.env`). Git history of `env.ts` still contains the old values — rotate at the providers below; do not rewrite history unless asked.

## You still must rotate at the providers

These were in git history via `env.ts`. Invalidating them is the real fix:

1. MongoDB Atlas password for the user that was in `MONGO_URI`.
2. Gmail app password for `NODEMAILER_EMAIL`.
3. Optional: Nova Poshta API key, only if `.env` was ever copied or committed.

Do not commit `.env`. Do not paste secret values into chat or this file.

## Pre-existing (not this phase)

`tsc` on the backend still reports JWT `userId` typing issues in auth/profile/tasks controllers — Phase 1 payload contract, not caused by deleting `env.ts`.
