# ADR-003: Role lives on User (`Customer` | `Admin`)

## Status

Accepted

## Date

2026-09-07

## Context

Product create/update/delete on Fastify are public (B4). The dashboard Products tab is visible to every logged-in user. We need a server-enforced admin check before opening the catalog mutations to the internet.

## Options Considered

### Option A: `UserRole` enum column on `User`

- Pros: One field, default `Customer`, one migration; matches two roles we actually have
- Cons: Adding more roles later means extending the enum

### Option B: Separate `user_roles` / join table

- Pros: Multiple roles per user, easier to add permissions later
- Cons: Extra table and queries for a binary check; overkill until we have staff vs super-admin vs editor

## Decision

We choose **Option A**.

- Prisma `enum UserRole { Customer Admin }` on `User.role`, default `Customer`
- JWT access payload stays `{ userId, email }` (ADR-001). Role is **not** in the token so a demotion takes effect on the next request
- `adminMiddleware` runs **after** `authMiddleware` and reads `role` from the database
- `GET /auth/me`, login, and refresh return `{ id, email, role }` for the UI
- Public registration always creates `Customer`; it accepts only email/password and rejects additional fields. `ADMIN_EMAIL` has no effect.
- Initial admin creation uses the separate `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` startup operation. It does not promote an existing unverified registration. See the [2026-11-24 security amendment](https://github.com/LeoFom/fastify-prisma-app/blob/dev/docs/adr/003-public-registration-role.md).

## Consequences

- POST/PATCH/DELETE `/products` require Admin; GET stays public
- Hiding the dashboard Products tab is not authorization
- A separate roles table would need a new ADR
