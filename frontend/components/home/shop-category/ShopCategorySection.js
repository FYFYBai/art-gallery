"use client";

import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./ShopCategorySection.module.css";

const CATEGORY_KEYS = [
  "categoryPaintings",
  "categoryPhotography",
  "categoryFineArtPrints",
  "categorySculpture",
];

export default function ShopCategorySection() {
  const t = useTranslations("home");

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t("shopByCategory")}</h2>

        <div className={styles.buttonRow}>
          {CATEGORY_KEYS.map((key) => (
            <button key={key} type="button" className={styles.categoryButton}>
              {t(key)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
