ALTER TABLE artworks
    ADD COLUMN IF NOT EXISTS description_en TEXT,
    ADD COLUMN IF NOT EXISTS description_zh TEXT;
