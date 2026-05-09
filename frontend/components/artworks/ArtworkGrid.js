"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "../../i18n/IntlContext";
import AddToCartButton from "./AddToCartButton";
import styles from "./ArtworkGrid.module.css";
import FilterPanel from "./FilterPanel";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const ARTWORK_TYPE_SLUGS = ["oil-paintings", "watercolors", "drawings", "charcoal"];
const SERIES_SLUGS = ["impressionism", "abstraction", "landscapes", "portraits"];
const DEFAULT_FILTERS = {
  selectedTypes: [],
  selectedSeries: [],
  priceRange: [0, 5000],
  selectedYears: [],
};

function filtersFromType(type) {
  if (ARTWORK_TYPE_SLUGS.includes(type)) {
    return { ...DEFAULT_FILTERS, selectedTypes: [type] };
  }

  if (SERIES_SLUGS.includes(type)) {
    return { ...DEFAULT_FILTERS, selectedSeries: [type] };
  }

  return DEFAULT_FILTERS;
}

function imageSrc(imageUrl) {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/uploads/")) return `${API_BASE_URL}${imageUrl}`;
  return imageUrl;
}

function buildArtworkQuery(filters) {
  const params = new URLSearchParams();
  filters.selectedTypes.forEach((type) => params.append("artworkTypes", type));
  filters.selectedSeries.forEach((series) => params.append("series", series));
  filters.selectedYears.forEach((year) => params.append("years", String(year)));
  params.set("minPrice", String(filters.priceRange[0]));
  params.set("maxPrice", String(filters.priceRange[1]));
  return params.toString();
}

export default function ArtworkGrid({ type }) {
  const locale = useLocale();
  const t = useTranslations("artworkGrid");
  const tTypes = useTranslations("artworkTypes");
  const tSeries = useTranslations("series");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(() => filtersFromType(type));
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadArtworks() {
      setLoading(true);
      setError("");

      try {
        const query = buildArtworkQuery(activeFilters);
        const response = await fetch(`${API_BASE_URL}/api/artworks?${query}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load artworks");
        }

        setArtworks(await response.json());
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError("loadFailed");
          setArtworks([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadArtworks();
    return () => controller.abort();
  }, [activeFilters]);

  const heading = useMemo(() => {
    if (!type) return t("allArtworks");
    if (ARTWORK_TYPE_SLUGS.includes(type)) {
      const key = type === "oil-paintings" ? "oilPaintings" : type;
      return tTypes(key);
    }
    if (SERIES_SLUGS.includes(type)) {
      return tSeries(type);
    }
    return t("allArtworks");
  }, [t, tSeries, tTypes, type]);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.count}>
              {artworks.length === 1
                ? t("artworkCount").replace("{count}", artworks.length)
                : t("artworkCountPlural").replace("{count}", artworks.length)}
            </p>
          </div>
          <button type="button" className={styles.filterButton} onClick={() => setFilterOpen(true)}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={styles.filterIcon}
            >
              <line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="3" y1="16" x2="21" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="16" cy="8" r="2" fill="white" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="8" cy="16" r="2" fill="white" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {t("filter")}
          </button>
        </div>

        {loading ? (
          <p className={styles.empty}>{t("loading")}</p>
        ) : error ? (
          <p className={styles.empty}>{t(error)}</p>
        ) : artworks.length === 0 ? (
          <p className={styles.empty}>{t("noArtworks")}</p>
        ) : (
          <ul className={styles.grid}>
            {artworks.map((artwork) => (
              <li key={artwork.id} className={styles.card}>
                <Link href={`/${locale}/artworks/${artwork.slug}`} className={styles.cardLink}>
                  <div className={styles.imageWrap}>
                    {artwork.imageUrl ? (
                      <img
                        src={imageSrc(artwork.imageUrl)}
                        alt={artwork.title}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder} aria-hidden="true" />
                    )}
                  </div>

                  <div className={styles.info}>
                    <p className={styles.title}>{artwork.title}</p>
                    <p className={styles.status}>
                      {artwork.soldOut ? t("sold") : t("available")}
                    </p>
                    <p className={styles.price}>
                      {Number(artwork.price || 0).toLocaleString("en-CA", {
                        style: "currency",
                        currency: artwork.currency || "CAD",
                      })}
                    </p>
                  </div>
                </Link>
                <AddToCartButton artworkId={artwork.id} soldOut={artwork.soldOut} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <FilterPanel
        key={`${filterOpen ? "open" : "closed"}-${JSON.stringify(activeFilters)}`}
        isOpen={filterOpen}
        filters={activeFilters}
        onClose={() => setFilterOpen(false)}
        onApply={setActiveFilters}
      />
    </>
  );
}
