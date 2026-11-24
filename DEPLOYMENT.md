# Coffeo frontend: Vercel + Render API

Use the `dev` branch of `LeoFom/coffee-shop`. The legacy `main` branch is a Supabase template, not the current Coffeo storefront.

Vercel settings: Next.js, repository root, Node 24.x, install `npm ci`, build `npm run build`. Git integration deploys updates from `dev`; verify a preview before promoting it. The repository contains `vercel.json` and a Linux CI workflow for lint, type checking and production build.

Set these server-only variables in Vercel:

| Name               | Value                                         |
| ------------------ | --------------------------------------------- |
| `API_URL`          | HTTPS origin of the new Coffeo Render service |
| `INTERNAL_API_KEY` | Same random value as the new Render service   |

No Supabase keys, database password or public API secret is needed in this repository. Do not use the old `NEXT_PUBLIC_API_URL` setting for authentication. Browser requests use `/api/*`; route handlers forward only auth cookies and the internal server key to Render. Multiple `Set-Cookie` headers remain separate. Cross-origin mutations to the BFF are rejected; responses are not cached. Server-rendered catalog reads use the same backend helper without a self-request to a hardcoded frontend URL.

Missing API configuration produces a controlled 503 response. Anonymous layout rendering does not wake the backend merely to check a nonexistent session. API cold starts may take about a minute; the BFF waits up to 65 seconds and then returns a retryable unavailable response.

For local development, copy `.env.example` to `.env.local`, use `API_URL=http://127.0.0.1:3001`, and set the matching internal key on the local API. HTTP backend origins are permitted only in development; deployed origins must be HTTPS.

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm run dev
```

Smoke-check the actual frontend origin: home/shop, register/login, profile, adding/updating/removing cart items, checkout with cash on delivery, order history, logout, and 403 for a customer trying to mutate products. Nova Poshta lookup needs its separate server key. Create the first admin through the Render bootstrap variables documented in the API repository, then add real products. No production demo users/products are silently inserted.

The existing loyalty/newsletter sections and online-payment UI do not imply those integrations are implemented. Deployment does not enable a payment processor or send email. Free-tier availability and quota limits are documented in the API repository.

## Release baseline and rollback

See the [C0.5 baseline](docs/releases/2026-11-24-baseline.json), [release/rollback runbook](docs/RELEASE_AND_ROLLBACK_UA.md), and [verification report](docs/C0_5_RELEASE_BASELINE_UA.md). The manifest separates observed production from dev/preview; it is not a deployment authorization. Production-linked dev, missing persistent staging, and the test branch migration-ledger gap are explicitly recorded. Do not run write smoke tests against an unverified preview target.
