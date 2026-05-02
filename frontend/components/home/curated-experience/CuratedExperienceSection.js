"use client";

import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./CuratedExperienceSection.module.css";

export default function CuratedExperienceSection() {
  const t = useTranslations("home");

  return (
    <section className={styles.section}>
      <div className={styles.backgroundLayer} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.title}>{t("curatedTitle")}</h2>
        <p className={styles.description}>{t("curatedDescription")}</p>
        <a href="#" className={styles.button}>{t("curatedCta")}</a>
      </div>
    </section>
  );
}
