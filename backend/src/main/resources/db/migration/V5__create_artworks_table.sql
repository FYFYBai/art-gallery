CREATE TABLE artworks (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255)    NOT NULL,
    description     TEXT,
    artwork_type    VARCHAR(50),
    artwork_medium  VARCHAR(100),
    price           NUMERIC(10,2)   NOT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'CAD',
    artwork_year    SMALLINT,
    is_sold_out     BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_artwork_year
        CHECK (artwork_year IN (2024, 2025, 2026))
);

CREATE INDEX idx_artworks_type        ON artworks(artwork_type);
CREATE INDEX idx_artworks_medium      ON artworks(artwork_medium);
CREATE INDEX idx_artworks_year        ON artworks(artwork_year);
CREATE INDEX idx_artworks_is_sold_out ON artworks(is_sold_out);
CREATE INDEX idx_artworks_is_active   ON artworks(is_active);
