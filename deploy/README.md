# VPS Deployment Notes

This project is deployed on one Ubuntu VPS running the frontend, backend, PostgreSQL, uploaded product images, and Caddy HTTPS reverse proxy.

## Current VPS

```txt
OS: Ubuntu 24.04.4 LTS
User: deploy
Firewall: 22/tcp, 80/tcp, 443/tcp
Runtime: Java 24, Node 24, Maven, PostgreSQL 16, Caddy
Swap: 3 GiB total
```

Important paths:

```txt
/opt/art-gallery/app       cloned Git repo
/opt/art-gallery/env       backend/frontend/db env files
/opt/art-gallery/uploads   persistent uploaded product images
/var/log/art-gallery       app logs
```

Services:

```txt
art-gallery-backend
art-gallery-frontend
caddy
postgresql
```

## Public Routing

```txt
https://sylvaineart.ca          -> frontend on 127.0.0.1:3000
https://sylvaineart.ca/api/...  -> backend on 127.0.0.1:8080
https://sylvaineart.ca/uploads/ -> backend static upload handler
```

Caddy config template:

```txt
deploy/Caddyfile.example
```

Systemd templates:

```txt
deploy/art-gallery-backend.service.example
deploy/art-gallery-frontend.service.example
```

Env templates:

```txt
deploy/backend.env.example
deploy/frontend.env.example
```

Real env files live only on the VPS and should not be committed.

## Required Backend Env

```txt
DB_URL=jdbc:postgresql://localhost:5432/artgallery
DB_USERNAME=artgallery
DB_PASSWORD=...
JWT_SECRET=...
CORS_ALLOWED_ORIGINS=https://sylvaineart.ca,https://www.sylvaineart.ca
APP_FRONTEND_BASE_URL=https://sylvaineart.ca
APP_UPLOAD_DIR=/opt/art-gallery/uploads
RESEND_FROM_EMAIL=studio@sylvaineart.ca
RESEND_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
ADMIN_DEV_ACCOUNT_DELETE_ENABLED=false
```

## Required Frontend Env

```txt
NEXT_PUBLIC_API_BASE_URL=https://sylvaineart.ca
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

`NEXT_PUBLIC_*` values must be present during `npm run build`; setting them only when starting the service is too late.

## Update Workflow

Push changes locally first:

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

Backend rebuild:

```bash
cd /opt/art-gallery/app/backend
mvn -B -DskipTests package
sudo systemctl restart art-gallery-backend
```

Frontend rebuild:

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

## Current Production Data

Initial deployed DB state after Flyway:

```txt
users: 1 admin user
artworks: 6 real artworks
orders/carts/refunds/email_outbox: empty
```

The seeded product image files are copied to:

```txt
/opt/art-gallery/uploads/products
```

## Remaining Production Tasks

- Confirm Cloudflare SSL/TLS mode is Full (strict).
- Test Resend live-domain emails.
- Test Stripe test-mode checkout and webhook delivery.
- Replace the seeded admin credentials with a strong admin account before real use.
- Add backup automation for PostgreSQL and `/opt/art-gallery/uploads`.
- Decide shipping fees and Canada/Quebec tax rules before enabling live Stripe payments.
- Later harden SSH by disabling root login and optionally restricting SSH by source IP.
