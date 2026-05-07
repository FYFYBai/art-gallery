# Codex Project Context

Codex-only handoff. Keep compact. Do not treat as user-facing docs.

## Current State

- Branch work was merged into `main` and pushed earlier. Current route system is locale-based.
- Next.js warning about deprecated `middleware.js` was fixed by renaming to `frontend/proxy.js`.
- `proxy.js` preserves main's `NEXT_LOCALE` cookie behavior: bare paths redirect to the cookie locale, falling back to `fr`.
- Internal visible navigation should stay in the active locale unless the user uses the language switcher.

## Commands

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Build may need network for Google Fonts (`next/font/google`). Lint passes with raw `<img>` warnings only.

Backend demo:

```powershell
docker compose up -d
cd backend
mvn test
mvn spring-boot:run
```

## Routes And Locale

Active app routes:

```txt
frontend/app/[locale]/page.js
frontend/app/[locale]/a-propos/page.js
frontend/app/[locale]/artworks/page.js
frontend/app/[locale]/cart/page.js
frontend/app/[locale]/profile/page.js
frontend/app/[locale]/layout.js
frontend/proxy.js
```

Locales: `fr`, `en`, `zh`. Default: `fr`.

Messages:

```txt
frontend/messages/fr.json
frontend/messages/en.json
frontend/messages/zh.json
```

`fr`, `en`, and `zh` key sets were audited and match. Homepage/header visible copy was moved into messages where practical.

Locale-aware links currently handled in:

```txt
frontend/components/header/Header.js
frontend/components/footer/Footer.js
frontend/components/hero/Hero.js
```

Each has a small `getLocalizedHref(href, locale)` helper. It leaves `#`/external links alone and prefixes internal root paths with the active locale.

## Header/Auth

Files:

```txt
frontend/components/header/Header.js
frontend/components/header/Header.module.css
frontend/components/header/headerData.js
```

Important behavior:

- Language switcher writes `NEXT_LOCALE` cookie and changes the locale path.
- Header logo/nav/cart/dropdown/promo links are locale-aware.
- Auth uses `localStorage` key `auth`.
- Login/register call backend auth endpoints.
- Profile link is `/${locale}/profile`.
- Account modal keeps blur, but header blur disables while modal is open to reduce stacked blur cost.
- `document.cookie` write has a narrow `react-hooks/immutability` eslint disable because it is an intentional event-handler side effect.

## Homepage

Rendered order in `frontend/app/[locale]/page.js`:

```jsx
<Hero />
<DisplaySample />
<WhyOriginalSection />
<CuratorFavoritesSection />
<CuratedExperienceSection />
```

### Hero

- Files: `frontend/components/hero/*`, images in `frontend/public/images/hero/`.
- Slide text is localized via message keys.
- Slide links are locale-aware in `Hero.js`.

### Display Sample

- Files: `frontend/components/home/display-sample/*`.
- Images: `frontend/public/images/display-sample/display1.png` through `display4.png`.
- Titles/descriptions/alts/actions are localized.
- Uses `--font-display` for titles and serif supporting text.

### Why Original

- Files: `frontend/components/home/why-original/*`.
- Images: `frontend/public/images/why-original/1.png` through `5.png`.
- Card text is localized via message keys.
- Custom sticky/fixed left column logic; edit carefully.

### Curator Favorites

- Files: `frontend/components/home/curator-favorites/*`.
- Images: `frontend/public/images/curator-favorites/1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`, `5.png`, `6.png`.
- Carousel shows 5 desktop items, 3 tablet, 2 mobile, 1 small mobile.
- Page offsets avoid empty final pages:
  - 6 items: `1-5` then `2-6`
  - 8 items: `1-5` then `4-8`
  - 10 items: `1-5` then `6-10`
  - 11 items: `1-5`, `6-10`, then `7-11`
- Text is localized via message keys.

### Curated Experience

- Files: `frontend/components/home/curated-experience/*`.
- Image: `frontend/public/images/curated-experience/1.png`.
- Implemented as split layout, not background text overlay: text column plus image column for responsive stability.
- CTA hover: brown background, white text.

## Styling Notes

Font tokens in `frontend/app/globals.css`:

```css
--font-body
--font-title
--font-logo
--font-display
```

Use existing CSS Modules and tokens. Raw `<img>` warnings are accepted for now. Do not optimize/convert image strategy unless asked.

## Backend Auth Demo

Registration/login backend exists from colleague/main work plus prior demo. Keep `REGISTRATION_DEMO_FLOW.txt` for walkthrough context.

Important frontend auth behavior:

- Register validates required fields, password length, and confirmation.
- Register success/failure toasts are localized on frontend.
- Login stores `{ email, role, token }` under `localStorage.auth`.
- Logout clears local auth and best-effort calls backend logout.

## Current Verification

Latest verified:

```txt
npm.cmd run lint   # passes; raw img warnings only
npm.cmd run build  # passes; may need Google Fonts network
```
