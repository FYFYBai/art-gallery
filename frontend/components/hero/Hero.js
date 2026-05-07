"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "../../i18n/IntlContext";
import styles from "./Hero.module.css";
import heroSlides from "./heroSlides";

function getLocalizedHref(href, locale) {
  if (!href || href.startsWith("#") || /^https?:\/\//.test(href)) {
    return href;
  }

  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  const clearSlideTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startSlideTimer = useCallback(() => {
    clearSlideTimer();

    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
  }, [clearSlideTimer]);

  const goToPrevious = useCallback(() => {
    clearSlideTimer();

    setActiveIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }, [clearSlideTimer]);

  const goToNext = useCallback(() => {
    clearSlideTimer();

    setActiveIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, [clearSlideTimer]);

  useEffect(() => {
    startSlideTimer();

    return () => {
      clearSlideTimer();
    };
  }, [activeIndex, startSlideTimer, clearSlideTimer]);

  return (
    <section className={styles.hero} aria-label={t("ariaLabel")}>
      <div className={styles.slidesWrapper}>
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.id}
              className={`${styles.slide} ${isActive ? styles.active : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-hidden={!isActive}
            >
              <div className={styles.imageOverlay} />

              <div className={styles.contentOuter}>
                <div className={styles.contentCard}>
                  <p className={styles.eyebrow}>{t(slide.eyebrowKey)}</p>
                  <h2 className={styles.title}>{t(slide.titleKey)}</h2>
                  <span className={styles.divider} aria-hidden="true" />
                  <a
                    href={getLocalizedHref(slide.linkHref, locale)}
                    className={styles.link}
                  >
                    {t(slide.linkTextKey)}
                    <span className={styles.linkArrow} aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.sideControl} ${styles.leftControl}`}
        onClick={goToPrevious}
        aria-label={t("previousSlide")}
      >
        <span className={styles.arrow}>&lsaquo;</span>
      </button>

      <button
        type="button"
        className={`${styles.sideControl} ${styles.rightControl}`}
        onClick={goToNext}
        aria-label={t("nextSlide")}
      >
        <span className={styles.arrow}>&rsaquo;</span>
      </button>
    </section>
  );
}
