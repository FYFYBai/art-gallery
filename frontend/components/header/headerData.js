export const navItems = [
  {
    label: "Œuvres",
    link: "/artworks",
    columns: [
      {
        title: "Œuvres",
        items: [
          { label: "Peintures à l'huile", slug: "oil-paintings" },
          { label: "Aquarelles",          slug: "watercolors" },
          { label: "Dessins",             slug: "drawings" },
          { label: "Dessins au fusain",   slug: "charcoal" },
        ],
      },
    ],
    promo: {
      eyebrow: "Collection",
      title: "Œuvres originales",
      description:
        "Explorez une sélection de travaux originaux à travers plusieurs médiums.",
      cta: "Voir les œuvres",
      link: "/artworks",
    },
  },
  {
    label: "Séries",
    link: "/artworks",
    columns: [
      {
        title: "Séries",
        items: [
          { label: "Impressionnisme", slug: "impressionism" },
          { label: "Abstraction",     slug: "abstraction" },
          { label: "Paysages",        slug: "landscapes" },
          { label: "Portraits",       slug: "portraits" },
        ],
      },
    ],
    promo: {
      eyebrow: "Série",
      title: "Univers thématiques",
      description:
        "Parcourez les œuvres par approche visuelle, ambiance et sujet.",
      cta: "Découvrir les séries",
      link: "/artworks",
    },
  },
  {
    label: "À propos",
    link: "/a-propos",
  },
  {
    label: "Expositions",
    link: "#",
    columns: [
      {
        title: "Expositions",
        items: [
          { label: "2022 — Exposition collective, Montréal",          slug: "expo-2022" },
          { label: "2023 — Université de Montréal, exposition étudiante", slug: "expo-2023" },
        ],
      },
    ],
    promo: {
      eyebrow: "Archives",
      title: "Expositions récentes",
      description:
        "Retrouvez un aperçu des expositions collectives et étudiantes récentes.",
      cta: "Voir les expositions",
      link: "#",
    },
  },
  {
    label: "Contact",
    link: "#",
  },
];

export const rotatingTerms = ["artist name", "painting", "return policy"];

export const languageOptions = ["Français", "English", "简体中文"];
