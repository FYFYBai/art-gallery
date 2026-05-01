# Sylvaine Art Gallery Frontend

This is a Next.js frontend for a warm, editorial art gallery website centered around the artist Sylvaine. The site is currently a front-end prototype with placeholder imagery, sample cart/checkout states, and presentation-only account/search interactions.

## Current Pages

- `/` - Homepage with hero, display sample cards, original-art storytelling, curator favorites carousel, and a curated experience CTA.
- `/a-propos` - About page for Sylvaine with two demo section layouts: text-only and text-with-image.
- `/cart` - Sample cart flow with Cart, Checkout, and Confirmation states.

The global header and footer persist across all routes through `app/layout.js`.

## Key Features

- Warm gallery-inspired palette from `color_pallet.txt`.
- Serif title typography and sans-serif UI/body typography.
- Custom header with navigation dropdowns, search input, language menu, account modal, and cart link.
- Account login modal with email/password fields, account links, and social login button placeholders.
- Cart icon shared between the header and cart empty state.
- Temporary cart flow with a progress stepper.
- Footer subscription form and navigation.
- Placeholder image data prepared for later real artwork/image implementation.

## Tech Stack

Current frontend:

- Next.js App Router
- React
- CSS Modules
- `next/font/google` for Noto Sans and Noto Serif
- Local font loading for the logo font through `app/globals.css`

Planned backend stack:

- Java Spring Boot REST API
- PostgreSQL database
- Spring Security
- JWT and/or secure session-cookie authentication
- Stripe for payments and checkout

Planned architecture:

```txt
Next.js frontend
  -> Spring Boot API
  -> PostgreSQL
  -> Stripe payment flow
```

The current login, cart, checkout, and confirmation views are front-end prototypes only. They are intended to be connected later to the Spring Boot backend, persisted user/cart/order data, and Stripe checkout/payment flows.

## Project Structure

```txt
app/
  layout.js
  page.js
  globals.css
  a-propos/
  cart/

components/
  header/
  footer/
  hero/
  cart/
  home/
```

Homepage sections live under `components/home`. Shared sitewide pieces live under `components/header` and `components/footer`.

For a detailed Codex handoff and implementation map, see:

```txt
CODEX_PROJECT_CONTEXT.md
```

## Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

On Windows PowerShell, if script execution blocks `npm`, use:

```powershell
npm.cmd run dev
```

Run lint:

```powershell
npm.cmd run lint
```

Build and preview production:

```powershell
npm.cmd run build
npm.cmd run start
```

## Current Notes

- Several images are temporary remote placeholders.
- Some components still use raw `<img>` tags, so lint reports image optimization warnings only.
- Search, account login, social login, subscription, and cart checkout are front-end placeholders.
- The favicon is served from `public/favicon.png`.
