"use client";

import { useState } from "react";
import styles from "./ArtworkGrid.module.css";
import FilterPanel from "./FilterPanel";

// Mock data — replace with API call to GET /api/artworks?type={type}
const MOCK_ARTWORKS = [
  {
    id: "1",
    title: "Lumière du matin",
    price: 1200,
    currency: "CAD",
    type: "oil-paintings",
    imageUrl: null,
  },
  {
    id: "2",
    title: "Aquarelle bleue",
    price: 650,
    currency: "CAD",
    type: "watercolors",
    imageUrl: null,
  },
  {
    id: "3",
    title: "Esquisse urbaine",
    price: 320,
    currency: "CAD",
    type: "drawings",
    imageUrl: null,
  },
  {
    id: "4",
    title: "Portrait au fusain",
    price: 480,
    currency: "CAD",
    type: "charcoal",
    imageUrl: null,
  },
  {
    id: "5",
    title: "Paysage d'automne",
    price: 980,
    currency: "CAD",
    type: "landscapes",
    imageUrl: null,
  },
  {
    id: "6",
    title: "Série abstraite no. 3",
    price: 1450,
    currency: "CAD",
    type: "abstraction",
    imageUrl: null,
  },
];

// Maps URL slug → human-readable label
const TYPE_LABELS = {
  "oil-paintings": "Peintures à l'huile",
  watercolors: "Aquarelles",
  drawings: "Dessins",
  charcoal: "Dessins au fusain",
  impressionism: "Impressionnisme",
  abstraction: "Abstraction",
  landscapes: "Paysages",
  portraits: "Portraits",
  "expo-2022": "Exposition 2022",
  "expo-2023": "Exposition 2023",
};

export default function ArtworkGrid({ type }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const filtered = type
    ? MOCK_ARTWORKS.filter((a) => a.type === type)
    : MOCK_ARTWORKS;

  const heading = type ? (TYPE_LABELS[type] ?? type) : "Toutes les œuvres";

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    // TODO: apply filters to artwork list when connected to API
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.count}>
              {filtered.length} œuvre{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button type="button" className={styles.filterButton} onClick={() => setFilterOpen(true)}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={styles.filterIcon}
            >
              <line x1="3" y1="8"  x2="21" y2="8"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="3" y1="16" x2="21" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="16" cy="8"  r="2" fill="white" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="8"  cy="16" r="2" fill="white" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Filtrer
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>Aucune œuvre dans cette catégorie.</p>
        ) : (
          <ul className={styles.grid}>
            {filtered.map((artwork) => (
              <li key={artwork.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {artwork.imageUrl ? (
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} aria-hidden="true" />
                  )}
                </div>

                <div className={styles.info}>
                  <p className={styles.title}>{artwork.title}</p>
                  <p className={styles.price}>
                    {artwork.price.toLocaleString("en-CA", {
                      style: "currency",
                      currency: artwork.currency,
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
}
