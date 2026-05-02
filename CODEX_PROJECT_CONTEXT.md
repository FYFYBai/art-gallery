# Codex Project Context

This file is a handoff guide for future Codex sessions working on this repository. Read this before making changes. It captures the current structure, conventions, design direction, and feature locations so future sessions can avoid rediscovering the project from scratch.

## Project Overview

This is a Next.js frontend for an art gallery / artist portfolio-style ecommerce site. The project uses the Next.js App Router and React client components where interactivity is needed.

Primary goals so far:

- Build a warm, refined art-gallery frontend.
- Use a French-facing navigation/content direction.
- Keep the global header and footer persistent across route pages.
- Keep page sections modular, with one component folder per feature section.
- Use temporary hardcoded image URLs for now, while leaving the structure ready for future real image implementation.

## Stack

- Next.js `^16.2.4`
- React `19.2.3`
- React DOM `19.2.3`
- ESLint `9`
- `eslint-config-next` `16.1.6`
- `babel-plugin-react-compiler` `1.0.0`
- JavaScript, not TypeScript
- CSS Modules for component styling
- `next/font/google` for typography

Useful commands:

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
npm.cmd run start
npm.cmd run dev
```

Run frontend commands from `frontend/`. Use `npm.cmd` on Windows PowerShell if `npm` is blocked by execution policy.

Backend demo commands:

```powershell
docker compose up -d
cd backend
mvn test
mvn spring-boot:run
```

The backend uses PostgreSQL from `docker-compose.yml` and defaults to `http://localhost:8080`.

## Important Working Notes

- Ignore `.next` and `node_modules` unless absolutely necessary.
- The shell may display some UTF-8/French/Chinese characters incorrectly as mojibake. Do not “fix” text just because shell output looks corrupted. The user confirmed these strings display fine in the IDE and live server.
- Do not use emojis unless the user explicitly asks for them.
- Current lint result: `npm.cmd run lint` passes with `0 errors`, but has warnings about raw `<img>` usage. These warnings are accepted for now because image handling is temporary.
- Many images are still temporary, but several homepage sections now use local files under `frontend/public/images/...`.
- The user may later ask to reverse the recent animation/performance optimization pass. Those changes are primarily CSS-only and listed below.

## Backend Status

### Database Layer (✅ Complete)

The Spring Boot backend has a complete and robust PostgreSQL database schema via Flyway migrations:

- **Migrations**: 10 SQL files under `backend/src/main/resources/db/migration/`
- **Tables**: All core domain tables present (users, user_auth_providers, user_addresses, payment_methods, artworks, artwork_images, carts, cart_items, orders, order_items)
- **Schema highlights**:
  - UUID primary keys using `gen_random_uuid()`
  - Proper constraints and CHECK conditions for domain values
  - Indexes on artwork search fields (type, medium, year, sold_out, active)
  - Unique constraints where needed (email, provider+provider_user_id, cart_id+artwork_id)
  - Foreign keys with CASCADE delete policies
  - Monetary fields use `NUMERIC(10,2)`
  - `artwork_year` limited to 2024, 2025, 2026
- **Configuration**: `application.yml` correctly enables Flyway with `spring.jpa.hibernate.ddl-auto: none`

### Application Layer (⏳ Pending)

The following layers are scaffolded but not yet implemented:

- `backend/src/main/java/com/artgallery/controller/` — empty (package-info only)
- `backend/src/main/java/com/artgallery/service/` — empty (package-info only)
- `backend/src/main/java/com/artgallery/security/` — empty (package-info only)

**Next backend work**:

1. Implement REST controllers for auth, user, artwork, cart, order endpoints
2. Implement business logic services
3. Implement JWT security config and OAuth2 integration
4. Wire repositories into services

The repository layer (`com.artgallery.repository`) is already present with all necessary JpaRepository interfaces.

### Current Backend Demo Slice

The backend is no longer purely scaffolded. A narrow registration demo has been implemented end-to-end:

- `POST /api/auth/register`
- Validates email, password length, and password confirmation.
- Normalizes email to lowercase.
- Rejects duplicate emails with `409 Conflict`.
- Hashes passwords with BCrypt before storing `users.password_hash`.
- Saves a `User` through `UserRepository`.
- CORS is configured for local frontend dev origins such as `http://localhost:*` and `http://127.0.0.1:*`.
- `mvn test` passes with 4 registration validation tests.

Registration demo files:

```txt
backend/src/main/java/com/artgallery/controller/AuthController.java
backend/src/main/java/com/artgallery/service/AuthService.java
backend/src/main/java/com/artgallery/config/SecurityConfig.java
backend/src/main/java/com/artgallery/dto/request/RegisterRequest.java
backend/src/main/java/com/artgallery/dto/response/RegisterResponse.java
backend/src/main/java/com/artgallery/dto/response/ApiErrorResponse.java
backend/src/main/java/com/artgallery/exception/DuplicateEmailException.java
backend/src/main/java/com/artgallery/exception/GlobalExceptionHandler.java
backend/src/test/java/com/artgallery/dto/request/RegisterRequestValidationTest.java
REGISTRATION_DEMO_FLOW.txt
```

### For Future Sessions

When implementing the service/controller layer:

- Match endpoint signatures to frontend expectations (Next.js frontend already has placeholder cart flow and auth UI ready)
- Domain entities are well-modeled in `com.artgallery.domain.*` (User, UserAuthProvider, UserAddress, PaymentMethod, Artwork, Cart, Order, etc.)
- Use the existing enum types (OAuthProvider, CartStatus, OrderStatus, PaymentType, PaymentProvider)
- Follow Spring Security + JWT best practices
- Spring Boot 3.5.0 and Java 24 are configured

## Repository Shape

Top-level important files:

```txt
frontend/app/
frontend/components/
frontend/public/
frontend/color_pallet.txt
frontend/package.json
frontend/jsconfig.json
frontend/next.config.mjs
frontend/eslint.config.mjs
backend/
docker-compose.yml
CODEX_PROJECT_CONTEXT.md
REGISTRATION_DEMO_FLOW.txt
```

Path alias:

```js
"@/*": ["./*"]
```

So imports commonly use `@/components/...`.

## App Router Structure

Routes live under `frontend/app`.

Current routes:

```txt
frontend/app/layout.js
frontend/app/page.js
frontend/app/a-propos/page.js
frontend/app/a-propos/AProposPage.module.css
frontend/app/cart/page.js
frontend/app/globals.css
```

### `frontend/app/layout.js`

Global shell. Imports:

- `frontend/app/globals.css`
- `Header`
- `Footer`
- `Noto_Sans`
- `Noto_Serif`

This layout wraps all pages with:

```jsx
<Header />
<main className="pageContent">{children}</main>
<Footer />
```

Because of this, route pages such as `/a-propos` and `/cart` automatically persist the header and footer.

### `frontend/app/page.js`

Homepage composition route. It imports and renders homepage sections in this order:

```jsx
<Hero />
<DisplaySample />
<WhyOriginalSection />
<CuratorFavoritesSection />
<CuratedExperienceSection />
```

Previously removed from homepage but files remain:

- `ShopCategorySection`
- `WhyShopSection`
- `FeaturedRowsSection`

These still exist in `frontend/components/home/...` but are not currently rendered in `frontend/app/page.js`.

### `frontend/app/a-propos`

Route for `/a-propos`.

Files:

```txt
frontend/app/a-propos/page.js
frontend/app/a-propos/AProposPage.module.css
```

The page currently has two demo main-content sections:

- A text-only section.
- A text-plus-sample-image section.

Both sections use the same text:

```txt
Sylvaine

Sylvaine est une artiste peintre basée à Montréal.

Son travail explore la lumière, la perception et la mémoire du paysage à travers la peinture à l’huile et le dessin.
```

These are demo alternatives. User said one will eventually be deleted, so treat each section as a standalone possible main design for the page.

Current implementation uses a raw `<img>` placeholder and therefore triggers a Next lint warning. This is acceptable for now.

Future cleanup option:

- If this page grows, keep `frontend/app/a-propos/page.js` as a route composer.
- Move reusable sections into `frontend/components/a-propos/`.

### `frontend/app/cart`

Route for `/cart`.

Files:

```txt
frontend/app/cart/page.js
frontend/components/cart/CartSection.js
frontend/components/cart/CartSection.module.css
```

`frontend/app/cart/page.js` only renders `<CartSection />`.

## Component Organization

Main convention:

- Shared/global components live directly under `frontend/components/<feature>/`.
- Homepage-only sections live under `frontend/components/home/<section-name>/`.
- Each section usually has:
  - PascalCase component file
  - matching CSS module
  - optional data file when content is list-like

Examples:

```txt
frontend/components/header/Header.js
frontend/components/header/Header.module.css
frontend/components/header/headerData.js
frontend/components/header/icons.js

frontend/components/footer/Footer.js
frontend/components/footer/Footer.module.css

frontend/components/hero/Hero.js
frontend/components/hero/Hero.module.css
frontend/components/hero/heroSlides.js

frontend/components/home/display-sample/DisplaySample.js
frontend/components/home/display-sample/DisplaySample.module.css

frontend/components/home/why-original/WhyOriginalSection.js
frontend/components/home/why-original/WhyOriginalSection.module.css
frontend/components/home/why-original/whyOriginalData.js

frontend/components/home/curator-favorites/CuratorFavoritesSection.js
frontend/components/home/curator-favorites/CuratorFavoritesSection.module.css

frontend/components/home/curated-experience/CuratedExperienceSection.js
frontend/components/home/curated-experience/CuratedExperienceSection.module.css

frontend/components/cart/CartSection.js
frontend/components/cart/CartSection.module.css
```

## Design System And Styling Rules

### Color Palette

Palette source: `frontend/color_pallet.txt`

```txt
Primary Background: #F5F0E6
Secondary Background: #FCFAF5
Soft Neutral / Border: #D8CBB8
Accent: #B89B72
Text / Dark Neutral: #4E4338
```

These are represented in `frontend/app/globals.css` as tokens:

```css
--page-bg: #f5f0e6;
--surface-main: #fcfaf5;
--surface-muted: #f4ecdf;
--surface-strong: #eadfce;
--surface-dark: #4e4338;
--text-main: #4e4338;
--text-soft: #6a5b4d;
--text-faint: #8f7f6f;
--accent: #b89b72;
--accent-strong: #9f8157;
--accent-soft: #ddceb7;
--line-soft: rgba(216, 203, 184, 0.58);
--line-mid: rgba(216, 203, 184, 0.9);
--white: #fcfaf5;
```

Prefer these tokens over hardcoded colors.

### Typography

User rule:

- `Noto Serif` for titles/headings.
- Sans-serif for body text, UI, labels, buttons, forms, navigation.
- Refined homepage editorial sections may use the local Playfair Display font via `--font-display`.

Implemented through `next/font/google` in `frontend/app/layout.js`:

```js
Noto_Sans -> --font-sans
Noto_Serif -> --font-serif
```

Global aliases in `frontend/app/globals.css`:

```css
--font-body: var(--font-sans);
--font-title: var(--font-serif);
--font-logo: "Sylvaine Didot", serif;
--font-display: "Sylvaine Playfair", serif;
```

Use:

```css
font-family: var(--font-title), serif;
font-family: var(--font-body), sans-serif;
```

### Interaction Style

Links and CTAs commonly use:

- Warm accent color on hover.
- Animated underline via `::after` with `transform: scaleX(...)`.
- Subtle transform on button active state.
- Rounded but not pill-shaped buttons for forms and CTAs, usually `border-radius: 8px`.

Avoid purple/dark-mode generic styling. Keep warm, muted, gallery-like.

### Animation Performance Notes

The site recently received a conservative performance optimization pass because animations felt low-framerate. Changes were intentionally small and reversible.

Touched files:

```txt
frontend/components/header/Header.module.css
frontend/components/hero/Hero.module.css
frontend/components/home/curator-favorites/CuratorFavoritesSection.module.css
frontend/components/home/featured-rows/FeaturedRowsSection.module.css
```

Optimization types:

- Reduced blur slightly:
  - Header `backdrop-filter: blur(14px)` to `10px`
  - Account modal overlay `blur(6px)` to `4px`
  - Hero content outer `blur(4px)` to `3px`
- Added `will-change` / `backface-visibility` / `translateZ(0)` to animated layers.
- Added `contain: paint` to carousel image containers.
- Added `translate3d(0, 0, 0)` base transform to carousel tracks.

If the user asks to reverse this optimization pass, inspect the diff around those four CSS files.

## Header

Files:

```txt
frontend/components/header/Header.js
frontend/components/header/Header.module.css
frontend/components/header/headerData.js
frontend/components/header/icons.js
```

### Header Layout

Current layout:

- Logo on the left.
- Navigation on the right, next to search.
- Then language, account, cart icon buttons.

Navigation items currently intended:

```txt
Œuvres
Séries
À propos
Expositions
Contact
```

Again, shell may display these as mojibake. Do not change encoding unless the user sees a real issue in IDE/browser.

### Header Data

`headerData.js` controls nav labels, links, dropdown columns, promo text, rotating search terms, and language options.

Important:

- `À propos` link points to `/a-propos`.
- `Œuvres`, `Séries`, and `Expositions` have dropdowns.
- `À propos` is a direct link only, no dropdown.
- `Contact` is currently a plain link.

### Header Dropdown Behavior

`Header.js` has hover logic for dropdowns:

- Dropdown opens when hovering a nav item with `columns`.
- It closes when pointer leaves the nav item and dropdown panel.
- It has a short delayed close and fade-out animation.
- `visibleDropdown`, `activeDropdown`, and `isDropdownClosing` manage open/close lifecycle.

CSS animation:

- `dropdownFadeIn`
- `dropdownFadeOut`

### Search Bar

The search bar is a real input inside a form.

Behavior:

- Rotating search text is an animated overlay placeholder, not a native input placeholder.
- The fixed prefix `Search for` stays in place while only the keyword moves up/out and the next keyword enters from below.
- Header search animation uses `searchTermIndex`, `previousSearchTermIndex`, `searchTermAnimating`, and CSS keyframes in `Header.module.css`.
- User can type normally.
- A custom `×` clear button appears when input has content.
- A right-arrow submit button appears when input has content.
- Pressing Enter or clicking arrow triggers placeholder logic:

```js
window.location.hash = `search=${encodeURIComponent(trimmedSearchQuery)}`;
```

This is temporary until a real search route/page exists.

### Account Modal

The account button opens a floating modal over the whole page, not a dropdown.

Behavior:

- Opens from account icon button.
- Closes on outside click.
- Closes on Escape.
- Closes via `×` button.
- Login UI is mostly presentational, but registration now talks to the Spring Boot demo endpoint.

Content:

- Login mode: email, password, forgot password link, register account link, login button.
- Register mode: email, password, password confirmation, back-to-login link, create account button.
- Register mode calls `POST /api/auth/register` through `handleAccountSubmit`.
- Frontend registration validation checks required fields, minimum password length, and password confirmation.
- A temporary `accountToast` success/failure message appears inside the modal.
- The frontend uses `NEXT_PUBLIC_API_BASE_URL` if set, otherwise `http://localhost:8080`.
- Social login buttons: Google, Facebook, Instagram. These remain visible under both login and registration modes.

CSS classes are in `Header.module.css`, including:

```css
.accountModalOverlay
.accountModal
.accountModalClose
.loginForm
.accountToast
.socialButtons
```

### Icons

Shared SVG icon components are in `frontend/components/header/icons.js`.

Important:

- `CartIcon` is a purse-like shopping bag icon.
- It is used both in the navbar and on the cart page empty state.
- If updating the cart/purse icon, update this shared component, not separate inline SVGs.

Current `CartIcon` design direction:

- Refined purse/bag outline.
- Rounded body.
- Handles dip into main body slightly.
- Stroke weight intended to fit other header icons.

## Footer

Files:

```txt
frontend/components/footer/Footer.js
frontend/components/footer/Footer.module.css
```

Footer currently contains:

- Subscription form replacing old brand/tagline.
- Nav links matching header labels.
- `À propos` links to `/a-propos`.
- Warm dark gradient background using project palette.

Subscription form is presentational only.

Footer nav links have animated underline hover.

## Homepage Sections

### Hero

Files:

```txt
frontend/components/hero/Hero.js
frontend/components/hero/Hero.module.css
frontend/components/hero/heroSlides.js
```

`Hero.js` is a client component with carousel state and previous/next side controls.

First slide text:

```txt
Sylvaine
Peinture, entre mémoire et paysage.
À propos
```

Older note: images used to be hardcoded remote placeholders in `heroSlides.js`; current hero images are local files under `frontend/public/images/hero/`.

Styling uses a content card over a background image, with warm overlay and animated entry.

Current hero refinement notes:

- Hero images are now local files under `frontend/public/images/hero/` named `1.png`, `2.png`, and `3.png`.
- `heroSlides.js` points to `/images/hero/1.png`, `/images/hero/2.png`, and `/images/hero/3.png`.
- The supplied hero PNGs are treated as designed banner comps. CSS uses `background-size: 100% 100%` to avoid both cropping and letterboxing.
- The text layer was restyled toward an editorial hero: no content card, navbar-style logo font for `SYLVAINE ART`, Playfair/Didot-like headline treatment, divider, CTA arrow, and non-selectable hero text.

### Display Sample

Files:

```txt
frontend/components/home/display-sample/DisplaySample.js
frontend/components/home/display-sample/DisplaySample.module.css
```

Homepage section with four sample artwork/category cards.

Older note: this section used to use hardcoded remote images; it now uses local files under `frontend/public/images/display-sample/`.

Titles use `Noto Serif`.

Action links use animated underline hover.

Current display-sample refinement notes:

- Images are now local files under `frontend/public/images/display-sample/` named `display1.png` through `display4.png`.
- `DisplaySample.js` contains French editorial card content and uses proper French ligatures where added in the IDE/browser source.
- The section heading/subheading is editorial and the subheading is kept one line on desktop.
- `DisplaySample.module.css` uses Playfair Display via `--font-display` for section and card titles.
- Supporting text in this section uses serif.
- Cards have thin borders, tall image ratios, subtle whole-card hover lift, and CTA underline animation.

### Why Original

Files:

```txt
frontend/components/home/why-original/WhyOriginalSection.js
frontend/components/home/why-original/WhyOriginalSection.module.css
frontend/components/home/why-original/whyOriginalData.js
```

Interactive client section with custom sticky/fixed behavior for the left text column.

Right side uses cards from `whyOriginalData.js`.

Older note: images used to be temporary remote placeholders; this section now uses local files under `frontend/public/images/why-original/`.

Important: This component manually calculates sticky behavior with scroll/resize listeners. Be careful editing this logic.

Current why-original refinement notes:

- Images are now local files under `frontend/public/images/why-original/` named `1.png` through `5.png`.
- `whyOriginalData.js` contains five French cards; reference numbering was intentionally removed.
- Card descriptions use real `\n` sentence breaks and `.cardDescription { white-space: pre-line; }`.
- Left copy is now French editorial copy similar to: `L'ART DANS VOTRE QUOTIDIEN` and `Habiter une œuvre, c'est habiter une sensation.`
- Left heading uses Playfair Display via `--font-display`.
- Card spacing was tightened, the image column was made larger, images fill the card height on desktop/tablet, and corners are only subtly rounded.

### Curator Favorites

Files:

```txt
frontend/components/home/curator-favorites/CuratorFavoritesSection.js
frontend/components/home/curator-favorites/CuratorFavoritesSection.module.css
```

Client carousel with 15 hardcoded placeholder items.

Behavior:

- Responsive items per view:
  - Desktop: 5
  - Tablet: 3
  - Mobile: 2
  - Small mobile: 1
- Autoplays every 10 seconds.
- Pauses on hover.
- Previous/next controls wrap infinitely.
- Uses `safePageIndex` directly to avoid React lint set-state-in-effect errors.

If modifying carousel state, run lint. React Compiler rules are strict.

### Curated Experience

Files:

```txt
frontend/components/home/curated-experience/CuratedExperienceSection.js
frontend/components/home/curated-experience/CuratedExperienceSection.module.css
```

Full-width background-image CTA section.

Uses warm overlay and a CTA button.

### Sections Not Currently Rendered

These still exist but are not currently included in `frontend/app/page.js`:

```txt
frontend/components/home/shop-category/ShopCategorySection.js
frontend/components/home/why-shop/WhyShopSection.js
frontend/components/home/featured-rows/FeaturedRowsSection.js
```

`FeaturedRowsSection` is a product carousel with two rows and sample product data. It still passes lint and may be reused later.

## Cart Page

Files:

```txt
frontend/app/cart/page.js
frontend/components/cart/CartSection.js
frontend/components/cart/CartSection.module.css
```

Current state:

- Client component.
- Three-stage temporary demo:
  - Cart
  - Checkout
  - Confirmation
- Temporary forward-flow button:
  - `Proceed to Checkout`
  - `Place Demo Order`
  - `Back to Cart`
- Stepper progress bar updates based on `currentStep`.
- Current/completed nodes are solid.
- Future nodes are hollow.

Cart stage:

- Empty cart display.
- Shared purse icon from `CartIcon`.
- `Continue Shopping` button.

Checkout stage:

- Sample checkout form fields:
  - Email
  - Full name
  - Delivery address
  - City

Confirmation stage:

- Sample confirmation message.
- Demo order summary.

Customer service panel appears on the right for all stages.

## Linting Notes

Run:

```powershell
cd frontend
npm.cmd run lint
```

Current lint status:

- `0 errors`
- Warnings only for raw `<img>` usage

Warning locations include:

```txt
frontend/app/a-propos/page.js
frontend/components/home/curator-favorites/CuratorFavoritesSection.js
frontend/components/home/display-sample/DisplaySample.js
frontend/components/home/featured-rows/FeaturedRowsSection.js
frontend/components/home/why-original/WhyOriginalSection.js
```

These warnings are accepted for now because image assets and image strategy are temporary.

Future improvement:

- Move important images into `frontend/public/`.
- Use Next `<Image />` for local/remote optimized images.
- Configure remote domains if needed.

## Image Strategy Current State

Current image implementation is temporary:

- Many sections use external URLs from Unsplash or Picsum.
- Some components use raw `<img>`.
- Hero uses CSS background images.
- `frontend/public/` now contains the favicon, local font files, legal-policy document placeholders, and local demo artwork/images.
- Local demo image folders currently include:
  - `frontend/public/images/hero/`
  - `frontend/public/images/display-sample/`
  - `frontend/public/images/why-original/`

Do not invest heavily in image optimization unless the user asks, because real image implementation is planned later.

## Routing And Links

Current meaningful routes:

```txt
/
/a-propos
/cart
```

Header/footer links:

- `À propos` -> `/a-propos`
- Cart button links to `/cart` in `frontend/components/header/Header.js`.
- Search currently writes URL hash only, no real search page yet.

## Common Future Tasks And Where To Work

### Change nav labels/dropdowns

Look in:

```txt
frontend/components/header/headerData.js
```

Then adjust dropdown styling if needed in:

```txt
frontend/components/header/Header.module.css
```

### Change header behavior

Look in:

```txt
frontend/components/header/Header.js
```

Important state:

```js
activeDropdown;
visibleDropdown;
isDropdownClosing;
languageOpen;
accountOpen;
searchQuery;
searchTermIndex;
```

### Inspect language switching

Current language UI lives in:

```txt
frontend/components/header/Header.js
frontend/components/header/headerData.js
frontend/components/header/Header.module.css
```

As of this context update, language options only open as a menu and do not switch site content. The next planned task is to inspect how the user's colleague implements language switching and decide how to integrate it with the current frontend structure.

### Change global palette or typography

Look in:

```txt
frontend/app/globals.css
frontend/app/layout.js
```

### Change homepage section order

Look in:

```txt
frontend/app/page.js
```

### Add a new route page

Add a folder under `frontend/app`:

```txt
frontend/app/<route-name>/page.js
frontend/app/<route-name>/<RouteName>.module.css
```

If the page gets complex, place reusable sections in:

```txt
frontend/components/<route-name>/
```

### Work on cart flow

Look in:

```txt
frontend/components/cart/CartSection.js
frontend/components/cart/CartSection.module.css
```

### Update shared icons

Look in:

```txt
frontend/components/header/icons.js
```

Important: `CartIcon` is shared between header and cart page.

## Code Style Preferences

- Prefer CSS Modules for component styling.
- Keep files colocated by feature.
- Keep data arrays separate when they become large or reusable.
- Use existing global tokens rather than hardcoded values.
- Use serif only for title-like text.
- Use sans-serif for UI, forms, buttons, labels, and body text.
- Preserve existing component separation and naming pattern.
- Avoid adding comments unless the code is unusually complex.
- Do not introduce emoji unless explicitly requested.

## Known Issues / Technical Debt

- Raw `<img>` warnings remain.
- Some shell outputs show mojibake for valid source text.
- Header has quite a bit of responsibility now:
  - nav dropdowns
  - search
  - language menu
  - account modal
  - cart button

  If it grows further, consider extracting:

```txt
frontend/components/header/SearchBar.js
frontend/components/header/AccountModal.js
frontend/components/header/NavDropdown.js
```

- Cart flow is temporary demo state only. It does not persist cart data and has no checkout backend.
- Search submit logic is placeholder hash routing only.
- Account modal login and social buttons are still presentational.
- Account modal registration is a real demo path connected to `POST /api/auth/register`.
- Language switching is not yet implemented beyond the language menu UI. The user plans to inspect how a colleague handles language switching next.

## Suggested Next Cleanup

If the user asks to make structure cleaner:

1. Extract header subcomponents:
   - `SearchBar`
   - `AccountModal`
   - `HeaderNav`
2. Move large data arrays into data files:
   - `curatorFavoritesData.js`
   - cart sample data if needed
3. Move `a-propos` sections into `frontend/components/a-propos/` if the route gets more complex.
4. Decide image strategy:
   - Local public assets
   - Next Image
   - CDN / CMS later
5. Convert placeholder buttons/links to actual routes only when routing plan is clear.

## Session Notes (May 1, 2026)

- Backend database schema is finalized and solid. Flyway migrations are complete (V1–V10).
- Backend service/controller layer was pending at the start of the session; the registration demo slice is now implemented, while broader auth/user/artwork/cart/order APIs remain pending.
- **Today's focus**: Refining the homepage layout and sections.
  - Review and adjust existing homepage sections (Hero, DisplaySample, WhyOriginal, CuratorFavorites, CuratedExperience).
  - Consider polish, spacing, and visual hierarchy.
  - Sections not rendered (ShopCategory, WhyShop, FeaturedRows) remain available for future use.

## Session Update (May 2026)

- Backend service/controller layer is no longer entirely pending: registration demo slice is implemented and documented in `REGISTRATION_DEMO_FLOW.txt`.
- Hero now uses local banner images and editorial overlay text.
- DisplaySample now uses local card images, Playfair titles, French editorial copy, bordered cards, and whole-card hover motion.
- WhyOriginal now uses local card images, French editorial left copy, updated card copy, tighter card spacing, larger image column, and sentence-broken descriptions.
- Header search placeholder animates only the changing keyword while `Search for` stays fixed.
- Header account modal supports a demo registration flow against the Spring Boot backend.
- Next area to inspect: language switching implementation from the user's colleague.
