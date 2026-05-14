# Codex Project Context

Codex-only handoff. Keep compact. Do not treat this as user-facing documentation.

## Project State

- Locale-based Next.js frontend (`fr`, `en`, `zh`, default `fr`) plus Spring Boot backend, PostgreSQL, Flyway.
- User usually works directly on `main`.
- Secrets are ignored in `.env`, `backend/.env`, and `frontend/.env.local`. Do not commit API keys.
- Live VPS production deployment exists at `https://sylvaineart.ca`.
- `frontend/proxy.js` replaces deprecated Next middleware and keeps locale redirects/cookies.
- Keep visible text based on French first, then translate to English and Chinese. Message key parity was verified after the refund rejection/profile cleanup and after the French/Chinese encoding repair.

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
- Admin frontend API routes were checked against `AdminController` after the mark-shipped fix. Current admin paths in use match backend mappings.
- Admin API helper now throws on non-OK responses; this prevents false success notices when backend validation rejects an action.
- Mark shipped requires a tracking URL beginning with `http://` or `https://`; frontend validates before calling backend, and backend validation is covered by `AdminShipOrderRequestValidationTest`.
- `ADMIN_DEV_ACCOUNT_DELETE_ENABLED` currently defaults to `true` for local registration testing. Before production, set it to `false` in production env/config and verify the admin delete-account button cannot remove accounts.
- Admin sample fallback records were removed. API failures show an error notice instead.
- Admin notifications use fixed top pill toasts styled like login success.
- Product upload returns public URLs under `/uploads/products/...`.
- Physical upload storage is environment-driven by `APP_UPLOAD_DIR` via `app.upload.dir`; use `/opt/art-gallery/uploads` on the VPS. Do not store uploads inside the repo, `.next`, or `target`.

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
  - `deploy/Caddyfile.example`
  - `deploy/art-gallery-backend.service.example`
  - `deploy/art-gallery-frontend.service.example`
  - `deploy/backend.env.example`
  - `deploy/frontend.env.example`
- Intended small-site deployment: one VPS running frontend, backend, PostgreSQL, and local uploaded product images.
- Current VPS: Ubuntu 24.04.4 LTS, non-root `deploy` user, UFW allows 22/80/443, app paths are `/opt/art-gallery/app`, `/opt/art-gallery/uploads`, `/opt/art-gallery/env`, `/var/log/art-gallery`.
- Installed on VPS: Java 24, Node 24, Maven, PostgreSQL 16, Caddy. Swap was increased to 3 GiB for builds.
- Production services: `art-gallery-backend`, `art-gallery-frontend`, `caddy`, `postgresql`; all were active after deployment.
- Live routes verified after deployment:
  - `https://sylvaineart.ca/en` returns 200.
  - `https://sylvaineart.ca/api/artworks?page=1&size=1` returns DB artwork data.
  - `https://sylvaineart.ca/uploads/products/vieux-port-de-montreal-hiver.jpg` returns 200.
- Live DB currently contains one verified admin user (`admin`, role `ADMIN`) and six real artworks/images/series; no orders, carts, refund requests, or email outbox rows yet.
- Uploads should be backed by persistent VPS storage at `/opt/art-gallery/uploads`; configure backend with `APP_UPLOAD_DIR=/opt/art-gallery/uploads`.
- Use Caddy for HTTPS/reverse proxy. Route `/api/**` and `/uploads/**` to backend `127.0.0.1:8080`; route everything else to Next `127.0.0.1:3000`.
- `NEXT_PUBLIC_*` variables must be present during `npm run build`; setting them only in the runtime systemd service is too late for client-side code.
- Normal update flow: change locally -> test -> commit/push `main` -> SSH as `deploy` -> `cd /opt/art-gallery/app && git pull --ff-only origin main` -> rebuild/restart backend and/or frontend.
- Local ignored `.env.production` exists as a deployment values source. Do not commit it.
- Minimum backup: nightly `pg_dump`, archive/copy uploads, keep at least one backup outside the VPS.

## Near-Term TODOs

- Confirm Cloudflare SSL/TLS is set to Full (strict).
- Test live Resend flows now that domain DNS is configured: registration verification, password reset, receipt, shipping, delivered, refund approval/rejection.
- Test live Stripe test-mode checkout and webhook at `https://sylvaineart.ca/api/stripe/webhook`; current deployed Stripe keys are test mode.
- Create/replace the production admin with a strong admin account before any real usage; do not rely on `admin/admin`.
- Later harden SSH: disable root login and optionally restrict SSH to the user's IP after deployment is fully validated.
- Keep `ADMIN_DEV_ACCOUNT_DELETE_ENABLED=false` on VPS and test that admin delete-account requests are rejected.
- Decide shipping fee and Canada/Quebec tax behavior before live Stripe checkout.
- Replace `soldOut` reservation semantics with explicit availability state.
- Verify official Stripe receipts later.
- Replace raw `<img>` with `next/image` or document why local/VPS images stay raw.
- Implement real OAuth provider verification only if social login is resumed.
