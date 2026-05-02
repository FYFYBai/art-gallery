"use client";

import { useState } from "react";
import { useTranslations } from "../../i18n/IntlContext";
import styles from "./FilterPanel.module.css";

const ARTWORK_TYPE_KEYS = ["oilPaintings", "watercolors", "drawings", "charcoal"];
const MEDIUM_KEYS       = ["canvas", "paper", "woodPanel", "mixedMedia"];
const YEARS             = [2024, 2025, 2026];

export default function FilterPanel({ isOpen, onClose, onApply }) {
  const t       = useTranslations("filterPanel");
  const tTypes  = useTranslations("artworkTypes");
  const tMediums = useTranslations("mediums");

  const [selectedTypes,   setSelectedTypes]   = useState([]);
  const [selectedMediums, setSelectedMediums] = useState([]);
  const [maxPrice,        setMaxPrice]        = useState(5000);
  const [selectedYears,   setSelectedYears]   = useState([]);

  const toggleItem = (setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedMediums([]);
    setMaxPrice(5000);
    setSelectedYears([]);
  };

  const handleApply = () => {
    onApply({ selectedTypes, selectedMediums, maxPrice, selectedYears });
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`${styles.panel} ${isOpen ? styles.isOpen : ""}`}
        aria-label={t("title")}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{t("title")}</h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label={t("title")}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.panelBody}>

          {/* Artwork Type */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>{t("artworkType")}</h3>
            <ul className={styles.checkList}>
              {ARTWORK_TYPE_KEYS.map((key) => (
                <li key={key}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedTypes.includes(key)}
                      onChange={() => toggleItem(setSelectedTypes, key)}
                    />
                    {tTypes(key)}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* Medium */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>{t("medium")}</h3>
            <ul className={styles.checkList}>
              {MEDIUM_KEYS.map((key) => (
                <li key={key}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedMediums.includes(key)}
                      onChange={() => toggleItem(setSelectedMediums, key)}
                    />
                    {tMediums(key)}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* Price Range */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>{t("priceRange")}</h3>
            <div className={styles.sliderWrap}>
              <input
                type="range"
                min={0}
                max={10000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className={styles.slider}
                aria-label={t("priceRange")}
              />
              <div className={styles.sliderLabels}>
                <span>CA$0</span>
                <span>
                  {maxPrice === 10000
                    ? t("priceMax")
                    : `CA$${maxPrice.toLocaleString("en-CA")}`}
                </span>
              </div>
            </div>
          </section>

          {/* Year */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>{t("year")}</h3>
            <ul className={styles.checkList}>
              {YEARS.map((year) => (
                <li key={year}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedYears.includes(year)}
                      onChange={() => toggleItem(setSelectedYears, year)}
                    />
                    {year}
                  </label>
                </li>
              ))}
            </ul>
          </section>

        </div>

        <div className={styles.panelFooter}>
          <button type="button" className={styles.resetButton} onClick={handleReset}>
            {t("reset")}
          </button>
          <button type="button" className={styles.applyButton} onClick={handleApply}>
            {t("apply")}
          </button>
        </div>
      </aside>
    </>
  );
}
