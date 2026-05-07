"use client";

import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./CuratedExperienceSection.module.css";

export default function CuratedExperienceSection() {
  const t = useTranslations("home");

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t("curatedTitle")}</h2>
          <p className={styles.description}>{t("curatedDescription")}</p>
          <a href="#" className={styles.button}>
            <span>{t("curatedCta")}</span>
            <span aria-hidden="true" className={styles.buttonArrow}>
              →
            </span>
          </a>
        </div>

        <div className={styles.visual}>
          <img
            src="/images/curated-experience/1.png"
            alt=""
            aria-hidden="true"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
