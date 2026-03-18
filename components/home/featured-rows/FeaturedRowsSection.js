"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./FeaturedRowsSection.module.css";
import { featuredRows } from "./featuredRowsData";

const DESKTOP_ITEMS_PER_VIEW = 5;
const TABLET_ITEMS_PER_VIEW = 3;
const MOBILE_ITEMS_PER_VIEW = 2;
const SMALL_MOBILE_ITEMS_PER_VIEW = 1;

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.arrowSvg}>
      <path
        d="M14.5 6.5L9 12l5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.arrowSvg}>
      <path
        d="M9.5 6.5L15 12l-5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.metaIcon}>
      <path
        d="M12 20s-6.5-4.2-8.7-8C1.8 9.3 2.9 6.5 6 6.1c1.8-.2 3 .6 4 1.9 1-1.3 2.2-2.1 4-1.9 3.1.4 4.2 3.2 2.7 5.9C18.5 15.8 12 20 12 20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.metaIcon}>
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 8.5v7M8.5 12h7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.metaIcon}>
      <path
        d="M7 9h10l-.8 10H7.8L7 9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 9V7.8A2.5 2.5 0 0112 5.3a2.5 2.5 0 012.5 2.5V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProductCard({ item }) {
  return (
    <article className={styles.card}>
      <a href="#" className={styles.imageLink}>
        <div className={styles.imageFrame}>
          <img src={item.image} alt={item.title} className={styles.image} />
        </div>
      </a>

      <div className={styles.cardMetaTop}>
        <span className={styles.price}>{item.price}</span>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Save item"
          >
            <HeartIcon />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Add to collection"
          >
            <PlusCircleIcon />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Add to cart"
          >
            <BagIcon />
          </button>
        </div>
      </div>

      <a href="#" className={styles.titleLink}>
        {item.title}
      </a>

      <p className={styles.metaLine}>{item.artist}</p>
      <p className={styles.metaLine}>{item.medium}</p>
      <p className={styles.metaLine}>{item.size}</p>
    </article>
  );
}

function getItemsPerView(width) {
  if (width <= 520) return SMALL_MOBILE_ITEMS_PER_VIEW;
  if (width <= 768) return MOBILE_ITEMS_PER_VIEW;
  if (width <= 1024) return TABLET_ITEMS_PER_VIEW;
  return DESKTOP_ITEMS_PER_VIEW;
}

function chunkItems(items, size) {
  const pages = [];

  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }

  return pages;
}

function ProductRow({ row }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(DESKTOP_ITEMS_PER_VIEW);

  useEffect(() => {
    const updateItemsPerView = () => {
      const nextItemsPerView = getItemsPerView(window.innerWidth);
      setItemsPerView(nextItemsPerView);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  const pages = useMemo(() => {
    return chunkItems(row.items, itemsPerView);
  }, [row.items, itemsPerView]);

  const totalPages = pages.length;
  const safePageIndex = Math.min(pageIndex, Math.max(totalPages - 1, 0));

  useEffect(() => {
    if (pageIndex !== safePageIndex) {
      setPageIndex(safePageIndex);
    }
  }, [pageIndex, safePageIndex]);

  const canGoPrev = safePageIndex > 0;
  const canGoNext = safePageIndex < totalPages - 1;

  const goPrev = () => {
    if (!canGoPrev) return;
    setPageIndex((prev) => prev - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    setPageIndex((prev) => prev + 1);
  };

  return (
    <section className={styles.rowSection}>
      <div className={styles.rowHeader}>
        <h2 className={styles.rowTitle}>{row.title}</h2>

        <div className={styles.rowControls}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label={`Previous items for ${row.title}`}
          >
            <ArrowLeftIcon />
          </button>

          <button
            type="button"
            className={styles.navButton}
            onClick={goNext}
            disabled={!canGoNext}
            aria-label={`Next items for ${row.title}`}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{
            width: `${totalPages * 100}%`,
            transform: `translateX(-${safePageIndex * (100 / totalPages)}%)`,
          }}
        >
          {pages.map((pageItems, pageNumber) => (
            <div
              key={`${row.id}-page-${pageNumber}`}
              className={styles.carouselPage}
              style={{ width: `${100 / totalPages}%` }}
            >
              <div
                className={styles.pageGrid}
                style={{
                  gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`,
                }}
              >
                {pageItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FeaturedRowsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {featuredRows.map((row) => (
          <ProductRow key={row.id} row={row} />
        ))}

        <div className={styles.priceFilter}>
          <h3 className={styles.priceFilterTitle}>Shop by Price</h3>

          <div className={styles.priceButtons}>
            <button type="button" className={styles.priceButton}>
              UNDER C$700
            </button>
            <button type="button" className={styles.priceButton}>
              C$700-C$1,400
            </button>
            <button type="button" className={styles.priceButton}>
              C$1,400-C$2,800
            </button>
            <button type="button" className={styles.priceButton}>
              C$2,800-C$7,000
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
