ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS stripe_refund_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS stripe_refund_status VARCHAR(50),
    ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS processed_stripe_events (
    event_id     VARCHAR(255) PRIMARY KEY,
    event_type   VARCHAR(255) NOT NULL,
    processed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_outbox (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient       VARCHAR(255) NOT NULL,
    subject         VARCHAR(255) NOT NULL,
    text_body       TEXT        NOT NULL,
    html_body       TEXT        NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempts        INTEGER     NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at         TIMESTAMPTZ,
    last_error      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_email_outbox_status
        CHECK (status IN ('PENDING','SENT','FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_email_outbox_status_next_attempt
    ON email_outbox(status, next_attempt_at, created_at);

CREATE INDEX IF NOT EXISTS idx_orders_stripe_refund_id
    ON orders(stripe_refund_id);
