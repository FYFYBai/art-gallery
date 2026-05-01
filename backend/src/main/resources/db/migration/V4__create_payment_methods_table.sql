CREATE TABLE payment_methods (
    id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     UUID        NOT NULL,
    payment_type                VARCHAR(20) NOT NULL,
    provider                    VARCHAR(20) NOT NULL,
    provider_payment_method_id  VARCHAR(255),
    card_brand                  VARCHAR(30),
    card_last4                  CHAR(4),
    card_exp_month              SMALLINT,
    card_exp_year               SMALLINT,
    paypal_email                VARCHAR(255),
    is_default                  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_payment_methods_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_payment_type
        CHECK (payment_type IN ('CREDIT_CARD', 'DEBIT_CARD', 'STRIPE', 'PAYPAL')),
    CONSTRAINT chk_payment_provider
        CHECK (provider IN ('STRIPE', 'PAYPAL', 'MANUAL'))
);
