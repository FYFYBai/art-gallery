# Requirements Document

## Introduction

This feature defines the PostgreSQL database schema and Flyway migration strategy for the art gallery e-commerce backend. The database supports user authentication (including third-party OAuth), address and payment method management, artwork/product catalog, shopping cart, and order history. The Spring Boot backend auto-executes unapplied Flyway migrations on startup. Primary keys use UUIDs throughout for distributed compatibility.

## Glossary

- **System**: The Spring Boot backend application.
- **Database**: The PostgreSQL relational database instance.
- **Flyway**: The database migration tool used to version and apply SQL migration scripts.
- **Migration_File**: A versioned SQL file placed in `src/main/resources/db/migration/` following the naming convention `V{n}__{description}.sql`.
- **User**: A registered account holder of the art gallery platform.
- **OAuth_Provider**: A third-party identity provider used for social login (GOOGLE, FACEBOOK, INSTAGRAM).
- **Artwork**: A product listed for sale in the gallery, such as a painting, drawing, print, or sculpture.
- **Cart**: A temporary collection of artworks a User intends to purchase.
- **Order**: A confirmed purchase record created from a Cart.
- **UUID**: Universally Unique Identifier, used as the primary key type for all tables.
- **Snapshot**: A copy of data captured at a point in time, used in order items to preserve historical purchase information.
- **CAD**: Canadian Dollar, the default currency for all monetary values.
- **NUMERIC(10,2)**: PostgreSQL numeric type with 10 total digits and 2 decimal places, used for all monetary fields.

---

## Requirements

### Requirement 1: Database Migration Management

**User Story:** As a backend developer, I want the database schema to be managed through versioned migration files, so that schema changes are tracked, reproducible, and automatically applied on deployment.

#### Acceptance Criteria

1. THE System SHALL use Flyway as the database migration tool.
2. THE System SHALL store all Migration_Files in `src/main/resources/db/migration/`.
3. WHEN the System starts up, THE System SHALL automatically detect and execute all unapplied Migration_Files in version order.
4. THE System SHALL name Migration_Files following the pattern `V{n}__{description}.sql` (e.g., `V1__create_user_tables.sql`).
5. IF a Migration_File has already been applied, THEN THE System SHALL skip that Migration_File without re-executing it.
6. IF a Migration_File fails to execute, THEN THE System SHALL halt startup and log a descriptive error message.

---

### Requirement 2: User Account Storage

**User Story:** As a user, I want to register and log in with an email and password, so that I can access my account and purchase history.

#### Acceptance Criteria

1. THE Database SHALL contain a `users` table with columns: `id` (UUID, primary key), `email` (VARCHAR, unique, not null), `password_hash` (VARCHAR, nullable), `first_name` (VARCHAR), `last_name` (VARCHAR), `phone` (VARCHAR), `is_active` (BOOLEAN, not null, default true), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
2. THE Database SHALL enforce a unique constraint on `users.email`.
3. THE Database SHALL allow `users.password_hash` to be null to support users who authenticate exclusively via OAuth.
4. THE Database SHALL NOT store plaintext passwords; only `password_hash` values produced by a secure hashing algorithm SHALL be stored.
5. WHEN a new User record is inserted, THE Database SHALL automatically set `created_at` to the current timestamp.
6. WHEN a User record is updated, THE Database SHALL automatically set `updated_at` to the current timestamp.

---

### Requirement 3: Third-Party OAuth Login

**User Story:** As a user, I want to log in using my Google, Facebook, or Instagram account, so that I can authenticate without creating a separate password.

#### Acceptance Criteria

1. THE Database SHALL contain a `user_auth_providers` table with columns: `id` (UUID, primary key), `user_id` (UUID, not null), `provider` (VARCHAR, not null), `provider_user_id` (VARCHAR, not null), `provider_email` (VARCHAR), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
2. THE Database SHALL enforce a foreign key constraint from `user_auth_providers.user_id` to `users.id`.
3. THE Database SHALL enforce a unique constraint on `(user_auth_providers.provider, user_auth_providers.provider_user_id)` to prevent duplicate provider bindings.
4. THE Database SHALL restrict `user_auth_providers.provider` to the values: `GOOGLE`, `FACEBOOK`, `INSTAGRAM`.
5. THE Database SHALL allow one User to have multiple rows in `user_auth_providers`, enabling binding of multiple OAuth providers to a single account.

---

### Requirement 4: User Address Management

**User Story:** As a user, I want to save multiple shipping and billing addresses to my account, so that I can reuse them during checkout.

#### Acceptance Criteria

1. THE Database SHALL contain a `user_addresses` table with columns: `id` (UUID, primary key), `user_id` (UUID, not null), `address_line_1` (VARCHAR, not null), `address_line_2` (VARCHAR, nullable), `city` (VARCHAR, not null), `province_state` (VARCHAR, not null), `postal_code` (VARCHAR, not null), `country` (VARCHAR, not null), `is_default` (BOOLEAN, not null, default false), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
2. THE Database SHALL enforce a foreign key constraint from `user_addresses.user_id` to `users.id`.
3. THE Database SHALL allow one User to have multiple rows in `user_addresses`.
4. THE Database SHALL use `user_addresses.is_default` to indicate the User's preferred address for checkout pre-fill.

---

### Requirement 5: Payment Method Storage

**User Story:** As a user, I want to save my payment methods (credit card, debit card, Stripe, or PayPal) to my account, so that I can check out quickly without re-entering payment details.

#### Acceptance Criteria

1. THE Database SHALL contain a `payment_methods` table with columns: `id` (UUID, primary key), `user_id` (UUID, not null), `payment_type` (VARCHAR, not null), `provider` (VARCHAR, not null), `provider_payment_method_id` (VARCHAR), `card_brand` (VARCHAR), `card_last4` (CHAR(4)), `card_exp_month` (SMALLINT), `card_exp_year` (SMALLINT), `paypal_email` (VARCHAR), `is_default` (BOOLEAN, not null, default false), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
2. THE Database SHALL enforce a foreign key constraint from `payment_methods.user_id` to `users.id`.
3. THE Database SHALL restrict `payment_methods.payment_type` to the values: `CREDIT_CARD`, `DEBIT_CARD`, `STRIPE`, `PAYPAL`.
4. THE Database SHALL restrict `payment_methods.provider` to the values: `STRIPE`, `PAYPAL`, `MANUAL`.
5. THE Database SHALL NOT store full card numbers in any column.
6. THE Database SHALL NOT store CVV values in any column.
7. WHEN a payment method uses Stripe, THE Database SHALL store the Stripe-returned payment method ID or token in `provider_payment_method_id`.
8. WHEN a payment method uses PayPal, THE Database SHALL store the PayPal account identifier or email in `paypal_email`.
9. THE Database SHALL use `payment_methods.is_default` to indicate the User's preferred payment method for checkout pre-fill.

---

### Requirement 6: Artwork Catalog

**User Story:** As a gallery visitor, I want to browse artworks with accurate details and images, so that I can discover and purchase pieces I like.

#### Acceptance Criteria

1. THE Database SHALL contain an `artworks` table with columns: `id` (UUID, primary key), `title` (VARCHAR, not null), `description` (TEXT), `artwork_type` (VARCHAR), `artwork_medium` (VARCHAR), `price` (NUMERIC(10,2), not null), `currency` (VARCHAR, not null, default `'CAD'`), `artwork_year` (SMALLINT), `is_sold_out` (BOOLEAN, not null, default false), `is_active` (BOOLEAN, not null, default true), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
2. THE Database SHALL enforce a CHECK constraint on `artworks.artwork_year` restricting values to `2024`, `2025`, or `2026`.
3. THE Database SHALL create indexes on `artworks.artwork_type`, `artworks.artwork_medium`, `artworks.artwork_year`, `artworks.is_sold_out`, and `artworks.is_active` to support filtered queries.
4. THE Database SHALL contain an `artwork_images` table with columns: `id` (UUID, primary key), `artwork_id` (UUID, not null), `image_url` (VARCHAR, not null), `alt_text` (VARCHAR), `display_order` (INTEGER, not null, default 0), `is_primary` (BOOLEAN, not null, default false), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
5. THE Database SHALL enforce a foreign key constraint from `artwork_images.artwork_id` to `artworks.id`.
6. THE Database SHALL allow one Artwork to have multiple rows in `artwork_images`.
7. THE Database SHALL use `artwork_images.is_primary` to identify the main display image for an Artwork.
8. THE Database SHALL use `artwork_images.display_order` to control the sequence in which images are presented.

---

### Requirement 7: Shopping Cart

**User Story:** As a user, I want to add artworks to a shopping cart and manage its contents, so that I can review my selections before placing an order.

#### Acceptance Criteria

1. THE Database SHALL contain a `carts` table with columns: `id` (UUID, primary key), `user_id` (UUID, not null), `status` (VARCHAR, not null, default `'ACTIVE'`), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
2. THE Database SHALL enforce a foreign key constraint from `carts.user_id` to `users.id`.
3. THE Database SHALL restrict `carts.status` to the values: `ACTIVE`, `CHECKED_OUT`, `ABANDONED`.
4. THE Database SHALL contain a `cart_items` table with columns: `id` (UUID, primary key), `cart_id` (UUID, not null), `artwork_id` (UUID, not null), `quantity` (INTEGER, not null, default 1), `unit_price` (NUMERIC(10,2), not null), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
5. THE Database SHALL enforce a foreign key constraint from `cart_items.cart_id` to `carts.id`.
6. THE Database SHALL enforce a foreign key constraint from `cart_items.artwork_id` to `artworks.id`.
7. THE Database SHALL enforce a unique constraint on `(cart_items.cart_id, cart_items.artwork_id)` to prevent duplicate Artwork entries within the same Cart.
8. WHEN an Artwork is added to a Cart, THE Database SHALL record the Artwork's price at that moment in `cart_items.unit_price`.

---

### Requirement 8: Order History

**User Story:** As a user, I want to view my past orders with accurate pricing and artwork details, so that I have a reliable purchase history even if artwork information changes later.

#### Acceptance Criteria

1. THE Database SHALL contain an `orders` table with columns: `id` (UUID, primary key), `user_id` (UUID, not null), `shipping_address_id` (UUID, not null), `billing_address_id` (UUID, not null), `payment_method_id` (UUID, not null), `order_status` (VARCHAR, not null), `subtotal` (NUMERIC(10,2), not null), `tax_amount` (NUMERIC(10,2), not null), `shipping_amount` (NUMERIC(10,2), not null), `total_amount` (NUMERIC(10,2), not null), `currency` (VARCHAR, not null, default `'CAD'`), `created_at` (TIMESTAMPTZ, not null), `updated_at` (TIMESTAMPTZ, not null).
2. THE Database SHALL enforce a foreign key constraint from `orders.user_id` to `users.id`.
3. THE Database SHALL enforce foreign key constraints from `orders.shipping_address_id` and `orders.billing_address_id` to `user_addresses.id`.
4. THE Database SHALL enforce a foreign key constraint from `orders.payment_method_id` to `payment_methods.id`.
5. THE Database SHALL restrict `orders.order_status` to the values: `PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`.
6. THE Database SHALL create an index on `orders.user_id` to support efficient order history queries per User.
7. THE Database SHALL contain an `order_items` table with columns: `id` (UUID, primary key), `order_id` (UUID, not null), `artwork_id` (UUID, not null), `artwork_title` (VARCHAR, not null), `quantity` (INTEGER, not null), `unit_price` (NUMERIC(10,2), not null), `total_price` (NUMERIC(10,2), not null), `created_at` (TIMESTAMPTZ, not null).
8. THE Database SHALL enforce a foreign key constraint from `order_items.order_id` to `orders.id`.
9. THE Database SHALL enforce a foreign key constraint from `order_items.artwork_id` to `artworks.id`.
10. WHEN an Order is created, THE System SHALL copy `artworks.title`, the unit price, and the calculated total price into `order_items` as a Snapshot, so that historical order records remain accurate if the Artwork is later modified.
11. THE Database SHALL create an index on `order_items.order_id` to support efficient retrieval of items belonging to a given Order.

---

### Requirement 9: Data Integrity and Security Constraints

**User Story:** As a system administrator, I want the database to enforce data integrity and security rules at the schema level, so that invalid or sensitive data cannot be persisted regardless of application-layer behavior.

#### Acceptance Criteria

1. THE Database SHALL use UUID as the primary key type for all tables.
2. THE Database SHALL enforce NOT NULL constraints on all columns designated as required in the table definitions above.
3. THE Database SHALL enforce CHECK constraints on enumerated string columns (`user_auth_providers.provider`, `payment_methods.payment_type`, `payment_methods.provider`, `carts.status`, `orders.order_status`) to restrict values to their defined sets.
4. THE Database SHALL enforce all foreign key relationships defined in Requirements 2 through 8.
5. THE Database SHALL NOT contain any column designed to store a full payment card number.
6. THE Database SHALL NOT contain any column designed to store a card CVV or CVC value.
7. THE Database SHALL use `TIMESTAMPTZ` (timestamp with time zone) for all timestamp columns to ensure consistent time zone handling.

---

### Requirement 10: Backend API Endpoints

**User Story:** As a frontend developer, I want the Spring Boot backend to expose REST API endpoints for all core features, so that the Next.js frontend can interact with the database through a well-defined interface.

#### Acceptance Criteria

1. THE System SHALL provide endpoints for user registration and login using email and password.
2. THE System SHALL provide endpoints for OAuth login via GOOGLE, FACEBOOK, and INSTAGRAM providers.
3. THE System SHALL provide CRUD endpoints for managing `user_addresses` records belonging to the authenticated User.
4. THE System SHALL provide CRUD endpoints for managing `payment_methods` records belonging to the authenticated User.
5. THE System SHALL provide read endpoints for querying `artworks`, supporting filtering by `artwork_type`, `artwork_medium`, `artwork_year`, `is_sold_out`, and `is_active`.
6. THE System SHALL provide endpoints for managing the authenticated User's active Cart, including adding, updating, and removing `cart_items`.
7. THE System SHALL provide an endpoint for creating an Order from the authenticated User's active Cart.
8. THE System SHALL provide an endpoint for retrieving the authenticated User's Order history, including associated `order_items`.
