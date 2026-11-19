# ADR-002: Cart requires a logged-in user

## Status

Accepted

## Date

2026-09-07

## Context

Prisma `CartItem.userId` is a required FK. There is no guest-cart table. The UI currently POSTs `userId: ''` for guests, which fails UUID validation and leaves Redux and the server out of sync. Checkout and orders will need a real user anyway.

## Options Considered

### Option A: Login required to add to cart

- Pros: No new tables; JWT is the only identity; matches the current schema
- Cons: Guests cannot collect items before sign-in

### Option B: Anonymous cart session + merge on login

- Pros: Better for first-time shoppers
- Cons: Needs `cartSession` (or similar), cookie, and merge rules; easy to get IDOR wrong; not needed until orders exist

## Decision

We choose **Option A**.

- All `/cart` routes use `authMiddleware`
- `userId` comes only from `request.user.userId`
- Guest add-to-cart: `401` → frontend `/auth/login`
- Do not invent guest identity with an empty or random UUID

## Consequences

- Header `GET /api/cart` for a guest is `401`; Redux cart stays empty
- Anonymous merge is a later ADR, not this phase
