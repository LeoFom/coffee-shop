# C0.2 dependency security update

Date: 2026-11-24. Scope: dependency security and the compatibility adjustments required by the updated Next ESLint configuration.

Full `npm audit --json` changed from **17 affected package aggregates** (1 critical, 8 high, 8 moderate) to **0 findings**, including dev dependencies. [Machine-readable risk register](C0_2_DEPENDENCY_AUDIT.json) records each original package path, advisory, execution surface and resolved before/after version. No production exploit was performed.

## Versions and configuration

| Package | Before | After |
| --- | --- | --- |
| Next.js | 16.2.4 | 16.4.6 |
| React / React DOM | 19.2.5 | 19.3.1, aligned |
| eslint-config-next | 15.3.1 | 16.4.6, aligned with Next |
| Zod | 4.3.6 | 4.6.7 |

Transitive updates also patch sharp, PostCSS/source-map dependencies, browserslist/baseline-browser-mapping, brace-expansion, js-yaml, TypeScript ESLint and selector parsing. package-lock.json captures exact versions/integrity. Node remains 24; Next stays on major 16 and React on major 19.

ESLint now consumes the supported native flat core-web-vitals/typescript exports. Removed the direct @eslint/eslintrc compatibility bridge dependency; no security or hooks rules were disabled.

The new hooks rules exposed two existing state-synchronization patterns. DashboardPage now resets its inner state with a key when initialTab changes. SearchableSelect derives loading/visible options from the current query and fetcher, and records state only when an asynchronous result arrives. Old query/city responses cannot replace the new context. These changes preserve existing controls and do not implement the separate Nova Poshta business-integration phase.

Next dev generated its standard AGENTS.md guidance for version-local documentation. This is framework-provided guidance, not completion of the planned Coffeo-specific AGENTS/CI work in C0.4.

## Verification

- Clean npm ci --ignore-scripts locally; ordinary npm ci with scripts is verified independently by Linux CI/Vercel.
- ESLint, next typegen/TypeScript and Next production build passed.
- Browser → Next BFF → updated Fastify → isolated PostgreSQL passed signup/login, cart, checkout, order history, CSRF and logout using synthetic data.
- Additional browser cases passed: a slow old city search does not overwrite the newer result; changing city clears/changes the warehouse context; navigating products/dashboard resets the intended initial tab.
- Nova Poshta responses in those component checks were synthetic intercepted fixtures. This is not a claim that the live carrier integration is completed.
- Full npm audit returned 0 findings. CI now runs `npm audit --audit-level=high`, including dev dependencies.

Runtime Next/image advisories and development-tool advisories have different preconditions; Windows-only or unused next/og/CSP-nonce paths are not represented as proven production exploits. All reported package findings were nevertheless removed from the resolved graph. API/key rotation, stock/checkout redesign, mobile navigation and other audit findings remain separate tasks.

References: [Next native flat ESLint configuration](https://nextjs.org/docs/app/api-reference/config/eslint), [React state reset with a key](https://react.dev/learn/preserving-and-resetting-state), [API update report](https://github.com/LeoFom/fastify-prisma-app/blob/dev/docs/security/C0_2_DEPENDENCY_UPDATE.md).
