# ADR-004: Browser-owned session recovery

Status: accepted for C1.4 branch, 2026-11-28. This is paired with API C1.3 and is not a production release by itself.

Server Components read the access cookie but cannot write a replacement cookie. When the C1.3 API returns `ACCESS_EXPIRED`, protected pages redirect to `/auth/continue` with a local allowlisted destination. A client component calls the same-origin `POST /api/v1/auth/refresh` Route Handler; it forwards every `Set-Cookie` from the API. Only after a successful `/api/auth/me` does the browser navigate back. A 503 preserves the session and offers a manual retry; a 401 asks for login.

Client API calls share one refresh promise and retry only a response explicitly marked `ACCESS_EXPIRED`. That code comes from the API auth guard before a mutation handler runs. A network timeout or uncertain checkout result is never retried automatically. Invalid credentials clear the UI identity and cached cart/products. The Context owns the visible user; Redux's old auth boolean is no longer used by login/logout.

The ten-second refresh grace and replay policy are defined in API ADR-004. C1.4 does not change JWT signing or database schema. The preview branch must not be paired with production API until the API C1.3 migration and a coordinated release are ready.
