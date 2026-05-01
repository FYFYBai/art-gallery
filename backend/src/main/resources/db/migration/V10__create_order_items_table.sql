CREATE TABLE order_items (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID            NOT NULL,
    artwork_id      UUID            NOT NULL,
    artwork_title   VARCHAR(255)    NOT NULL,
    quantity        INTEGER         NOT NULL,
    unit_price      NUMERIC(10,2)   NOT NULL,
    total_price     NUMERIC(10,2)   NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_artwork
        FOREIGN KEY (artwork_id) REFERENCES artworks(id)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
