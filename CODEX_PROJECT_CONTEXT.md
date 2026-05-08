# Codex Project Context

Codex-only handoff. Keep this compact and factual. Do not treat it as user-facing docs.

## Project State

- Main app is a locale-based Next.js frontend plus Spring Boot backend with PostgreSQL/Flyway.
- Current branch should be `main`; user wants changes pushed directly to `main` unless they say otherwise.
- Local secret files such as `backend/.env` are ignored. Do not commit API keys.
- Locale routes use `fr`, `en`, `zh`; default locale is `fr`.
- `frontend/proxy.js` replaces deprecated `middleware.js` and keeps locale cookie redirects.

## Verification Commands

```powershell
cd backend
mvn.cmd test

cd ..\frontend
npm.cmd run lint
```

Frontend lint currently passes with existing raw `<img>` optimization warnings only. `npm.cmd run build` may require network because of Google Fonts.

Backend local run:

```powershell
docker compose up -d
cd backend
mvn.cmd spring-boot:run
```

If port 8080 is blocked:

```powershell
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Get-Process -Id $_ }
Stop-Process -Id <pid> -Force
```

## Frontend Routes

Active route areas:

```txt
frontend/app/[locale]/page.js
frontend/app/[locale]/a-propos/page.js
frontend/app/[locale]/artworks/page.js
frontend/app/[locale]/cart/page.js
frontend/app/[locale]/profile/page.js
frontend/app/[locale]/admin/page.js
frontend/app/[locale]/reset-password/page.js
frontend/app/[locale]/layout.js
frontend/proxy.js
```

Messages:

```txt
frontend/messages/fr.json
frontend/messages/en.json
frontend/messages/zh.json
```

Keep key sets aligned across all locales. Base visible text on French first, then translate to English and Chinese.

## Header/Auth

Files:

```txt
frontend/components/header/Header.js
frontend/components/header/Header.module.css
```

- Auth state is stored in `localStorage.auth`.
- Login/register/password reset use backend auth endpoints.
- Password rule: more than 10 characters, at least one uppercase letter, at least one special symbol.
- Register sends verification email. Login blocks unverified accounts and shows resend verification with a 60s cooldown.
- Forgot/reset password verifies account existence before sending a reset link and blocks reusing the same password.
- Password inputs should use the same eye-toggle style across login/register/reset/profile.
- Login success shows a top notification for 3 seconds.
- Profile icon routes admins to `/${locale}/admin`; normal users to `/${locale}/profile`.
- Internal links should stay in the active locale unless changed through the language switcher.

## Homepage

Rendered order in `frontend/app/[locale]/page.js`:

```jsx
<Hero />
<DisplaySample />
<WhyOriginalSection />
<CuratorFavoritesSection />
<CuratedExperienceSection />
```

Homepage has been polished for mobile; keep later homepage edits scoped so unrelated sections do not shift unexpectedly.

Important image folders:

```txt
frontend/public/images/hero/
frontend/public/images/display-sample/
frontend/public/images/why-original/
frontend/public/images/curator-favorites/
frontend/public/images/curated-experience/
```

Curator favorites carousel:

- Uses locale text.
- Shows 5 desktop items, fewer at smaller breakpoints.
- Final page logic avoids empty slots: e.g. 6 items shows `1-5`, then `2-6`; 8 items shows `1-5`, then `4-8`; 11 items shows `1-5`, `6-10`, then `7-11`.

Curated experience:

- Uses `frontend/public/images/curated-experience/1.png`.
- Background positioning is tuned for common screen sizes. Preserve object visibility: full painting and table matter most; excess wall/side space can crop.

## Profile

Files:

```txt
frontend/app/[locale]/profile/page.js
frontend/app/[locale]/profile/ProfilePage.module.css
backend/src/main/java/com/artgallery/controller/ProfileController.java
backend/src/main/java/com/artgallery/service/ProfileService.java
```

Current frontend behavior:

- Address section has primary address plus other addresses; other addresses can be made primary in UI.
- Add address and add payment buttons are left-aligned and styled.
- Security update password uses same password rules and eye toggles.
- Order history reads real backend data from `GET /api/profile/orders`; fallback data only appears if API fails.
- Users can request refund from eligible orders. Modal asks for reason and contact info, then posts to backend. The request waits for admin approval.

## Admin Dashboard

Files:

```txt
frontend/app/[locale]/admin/page.js
frontend/app/[locale]/admin/AdminPage.module.css
backend/src/main/java/com/artgallery/controller/AdminController.java
backend/src/main/java/com/artgallery/service/AdminService.java
```

Access:

- Frontend admin page checks local role and confirms with backend dashboard endpoint.
- Backend admin endpoints must remain role-protected. Normal users should not access admin dashboard data.

Dashboard features:

- Account lookup and management.
- Ban button uses confirmation before disabling users.
- Dev-only delete button removes account data so the email can be reused for future registration.
- User count, order count, revenue cards.
- Monthly transaction/revenue chart.
- Real page view chart from compact analytics data.
- Product search/update/add with upload button, artwork type, series, name, price, size, year, and long description.
- Uploaded product images should use the backend-managed product upload path because those paths will later render real product pages.

Order admin behavior:

- Order statuses currently used: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`.
- `PROCESSING` was removed for small-studio workflow.
- `PENDING` is for checkout/payment flow and is cleaned up after 24 hours by backend scheduler.
- Delivery queue includes only `PAID`.
- Mark shipped asks for tracking link, sets `SHIPPED`, and emails the user.
- Shipped card lists `SHIPPED` orders and can mark them delivered.
- Mark delivered sends a thank-you email and refreshes all order-related admin data.
- Order search shows latest/search matching orders with highlighted status only.
- Refund approval is separated into a refund request card. Admin approval sets order `REFUNDED` and sends the refund email.

## Backend Order/Data Model

Important files:

```txt
backend/src/main/java/com/artgallery/domain/order/Order.java
backend/src/main/java/com/artgallery/domain/order/OrderStatus.java
backend/src/main/java/com/artgallery/domain/order/RefundRequestEntity.java
backend/src/main/java/com/artgallery/domain/order/RefundRequestStatus.java
backend/src/main/java/com/artgallery/repository/OrderRepository.java
backend/src/main/java/com/artgallery/repository/RefundRequestRepository.java
backend/src/main/java/com/artgallery/service/PendingOrderCleanupService.java
```

Orders have:

- UUID primary key.
- Human order number using DB sequence format like `SA-000001`.
- Tracking link, shipped timestamp, delivered timestamp.
- Refund requests stored separately with reason/contact/status.

Migrations:

```txt
backend/src/main/resources/db/migration/V14__admin_dashboard_support.sql
backend/src/main/resources/db/migration/V15__remove_artwork_medium.sql
backend/src/main/resources/db/migration/V16__add_page_view_analytics.sql
backend/src/main/resources/db/migration/V17__simplify_order_statuses.sql
backend/src/main/resources/db/migration/V18__add_order_tracking.sql
backend/src/main/resources/db/migration/V19__add_order_numbers.sql
backend/src/main/resources/db/migration/V20__create_refund_requests.sql
```

Do not edit already-applied migrations. Add a new migration for future schema changes.

## Email

Files:

```txt
backend/src/main/java/com/artgallery/service/EmailService.java
backend/src/main/java/com/artgallery/service/ResendEmailService.java
```

Resend is configured through ignored env/application configuration. Email flows currently include:

- Account verification.
- Resend verification.
- Password reset.
- Order shipped with tracking link.
- Order delivered thank-you.
- Refund approval notice.

## Analytics

Files:

```txt
frontend/components/analytics/PageViewTracker.js
backend/src/main/java/com/artgallery/controller/AnalyticsController.java
backend/src/main/java/com/artgallery/service/AnalyticsService.java
backend/src/main/java/com/artgallery/repository/AnalyticsRepository.java
backend/src/main/resources/db/migration/V16__add_page_view_analytics.sql
```

Page views are aggregated to avoid unbounded row growth. Admin dashboard should display real aggregate data, not hardcoded view data.

## Stripe/Payment Reminder

Payment is not implemented yet. Current order/refund logic is demo/admin workflow only.

When Stripe is added, refine every related workflow:

- Store Stripe payment intent/charge/refund IDs.
- Create `PENDING` orders when checkout starts.
- Mark `PAID` only from verified Stripe webhook events.
- Keep pending cleanup for abandoned checkout sessions.
- For refunds, admin approval should call Stripe Refund API first.
- Mark order `REFUNDED` and send refund email only after Stripe confirms the refund.
- Add idempotency handling so repeated webhook/admin actions do not double-charge or double-refund.
- Revisit revenue calculations so refunded orders are excluded or subtracted consistently.
- Revisit user order history statuses and admin delivery/refund queues after real payment state exists.
