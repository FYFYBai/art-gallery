"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WhyOriginalSection.module.css";
import { whyOriginalCards } from "./whyOriginalData";

const leftCopy = {
  eyebrow: "L'ART DANS VOTRE QUOTIDIEN",
  description:
    "Chaque peinture ne se limite pas à une image. Elle transforme la lumière, le silence et la perception d'un espace.",
};

export default function WhyOriginalSection() {
  const sectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const leftContentRef = useRef(null);

  const [mode, setMode] = useState("static");
  const [fixedStyle, setFixedStyle] = useState({});

  useEffect(() => {
    function updateSticky() {
      const sectionEl = sectionRef.current;
      const leftColumnEl = leftColumnRef.current;
      const leftContentEl = leftContentRef.current;

      if (!sectionEl || !leftColumnEl || !leftContentEl) return;

      const headerHeight = 84;
      const topOffset = headerHeight + 20;

      const sectionRect = sectionEl.getBoundingClientRect();
      const leftColumnRect = leftColumnEl.getBoundingClientRect();
      const leftContentHeight = leftContentEl.offsetHeight;

      const sectionTop = window.scrollY + sectionRect.top;
      const sectionHeight = sectionEl.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      const startFixAt = sectionTop - topOffset;
      const stopFixAt = sectionBottom - topOffset - leftContentHeight;

      const nextFixedStyle = {
        width: `${leftColumnRect.width}px`,
        left: `${leftColumnRect.left}px`,
        top: `${topOffset}px`,
      };

      if (window.scrollY < startFixAt) {
        setMode("static");
        setFixedStyle({});
        return;
      }

      if (window.scrollY >= startFixAt && window.scrollY < stopFixAt) {
        setMode("fixed");
        setFixedStyle(nextFixedStyle);
        return;
      }

      setMode("bottom");
      setFixedStyle({});
    }

    let ticking = false;

    function onScrollOrResize() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSticky();
          ticking = false;
        });
        ticking = true;
      }
    }

    updateSticky();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const stateClass =
    mode === "fixed"
      ? styles.isFixed
      : mode === "bottom"
        ? styles.isBottom
        : styles.isStatic;

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.leftColumn} ref={leftColumnRef}>
          <div
            ref={leftContentRef}
            className={`${styles.leftContent} ${stateClass}`}
            style={mode === "fixed" ? fixedStyle : undefined}
          >
            <p className={styles.eyebrow}>{leftCopy.eyebrow}</p>

            <h2 className={styles.title}>
              Habiter une
              <br />
              œuvre, c&apos;est
              <br />
              habiter une
              <br />
              sensation.
            </h2>

            <span className={styles.titleRule} aria-hidden="true" />

            <p className={styles.description}>
              {leftCopy.description}
            </p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          {whyOriginalCards.map((card) => (
            <article className={styles.card} key={card.id}>
              <div className={styles.cardImageWrap}>
                <img
                  src={card.image}
                  alt={card.title}
                  className={styles.cardImage}
                />
              </div>

              <div className={styles.cardTextBlock}>
                {card.eyebrow && (
                  <p className={styles.cardEyebrow}>{card.eyebrow}</p>
                )}
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
