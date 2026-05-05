"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./CuratorFavoritesSection.module.css";

const DESKTOP_ITEMS_PER_VIEW = 5;
const TABLET_ITEMS_PER_VIEW = 3;
const MOBILE_ITEMS_PER_VIEW = 2;
const SMALL_MOBILE_ITEMS_PER_VIEW = 1;
const AUTOPLAY_DELAY_MS = 10000;

const curatorItems = [
  {
    id: "presence-urbaine",
    title: "Présence urbaine",
    description: "Entre mouvement et lumière,\nla ville devient sensation.",
    image: "/images/curator-favorites/1.jpg",
  },
  {
    id: "paysage-ouvert",
    title: "Paysage ouvert",
    description:
      "Un espace extérieur où la lumière\nse reflète et s'étire dans le temps.",
    image: "/images/curator-favorites/2.jpg",
    imagePosition: "center 3%",
  },
  {
    id: "interiorite",
    title: "Intériorité",
    description: "Une présence fragile,\nentre regard et transformation.",
    image: "/images/curator-favorites/3.jpg",
  },
  {
    id: "lumiere-vibrante",
    title: "Lumière vibrante",
    description: "La couleur devient énergie,\net transforme le paysage.",
    image: "/images/curator-favorites/4.jpg",
    imagePosition: "center 12%",
  },
  {
    id: "silence-nocturne",
    title: "Silence nocturne",
    description: "La ville s'apaise,\net la lumière reste.",
    image: "/images/curator-favorites/5.png",
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
  const t = useTranslations("home");
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
          <div>
            <h2 className={styles.title}>Regards choisis</h2>
            <p className={styles.subtitle}>
              Cinq façons de ressentir le monde, à travers mes œuvres.
            </p>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={goPrev}
              disabled={!canGoPrev && totalPages <= 1}
              aria-label={t("previousCurator")}
            >
              <ArrowLeftIcon />
            </button>

            <button
              type="button"
              className={styles.arrowButton}
              onClick={goNext}
              disabled={!canGoNext && totalPages <= 1}
              aria-label={t("nextCurator")}
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
                            style={
                              item.imagePosition
                                ? { objectPosition: item.imagePosition }
                                : undefined
                            }
                          />
                        </div>
                      </a>

                      <a href="#" className={styles.cardTitleLink}>
                        {item.title}
                      </a>
                      <p className={styles.cardDescription}>
                        {item.description}
                      </p>
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
