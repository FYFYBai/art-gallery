"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Header.module.css";
import { languageOptions, navItems, rotatingTerms } from "./headerData";
import {
  ArrowRightIcon,
  CartIcon,
  GlobeIcon,
  SearchIcon,
  UserIcon,
} from "./icons";

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTermIndex, setSearchTermIndex] = useState(0);
  const closeDropdownTimerRef = useRef(null);
  const hideDropdownTimerRef = useRef(null);

  const activeItem = useMemo(() => {
    return navItems.find((item) => item.label === visibleDropdown) || null;
  }, [visibleDropdown]);

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
        setVisibleDropdown(null);
        setIsDropdownClosing(false);
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

  const clearDropdownCloseTimer = () => {
    if (closeDropdownTimerRef.current) {
      clearTimeout(closeDropdownTimerRef.current);
      closeDropdownTimerRef.current = null;
    }
  };

  const clearDropdownHideTimer = () => {
    if (hideDropdownTimerRef.current) {
      clearTimeout(hideDropdownTimerRef.current);
      hideDropdownTimerRef.current = null;
    }
  };

  const hideDropdown = () => {
    clearDropdownCloseTimer();
    clearDropdownHideTimer();
    setActiveDropdown(null);
    setIsDropdownClosing(true);

    hideDropdownTimerRef.current = setTimeout(() => {
      setVisibleDropdown(null);
      setIsDropdownClosing(false);
      hideDropdownTimerRef.current = null;
    }, 180);
  };

  const scheduleDropdownClose = () => {
    clearDropdownCloseTimer();

    closeDropdownTimerRef.current = setTimeout(() => {
      hideDropdown();
    }, 120);
  };

  const openDropdown = (label) => {
    clearDropdownCloseTimer();
    clearDropdownHideTimer();
    setIsDropdownClosing(false);
    setActiveDropdown(label);
    setVisibleDropdown(label);
  };

  const trimmedSearchQuery = searchQuery.trim();
  const searchPlaceholder = `Search for ${rotatingTerms[searchTermIndex]}`;
  const isOverlayVisible = Boolean(activeDropdown);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!trimmedSearchQuery) {
      return;
    }

    // Placeholder for future search-page routing.
    window.location.hash = `search=${encodeURIComponent(trimmedSearchQuery)}`;
  };

  useEffect(() => {
    return () => {
      clearDropdownCloseTimer();
      clearDropdownHideTimer();
    };
  }, []);

  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerShell}>
          <a href="/" className={styles.logoLink} aria-label="Go to homepage">
            LOGO
          </a>

          <div className={styles.headerRight}>
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
                      onMouseEnter={() => hasDropdown && openDropdown(item.label)}
                      onMouseLeave={() =>
                        hasDropdown && activeDropdown === item.label
                          ? scheduleDropdownClose()
                          : undefined
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

            <form
              className={styles.searchBar}
              aria-label="Search"
              onSubmit={handleSearchSubmit}
            >
              <span className={styles.searchIconWrap}>
                <SearchIcon className={styles.headerIconSvg} />
              </span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className={styles.searchInput}
              />

              {trimmedSearchQuery && (
                <button
                  type="button"
                  className={styles.searchClearButton}
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                >
                  <span className={styles.searchClearIcon}>×</span>
                </button>
              )}

              <button
                type="submit"
                className={`${styles.searchSubmitButton} ${
                  trimmedSearchQuery ? styles.searchSubmitVisible : ""
                }`}
                aria-label="Submit search"
                tabIndex={trimmedSearchQuery ? 0 : -1}
              >
                <ArrowRightIcon className={styles.searchSubmitIcon} />
              </button>
            </form>

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
            className={`${styles.globalDropdown} ${
              isDropdownClosing ? styles.isClosing : styles.isOpen
            }`}
            onMouseEnter={() => openDropdown(activeItem.label)}
            onMouseLeave={scheduleDropdownClose}
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
