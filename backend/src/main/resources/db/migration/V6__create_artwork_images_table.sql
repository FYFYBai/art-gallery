CREATE TABLE artwork_images (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id      UUID            NOT NULL,
    image_url       VARCHAR(2048)   NOT NULL,
    alt_text        VARCHAR(255),
    display_order   INTEGER         NOT NULL DEFAULT 0,
    is_primary      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_artwork_images_artwork
        FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);
