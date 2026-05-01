CREATE TABLE cart_items (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id     UUID            NOT NULL,
    artwork_id  UUID            NOT NULL,
    quantity    INTEGER         NOT NULL DEFAULT 1,
    unit_price  NUMERIC(10,2)   NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_artwork
        FOREIGN KEY (artwork_id) REFERENCES artworks(id),
    CONSTRAINT uq_cart_items_cart_artwork
        UNIQUE (cart_id, artwork_id)
);
