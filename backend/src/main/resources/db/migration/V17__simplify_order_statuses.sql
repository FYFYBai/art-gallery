UPDATE orders
SET order_status = 'PAID',
    updated_at = NOW()
WHERE order_status = 'PROCESSING';

DELETE FROM orders
WHERE order_status = 'PENDING'
  AND created_at < NOW() - INTERVAL '24 hours';

ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS chk_order_status;

ALTER TABLE orders
    ADD CONSTRAINT chk_order_status
        CHECK (order_status IN ('PENDING','PAID','SHIPPED','DELIVERED','CANCELLED','REFUNDED'));
