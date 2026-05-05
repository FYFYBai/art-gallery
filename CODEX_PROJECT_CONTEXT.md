# Codex Project Context

This file is for Codex handoff only. Keep it compact and current. Do not treat it as user-facing documentation.

## Current Focus

- Frontend homepage refinement is in progress.
- Next planned area: inspect how the user's colleague implements language switching and decide how to integrate it with the current header/language menu.

## Repo Shape

```txt
frontend/
backend/
docker-compose.yml
CODEX_PROJECT_CONTEXT.md
REGISTRATION_DEMO_FLOW.txt
```

Frontend source is under `frontend/`. Backend source is under `backend/`.

Path alias in `frontend/jsconfig.json`:

```js
"@/*": ["./*"]
```

## Commands

Frontend:

```powershell
cd frontend
npm.cmd run lint
npm.cmd run dev
npm.cmd run build
```

Backend demo:

```powershell
docker compose up -d
cd backend
mvn test
mvn spring-boot:run
```

Use `npm.cmd` in PowerShell if `npm` is blocked by execution policy.

## Working Notes

- Shell output may show French/Chinese text as mojibake. Do not "fix" encoding based only on shell output if IDE/browser display is fine.
- Raw `<img>` warnings are currently accepted because image strategy is temporary.
- Avoid broad image optimization unless explicitly requested.
- Prefer existing CSS Modules and feature-folder organization.
- Use existing palette/font tokens.
- Do not introduce emoji unless asked.

## Frontend Stack

- Next.js `^16.2.4`
- React `19.2.3`
- JavaScript, not TypeScript
- CSS Modules
- React Compiler enabled in `frontend/next.config.mjs`

## Global Styling

Important files:

```txt
frontend/app/layout.js
frontend/app/globals.css
frontend/color_pallet.txt
frontend/public/fonts/
```

Font tokens in `globals.css`:

```css
--font-body: var(--font-sans);
--font-title: var(--font-serif);
--font-logo: "Sylvaine Didot", serif;
--font-display: "Sylvaine Playfair", serif;
```

Current conventions:

- `--font-logo`: navbar/hero logo-style text.
- `--font-display`: refined editorial titles in selected homepage sections.
- `--font-title`: general serif text/headings.
- `--font-body`: UI, labels, forms, nav, buttons unless a section explicitly uses serif.

Palette tokens live in `globals.css`; prefer those over hardcoded colors.

## Routes

```txt
frontend/app/layout.js
frontend/app/page.js
frontend/app/a-propos/page.js
frontend/app/cart/page.js
```

`layout.js` wraps pages with persistent `Header`, main `.pageContent`, and `Footer`.

Homepage render order in `frontend/app/page.js`:

```jsx
<Hero />
<DisplaySample />
<WhyOriginalSection />
<CuratorFavoritesSection />
<CuratedExperienceSection />
```

## Header

Files:

```txt
frontend/components/header/Header.js
frontend/components/header/Header.module.css
frontend/components/header/headerData.js
frontend/components/header/icons.js
```

Current header behavior:

- Left logo, nav/search/actions on right.
- Nav dropdowns for items with `columns`.
- Language menu opens but does not switch content yet.
- Cart icon links to `/cart`.
- Search is a real form, but submit only writes URL hash:

```js
window.location.hash = `search=${encodeURIComponent(trimmedSearchQuery)}`;
```

Search placeholder:

- Custom animated overlay, not native placeholder.
- `Search for` stays fixed.
- Only the keyword rolls upward/out and new keyword enters from below.
- Controlled by `searchTermIndex`, `previousSearchTermIndex`, `searchTermAnimating`.

Account modal:

- Opens from account icon.
- Closes on outside click, Escape, or close button.
- Login UI is mostly presentational.
- Register mode is a real demo flow.
- `Register account` switches in-place to email/password/password-confirmation form.
- `Back to login` returns to login mode.
- Social buttons remain visible under both login and register modes.
- Registration calls `POST /api/auth/register`.
- Frontend validates required fields, password length, and password match.
- `accountToast` shows temporary success/failure.
- Backend URL is `NEXT_PUBLIC_API_BASE_URL` or `http://localhost:8080`.

If header grows further, likely extract:

```txt
SearchBar.js
AccountModal.js
HeaderNav.js
NavDropdown.js
```

## Homepage Sections

### Hero

Files:

```txt
frontend/components/hero/Hero.js
frontend/components/hero/Hero.module.css
frontend/components/hero/heroSlides.js
frontend/public/images/hero/
```

Current state:

- Uses local banner images: `1.png`, `2.png`, `3.png`.
- Images are CSS backgrounds with `background-size: 100% 100%` to avoid cropping/letterboxing.
- Text is an editorial overlay, not a card.
- `SYLVAINE ART` uses `--font-logo`.
- Hero text is non-selectable.

### Display Sample

Files:

```txt
frontend/components/home/display-sample/DisplaySample.js
frontend/components/home/display-sample/DisplaySample.module.css
frontend/public/images/display-sample/
```

Current state:

- Uses `display1.png` through `display4.png`.
- French editorial heading/subheading.
- Subheading stays one line on desktop and wraps on mobile.
- Cards have thin borders, tall image ratios, and whole-card hover lift.
- Card CTA has underline animation.
- Titles use `--font-display`.
- Supporting text uses serif in this section.

### Why Original

Files:

```txt
frontend/components/home/why-original/WhyOriginalSection.js
frontend/components/home/why-original/WhyOriginalSection.module.css
frontend/components/home/why-original/whyOriginalData.js
frontend/public/images/why-original/
```

Important:

- This is a client component with custom sticky/fixed behavior for the left column.
- Be careful editing scroll/resize logic.

Current state:

- Uses local images `1.png` through `5.png`.
- Left copy is French editorial, with Playfair title.
- Cards use French copy from `whyOriginalData.js`.
- Reference numbering was intentionally removed.
- Card descriptions use `\n` between sentences and CSS `white-space: pre-line`.
- Cards have tighter spacing, larger image column, image fills card height on desktop/tablet, and subtle rounded corners.

### Curator Favorites

Files:

```txt
frontend/components/home/curator-favorites/CuratorFavoritesSection.js
frontend/components/home/curator-favorites/CuratorFavoritesSection.module.css
```

Current state:

- Client carousel with 15 placeholder items.
- Responsive items per view: desktop 5, tablet 3, mobile 2, small mobile 1.
- Autoplay every 10 seconds, pauses on hover.
- Uses `safePageIndex` to satisfy strict React Compiler lint rules.

### Curated Experience

Files:

```txt
frontend/components/home/curated-experience/CuratedExperienceSection.js
frontend/components/home/curated-experience/CuratedExperienceSection.module.css
```

Current state:

- Full-width background-image CTA section.
- Uses warm overlay and CTA button.

## Backend Registration Demo

Root walkthrough:

```txt
REGISTRATION_DEMO_FLOW.txt
```

Files:

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
```

Behavior:

- `POST /api/auth/register`.
- Validates email, password length, and password confirmation.
- Normalizes email to lowercase.
- Rejects duplicates with `409 Conflict`.
- Hashes password with BCrypt into `users.password_hash`.
- Saves through `UserRepository`.
- CORS allows local frontend dev origins such as `http://localhost:*` and `http://127.0.0.1:*`.
- Validation tests pass with `mvn test`.

The broader backend service/controller/JWT/OAuth work is still pending beyond this demo slice.

## Cart

Files:

```txt
frontend/app/cart/page.js
frontend/components/cart/CartSection.js
frontend/components/cart/CartSection.module.css
```

Current state:

- Temporary client-side demo flow only.
- Stages: cart, checkout, confirmation.
- No backend persistence yet.

## Image Strategy

Current local image folders:

```txt
frontend/public/images/hero/
frontend/public/images/display-sample/
frontend/public/images/why-original/
```

Other sections still use external placeholders or raw `<img>`.

Future image cleanup:

- Move finalized artwork assets into `frontend/public/`.
- Consider Next `<Image />` once image strategy is settled.
- Configure remote domains only if remote/CDN strategy is chosen.

## Lint/Test Status

Frontend:

- `npm.cmd run lint` passes with warnings only for raw `<img>`.

Backend:

- `mvn test` passes for registration validation tests.

Known accepted warnings:

```txt
@next/next/no-img-element
```

## Next Likely Task

Inspect language switching. Current language options are only a menu in the header. They do not switch content yet.

Relevant files:

```txt
frontend/components/header/Header.js
frontend/components/header/headerData.js
frontend/components/header/Header.module.css
```
