DO $$
DECLARE
    vieux_port UUID := '7a0c86f8-6e2c-4f89-91b3-0e67f4b02101';
    voile UUID := '7a0c86f8-6e2c-4f89-91b3-0e67f4b02102';
    automne UUID := '7a0c86f8-6e2c-4f89-91b3-0e67f4b02103';
    automne_reflet UUID := '7a0c86f8-6e2c-4f89-91b3-0e67f4b02104';
    nuit UUID := '7a0c86f8-6e2c-4f89-91b3-0e67f4b02105';
    fragment UUID := '7a0c86f8-6e2c-4f89-91b3-0e67f4b02106';
BEGIN
    INSERT INTO artworks (
        id, title, description, artwork_type, artwork_size, artwork_year,
        price, currency, is_sold_out, is_active, created_at, updated_at
    )
    VALUES
    (
        vieux_port,
        'Vieux-Port de Montréal, l’hiver',
        'Cette œuvre capture un instant suspendu du Vieux-Port de Montréal en hiver, où le réel se transforme en sensation. Inspirée d’une photographie prise sur place, l’artiste ne cherche pas à reproduire fidèlement la scène, mais à en révéler la mémoire lumineuse.

À travers une palette dominée par des bleus profonds et des touches de couleurs chaudes inattendues, la peinture évoque la présence persistante du soleil même dans le froid. Les reflets dans l’eau deviennent des fragments mouvants, traduisant une perception sensible plutôt qu’une réalité figée.

Travaillée à la spatule et au pinceau, la matière picturale est volontairement expressive, créant un dialogue entre structure et spontanéité. Les lignes, les textures et les contrastes donnent à l’œuvre une vibration vivante, presque musicale.

Cette pièce unique incarne une vision poétique de Montréal : une ville froide en apparence, mais traversée de chaleur, de lumière et d’émotion.',
        'oil-paintings', '24 × 30 in', 2024, 680.00, 'CAD', FALSE, TRUE, NOW(), NOW()
    ),
    (
        voile,
        'Voile au crépuscule — lumière en dérive',
        'Cette œuvre capte un instant suspendu entre le jour et la nuit, où la lumière se dissout lentement dans l’horizon.

Au centre de la composition, une voile solitaire traverse un espace presque infini, comme en équilibre entre présence et disparition.

La palette, dominée par des tons chauds — orangés, rosés et dorés — évoque une chaleur diffuse, enveloppante, presque irréelle. Le ciel et l’eau semblent se répondre, se fondre, abolissant les limites.

Les reflets lumineux se fragmentent à la surface de l’eau, créant une vibration douce, comme un écho du soleil en train de s’éteindre.

Travaillée à la spatule et au pinceau, la matière picturale est riche et expressive. Les gestes visibles, les reliefs et les superpositions de couleurs donnent à l’ensemble une texture vivante, presque tactile.

Cette pièce unique propose une vision poétique du paysage marin : un espace de calme, de dérive et de contemplation intérieure.',
        'oil-paintings', '24 × 30 in', 2026, 780.00, 'CAD', FALSE, TRUE, NOW(), NOW()
    ),
    (
        automne,
        'Montréal, l’automne',
        'Cette œuvre capture un instant du paysage montréalais, où la ville se transforme sous le regard et la mémoire. Inspirée d’une photographie prise sur place, elle ne cherche pas à en reproduire fidèlement les contours, mais à en prolonger la sensation.

Les structures urbaines se dissolvent dans la matière, tandis que les couleurs — dominées par des bleus lumineux et enrichies de touches chaudes — réinterprètent l’atmosphère de l’automne. La scène devient mouvante, presque instable, comme un souvenir en transformation.

Travaillée à la spatule et au pinceau, la peinture joue sur les contrastes entre précision et spontanéité. Les textures, les lignes et les superpositions créent une vibration visuelle qui évoque le rythme de la ville.

Cette pièce unique propose une lecture sensible de Montréal : une ville à la fois vivante et introspective, où l’espace devient émotion.',
        'oil-paintings', '24 × 30 in', 2024, 680.00, 'CAD', FALSE, TRUE, NOW(), NOW()
    ),
    (
        automne_reflet,
        'Montréal, l’automne — reflet',
        'Cette œuvre capte un instant suspendu, où la ville semble se dissoudre dans la lumière. Inspirée d’un paysage montréalais, elle ne cherche pas à en restituer fidèlement les formes, mais à en prolonger la sensation.

La grande roue apparaît presque immatérielle, comme un souvenir en train de s’effacer, tandis que les arbres aux teintes chaudes structurent l’espace. Le regard est naturellement attiré vers les reflets, où l’image se fragmente et se transforme.

À travers une palette dominée par des bleus lumineux, contrastés par des oranges vibrants, la peinture évoque un équilibre entre calme et intensité. L’eau devient un espace de passage, où la lumière se déploie librement.

Travaillée à la spatule et au pinceau, la matière reste visible et vivante. Elle introduit une tension entre précision et spontanéité, donnant à l’ensemble une vibration douce et continue.

Cette pièce unique propose une vision sensible de Montréal : un paysage à la fois réel et flottant, où le temps semble ralentir.',
        'oil-paintings', '16 × 20 in', 2026, 320.00, 'CAD', FALSE, TRUE, NOW(), NOW()
    ),
    (
        nuit,
        'Montréal, la nuit — éclats de lumière',
        'Cette œuvre saisit un moment où la ville s’embrase sous la lumière du soir. Inspirée d’un paysage montréalais, elle ne cherche pas à en fixer les contours, mais à en intensifier la présence.

Le ciel, travaillé en touches épaisses et vibrantes, devient un espace en mouvement, presque incandescent. Les bâtiments émergent de cette matière lumineuse, tandis que la grande roue agit comme un point d’ancrage, à la fois stable et fragile.

La surface de l’eau capte et fragmente la lumière, transformant le paysage en une constellation de reflets. Rien n’est figé : tout oscille entre apparition et dissolution.

Réalisée à la spatule et au pinceau, la peinture affirme une matière dense et expressive. Les contrastes entre bleu profond et orangé lumineux créent une tension visuelle, donnant à l’ensemble une énergie presque vibrante.

Cette pièce unique propose une vision intense de Montréal : une ville traversée de lumière, où la nuit devient un espace vivant.',
        'oil-paintings', '12 × 12 in', 2026, 260.00, 'CAD', FALSE, TRUE, NOW(), NOW()
    ),
    (
        fragment,
        'Fragment intérieur — métamorphose',
        'Cette œuvre explore un espace plus intime, où le visage apparaît comme à travers une fissure. Elle ne représente pas seulement une figure, mais un passage entre intérieur et extérieur, entre ce qui est montré et ce qui reste caché.

Le contraste du noir et blanc renforce cette tension. La matière semble s’ouvrir, laissant émerger un regard calme, presque distant, tandis que le papillon vient troubler l’équilibre de la composition.

Symbole de transformation, il introduit une dimension fragile et mouvante, comme une présence éphémère au cœur de l’image. Rien n’est entièrement stable : la forme se construit et se dissout à la fois.

Travaillée dans une approche graphique et expressive, l’œuvre joue sur la précision du trait et la spontanéité de la matière. Les lignes fissurées, les zones d’ombre et les contrastes créent une vibration silencieuse.

Cette pièce unique propose une réflexion visuelle sur l’identité et la transformation : une présence à la fois révélée et incomplète.',
        'charcoal', '8 × 12 in', 2025, 240.00, 'CAD', FALSE, TRUE, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        artwork_type = EXCLUDED.artwork_type,
        artwork_size = EXCLUDED.artwork_size,
        artwork_year = EXCLUDED.artwork_year,
        price = EXCLUDED.price,
        currency = EXCLUDED.currency,
        is_sold_out = EXCLUDED.is_sold_out,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();

    DELETE FROM artwork_series WHERE artwork_id IN (vieux_port, voile, automne, automne_reflet, nuit, fragment);

    INSERT INTO artwork_series (artwork_id, series_slug, display_order)
    VALUES
        (vieux_port, 'impressionism', 0),
        (vieux_port, 'landscapes', 1),
        (voile, 'impressionism', 0),
        (voile, 'landscapes', 1),
        (automne, 'landscapes', 0),
        (automne, 'abstraction', 1),
        (automne_reflet, 'impressionism', 0),
        (automne_reflet, 'landscapes', 1),
        (nuit, 'impressionism', 0),
        (nuit, 'landscapes', 1),
        (nuit, 'abstraction', 2),
        (fragment, 'portraits', 0),
        (fragment, 'abstraction', 1);

    DELETE FROM artwork_images WHERE artwork_id IN (vieux_port, voile, automne, automne_reflet, nuit, fragment);

    INSERT INTO artwork_images (id, artwork_id, image_url, alt_text, display_order, is_primary, created_at, updated_at)
    VALUES
        ('7a0c86f8-6e2c-4f89-91b3-1e67f4b02101', vieux_port, '/uploads/products/vieux-port-de-montreal-hiver.jpg', 'Vieux-Port de Montréal, l’hiver', 0, TRUE, NOW(), NOW()),
        ('7a0c86f8-6e2c-4f89-91b3-1e67f4b02102', voile, '/uploads/products/voile-au-crepuscule-lumiere-en-derive.jpg', 'Voile au crépuscule — lumière en dérive', 0, TRUE, NOW(), NOW()),
        ('7a0c86f8-6e2c-4f89-91b3-1e67f4b02103', automne, '/uploads/products/montreal-automne.jpg', 'Montréal, l’automne', 0, TRUE, NOW(), NOW()),
        ('7a0c86f8-6e2c-4f89-91b3-1e67f4b02104', automne_reflet, '/uploads/products/montreal-automne-reflet.jpg', 'Montréal, l’automne — reflet', 0, TRUE, NOW(), NOW()),
        ('7a0c86f8-6e2c-4f89-91b3-1e67f4b02105', nuit, '/uploads/products/montreal-la-nuit-eclats-de-lumiere.jpg', 'Montréal, la nuit — éclats de lumière', 0, TRUE, NOW(), NOW()),
        ('7a0c86f8-6e2c-4f89-91b3-1e67f4b02106', fragment, '/uploads/products/fragment-interieur-metamorphose.jpg', 'Fragment intérieur — métamorphose', 0, TRUE, NOW(), NOW());
END $$;
