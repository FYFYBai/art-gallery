ALTER TABLE artworks
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

UPDATE artworks
SET slug = CASE id::text
    WHEN '7a0c86f8-6e2c-4f89-91b3-0e67f4b02101' THEN 'vieux-port-de-montreal-hiver'
    WHEN '7a0c86f8-6e2c-4f89-91b3-0e67f4b02102' THEN 'voile-au-crepuscule-lumiere-en-derive'
    WHEN '7a0c86f8-6e2c-4f89-91b3-0e67f4b02103' THEN 'montreal-automne'
    WHEN '7a0c86f8-6e2c-4f89-91b3-0e67f4b02104' THEN 'montreal-automne-reflet'
    WHEN '7a0c86f8-6e2c-4f89-91b3-0e67f4b02105' THEN 'montreal-la-nuit-eclats-de-lumiere'
    WHEN '7a0c86f8-6e2c-4f89-91b3-0e67f4b02106' THEN 'fragment-interieur-metamorphose'
    ELSE regexp_replace(
        regexp_replace(
            regexp_replace(
                lower(translate(title,
                    'àáâãäåçèéêëìíîïñòóôõöùúûüýÿœæ’''',
                    'aaaaaaceeeeiiiinooooouuuuyyoeae--'
                )),
                '[^a-z0-9]+', '-', 'g'
            ),
            '(^-+|-+$)', '', 'g'
        ),
        '-{2,}', '-', 'g'
    )
END
WHERE slug IS NULL OR slug = '';

WITH duplicates AS (
    SELECT id,
           slug,
           row_number() OVER (PARTITION BY slug ORDER BY created_at, id) AS duplicate_index
    FROM artworks
)
UPDATE artworks a
SET slug = duplicates.slug || '-' || duplicates.duplicate_index
FROM duplicates
WHERE a.id = duplicates.id
  AND duplicates.duplicate_index > 1;

ALTER TABLE artworks
    ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_artworks_slug ON artworks(slug);
