// getNavItems receives the `t` function from useTranslations and returns translated nav data
export function getNavItems(t) {
  return [
    {
      labelKey: "nav.artworks",
      label: t("nav.artworks"),
      link: "/artworks",
      columns: [
        {
          title: t("artworkTypes.title"),
          items: [
            { label: t("artworkTypes.oilPaintings"), slug: "oil-paintings" },
            { label: t("artworkTypes.watercolors"),  slug: "watercolors" },
            { label: t("artworkTypes.drawings"),     slug: "drawings" },
            { label: t("artworkTypes.charcoal"),     slug: "charcoal" },
          ],
        },
      ],
      promo: {
        eyebrow:     t("promo.artworks.eyebrow"),
        title:       t("promo.artworks.title"),
        description: t("promo.artworks.description"),
        cta:         t("promo.artworks.cta"),
        link:        "/artworks",
      },
    },
    {
      labelKey: "nav.series",
      label: t("nav.series"),
      link: "/artworks",
      columns: [
        {
          title: t("series.title"),
          items: [
            { label: t("series.impressionism"), slug: "impressionism" },
            { label: t("series.abstraction"),   slug: "abstraction" },
            { label: t("series.landscapes"),    slug: "landscapes" },
            { label: t("series.portraits"),     slug: "portraits" },
          ],
        },
      ],
      promo: {
        eyebrow:     t("promo.series.eyebrow"),
        title:       t("promo.series.title"),
        description: t("promo.series.description"),
        cta:         t("promo.series.cta"),
        link:        "/artworks",
      },
    },
    {
      labelKey: "nav.about",
      label: t("nav.about"),
      link: "/a-propos",
    },
    {
      labelKey: "nav.exhibitions",
      label: t("nav.exhibitions"),
      link: "#",
      columns: [
        {
          title: t("exhibitions.title"),
          items: [
            { label: t("exhibitions.expo2022"), slug: "expo-2022" },
            { label: t("exhibitions.expo2023"), slug: "expo-2023" },
          ],
        },
      ],
      promo: {
        eyebrow:     t("promo.exhibitions.eyebrow"),
        title:       t("promo.exhibitions.title"),
        description: t("promo.exhibitions.description"),
        cta:         t("promo.exhibitions.cta"),
        link:        "#",
      },
    },
    {
      labelKey: "nav.contact",
      label: t("nav.contact"),
      link: "#",
    },
  ];
}

export const languageOptions = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "zh", label: "简体中文" },
];
