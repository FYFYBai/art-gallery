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

- Next.js `16.1.6`
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
npm.cmd run lint
npm.cmd run build
npm.cmd run start
npm.cmd run dev
```

Use `npm.cmd` on Windows PowerShell if `npm` is blocked by execution policy.

## Important Working Notes

- Ignore `.next` and `node_modules` unless absolutely necessary.
- The shell may display some UTF-8/French/Chinese characters incorrectly as mojibake. Do not “fix” text just because shell output looks corrupted. The user confirmed these strings display fine in the IDE and live server.
- Do not use emojis unless the user explicitly asks for them.
- Current lint result: `npm.cmd run lint` passes with `0 errors`, but has warnings about raw `<img>` usage. These warnings are accepted for now because image handling is temporary.
- Many images are currently hardcoded external placeholders from Unsplash or Picsum. This is intentional for now.
- The user may later ask to reverse the recent animation/performance optimization pass. Those changes are primarily CSS-only and listed below.

## Repository Shape

Top-level important files:

```txt
app/
components/
public/
color_pallet.txt
package.json
jsconfig.json
next.config.mjs
eslint.config.mjs
CODEX_PROJECT_CONTEXT.md
```

Path alias:

```js
"@/*": ["./*"]
```

So imports commonly use `@/components/...`.

## App Router Structure

Routes live under `app`.

Current routes:

```txt
app/layout.js
app/page.js
app/a-propos/page.js
app/a-propos/AProposPage.module.css
app/cart/page.js
app/globals.css
```

### `app/layout.js`

Global shell. Imports:

- `app/globals.css`
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

### `app/page.js`

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

These still exist in `components/home/...` but are not currently rendered in `app/page.js`.

### `app/a-propos`

Route for `/a-propos`.

Files:

```txt
app/a-propos/page.js
app/a-propos/AProposPage.module.css
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

- If this page grows, keep `app/a-propos/page.js` as a route composer.
- Move reusable sections into `components/a-propos/`.

### `app/cart`

Route for `/cart`.

Files:

```txt
app/cart/page.js
components/cart/CartSection.js
components/cart/CartSection.module.css
```

`app/cart/page.js` only renders `<CartSection />`.

## Component Organization

Main convention:

- Shared/global components live directly under `components/<feature>/`.
- Homepage-only sections live under `components/home/<section-name>/`.
- Each section usually has:
  - PascalCase component file
  - matching CSS module
  - optional data file when content is list-like

Examples:

```txt
components/header/Header.js
components/header/Header.module.css
components/header/headerData.js
components/header/icons.js

components/footer/Footer.js
components/footer/Footer.module.css

components/hero/Hero.js
components/hero/Hero.module.css
components/hero/heroSlides.js

components/home/display-sample/DisplaySample.js
components/home/display-sample/DisplaySample.module.css

components/home/why-original/WhyOriginalSection.js
components/home/why-original/WhyOriginalSection.module.css
components/home/why-original/whyOriginalData.js

components/home/curator-favorites/CuratorFavoritesSection.js
components/home/curator-favorites/CuratorFavoritesSection.module.css

components/home/curated-experience/CuratedExperienceSection.js
components/home/curated-experience/CuratedExperienceSection.module.css

components/cart/CartSection.js
components/cart/CartSection.module.css
```

## Design System And Styling Rules

### Color Palette

Palette source: `color_pallet.txt`

```txt
Primary Background: #F5F0E6
Secondary Background: #FCFAF5
Soft Neutral / Border: #D8CBB8
Accent: #B89B72
Text / Dark Neutral: #4E4338
```

These are represented in `app/globals.css` as tokens:

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

Implemented through `next/font/google` in `app/layout.js`:

```js
Noto_Sans -> --font-sans
Noto_Serif -> --font-serif
```

Global aliases in `app/globals.css`:

```css
--font-body: var(--font-sans);
--font-title: var(--font-serif);
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
components/header/Header.module.css
components/hero/Hero.module.css
components/home/curator-favorites/CuratorFavoritesSection.module.css
components/home/featured-rows/FeaturedRowsSection.module.css
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
components/header/Header.js
components/header/Header.module.css
components/header/headerData.js
components/header/icons.js
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

- Rotating search text is now placeholder filler only.
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
- Front-end only.

Content:

- Email input.
- Password input.
- Forgot password link.
- Register account link.
- Login button.
- Social login buttons: Google, Facebook, Instagram.

CSS classes are in `Header.module.css`, including:

```css
.accountModalOverlay
.accountModal
.accountModalClose
.loginForm
.socialButtons
```

### Icons

Shared SVG icon components are in `components/header/icons.js`.

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
components/footer/Footer.js
components/footer/Footer.module.css
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
components/hero/Hero.js
components/hero/Hero.module.css
components/hero/heroSlides.js
```

`Hero.js` is a client component with carousel state and previous/next side controls.

First slide text:

```txt
Sylvaine
Peinture, entre mémoire et paysage.
À propos
```

Images are hardcoded remote placeholders in `heroSlides.js`.

Styling uses a content card over a background image, with warm overlay and animated entry.

### Display Sample

Files:

```txt
components/home/display-sample/DisplaySample.js
components/home/display-sample/DisplaySample.module.css
```

Homepage section with four sample artwork/category cards.

Uses hardcoded remote images.

Titles use `Noto Serif`.

Action links use animated underline hover.

### Why Original

Files:

```txt
components/home/why-original/WhyOriginalSection.js
components/home/why-original/WhyOriginalSection.module.css
components/home/why-original/whyOriginalData.js
```

Interactive client section with custom sticky/fixed behavior for the left text column.

Right side uses cards from `whyOriginalData.js`.

Images are temporary hardcoded remote placeholders.

Important: This component manually calculates sticky behavior with scroll/resize listeners. Be careful editing this logic.

### Curator Favorites

Files:

```txt
components/home/curator-favorites/CuratorFavoritesSection.js
components/home/curator-favorites/CuratorFavoritesSection.module.css
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
components/home/curated-experience/CuratedExperienceSection.js
components/home/curated-experience/CuratedExperienceSection.module.css
```

Full-width background-image CTA section.

Uses warm overlay and a CTA button.

### Sections Not Currently Rendered

These still exist but are not currently included in `app/page.js`:

```txt
components/home/shop-category/ShopCategorySection.js
components/home/why-shop/WhyShopSection.js
components/home/featured-rows/FeaturedRowsSection.js
```

`FeaturedRowsSection` is a product carousel with two rows and sample product data. It still passes lint and may be reused later.

## Cart Page

Files:

```txt
app/cart/page.js
components/cart/CartSection.js
components/cart/CartSection.module.css
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
npm.cmd run lint
```

Current lint status:

- `0 errors`
- Warnings only for raw `<img>` usage

Warning locations include:

```txt
app/a-propos/page.js
components/home/curator-favorites/CuratorFavoritesSection.js
components/home/display-sample/DisplaySample.js
components/home/featured-rows/FeaturedRowsSection.js
components/home/why-original/WhyOriginalSection.js
```

These warnings are accepted for now because image assets and image strategy are temporary.

Future improvement:

- Move important images into `public/`.
- Use Next `<Image />` for local/remote optimized images.
- Configure remote domains if needed.

## Image Strategy Current State

Current image implementation is temporary:

- Many sections use external URLs from Unsplash or Picsum.
- Some components use raw `<img>`.
- Hero uses CSS background images.
- Public folder currently only has default SVG assets, not real artwork.

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
- Cart button should eventually link to `/cart` if not already requested. Check `Header.js` before changing; current cart icon may still be a plain button depending on latest state.
- Search currently writes URL hash only, no real search page yet.

## Common Future Tasks And Where To Work

### Change nav labels/dropdowns

Look in:

```txt
components/header/headerData.js
```

Then adjust dropdown styling if needed in:

```txt
components/header/Header.module.css
```

### Change header behavior

Look in:

```txt
components/header/Header.js
```

Important state:

```js
activeDropdown
visibleDropdown
isDropdownClosing
languageOpen
accountOpen
searchQuery
searchTermIndex
```

### Change global palette or typography

Look in:

```txt
app/globals.css
app/layout.js
```

### Change homepage section order

Look in:

```txt
app/page.js
```

### Add a new route page

Add a folder under `app`:

```txt
app/<route-name>/page.js
app/<route-name>/<RouteName>.module.css
```

If the page gets complex, place reusable sections in:

```txt
components/<route-name>/
```

### Work on cart flow

Look in:

```txt
components/cart/CartSection.js
components/cart/CartSection.module.css
```

### Update shared icons

Look in:

```txt
components/header/icons.js
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
components/header/SearchBar.js
components/header/AccountModal.js
components/header/NavDropdown.js
```

- Cart flow is temporary demo state only. It does not persist cart data and has no checkout backend.
- Search submit logic is placeholder hash routing only.
- Account modal form and social login buttons are front-end only.

## Suggested Next Cleanup

If the user asks to make structure cleaner:

1. Extract header subcomponents:
   - `SearchBar`
   - `AccountModal`
   - `HeaderNav`
2. Move large data arrays into data files:
   - `curatorFavoritesData.js`
   - cart sample data if needed
3. Move `a-propos` sections into `components/a-propos/` if the route gets more complex.
4. Decide image strategy:
   - Local public assets
   - Next Image
   - CDN / CMS later
5. Convert placeholder buttons/links to actual routes only when routing plan is clear.
