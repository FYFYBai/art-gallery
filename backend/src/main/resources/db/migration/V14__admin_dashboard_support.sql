ALTER TABLE artworks
    ADD COLUMN IF NOT EXISTS series VARCHAR(100),
    ADD COLUMN IF NOT EXISTS artwork_size VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_artworks_series ON artworks(series);

INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    is_active,
    email_verified,
    role
)
VALUES (
    'admin',
    crypt('admin', gen_salt('bf')),
    'Admin',
    'User',
    TRUE,
    TRUE,
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    is_active = TRUE,
    email_verified = TRUE,
    role = 'ADMIN',
    updated_at = NOW();
