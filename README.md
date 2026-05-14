# Sylvaine Art Gallery

A production-deployed full-stack e-commerce gallery for a small independent art studio.

The project supports a localized storefront, account registration with email verification, persistent carts, Stripe Checkout, order/refund workflows, product image uploads, and an admin dashboard for managing artworks, users, delivery, refunds, and analytics.

Live site:

```txt
https://sylvaineart.ca
```

## Highlights

- Built a multilingual storefront with French, English, and Chinese routes.
- Modeled a DB-backed artwork catalog with artwork type, multiple series, year, size, price, availability, image, and long-form descriptions.
- Implemented account-backed carts and checkout safety: the backend recomputes final cart items and prices before creating Stripe sessions.
- Integrated Stripe Checkout, webhook payment confirmation, checkout expiry handling, and refund reconciliation.
- Added email workflows through Resend: verification, password reset, receipts, shipping, delivery, refund approval, and refund rejection.
- Added a transactional email outbox so email delivery failures do not roll back payment/order state.
- Built an admin dashboard for account lookup, product CRUD/upload, delivery queue, shipped orders, refund requests, and page-view analytics.
- Deployed to a single Ubuntu VPS with PostgreSQL, Spring Boot, Next.js, local upload storage, systemd services, Caddy HTTPS reverse proxy, and Cloudflare DNS.

## Stack

Frontend:

- Next.js App Router
- React
- CSS Modules
- Localized routes: `fr`, `en`, `zh`

Backend:

- Spring Boot
- Spring Security + JWT
- JPA/Hibernate
- Flyway migrations
- PostgreSQL

Integrations:

- Stripe Checkout and Stripe refund APIs
- Resend transactional email
- Cloudflare DNS
- Caddy reverse proxy with automatic HTTPS

## Core Features

- Localized homepage, about page, legal pages, artwork listing, artwork detail, cart, checkout, profile, and admin routes.
- Registration with email verification and resend cooldown.
- Password reset with token email and password reuse prevention.
- Login/logout with JWT.
- Persistent cart per account.
- Artwork availability checks on cart access and checkout.
- Admin product creation/edit/delete with image upload.
- Admin delivery workflow: paid orders, shipped orders, tracking link email, delivered email.
- User refund request workflow with admin approval/rejection.
- Stripe webhook idempotency through processed event storage.
- Aggregated page-view analytics for admin dashboard.

## Local Development

Start PostgreSQL:

```powershell
docker compose up -d postgres
```

Run backend:

```powershell
cd backend
mvn.cmd spring-boot:run
```

Run frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Local environment files:

```txt
backend/.env
frontend/.env.local
```

Do not commit real secrets.

## Verification

Backend tests:

```powershell
cd backend
mvn.cmd test
```

Frontend lint:

```powershell
cd frontend
npm.cmd run lint
```

Frontend production build:

```powershell
cd frontend
npm.cmd run build
```

Current lint note: frontend lint passes with existing raw `<img>` optimization warnings.

## Deployment

Current production deployment:

```txt
Ubuntu 24.04 VPS
Cloudflare DNS
Caddy HTTPS reverse proxy
Next.js frontend on 127.0.0.1:3000
Spring Boot backend on 127.0.0.1:8080
PostgreSQL 16 on localhost
Uploads at /opt/art-gallery/uploads
```

Important VPS paths:

```txt
/opt/art-gallery/app
/opt/art-gallery/env
/opt/art-gallery/uploads
/var/log/art-gallery
```

Public routing:

```txt
https://sylvaineart.ca          -> Next.js frontend
https://sylvaineart.ca/api/...  -> Spring Boot backend
https://sylvaineart.ca/uploads/ -> backend upload handler
```

Deployment templates are in:

```txt
deploy/
```

They include Caddy, systemd, and environment examples. `NEXT_PUBLIC_*` values must be present during `npm run build` because Next.js inlines them into the client bundle.

## Update Workflow

Normal production updates:

```powershell
git add .
git commit -m "Describe change"
git push origin main
```

Then on the VPS:

```bash
cd /opt/art-gallery/app
git pull --ff-only origin main
```

Backend changes:

```bash
cd /opt/art-gallery/app/backend
mvn -B -DskipTests package
sudo systemctl restart art-gallery-backend
```

Frontend changes:

```bash
cd /opt/art-gallery/app/frontend
set -a
. /opt/art-gallery/env/frontend.env
set +a
npm ci
npm run build
sudo systemctl restart art-gallery-frontend
```

Health checks:

```bash
systemctl is-active art-gallery-backend art-gallery-frontend caddy postgresql
curl -I https://sylvaineart.ca/en
curl "https://sylvaineart.ca/api/artworks?page=1&size=1"
```

## Production Notes

- Stripe is currently configured for test mode until live checkout is intentionally enabled.
- `ADMIN_DEV_ACCOUNT_DELETE_ENABLED` must remain `false` on the VPS.
- Back up PostgreSQL and `/opt/art-gallery/uploads`.
- Shipping fees and Canada/Quebec tax behavior still need final business rules before live payment use.
- OAuth/social login scaffolding exists, but provider verification is not production-ready.
