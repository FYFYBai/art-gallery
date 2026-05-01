"use client";

import { useState } from "react";
import styles from "./FilterPanel.module.css";

const ARTWORK_TYPES = [
  "Oil Painting",
  "Watercolor",
  "Drawing",
  "Charcoal",
];

const MEDIUMS = [
  "Canvas",
  "Paper",
  "Wood Panel",
  "Mixed Media",
];

const YEARS = [2024, 2025, 2026];

export default function FilterPanel({ isOpen, onClose, onApply }) {
  const [selectedTypes, setSelectedTypes]   = useState([]);
  const [selectedMediums, setSelectedMediums] = useState([]);
  const [maxPrice, setMaxPrice]             = useState(5000);
  const [selectedYears, setSelectedYears]   = useState([]);

  const toggleItem = (list, setList, value) => {
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
      {/* backdrop */}
      {isOpen && (
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      )}

      {/* panel */}
      <aside
        className={`${styles.panel} ${isOpen ? styles.isOpen : ""}`}
        aria-label="Filter artworks"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Filters</h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close filters"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.panelBody}>

          {/* Artwork Type */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Artwork Type</h3>
            <ul className={styles.checkList}>
              {ARTWORK_TYPES.map((type) => (
                <li key={type}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleItem(selectedTypes, setSelectedTypes, type)}
                    />
                    {type}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* Medium */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Medium</h3>
            <ul className={styles.checkList}>
              {MEDIUMS.map((medium) => (
                <li key={medium}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedMediums.includes(medium)}
                      onChange={() => toggleItem(selectedMediums, setSelectedMediums, medium)}
                    />
                    {medium}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* Price Range */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Price Range</h3>
            <div className={styles.sliderWrap}>
              <input
                type="range"
                min={0}
                max={10000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className={styles.slider}
                aria-label="Maximum price"
              />
              <div className={styles.sliderLabels}>
                <span>CA$0</span>
                <span>
                  {maxPrice === 10000
                    ? "CA$10,000+"
                    : `Up to CA$${maxPrice.toLocaleString("en-CA")}`}
                </span>
              </div>
            </div>
          </section>

          {/* Year */}
          <section className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Year</h3>
            <ul className={styles.checkList}>
              {YEARS.map((year) => (
                <li key={year}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedYears.includes(year)}
                      onChange={() => toggleItem(selectedYears, setSelectedYears, year)}
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
            Reset
          </button>
          <button type="button" className={styles.applyButton} onClick={handleApply}>
            Apply
          </button>
        </div>
      </aside>
    </>
  );
}
