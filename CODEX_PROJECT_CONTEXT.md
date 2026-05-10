# Codex Project Context

Codex-only handoff. Keep compact. Do not treat this as user-facing documentation.

## Project State

- Locale-based Next.js frontend (`fr`, `en`, `zh`, default `fr`) plus Spring Boot backend, PostgreSQL, Flyway.
- User usually works directly on `main`.
- Secrets are ignored in `.env`, `backend/.env`, and `frontend/.env.local`. Do not commit API keys.
- `frontend/proxy.js` replaces deprecated Next middleware and keeps locale redirects/cookies.
- Keep visible text based on French first, then translate to English and Chinese. Message key parity was verified after the refund rejection/profile cleanup.

## Verification

```powershell
cd backend
mvn.cmd test

cd ..\frontend
npm.cmd run lint
npm.cmd run test:e2e
```

Known lint state: frontend lint passes with raw `<img>` optimization warnings only.

Local dev:

```powershell
docker compose up -d postgres
cd backend
mvn.cmd spring-boot:run
cd ..\frontend
npm.cmd run dev
```

## Active Frontend Routes

```txt
frontend/app/[locale]/page.js
frontend/app/[locale]/a-propos/page.js
frontend/app/[locale]/artworks/page.js
frontend/app/[locale]/artworks/[slug]/page.js
frontend/app/[locale]/cart/page.js
frontend/app/[locale]/checkout/success/page.js
frontend/app/[locale]/checkout/cancel/page.js
frontend/app/[locale]/profile/page.js
frontend/app/[locale]/admin/page.js
frontend/app/[locale]/verify-email/page.js
frontend/app/[locale]/reset-password/page.js
frontend/app/[locale]/privacy-policy/page.js
frontend/app/[locale]/terms-of-service/page.js
frontend/app/[locale]/refund-shipping-commission/page.js
```

## Auth

- Login/register/reset/profile auth use Spring endpoints and JWT stored in `localStorage.auth`.
- Password rule: more than 10 characters, at least one uppercase letter, at least one special symbol.
- Registration sends a Resend verification email; login blocks unverified users and offers resend with 60s cooldown.
- Forgot/reset password checks account existence and prevents reusing the same password.
- OAuth/social login is not production-ready. `AuthService.oauthLogin()` is still a provider-verification stub.
- Header routes admin profile icon to `/${locale}/admin`; normal users to `/${locale}/profile`.
- Admin cart clicks show the Chinese warning toast and do not navigate.
- JWT logout denylist is in-memory; revisit before production if persistent logout invalidation matters.

## Artworks, Cart, Checkout

- Artworks list/detail fetch from DB. No hardcoded product grid.
- Filters: artwork type, series, year, two-sided CAD price range. No `medium`.
- Artwork has one type, multiple series, size, year, price, long description, active flag, and `soldOut` boolean.
- Current availability model is still `soldOut`; recommended next refactor is explicit `AVAILABLE`, `RESERVED`, `SOLD`.
- Add-to-cart uses backend cart and top toasts. Cart persists per account.
- Cart checks current artwork availability on access; unavailable items block checkout.
- Stripe Checkout is implemented. Backend computes authoritative totals and creates checkout sessions.
- Checkout currently uses `shippingAmount = 0` and `taxAmount = 0`; shipping/tax rules are still pending.
- Stripe webhook handles `checkout.session.completed` and `checkout.session.expired`.
- Stripe webhook events are recorded in `processed_stripe_events` after successful handling so duplicate webhook deliveries do not reprocess completed/expired checkouts.
- Receipt email is enqueued after webhook payment completion.
- Reminder: later verify/enable official Stripe receipts in Stripe Dashboard or Stripe checkout settings.

## Orders and Refunds

- Order statuses: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`.
- `PROCESSING` was intentionally removed for the small-studio workflow.
- DB-generated order numbers use `SA-000001` style.
- Pending orders are cleaned by `PendingOrderCleanupService`; expired pending orders unlock artworks.
- User profile order history reads real backend data only. No sample fallback data.
- Users can file one refund request per order. DB uniqueness is enforced on `(order_id, user_id)`.
- Admin refund card shows pending refund requests.
- Admin approve calls Stripe refund, stores Stripe refund ID/status on the order, marks `REFUNDED`, unlocks artworks, and enqueues refund email.
- Admin reject opens a modal for a reason, marks request `REJECTED`, and enqueues rejection email.
- Pending checkout cleanup should continue deleting expired pending orders; user explicitly chose deletion over keeping cancelled audit rows for now.
- Stripe refund webhook reconciliation is implemented for `Refund` objects and `Charge` objects with refund collections. It finds orders by `stripe_refund_id` and updates `stripe_refund_status`; `succeeded` keeps order `REFUNDED`, sets `refunded_at` if missing, and unlocks artworks.
- Remaining payment hardening: add stronger concurrency/idempotency around simultaneous duplicate webhook delivery if needed.

## Profile

- Profile sections: overview, addresses, security, orders.
- Saved payment methods were removed; checkout relies on Stripe Checkout at purchase time.
- Address management supports primary/other addresses and Canadian postal-code validation.
- Security password update uses same password rules and eye toggles.
- Empty addresses/orders now show empty states instead of fake sample data.

## Admin

- Backend admin controller is protected by `@PreAuthorize("hasRole('ADMIN')")`.
- Frontend admin also checks local role and confirms against backend dashboard endpoint.
- Admin functions: account lookup, ban, dev-only delete, order search, delivery queue, shipped orders, refund requests, product CRUD/upload, dashboard metrics.
- `ADMIN_DEV_ACCOUNT_DELETE_ENABLED` currently defaults to `true` for local registration testing. Before production, set it to `false` in production env/config and verify the admin delete-account button cannot remove accounts.
- Admin sample fallback records were removed. API failures show an error notice instead.
- Admin notifications use fixed top toasts.
- Product upload stores files under `/uploads/products/...`.

## Email

Implemented through `EmailService` / `ResendEmailService`:

- Verification email.
- Password reset.
- Order receipt.
- Shipped with tracking link.
- Delivered thank-you.
- Refund approved.
- Refund rejected.

Email sending now uses DB outbox table `email_outbox`. Service methods enqueue messages inside the business transaction; `EmailOutboxDeliveryService` sends pending messages to Resend on a scheduled retry loop. This prevents Resend failures from rolling back order/refund/payment state.

## Analytics

- Frontend `PageViewTracker` posts compact page-view data.
- Backend aggregates by day/path/visitor to avoid unbounded raw view rows.
- Admin views chart should use real aggregate data only.

## Deployment

- Dev compose still only starts PostgreSQL.
- Optional production files exist:
  - `backend/Dockerfile`
  - `frontend/Dockerfile`
  - `docker-compose.prod.yml`
  - `.env.production.example`
  - `deploy/README.md`
- Intended small-site deployment: one VPS running frontend, backend, PostgreSQL, and local uploaded product images.
- Uploads should be backed by persistent VPS storage such as `/srv/art-gallery/uploads/products`, mounted to backend `/app/uploads/products`.
- Add Caddy/Nginx after domain is known. Route `/api/**` and `/uploads/**` to backend, frontend routes to Next.
- Minimum backup: nightly `pg_dump`, archive/copy uploads, keep at least one backup outside the VPS.

## Near-Term TODOs

- Before production, disable dev account deletion: set `ADMIN_DEV_ACCOUNT_DELETE_ENABLED=false` and test that admin delete-account requests are rejected.
- Decide shipping fee and Canada/Quebec tax behavior before live Stripe checkout.
- Replace `soldOut` reservation semantics with explicit availability state.
- Verify official Stripe receipts later.
- Finish production reverse proxy once domain/VPS are available.
- Replace raw `<img>` with `next/image` or document why local/VPS images stay raw.
- Implement real OAuth provider verification only if social login is resumed.
