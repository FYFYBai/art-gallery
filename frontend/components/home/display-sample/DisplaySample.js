"use client";

import styles from "./DisplaySample.module.css";
import { useTranslations } from "../../../i18n/IntlContext";

const sampleItems = [
  {
    id: 1,
    titleKey: "displaySample1Title",
    descriptionKey: "displaySample1Description",
    image: "/images/display-sample/display1.png",
    altKey: "displaySample1Alt",
  },
  {
    id: 2,
    titleKey: "displaySample2Title",
    descriptionKey: "displaySample2Description",
    image: "/images/display-sample/display2.png",
    altKey: "displaySample2Alt",
  },
  {
    id: 3,
    titleKey: "displaySample3Title",
    descriptionKey: "displaySample3Description",
    image: "/images/display-sample/display3.png",
    altKey: "displaySample3Alt",
  },
  {
    id: 4,
    titleKey: "displaySample4Title",
    descriptionKey: "displaySample4Description",
    image: "/images/display-sample/display4.png",
    altKey: "displaySample4Alt",
  },
];

export default function DisplaySample() {
  const t = useTranslations("home");

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t("displaySectionTitle")}</h2>
        <p className={styles.subheading}>{t("displaySectionSubtitle")}</p>

        <div className={styles.grid}>
          {sampleItems.map((item) => (
            <article key={item.id} className={styles.card}>
              <a href="#" className={styles.imageLink}>
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={t(item.altKey)}
                    className={styles.image}
                  />
                </div>
              </a>

              <div className={styles.textBlock}>
                <h3 className={styles.title}>{t(item.titleKey)}</h3>
                <span className={styles.cardDivider} aria-hidden="true" />
                <p className={styles.description}>{t(item.descriptionKey)}</p>
                <a href="#" className={styles.action}>
                  {t("displaySampleAction")}
                  <span className={styles.actionArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
