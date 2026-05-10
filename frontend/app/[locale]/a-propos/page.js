"use client";

import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./AProposPage.module.css";

export default function AProposPage() {
  const t = useTranslations("about");

  return (
    <main className={styles.page}>
      <section className={`${styles.section} ${styles.imageSection}`}>
        <div className={styles.imageInner}>
          <div className={styles.imageTextBlock}>
            <p className={styles.eyebrow}>{t("portraitEyebrow")}</p>
            <h2 className={styles.title}>{t("name")}</h2>
            <p className={styles.lead}>{t("intro")}</p>
            <p className={styles.bodyText}>{t("body")}</p>
          </div>

          <div className={styles.imageWrap}>
            <img
              src="/images/curated-experience/1.png"
              alt={t("imageAlt")}
              className={styles.image}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
