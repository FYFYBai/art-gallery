DROP INDEX IF EXISTS idx_artworks_medium;

ALTER TABLE artworks
    DROP COLUMN IF EXISTS artwork_medium;
