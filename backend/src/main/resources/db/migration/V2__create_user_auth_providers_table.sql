CREATE TABLE user_auth_providers (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL,
    provider            VARCHAR(30)     NOT NULL,
    provider_user_id    VARCHAR(255)    NOT NULL,
    provider_email      VARCHAR(255),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_auth_providers_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_auth_providers_provider_user
        UNIQUE (provider, provider_user_id),
    CONSTRAINT chk_auth_providers_provider
        CHECK (provider IN ('GOOGLE', 'FACEBOOK', 'INSTAGRAM'))
);
