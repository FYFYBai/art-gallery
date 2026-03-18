"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import heroSlides from "./heroSlides";

export default function Hero() {
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
    <section className={styles.hero} aria-label="Featured gallery highlights">
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
                  <p className={styles.eyebrow}>{slide.eyebrow}</p>
                  <h2 className={styles.title}>{slide.title}</h2>
                  <a href={slide.linkHref} className={styles.link}>
                    {slide.linkText}
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
        aria-label="Previous slide"
      >
        <span className={styles.arrow}>&lsaquo;</span>
      </button>

      <button
        type="button"
        className={`${styles.sideControl} ${styles.rightControl}`}
        onClick={goToNext}
        aria-label="Next slide"
      >
        <span className={styles.arrow}>&rsaquo;</span>
      </button>
    </section>
  );
}
