"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./CuratorFavoritesSection.module.css";

const DESKTOP_ITEMS_PER_VIEW = 5;
const TABLET_ITEMS_PER_VIEW = 3;
const MOBILE_ITEMS_PER_VIEW = 2;
const SMALL_MOBILE_ITEMS_PER_VIEW = 1;
const AUTOPLAY_DELAY_MS = 10000;

const curatorItems = [
  {
    id: "best-of-2026",
    title: "Best Of 2026",
    image: "https://picsum.photos/seed/curator-1/900/640",
  },
  {
    id: "arresting-abstracts",
    title: "Arresting Abstracts",
    image: "https://picsum.photos/seed/curator-2/900/640",
  },
  {
    id: "featured-sculptures",
    title: "Featured Sculptures",
    image: "https://picsum.photos/seed/curator-3/900/640",
  },
  {
    id: "powerful-portraits",
    title: "Powerful Portraits",
    image: "https://picsum.photos/seed/curator-4/900/640",
  },
  {
    id: "vibrant-landscapes",
    title: "Vibrant Landscapes",
    image: "https://picsum.photos/seed/curator-5/900/640",
  },
  {
    id: "studio-selections",
    title: "Studio Selections",
    image: "https://picsum.photos/seed/curator-6/900/640",
  },
  {
    id: "quiet-interiors",
    title: "Quiet Interiors",
    image: "https://picsum.photos/seed/curator-7/900/640",
  },
  {
    id: "monochrome-moments",
    title: "Monochrome Moments",
    image: "https://picsum.photos/seed/curator-8/900/640",
  },
  {
    id: "colour-and-light",
    title: "Colour and Light",
    image: "https://picsum.photos/seed/curator-9/900/640",
  },
  {
    id: "textural-works",
    title: "Textural Works",
    image: "https://picsum.photos/seed/curator-10/900/640",
  },
  {
    id: "gestural-series",
    title: "Gestural Series",
    image: "https://picsum.photos/seed/curator-11/900/640",
  },
  {
    id: "framed-favorites",
    title: "Framed Favorites",
    image: "https://picsum.photos/seed/curator-12/900/640",
  },
  {
    id: "earth-tone-edit",
    title: "Earth Tone Edit",
    image: "https://picsum.photos/seed/curator-13/900/640",
  },
  {
    id: "collectors-choice",
    title: "Collector's Choice",
    image: "https://picsum.photos/seed/curator-14/900/640",
  },
  {
    id: "new-perspectives",
    title: "New Perspectives",
    image: "https://picsum.photos/seed/curator-15/900/640",
  },
];

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

export default function CuratorFavoritesSection() {
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(DESKTOP_ITEMS_PER_VIEW);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(getItemsPerView(window.innerWidth));
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  const pages = useMemo(() => {
    return chunkItems(curatorItems, itemsPerView);
  }, [itemsPerView]);

  const totalPages = pages.length;
  const safePageIndex = Math.min(pageIndex, Math.max(totalPages - 1, 0));
  const canGoPrev = safePageIndex > 0;
  const canGoNext = safePageIndex < totalPages - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();

    if (!isHovered && totalPages > 1) {
      timerRef.current = setTimeout(() => {
        setPageIndex((prev) => {
          const safePrev = Math.min(prev, Math.max(totalPages - 1, 0));

          return safePrev + 1 >= totalPages ? 0 : safePrev + 1;
        });
      }, AUTOPLAY_DELAY_MS);
    }

    return () => {
      clearTimer();
    };
  }, [clearTimer, safePageIndex, isHovered, totalPages]);

  const goPrev = () => {
    clearTimer();
    setPageIndex(safePageIndex === 0 ? totalPages - 1 : safePageIndex - 1);
  };

  const goNext = () => {
    clearTimer();
    setPageIndex(safePageIndex + 1 >= totalPages ? 0 : safePageIndex + 1);
  };

  return (
    <section
      className={styles.section}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.inner}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Curator Favorites</h2>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={goPrev}
              disabled={!canGoPrev && totalPages <= 1}
              aria-label="Previous curator favorites"
            >
              <ArrowLeftIcon />
            </button>

            <button
              type="button"
              className={styles.arrowButton}
              onClick={goNext}
              disabled={!canGoNext && totalPages <= 1}
              aria-label="Next curator favorites"
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
                key={`curator-page-${pageNumber}`}
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
                    <article key={item.id} className={styles.card}>
                      <a href="#" className={styles.imageLink}>
                        <div className={styles.imageWrap}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className={styles.image}
                          />
                        </div>
                      </a>

                      <a href="#" className={styles.cardTitleLink}>
                        {item.title}
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
