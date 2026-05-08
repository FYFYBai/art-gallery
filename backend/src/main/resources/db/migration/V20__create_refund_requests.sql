CREATE TABLE IF NOT EXISTS refund_requests (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id     UUID          NOT NULL,
    user_id      UUID          NOT NULL,
    reason       VARCHAR(2000) NOT NULL,
    contact_info VARCHAR(255)  NOT NULL,
    status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    approved_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_refund_requests_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_refund_requests_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_refund_request_status
        CHECK (status IN ('PENDING','APPROVED'))
);

CREATE INDEX IF NOT EXISTS idx_refund_requests_status_created
    ON refund_requests(status, created_at);
