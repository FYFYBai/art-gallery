CREATE TABLE orders (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL,
    shipping_address_id UUID            NOT NULL,
    billing_address_id  UUID            NOT NULL,
    payment_method_id   UUID            NOT NULL,
    order_status        VARCHAR(20)     NOT NULL,
    subtotal            NUMERIC(10,2)   NOT NULL,
    tax_amount          NUMERIC(10,2)   NOT NULL,
    shipping_amount     NUMERIC(10,2)   NOT NULL,
    total_amount        NUMERIC(10,2)   NOT NULL,
    currency            VARCHAR(10)     NOT NULL DEFAULT 'CAD',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_shipping_address
        FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id),
    CONSTRAINT fk_orders_billing_address
        FOREIGN KEY (billing_address_id) REFERENCES user_addresses(id),
    CONSTRAINT fk_orders_payment_method
        FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    CONSTRAINT chk_order_status
        CHECK (order_status IN ('PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED'))
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
