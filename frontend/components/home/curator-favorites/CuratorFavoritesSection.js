"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./CuratorFavoritesSection.module.css";

const DESKTOP_ITEMS_PER_VIEW = 5;
const TABLET_ITEMS_PER_VIEW = 3;
const MOBILE_ITEMS_PER_VIEW = 2;
const SMALL_MOBILE_ITEMS_PER_VIEW = 1;
const AUTOPLAY_DELAY_MS = 10000;
const CARD_GAP_PX = 24;

const curatorItems = [
  {
    id: "presence-urbaine",
    titleKey: "curatorFavorite1Title",
    descriptionKey: "curatorFavorite1Description",
    image: "/images/curator-favorites/1.jpg",
  },
  {
    id: "paysage-ouvert",
    titleKey: "curatorFavorite2Title",
    descriptionKey: "curatorFavorite2Description",
    image: "/images/curator-favorites/2.jpg",
    imagePosition: "center 3%",
  },
  {
    id: "interiorite",
    titleKey: "curatorFavorite3Title",
    descriptionKey: "curatorFavorite3Description",
    image: "/images/curator-favorites/3.jpg",
  },
  {
    id: "lumiere-vibrante",
    titleKey: "curatorFavorite4Title",
    descriptionKey: "curatorFavorite4Description",
    image: "/images/curator-favorites/4.jpg",
    imagePosition: "center 12%",
  },
  {
    id: "silence-nocturne",
    titleKey: "curatorFavorite5Title",
    descriptionKey: "curatorFavorite5Description",
    image: "/images/curator-favorites/5.png",
  },
  {
    id: "lumiere-apaisante",
    titleKey: "curatorFavorite6Title",
    descriptionKey: "curatorFavorite6Description",
    image: "/images/curator-favorites/6.png",
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

function getPageOffsets(itemCount, itemsPerView) {
  const maxOffset = Math.max(itemCount - itemsPerView, 0);
  const offsets = [0];

  for (
    let offset = itemsPerView;
    offset <= maxOffset;
    offset += itemsPerView
  ) {
    offsets.push(offset);
  }

  if (!offsets.includes(maxOffset)) {
    offsets.push(maxOffset);
  }

  return offsets;
}

export default function CuratorFavoritesSection() {
  const t = useTranslations("home");
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(DESKTOP_ITEMS_PER_VIEW);
  const [slideDistance, setSlideDistance] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselTrackRef = useRef(null);
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

  const pageOffsets = useMemo(() => {
    return getPageOffsets(curatorItems.length, itemsPerView);
  }, [itemsPerView]);
  const safePageIndex = Math.min(pageIndex, Math.max(pageOffsets.length - 1, 0));
  const activeOffset = pageOffsets[safePageIndex] ?? 0;
  const canSlide = pageOffsets.length > 1;
  const canGoPrev = safePageIndex > 0;
  const canGoNext = safePageIndex < pageOffsets.length - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const measureSlideDistance = useCallback(() => {
    const firstCard = carouselTrackRef.current?.querySelector(
      "[data-curator-card]",
    );

    if (firstCard) {
      setSlideDistance(firstCard.getBoundingClientRect().width + CARD_GAP_PX);
    }
  }, []);

  useEffect(() => {
    measureSlideDistance();

    window.addEventListener("resize", measureSlideDistance);

    return () => {
      window.removeEventListener("resize", measureSlideDistance);
    };
  }, [measureSlideDistance]);

  useEffect(() => {
    measureSlideDistance();
  }, [itemsPerView, measureSlideDistance]);

  useEffect(() => {
    clearTimer();

    if (!isHovered && canSlide) {
      timerRef.current = setTimeout(() => {
        setPageIndex((prev) => {
          const safePrev = Math.min(prev, Math.max(pageOffsets.length - 1, 0));

          return safePrev >= pageOffsets.length - 1 ? 0 : safePrev + 1;
        });
      }, AUTOPLAY_DELAY_MS);
    }

    return () => {
      clearTimer();
    };
  }, [canSlide, clearTimer, isHovered, pageOffsets.length, safePageIndex]);

  const goPrev = () => {
    clearTimer();
    setPageIndex(
      safePageIndex === 0 ? pageOffsets.length - 1 : safePageIndex - 1,
    );
  };

  const goNext = () => {
    clearTimer();
    setPageIndex(
      safePageIndex >= pageOffsets.length - 1 ? 0 : safePageIndex + 1,
    );
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
            <h2 className={styles.title}>{t("curatorFavoritesTitle")}</h2>
            <p className={styles.subtitle}>
              {t("curatorFavoritesSubtitle")}
            </p>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={goPrev}
              disabled={!canGoPrev && !canSlide}
              aria-label={t("previousCurator")}
            >
              <ArrowLeftIcon />
            </button>

            <button
              type="button"
              className={styles.arrowButton}
              onClick={goNext}
              disabled={!canGoNext && !canSlide}
              aria-label={t("nextCurator")}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        <div className={styles.carouselViewport}>
          <div
            ref={carouselTrackRef}
            className={styles.carouselTrack}
            style={{
              "--items-per-view": itemsPerView,
              "--card-gap": `${CARD_GAP_PX}px`,
              "--visible-gap-total": `${(itemsPerView - 1) * CARD_GAP_PX}px`,
              transform: `translate3d(-${activeOffset * slideDistance}px, 0, 0)`,
            }}
          >
            {curatorItems.map((item) => (
              <article key={item.id} className={styles.card} data-curator-card>
                <a href="#" className={styles.imageLink}>
                  <div className={styles.imageWrap}>
                    <img
                      src={item.image}
                      alt={t(item.titleKey)}
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
                  {t(item.titleKey)}
                </a>
                <p className={styles.cardDescription}>
                  {t(item.descriptionKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
