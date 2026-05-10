ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS fk_orders_payment_method;

ALTER TABLE orders
    DROP COLUMN IF EXISTS payment_method_id;

DROP TABLE IF EXISTS payment_methods;
