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
const ITEMS_PER_PAGE = 15;
const DEFAULT_FILTERS = {
  selectedTypes: [],
  selectedSeries: [],
  priceRange: [0, 5000],
  selectedYears: [],
  hideSold: false,
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

function buildArtworkQuery(filters, page) {
  const params = new URLSearchParams();
  filters.selectedTypes.forEach((type) => params.append("artworkTypes", type));
  filters.selectedSeries.forEach((series) => params.append("series", series));
  filters.selectedYears.forEach((year) => params.append("years", String(year)));
  params.set("minPrice", String(filters.priceRange[0]));
  params.set("maxPrice", String(filters.priceRange[1]));
  params.set("hideSold", String(filters.hideSold));
  params.set("page", String(page));
  params.set("size", String(ITEMS_PER_PAGE));
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
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadArtworks() {
      setLoading(true);
      setError("");

      try {
        const query = buildArtworkQuery(activeFilters, currentPage);
        const response = await fetch(`${API_BASE_URL}/api/artworks?${query}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load artworks");
        }

        const payload = await response.json();
        setArtworks(payload.items ?? []);
        setTotalItems(payload.totalItems ?? 0);
        setTotalPages(Math.max(1, payload.totalPages ?? 1));
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError("loadFailed");
          setArtworks([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadArtworks();
    return () => controller.abort();
  }, [activeFilters, currentPage]);

  const displayPage = Math.min(currentPage, totalPages);

  const handleApplyFilters = (filters) => {
    setCurrentPage(1);
    setActiveFilters(filters);
  };

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
              {totalItems === 1
                ? t("artworkCount").replace("{count}", totalItems)
                : t("artworkCountPlural").replace("{count}", totalItems)}
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
          <>
            <ul className={styles.grid}>
              {artworks.map((artwork) => (
                <li key={artwork.id} className={styles.card}>
                  <Link href={`/${locale}/artworks/${artwork.slug}`} className={styles.cardLink}>
                    <div className={styles.imageWrap}>
                      {artwork.imageUrl ? (
                        <>
                          <img
                            src={imageSrc(artwork.imageUrl)}
                            alt={artwork.title}
                            className={styles.image}
                          />
                          {artwork.secondaryImageUrl && (
                            <img
                              src={imageSrc(artwork.secondaryImageUrl)}
                              alt=""
                              aria-hidden="true"
                              className={`${styles.image} ${styles.hoverImage}`}
                            />
                          )}
                        </>
                      ) : (
                        <div className={styles.imagePlaceholder} aria-hidden="true" />
                      )}
                    </div>

                    <div className={styles.info}>
                      <p className={styles.title}>{artwork.title}</p>
                      <p className={`${styles.status} ${artwork.soldOut ? styles.soldStatus : ""}`}>
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

            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label={t("paginationLabel")}>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={displayPage === 1}
                >
                  {t("previousPage")}
                </button>
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`${styles.pageNumber} ${page === displayPage ? styles.activePage : ""}`}
                      onClick={() => setCurrentPage(page)}
                      aria-current={page === displayPage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={displayPage === totalPages}
                >
                  {t("nextPage")}
                </button>
              </nav>
            )}
          </>
        )}
      </section>

      <FilterPanel
        key={`${filterOpen ? "open" : "closed"}-${JSON.stringify(activeFilters)}`}
        isOpen={filterOpen}
        filters={activeFilters}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
}
