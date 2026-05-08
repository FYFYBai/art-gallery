CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1;

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS order_number VARCHAR(32);

WITH numbered_orders AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS row_number
    FROM orders
    WHERE order_number IS NULL OR order_number = ''
)
UPDATE orders
SET order_number = 'SA-' || TO_CHAR(numbered_orders.row_number, 'FM000000')
FROM numbered_orders
WHERE orders.id = numbered_orders.id;

WITH max_order_number AS (
    SELECT MAX(SUBSTRING(order_number FROM '^SA-([0-9]+)$')::BIGINT) AS value
    FROM orders
    WHERE order_number ~ '^SA-[0-9]+$'
)
SELECT setval(
    'order_number_seq',
    GREATEST(COALESCE(value, 1), 1),
    COALESCE(value, 0) > 0
)
FROM max_order_number;

ALTER TABLE orders
    ALTER COLUMN order_number SET NOT NULL;

ALTER TABLE orders
    ALTER COLUMN order_number SET DEFAULT ('SA-' || TO_CHAR(nextval('order_number_seq'), 'FM000000'));

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_orders_order_number'
          AND conrelid = 'orders'::regclass
    ) THEN
        ALTER TABLE orders
            ADD CONSTRAINT uq_orders_order_number UNIQUE (order_number);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
