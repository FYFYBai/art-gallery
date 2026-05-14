# VPS Deployment Notes

This repo can run frontend, backend, PostgreSQL, and uploaded product images on one small VPS.

Current development commands are unchanged:

- Database only: `docker compose up -d postgres`
- Backend: `cd backend && mvn spring-boot:run`
- Frontend: `cd frontend && npm run dev`

Production-oriented files added here are optional until a domain/VPS is ready:

- `docker-compose.prod.yml` builds and runs PostgreSQL, Spring Boot, and Next.js.
- `.env.production.example` lists the required production environment variables.
- `backend/Dockerfile` builds the Spring Boot jar.
- `frontend/Dockerfile` builds and starts the Next.js app.

Before production, confirm dev-only account deletion is disabled:

```txt
ADMIN_DEV_ACCOUNT_DELETE_ENABLED=false
```

This is intentionally enabled by default in local development so registration workflows can be retested with the same email. It must stay disabled on the VPS.

Uploads are stored on the VPS filesystem at `./uploads/products` and mounted into the backend container at `/app/uploads/products`. Back this directory up together with the PostgreSQL volume.

A reverse proxy such as Caddy or Nginx still needs to be added after the domain is known. It should terminate HTTPS, route `/api/**` and `/uploads/**` to the backend, and route everything else to the frontend.

## Current VPS Plan

The current target is a single Ubuntu 24.04 VPS:

- App checkout: `/opt/art-gallery/app`
- Production env files: `/opt/art-gallery/env`
- Product uploads: `/opt/art-gallery/uploads`
- App logs: `/var/log/art-gallery`

The backend must receive:

```txt
APP_UPLOAD_DIR=/opt/art-gallery/uploads
APP_FRONTEND_BASE_URL=https://sylvaineart.ca
CORS_ALLOWED_ORIGINS=https://sylvaineart.ca,https://www.sylvaineart.ca
ADMIN_DEV_ACCOUNT_DELETE_ENABLED=false
```

The frontend must receive:

```txt
NEXT_PUBLIC_API_BASE_URL=https://sylvaineart.ca
```

These `NEXT_PUBLIC_*` values must be present during `npm run build` because Next.js inlines them into the client bundle.

Expected public routing:

```txt
https://sylvaineart.ca          -> frontend on localhost:3000
https://sylvaineart.ca/api/...  -> backend on localhost:8080
https://sylvaineart.ca/uploads/ -> backend static upload handler
```

Before switching Stripe to live mode, deploy with test keys and test registration, email verification, password reset, checkout, webhook payment confirmation, refund approval/rejection, shipping, delivered, and uploaded product images.
