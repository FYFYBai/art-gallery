"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "../../i18n/IntlContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { languageOptions, getNavItems } from "./headerData";
import {
  ArrowRightIcon,
  CartIcon,
  GlobeIcon,
  SearchIcon,
  UserIcon,
} from "./icons";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = getNavItems(t);
  const rotatingTerms = [
    t("search.artistName"),
    t("search.painting"),
    t("search.returnPolicy"),
  ];

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState("login");
  const [accountToast, setAccountToast] = useState(null);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTermIndex, setSearchTermIndex] = useState(0);
  const [previousSearchTermIndex, setPreviousSearchTermIndex] = useState(null);
  const [searchTermAnimating, setSearchTermAnimating] = useState(false);
  const closeDropdownTimerRef = useRef(null);
  const hideDropdownTimerRef = useRef(null);
  const searchTermIndexRef = useRef(0);
  const searchAnimationTimerRef = useRef(null);
  const accountToastTimerRef = useRef(null);
  const registerSubmittingRef = useRef(false);

  const activeItem = useMemo(() => {
    return navItems.find((item) => item.labelKey === visibleDropdown) || null;
  }, [visibleDropdown, navItems]);

  const rotatingTermsLength = rotatingTerms.length;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const previousIndex = searchTermIndexRef.current;
      const nextIndex = (previousIndex + 1) % rotatingTermsLength;

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
  }, [rotatingTermsLength]);

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

  const handleLanguageSelect = (code) => {
    // Replace the locale segment in the current path
    const segments = window.location.pathname.split("/");
    segments[1] = code; // segments[0] is "", segments[1] is the locale
    router.push(segments.join("/") || "/");
    setLanguageOpen(false);
  };

  const handleLanguageToggle = (event) => {
    event.stopPropagation();
    setLanguageOpen((prev) => !prev);
    setAccountOpen(false);
  };

  const handleAccountToggle = (event) => {
    event.stopPropagation();
    setAccountOpen((prev) => {
      const nextOpen = !prev;

      if (nextOpen) {
        setAccountMode("login");
        setAccountToast(null);
      }

      return nextOpen;
    });
    setLanguageOpen(false);
  };

  const closeAccountModal = () => {
    setAccountOpen(false);
    setAccountMode("login");
    setAccountToast(null);
  };

  const showAccountToast = (nextToast) => {
    if (accountToastTimerRef.current) {
      clearTimeout(accountToastTimerRef.current);
    }

    setAccountToast(nextToast);

    accountToastTimerRef.current = setTimeout(() => {
      setAccountToast(null);
      accountToastTimerRef.current = null;
    }, 3600);
  };

  const switchAccountMode = (nextMode) => {
    setAccountMode(nextMode);
    setAccountToast(null);
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();

    if (accountMode !== "register") {
      return;
    }

    if (registerSubmittingRef.current) {
      return;
    }

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const passwordConfirmation = String(
      formData.get("passwordConfirmation") || "",
    );

    if (!email || !password || !passwordConfirmation) {
      showAccountToast({
        type: "error",
        message: "Please fill in all registration fields.",
      });
      return;
    }

    if (password.length < 8) {
      showAccountToast({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    if (password !== passwordConfirmation) {
      showAccountToast({
        type: "error",
        message: "Passwords must match.",
      });
      return;
    }

    registerSubmittingRef.current = true;
    setIsRegisterSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          passwordConfirmation,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const fallbackMessage = "Registration failed. Please try again.";
        const apiMessage = result?.errors?.[0] || result?.message;
        const duplicateEmail = response.status === 409;

        showAccountToast({
          type: duplicateEmail ? "success" : "error",
          message: duplicateEmail
            ? "An account already exists for this email. If you just registered, it was created successfully."
            : apiMessage || fallbackMessage,
        });
        return;
      }

      formElement.reset();
      showAccountToast({
        type: "success",
        message: result?.message || "Registration succeeded.",
      });
    } catch {
      showAccountToast({
        type: "error",
        message:
          "Registration response was interrupted. If retry says the account already exists, the first request succeeded.",
      });
    } finally {
      registerSubmittingRef.current = false;
      setIsRegisterSubmitting(false);
    }
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

  const openDropdown = (labelKey) => {
    clearDropdownCloseTimer();
    clearDropdownHideTimer();
    setIsDropdownClosing(false);
    setActiveDropdown(labelKey);
    setVisibleDropdown(labelKey);
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
    if (!trimmedSearchQuery) return;
    window.location.hash = `search=${encodeURIComponent(trimmedSearchQuery)}`;
  };

  useEffect(() => {
    return () => {
      clearDropdownCloseTimer();
      clearDropdownHideTimer();

      if (accountToastTimerRef.current) {
        clearTimeout(accountToastTimerRef.current);
      }

      registerSubmittingRef.current = false;
    };
  }, []);

  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.headerShell}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label={t("header.logoLabel")}
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
                      key={item.labelKey}
                      className={`${styles.navItem} ${hasDropdown ? styles.hasDropdown : ""}`}
                      onMouseEnter={() =>
                        hasDropdown && openDropdown(item.labelKey)
                      }
                      onMouseLeave={() =>
                        hasDropdown && activeDropdown === item.labelKey
                          ? scheduleDropdownClose()
                          : undefined
                      }
                    >
                      <Link href={item.link} className={styles.navLink}>
                        {item.label}
                      </Link>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                className={`${styles.searchSubmitButton} ${trimmedSearchQuery ? styles.searchSubmitVisible : ""}`}
                aria-label="Submit search"
                tabIndex={trimmedSearchQuery ? 0 : -1}
              >
                <ArrowRightIcon className={styles.searchSubmitIcon} />
              </button>
            </form>

            <div className={styles.headerActions}>
              {/* Language switcher */}
              <div
                className={styles.languageMenuWrap}
                onClick={stopPropagation}
              >
                <button
                  type="button"
                  className={`${styles.iconButton} ${languageOpen ? styles.isActive : ""}`}
                  aria-label={t("header.languageLabel")}
                  aria-expanded={languageOpen}
                  onClick={handleLanguageToggle}
                >
                  <GlobeIcon className={styles.headerIconSvg} />
                </button>

                {languageOpen && (
                  <div className={styles.languageDropdown}>
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        className={`${styles.languageOption} ${locale === option.code ? styles.isSelected : ""}`}
                        onClick={() => handleLanguageSelect(option.code)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Account */}
              <div className={styles.accountMenuWrap}>
                <button
                  type="button"
                  className={`${styles.iconButton} ${accountOpen ? styles.isActive : ""}`}
                  aria-label={t("header.accountLabel")}
                  aria-expanded={accountOpen}
                  onClick={handleAccountToggle}
                >
                  <UserIcon className={styles.headerIconSvg} />
                </button>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className={styles.iconButton}
                aria-label={t("header.cartLabel")}
              >
                <CartIcon className={styles.headerIconSvg} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mega dropdown */}
        {activeItem && (
          <div
            className={`${styles.globalDropdown} ${isDropdownClosing ? styles.isClosing : styles.isOpen}`}
            onMouseEnter={() => openDropdown(activeItem.labelKey)}
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
                <Link href={activeItem.promo.link} className={styles.promoCta}>
                  {activeItem.promo.cta}
                </Link>
              </aside>
            </div>
          </div>
        )}
      </header>

      <div
        className={`${styles.pageOverlay} ${isOverlayVisible ? styles.isVisible : ""}`}
      />

      {/* Account modal */}
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
              <p className={styles.accountEyebrow}>{t("account.eyebrow")}</p>
              <h2 id="account-login-title" className={styles.accountTitle}>
                {accountMode === "login"
                  ? t("account.title")
                  : "Create account"}
              </h2>
              <p className={styles.accountText}>{t("account.description")}</p>
            </div>

            <form
              key={accountMode}
              className={styles.loginForm}
              onSubmit={handleAccountSubmit}
            >
              <label className={styles.loginLabel} htmlFor="login-email">
                {t("account.emailLabel")}
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                className={styles.loginInput}
                placeholder={t("account.emailPlaceholder")}
              />

              <label className={styles.loginLabel} htmlFor="login-password">
                {t("account.passwordLabel")}
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                className={styles.loginInput}
                placeholder={t("account.passwordPlaceholder")}
              />

              {accountMode === "register" && (
                <>
                  <label
                    className={styles.loginLabel}
                    htmlFor="register-password-confirmation"
                  >
                    Password confirmation
                  </label>
                  <input
                    id="register-password-confirmation"
                    name="passwordConfirmation"
                    type="password"
                    className={styles.loginInput}
                    placeholder="Confirm your password"
                  />
                </>
              )}

              {accountMode === "login" ? (
                <div className={styles.accountLinksRow}>
                  <a href="#" className={styles.accountTextLink}>
                    {t("account.forgotPassword")}
                  </a>
                  <button
                    type="button"
                    className={styles.accountTextLink}
                    onClick={() => switchAccountMode("register")}
                  >
                    {t("account.register")}
                  </button>
                </div>
              ) : (
                <div className={styles.accountLinksRow}>
                  <button
                    type="button"
                    className={styles.accountTextLink}
                    onClick={() => switchAccountMode("login")}
                  >
                    Back to login
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={styles.loginButton}
                disabled={accountMode === "register" && isRegisterSubmitting}
              >
                {accountMode === "login"
                  ? t("account.loginButton")
                  : isRegisterSubmitting
                    ? "Creating..."
                    : "Create account"}
              </button>
            </form>

            {accountToast && (
              <div
                className={`${styles.accountToast} ${
                  accountToast.type === "success"
                    ? styles.accountToastSuccess
                    : styles.accountToastError
                }`}
                role="status"
              >
                {accountToast.message}
              </div>
            )}

            <div className={styles.socialLoginBlock}>
              <p className={styles.socialDivider}>
                {t("account.orContinueWith")}
              </p>
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
