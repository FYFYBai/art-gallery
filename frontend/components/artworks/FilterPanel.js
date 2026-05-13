"use client";

import { useState } from "react";
import { useTranslations } from "../../i18n/IntlContext";
import styles from "./FilterPanel.module.css";

const ARTWORK_TYPES = [
  { value: "oil-paintings", labelKey: "oilPaintings" },
  { value: "watercolors", labelKey: "watercolors" },
  { value: "drawings", labelKey: "drawings" },
  { value: "charcoal", labelKey: "charcoal" },
];
const SERIES_KEYS = ["impressionism", "abstraction", "landscapes", "portraits"];
const YEARS = [2024, 2025, 2026];
const MIN_PRICE = 0;
const MAX_PRICE = 5000;
const PRICE_STEP = 50;

function formatCad(value) {
  return `CA$${value.toLocaleString("en-CA")}`;
}

export default function FilterPanel({ isOpen, filters, onClose, onApply }) {
  const t = useTranslations("filterPanel");
  const tTypes = useTranslations("artworkTypes");
  const tSeries = useTranslations("series");

  const [selectedTypes, setSelectedTypes] = useState(filters?.selectedTypes ?? []);
  const [selectedSeries, setSelectedSeries] = useState(filters?.selectedSeries ?? []);
  const [minPrice, setMinPrice] = useState(filters?.priceRange?.[0] ?? MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(filters?.priceRange?.[1] ?? MAX_PRICE);
  const [selectedYears, setSelectedYears] = useState(filters?.selectedYears ?? []);
  const [hideSold, setHideSold] = useState(filters?.hideSold ?? false);

  const toggleItem = (setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const updateMinPrice = (value) => {
    const nextValue = Math.min(Number(value), maxPrice - PRICE_STEP);
    setMinPrice(Math.max(MIN_PRICE, nextValue));
  };

  const updateMaxPrice = (value) => {
    const nextValue = Math.max(Number(value), minPrice + PRICE_STEP);
    setMaxPrice(Math.min(MAX_PRICE, nextValue));
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedSeries([]);
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setSelectedYears([]);
    setHideSold(false);
  };

  const handleApply = () => {
    onApply({
      selectedTypes,
      selectedSeries,
      priceRange: [minPrice, maxPrice],
      selectedYears,
      hideSold,
    });
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
            aria-label={t("close")}
            onClick={onClose}
          >
            x
          </button>
        </div>

        <div className={styles.panelBody}>
          <section className={styles.filterSection}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={hideSold}
                onChange={(event) => setHideSold(event.target.checked)}
              />
              {t("hideSoldArtworks")}
            </label>
          </section>

          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>{t("artworkType")}</h3>
            <ul className={styles.checkList}>
              {ARTWORK_TYPES.map((type) => (
                <li key={type.value}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleItem(setSelectedTypes, type.value)}
                    />
                    {tTypes(type.labelKey)}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>{t("series")}</h3>
            <ul className={styles.checkList}>
              {SERIES_KEYS.map((key) => (
                <li key={key}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedSeries.includes(key)}
                      onChange={() => toggleItem(setSelectedSeries, key)}
                    />
                    {tSeries(key)}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>{t("priceRange")}</h3>
            <div className={styles.rangeWrap}>
              <div
                className={styles.rangeTrack}
                style={{
                  "--range-start": `${(minPrice / MAX_PRICE) * 100}%`,
                  "--range-end": `${(maxPrice / MAX_PRICE) * 100}%`,
                }}
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={minPrice}
                onChange={(event) => updateMinPrice(event.target.value)}
                className={styles.rangeInput}
                aria-label={t("minPrice")}
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={maxPrice}
                onChange={(event) => updateMaxPrice(event.target.value)}
                className={styles.rangeInput}
                aria-label={t("maxPrice")}
              />
            </div>
            <div className={styles.priceFields}>
              <label>
                {t("minPrice")}
                <input
                  type="number"
                  min={MIN_PRICE}
                  max={maxPrice - PRICE_STEP}
                  step={PRICE_STEP}
                  value={minPrice}
                  onChange={(event) => updateMinPrice(event.target.value)}
                />
              </label>
              <label>
                {t("maxPrice")}
                <input
                  type="number"
                  min={minPrice + PRICE_STEP}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={maxPrice}
                  onChange={(event) => updateMaxPrice(event.target.value)}
                />
              </label>
            </div>
            <div className={styles.sliderLabels}>
              <span>{formatCad(minPrice)}</span>
              <span>{formatCad(maxPrice)}</span>
            </div>
          </section>

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
