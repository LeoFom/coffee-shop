# Phase 7 — shop storefront

## 2026-09-07

**Header (F13)**

- Catalog link is `/shop`. `/products` is gone from nav (route still 404).
- Duplicate “Products” + “Shop” collapsed to one “Shop”.

**Filters / sort**

- `components/shop/page.tsx` filters live `ProductsType[]`, not `MOCK_PRODUCTS`.
- Categories: Prisma enum `Coffee` | `Equipment` | `Merchandise` (`PRODUCT_CATEGORIES` in `lib/data/products.data.ts`).
- Roast: `coffeeDetails.roast` (`Light` | `Medium` | `Dark`).
- Member Perks: `cartPriceAtAdding(product) < listPrice` (percent-off via `discount` / `memberDiscountPercent`).
- Sort: Featured / Price low–high / Price high–low.
- Empty result: dashed panel + “Clear all filters”, not a blank page.

**Mocks**

- Shop no longer imports `lib/data/mockProducts.ts`. File marked leftover for Phase 8.
- `types/products.types.ts` no longer imports mock `ProductCategory` / `RoastLevel`. Unused mock `Product` interface removed.

**Verified (HTTP, no browser MCP)**

- `GET /products` → 404
- Home header HTML: `href="/shop"` only, no `/products`
- `/shop` HTML: Coffee / Equipment / Merchandise, sort options, product “Леонід”; no Beans / Instant
- Live catalog (3 items) is all `Coffee`, no roast / discount — Equipment / roast / member filters correctly empty the grid

**Not clicked in a browser** — no browser MCP. Filter clicks, sort, and mobile/tablet/desktop screenshots not done.
