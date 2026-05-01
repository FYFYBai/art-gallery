"use client";

import Link from "next/link";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTermIndex, setSearchTermIndex] = useState(0);
  const [previousSearchTermIndex, setPreviousSearchTermIndex] = useState(null);
  const [searchTermAnimating, setSearchTermAnimating] = useState(false);
  const closeDropdownTimerRef = useRef(null);
  const hideDropdownTimerRef = useRef(null);
  const searchTermIndexRef = useRef(0);
  const searchAnimationTimerRef = useRef(null);

  const activeItem = useMemo(() => {
    return navItems.find((item) => item.label === visibleDropdown) || null;
  }, [visibleDropdown]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const previousIndex = searchTermIndexRef.current;
      const nextIndex = (previousIndex + 1) % rotatingTerms.length;

      if (searchAnimationTimerRef.current) {
        clearTimeout(searchAnimationTimerRef.current);
      }

      setPreviousSearchTermIndex(previousIndex);
      searchTermIndexRef.current = nextIndex;
      setSearchTermIndex(nextIndex);
      setSearchTermAnimating(true);

      searchAnimationTimerRef.current = setTimeout(() => {
        setSearchTermAnimating(false);
        setPreviousSearchTermIndex(null);
        searchAnimationTimerRef.current = null;
      }, 360);
    }, 2200);

    return () => {
      clearInterval(intervalId);

      if (searchAnimationTimerRef.current) {
        clearTimeout(searchAnimationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const closeMenus = () => {
      setLanguageOpen(false);
      setAccountOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setAccountOpen(false);
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
    setAccountOpen(false);
  };

  const handleAccountToggle = (event) => {
    event.stopPropagation();
    setAccountOpen((prev) => !prev);
    setLanguageOpen(false);
  };

  const closeAccountModal = () => {
    setAccountOpen(false);
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
  const searchTerm = rotatingTerms[searchTermIndex];
  const previousSearchTerm =
    previousSearchTermIndex === null
      ? null
      : rotatingTerms[previousSearchTermIndex];
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
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="Go to homepage"
          >
            SYLVAINE ART
          </Link>

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
                      onMouseEnter={() =>
                        hasDropdown && openDropdown(item.label)
                      }
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

              <div className={styles.searchInputWrap}>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder=""
                  className={styles.searchInput}
                />

                {!searchQuery && (
                  <span className={styles.searchPlaceholder}>
                    <span className={styles.searchPlaceholderPrefix}>
                      Search for&nbsp;
                    </span>
                    <span className={styles.searchTermSlot}>
                      {searchTermAnimating && previousSearchTerm && (
                        <span className={styles.searchTermExit}>
                          {previousSearchTerm}
                        </span>
                      )}
                      <span
                        key={searchTermIndex}
                        className={
                          searchTermAnimating
                            ? styles.searchTermEnter
                            : styles.searchTermCurrent
                        }
                      >
                        {searchTerm}
                      </span>
                    </span>
                  </span>
                )}
              </div>

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

              <div className={styles.accountMenuWrap}>
                <button
                  type="button"
                  className={`${styles.iconButton} ${
                    accountOpen ? styles.isActive : ""
                  }`}
                  aria-label="Account"
                  aria-expanded={accountOpen}
                  onClick={handleAccountToggle}
                >
                  <UserIcon className={styles.headerIconSvg} />
                </button>
              </div>

              <Link href="/cart" className={styles.iconButton} aria-label="Cart">
                <CartIcon className={styles.headerIconSvg} />
              </Link>
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
                        <li key={subItem.slug}>
                          <Link
                            href={`/artworks?type=${subItem.slug}`}
                            className={styles.dropdownItemLink}
                            onClick={hideDropdown}
                          >
                            {subItem.label}
                          </Link>
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
                <a href={activeItem.promo.link} className={styles.promoCta}>
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

      {accountOpen && (
        <div
          className={styles.accountModalOverlay}
          role="presentation"
          onClick={closeAccountModal}
        >
          <div
            className={styles.accountModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-login-title"
            onClick={stopPropagation}
          >
            <button
              type="button"
              className={styles.accountModalClose}
              aria-label="Close account login"
              onClick={closeAccountModal}
            >
              ×
            </button>

            <div className={styles.accountHeader}>
              <p className={styles.accountEyebrow}>Espace privé</p>
              <h2 id="account-login-title" className={styles.accountTitle}>
                Connexion
              </h2>
              <p className={styles.accountText}>
                Accédez à vos favoris, demandes et sélections privées.
              </p>
            </div>

            <form className={styles.loginForm}>
              <label className={styles.loginLabel} htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className={styles.loginInput}
                placeholder="nom@example.com"
              />

              <label className={styles.loginLabel} htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className={styles.loginInput}
                placeholder="Your password"
              />

              <div className={styles.accountLinksRow}>
                <a href="#" className={styles.accountTextLink}>
                  Forgot password?
                </a>
                <a href="#" className={styles.accountTextLink}>
                  Register account
                </a>
              </div>

              <button type="submit" className={styles.loginButton}>
                Login
              </button>
            </form>

            <div className={styles.socialLoginBlock}>
              <p className={styles.socialDivider}>Or continue with</p>

              <div className={styles.socialButtons}>
                <button type="button" className={styles.socialButton}>
                  Google
                </button>
                <button type="button" className={styles.socialButton}>
                  Facebook
                </button>
                <button type="button" className={styles.socialButton}>
                  Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
