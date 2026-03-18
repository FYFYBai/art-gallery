"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Header.module.css";
import { languageOptions, navItems, rotatingTerms } from "./headerData";
import { CartIcon, GlobeIcon, SearchIcon, UserIcon } from "./icons";

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchTermIndex, setSearchTermIndex] = useState(0);

  const activeItem = useMemo(() => {
    return navItems.find((item) => item.label === activeDropdown) || null;
  }, [activeDropdown]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSearchTermIndex((prev) => (prev + 1) % rotatingTerms.length);
    }, 2200);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const closeMenus = () => {
      setLanguageOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener("click", closeMenus);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("click", closeMenus);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLanguageToggle = (event) => {
    event.stopPropagation();
    setLanguageOpen((prev) => !prev);
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const isOverlayVisible = Boolean(activeDropdown);

  return (
    <>
      <header
        className={styles.siteHeader}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className={styles.headerShell}>
          <div className={styles.headerLeft}>
            <a href="/" className={styles.logoLink} aria-label="Go to homepage">
              LOGO
            </a>

            <nav className={styles.mainNav} aria-label="Main navigation">
              <ul className={styles.navList}>
                {navItems.map((item) => {
                  const hasDropdown = Boolean(item.columns);

                  return (
                    <li
                      key={item.label}
                      className={`${styles.navItem} ${
                        hasDropdown ? styles.hasDropdown : ""
                      }`}
                      onMouseEnter={() =>
                        hasDropdown && setActiveDropdown(item.label)
                      }
                    >
                      <a href={item.link} className={styles.navLink}>
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchBar} aria-label="Search">
              <span className={styles.searchIconWrap}>
                <SearchIcon className={styles.headerIconSvg} />
              </span>

              <div className={styles.searchPlaceholder}>
                <span className={styles.searchStaticText}>Search for </span>
                <span className={styles.rotatingWordViewport}>
                  <span
                    className={styles.rotatingWordTrack}
                    style={{
                      transform: `translateY(-${searchTermIndex * 1.5}em)`,
                    }}
                  >
                    {rotatingTerms.map((term) => (
                      <span key={term} className={styles.rotatingWord}>
                        {term}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            </div>

            <div className={styles.headerActions}>
              <div
                className={styles.languageMenuWrap}
                onClick={stopPropagation}
              >
                <button
                  type="button"
                  className={`${styles.iconButton} ${
                    languageOpen ? styles.isActive : ""
                  }`}
                  aria-label="Language options"
                  aria-expanded={languageOpen}
                  onClick={handleLanguageToggle}
                >
                  <GlobeIcon className={styles.headerIconSvg} />
                </button>

                {languageOpen && (
                  <div className={styles.languageDropdown}>
                    {languageOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={styles.languageOption}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={styles.iconButton}
                aria-label="Account"
              >
                <UserIcon className={styles.headerIconSvg} />
              </button>

              <button
                type="button"
                className={styles.iconButton}
                aria-label="Cart"
              >
                <CartIcon className={styles.headerIconSvg} />
              </button>
            </div>
          </div>
        </div>

        {activeItem && (
          <div
            className={styles.globalDropdown}
            onMouseEnter={() => setActiveDropdown(activeItem.label)}
          >
            <div className={styles.globalDropdownInner}>
              <div className={styles.dropdownColumns}>
                {activeItem.columns.map((column) => (
                  <div key={column.title} className={styles.dropdownColumn}>
                    <p className={styles.columnTitle}>{column.title}</p>

                    <ul className={styles.columnList}>
                      {column.items.map((subItem) => (
                        <li key={subItem}>
                          <a href="#" className={styles.dropdownItemLink}>
                            {subItem}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <aside className={styles.dropdownPromo}>
                <div className={styles.promoImagePlaceholder}>Future Image</div>
                <p className={styles.promoEyebrow}>
                  {activeItem.promo.eyebrow}
                </p>
                <h3 className={styles.promoTitle}>{activeItem.promo.title}</h3>
                <p className={styles.promoDescription}>
                  {activeItem.promo.description}
                </p>
                <a href="#" className={styles.promoCta}>
                  {activeItem.promo.cta}
                </a>
              </aside>
            </div>
          </div>
        )}
      </header>

      <div
        className={`${styles.pageOverlay} ${
          isOverlayVisible ? styles.isVisible : ""
        }`}
      />
    </>
  );
}
