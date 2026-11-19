# ADR-001: JWT access payload is `{ userId, email }`

## Status

Accepted

## Date

2026-09-07

## Context

Login, silent refresh, and `/auth/me` used different JWT field names (`userId` vs `id`). Refresh tokens only carry `userId`, so signing a new access token from the refresh payload left `email` undefined. Checkout and cart will identify the buyer from this contract; mixing names writes the wrong user.

## Options Considered

### Option A: `{ userId, email }` on the backend, `{ id, email }` on the frontend `/me` response

- Pros: Matches existing login sign and Prisma `User.id`; frontend already reads `user.id`
- Cons: Two names across the HTTP boundary (`userId` inside JWT, `id` in JSON)

### Option B: `{ id, email }` everywhere, including JWT

- Pros: One name
- Cons: Touches login, every `request.user.userId` reader (profile, tasks), and still needs a mapping from Prisma `User.id`

### Option C: Put `email` on the refresh JWT

- Pros: Silent refresh can copy email without a DB read
- Cons: Email changes would stay stale until refresh expiry; refresh should stay minimal

## Decision

We choose **Option A**.

- Access JWT: `{ userId: string, email: string }`
- Refresh JWT: `{ userId: string }` only
- Email for a new access token comes from the user row in the database, not from the refresh token
- `GET /auth/me` returns `{ id, email }` for the frontend `User` type
- Guest on the frontend is `null`, not a stub object with `undefined` fields

## Consequences

- `fastify.d.ts` `payload` and `user` both use `userId`
- Controllers keep reading `request.user.userId`
- Session lookup always hashes the raw refresh cookie before Prisma
- Do not reopen `id` vs `userId` on the access token without a new ADR
