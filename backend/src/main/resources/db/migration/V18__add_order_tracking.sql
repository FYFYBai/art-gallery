ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS tracking_link VARCHAR(1000),
    ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

UPDATE orders
SET shipped_at = COALESCE(shipped_at, updated_at)
WHERE order_status = 'SHIPPED';

UPDATE orders
SET delivered_at = COALESCE(delivered_at, updated_at)
WHERE order_status = 'DELIVERED';
