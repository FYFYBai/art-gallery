"use client";

import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./AProposPage.module.css";

export default function AProposPage() {
  const t = useTranslations("about");

  return (
    <main className={styles.page}>
      <section className={`${styles.section} ${styles.textOnlySection}`}>
        <div className={styles.textOnlyInner}>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1 className={styles.title}>{t("name")}</h1>
          <p className={styles.lead}>{t("intro")}</p>
          <p className={styles.bodyText}>{t("body")}</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.imageSection}`}>
        <div className={styles.imageInner}>
          <div className={styles.imageWrap}>
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80"
              alt={t("imageAlt")}
              className={styles.image}
            />
          </div>

          <div className={styles.imageTextBlock}>
            <p className={styles.eyebrow}>{t("portraitEyebrow")}</p>
            <h2 className={styles.title}>{t("name")}</h2>
            <p className={styles.lead}>{t("intro")}</p>
            <p className={styles.bodyText}>{t("body")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
