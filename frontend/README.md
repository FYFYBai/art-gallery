# Sylvaine Art Frontend

Next.js App Router frontend for the Sylvaine Art gallery storefront.

## Routes

- `/{locale}` - Homepage.
- `/{locale}/a-propos` - About page.
- `/{locale}/artworks` - DB-backed artwork catalog with filters.
- `/{locale}/artworks/{slug}` - Artwork detail page.
- `/{locale}/cart` - Account-backed cart and Stripe Checkout start.
- `/{locale}/checkout/success` and `/{locale}/checkout/cancel` - Stripe return pages.
- `/{locale}/profile` - User account, addresses, password update, order history, refund request modal.
- `/{locale}/admin` - Admin dashboard for users, orders, refunds, analytics, and products.
- `/{locale}/privacy-policy`, `/{locale}/terms-of-service`, `/{locale}/refund-shipping-commission` - Legal pages.

Locales are `fr`, `en`, and `zh`; French is the source language for visible copy.

## Development

```powershell
npm.cmd install
npm.cmd run dev
```

Lint:

```powershell
npm.cmd run lint
```

E2E smoke tests:

```powershell
npm.cmd run test:e2e
```

Production build:

```powershell
npm.cmd run build
npm.cmd run start
```

## Environment

Create `frontend/.env.local` for local frontend secrets/config:

```txt
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

Do not commit `.env.local`.

## Notes

- Auth state is stored in `localStorage.auth`; backend APIs remain the source of authorization.
- Cart/checkout prices are computed by backend before Stripe checkout.
- Some images intentionally still use raw `<img>` tags; lint reports optimization warnings only.
- Social login buttons are visual placeholders until real OAuth provider verification is implemented.
