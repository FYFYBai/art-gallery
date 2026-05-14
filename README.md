# Sylvaine Art Gallery

Full-stack gallery storefront for Sylvaine Art.

## Stack

- Frontend: Next.js App Router, React, CSS Modules, localized routes.
- Backend: Spring Boot REST API, Spring Security/JWT, JPA/Hibernate.
- Database: PostgreSQL with Flyway migrations.
- Payments: Stripe Checkout and Stripe refunds.
- Email: Resend.

## Current Capabilities

- Localized storefront in French, English, and Chinese.
- DB-backed artwork catalog and detail pages.
- Account registration with email verification.
- Login, logout, password reset, profile password update.
- Account-backed cart.
- Stripe Checkout session creation with backend-computed totals.
- Stripe webhook payment confirmation and checkout expiry handling.
- User profile order history and refund request form.
- Admin dashboard for user lookup, product CRUD/upload, order delivery workflow, refund approval/rejection, and analytics.
- Local product image upload storage under `/uploads/products`.

## Local Development

Start PostgreSQL:

```powershell
docker compose up -d postgres
```

Backend:

```powershell
cd backend
mvn.cmd spring-boot:run
```

Frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

## Tests

Backend:

```powershell
cd backend
mvn.cmd test
```

Frontend lint:

```powershell
cd frontend
npm.cmd run lint
```

Frontend smoke tests:

```powershell
cd frontend
npm.cmd run test:e2e
```

## Environment

Backend reads `backend/.env` through Spring config import. Frontend reads `frontend/.env.local`.

Do not commit real secrets. Use `.env.production.example` as a production checklist.

## Deployment Direction

For the intended small VPS deployment, use one server for frontend, backend, PostgreSQL, and local upload storage. Optional production artifacts are included:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.prod.yml`
- `.env.production.example`
- `deploy/README.md`
- `deploy/Caddyfile.example`
- `deploy/*.service.example`
- `deploy/*.env.example`

For the current VPS plan, use Caddy as the reverse proxy and systemd services for the backend/frontend. `NEXT_PUBLIC_*` frontend values must be present when running `npm run build`, not only when starting the already-built Next.js server.
