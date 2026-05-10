ALTER TABLE refund_requests
    ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(2000);

WITH ranked_refund_requests AS (
    SELECT
        ctid,
        ROW_NUMBER() OVER (
            PARTITION BY order_id, user_id
            ORDER BY created_at, id
        ) AS row_number
    FROM refund_requests
)
DELETE FROM refund_requests request
USING ranked_refund_requests ranked
WHERE request.ctid = ranked.ctid
  AND ranked.row_number > 1;

ALTER TABLE refund_requests
    DROP CONSTRAINT IF EXISTS chk_refund_request_status;

ALTER TABLE refund_requests
    ADD CONSTRAINT chk_refund_request_status
        CHECK (status IN ('PENDING','APPROVED','REJECTED'));

CREATE UNIQUE INDEX IF NOT EXISTS uq_refund_requests_order_user
    ON refund_requests(order_id, user_id);
