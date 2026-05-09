CREATE TABLE IF NOT EXISTS artwork_series (
    artwork_id UUID NOT NULL,
    series_slug VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT pk_artwork_series PRIMARY KEY (artwork_id, series_slug),
    CONSTRAINT fk_artwork_series_artwork
        FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

INSERT INTO artwork_series (artwork_id, series_slug, display_order)
SELECT id, trim(series), 0
FROM artworks
WHERE series IS NOT NULL
  AND trim(series) <> ''
ON CONFLICT DO NOTHING;

DROP INDEX IF EXISTS idx_artworks_series;

ALTER TABLE artworks
    DROP COLUMN IF EXISTS series;

CREATE INDEX IF NOT EXISTS idx_artwork_series_slug ON artwork_series(series_slug);
