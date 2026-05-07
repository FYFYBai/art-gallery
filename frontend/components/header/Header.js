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

function readStoredAuth() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getLocalizedHref(href, locale) {
  if (!href || href.startsWith("#") || /^https?:\/\//.test(href)) {
    return href;
  }

  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

function isStrongRegistrationPassword(password) {
  return (
    password.length > 10 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.passwordIcon}>
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.passwordIcon}>
      <path
        d="m3 3 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.2 5.4A10.6 10.6 0 0 1 12 5c6 0 9.5 7 9.5 7a18.2 18.2 0 0 1-2.9 3.7M6.2 6.9C3.8 8.7 2.5 12 2.5 12s3.5 7 9.5 7a9.7 9.7 0 0 0 4.3-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 10.4a2.8 2.8 0 0 0 3.4 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isForgotPasswordSubmitting, setIsForgotPasswordSubmitting] =
    useState(false);
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirmation, setRegisterPasswordConfirmation] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [currentUser, setCurrentUser] = useState(readStoredAuth); // { email, role, token }
  const loginSubmittingRef = useRef(false);
  const forgotPasswordSubmittingRef = useRef(false);
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
  const resendSubmittingRef = useRef(false);
  const previousPathnameRef = useRef(pathname);

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

  useEffect(() => {
    // Sync auth state when another tab or the profile page clears localStorage
    const onStorage = (e) => {
      if (e.key === "auth") {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setCurrentUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveAuth = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("auth", JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  };

  const clearAuth = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("auth");
    } catch {
      // ignore storage errors
    }
  };

  const handleLanguageSelect = (code) => {
    // Persist the chosen locale in a cookie so the middleware uses it
    // for any path that doesn't already have a locale prefix
    // eslint-disable-next-line react-hooks/immutability
    window.document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;

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
        resetAccountFormState();
      }

      return nextOpen;
    });
    setLanguageOpen(false);
  };

  const closeAccountModal = () => {
    setAccountOpen(false);
    setAccountMode("login");
    setAccountToast(null);
    resetAccountFormState();
  };

  const showAccountToast = (nextToast) => {
    if (accountToastTimerRef.current) {
      clearTimeout(accountToastTimerRef.current);
    }

    setAccountToast(nextToast);

    if (!nextToast?.persistent) {
      accountToastTimerRef.current = setTimeout(() => {
        setAccountToast(null);
        accountToastTimerRef.current = null;
      }, 3600);
    }
  };

  const resetAccountFormState = () => {
    setRegisterPassword("");
    setRegisterPasswordConfirmation("");
    setShowPassword(false);
    setShowPasswordConfirmation(false);
    setVerificationEmail("");
    setResendCooldown(0);
    setIsResendingVerification(false);
    resendSubmittingRef.current = false;
    forgotPasswordSubmittingRef.current = false;
  };

  const switchAccountMode = (nextMode) => {
    setAccountMode(nextMode);
    setAccountToast(null);
    resetAccountFormState();
  };

  const handleResendVerificationEmail = async () => {
    if (!verificationEmail || resendCooldown > 0 || resendSubmittingRef.current) {
      return;
    }

    resendSubmittingRef.current = true;
    setIsResendingVerification(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/resend-verification-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: verificationEmail, locale }),
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        showAccountToast({
          type: "error",
          message:
            result?.errors?.[0] ||
            result?.message ||
            t("account.resendVerificationFailed"),
        });
        return;
      }

      setResendCooldown(60);
      showAccountToast({
        type: "success",
        message: t("account.verificationEmailResent"),
        persistent: true,
        resendVerification: true,
      });
    } catch {
      showAccountToast({
        type: "error",
        message: t("account.resendVerificationFailed"),
      });
    } finally {
      resendSubmittingRef.current = false;
      setIsResendingVerification(false);
    }
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();

    if (accountMode === "forgot") {
      if (forgotPasswordSubmittingRef.current) return;

      const formElement = event.currentTarget;
      const formData = new FormData(formElement);
      const email = String(formData.get("email") || "").trim();

      if (!email) {
        showAccountToast({ type: "error", message: t("account.emailRequired") });
        return;
      }

      forgotPasswordSubmittingRef.current = true;
      setIsForgotPasswordSubmitting(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          showAccountToast({
            type: "error",
            message:
              result?.errors?.[0] ||
              result?.message ||
              t("account.passwordResetRequestFailed"),
          });
          return;
        }

        formElement.reset();
        showAccountToast({
          type: "success",
          message: t("account.passwordResetEmailSent"),
          persistent: true,
        });
      } catch {
        showAccountToast({
          type: "error",
          message: t("account.passwordResetRequestFailed"),
        });
      } finally {
        forgotPasswordSubmittingRef.current = false;
        setIsForgotPasswordSubmitting(false);
      }
      return;
    }

    if (accountMode === "login") {
      if (loginSubmittingRef.current) return;

      const formElement = event.currentTarget;
      const formData = new FormData(formElement);
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");

      if (!email || !password) {
        showAccountToast({ type: "error", message: t("account.loginMissingFields") });
        return;
      }

      loginSubmittingRef.current = true;
      setIsLoginSubmitting(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            response.status === 401
              ? t("account.invalidCredentials")
              : response.status === 403
                ? result?.message === "Email verification required"
                  ? t("account.emailVerificationRequired")
                  : t("account.accountDisabled")
                : result?.message || t("account.loginFailed");
          showAccountToast({ type: "error", message });
          return;
        }

        saveAuth({ email: result.email, role: result.role, token: result.token });
        formElement.reset();
        closeAccountModal();
      } catch {
        showAccountToast({ type: "error", message: t("account.loginRequestFailed") });
      } finally {
        loginSubmittingRef.current = false;
        setIsLoginSubmitting(false);
      }
      return;
    }

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
        message: t("account.fillAllFields"),
      });
      return;
    }

    if (!isStrongRegistrationPassword(password)) {
      showAccountToast({
        type: "error",
        message: t("account.passwordRequirements"),
      });
      return;
    }

    if (password !== passwordConfirmation) {
      showAccountToast({
        type: "error",
        message: t("account.passwordMismatch"),
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
          locale,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const fallbackMessage = t("account.registrationFailed");
        const apiMessage = result?.errors?.[0] || result?.message;

        showAccountToast({
          type: "error",
          message: apiMessage || fallbackMessage,
        });
        return;
      }

      formElement.reset();
      setRegisterPassword("");
      setRegisterPasswordConfirmation("");
      setShowPassword(false);
      setShowPasswordConfirmation(false);
      setVerificationEmail(email);
      setResendCooldown(60);
      showAccountToast({
        type: "success",
        message: t("account.registrationSucceeded"),
        persistent: true,
        resendVerification: true,
      });
    } catch {
      showAccountToast({
        type: "error",
        message: t("account.registrationInterrupted"),
      });
    } finally {
      registerSubmittingRef.current = false;
      setIsRegisterSubmitting(false);
    }
  };

  const handleLogout = async () => {
    const token = currentUser?.token;
    clearAuth();
    setAccountOpen(false);

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // best-effort — token is already cleared locally
      }
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
  const isRegisterMode = accountMode === "register";
  const isRegisterPasswordInvalid =
    isRegisterMode &&
    registerPassword.length > 0 &&
    !isStrongRegistrationPassword(registerPassword);
  const isRegisterConfirmationInvalid =
    isRegisterMode &&
    registerPasswordConfirmation.length > 0 &&
    registerPassword !== registerPasswordConfirmation;

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

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const intervalId = setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [resendCooldown]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    setAccountToast(null);
    setRegisterPassword("");
    setRegisterPasswordConfirmation("");
    setShowPassword(false);
    setShowPasswordConfirmation(false);
    setVerificationEmail("");
    setResendCooldown(0);
    setIsResendingVerification(false);
    resendSubmittingRef.current = false;
    forgotPasswordSubmittingRef.current = false;
  }, [pathname]);

  return (
    <>
      <header
        className={`${styles.siteHeader} ${accountOpen ? styles.accountModalActive : ""}`}
      >
        <div className={styles.headerShell}>
          <Link
            href={getLocalizedHref("/", locale)}
            className={styles.logoLink}
            aria-label={t("header.logoLabel")}
          >
            SYLVAINE ART
          </Link>

          <div className={styles.headerRight}>
            <nav className={styles.mainNav} aria-label={t("header.mainNav")}>
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
                      <Link
                        href={getLocalizedHref(item.link, locale)}
                        className={styles.navLink}
                      >
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
                      {t("search.searchFor")}{" "}
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
                  aria-label={t("search.clear")}
                  onClick={() => setSearchQuery("")}
                >
                  <span className={styles.searchClearIcon}>×</span>
                </button>
              )}

              <button
                type="submit"
                className={`${styles.searchSubmitButton} ${trimmedSearchQuery ? styles.searchSubmitVisible : ""}`}
                aria-label={t("search.submit")}
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
                {currentUser ? (
                  <Link
                    href={`/${locale}/profile`}
                    className={`${styles.iconButton} ${styles.isActive}`}
                    aria-label="Go to profile"
                    title={currentUser.email}
                  >
                    <UserIcon className={`${styles.headerIconSvg} ${styles.loggedInIcon}`} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`${styles.iconButton} ${accountOpen ? styles.isActive : ""}`}
                    aria-label={t("header.accountLabel")}
                    aria-expanded={accountOpen}
                    onClick={handleAccountToggle}
                  >
                    <UserIcon className={styles.headerIconSvg} />
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link
                href={getLocalizedHref("/cart", locale)}
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
                            href={getLocalizedHref(
                              `/artworks?type=${subItem.slug}`,
                              locale,
                            )}
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
                <div className={styles.promoImagePlaceholder}>
                  {t("promo.futureImage")}
                </div>
                <p className={styles.promoEyebrow}>
                  {activeItem.promo.eyebrow}
                </p>
                <h3 className={styles.promoTitle}>{activeItem.promo.title}</h3>
                <p className={styles.promoDescription}>
                  {activeItem.promo.description}
                </p>
                <Link
                  href={getLocalizedHref(activeItem.promo.link, locale)}
                  className={styles.promoCta}
                >
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
              aria-label={t("account.close")}
              onClick={closeAccountModal}
            >
              ×
            </button>

            <div className={styles.accountHeader}>
              <p className={styles.accountEyebrow}>{t("account.eyebrow")}</p>
              <h2 id="account-login-title" className={styles.accountTitle}>
                {accountMode === "login"
                  ? t("account.title")
                  : accountMode === "register"
                    ? t("account.createTitle")
                    : t("account.forgotTitle")}
              </h2>
              <p className={styles.accountText}>
                {accountMode === "forgot"
                  ? t("account.forgotDescription")
                  : t("account.description")}
              </p>
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

              {accountMode !== "forgot" && (
                <>
                  <label className={styles.loginLabel} htmlFor="login-password">
                    {t("account.passwordLabel")}
                  </label>
                  <div className={styles.passwordInputWrap}>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`${styles.loginInput} ${
                        isRegisterPasswordInvalid ? styles.loginInputError : ""
                      }`}
                      placeholder={t("account.passwordPlaceholder")}
                      value={isRegisterMode ? registerPassword : undefined}
                      onChange={
                        isRegisterMode
                          ? (event) => setRegisterPassword(event.target.value)
                          : undefined
                      }
                      aria-invalid={isRegisterPasswordInvalid}
                      aria-describedby={
                        isRegisterPasswordInvalid
                          ? "register-password-error"
                          : isRegisterMode
                            ? "register-password-hint"
                            : undefined
                      }
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      aria-label={
                        showPassword
                          ? t("account.hidePassword")
                          : t("account.showPassword")
                      }
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {accountMode === "register" && (
                    <p
                      id="register-password-hint"
                      className={styles.passwordHint}
                    >
                      {t("account.passwordRequirements")}
                    </p>
                  )}
                  {isRegisterPasswordInvalid && (
                    <p
                      id="register-password-error"
                      className={styles.fieldError}
                    >
                      {t("account.passwordInvalidInline")}
                    </p>
                  )}
                </>
              )}

              {accountMode === "register" && (
                <>
                  <label
                    className={styles.loginLabel}
                    htmlFor="register-password-confirmation"
                  >
                    {t("account.passwordConfirmationLabel")}
                  </label>
                  <div className={styles.passwordInputWrap}>
                    <input
                      id="register-password-confirmation"
                      name="passwordConfirmation"
                      type={showPasswordConfirmation ? "text" : "password"}
                      className={`${styles.loginInput} ${
                        isRegisterConfirmationInvalid
                          ? styles.loginInputError
                          : ""
                      }`}
                      placeholder={t(
                        "account.passwordConfirmationPlaceholder",
                      )}
                      value={registerPasswordConfirmation}
                      onChange={(event) =>
                        setRegisterPasswordConfirmation(event.target.value)
                      }
                      aria-invalid={isRegisterConfirmationInvalid}
                      aria-describedby={
                        isRegisterConfirmationInvalid
                          ? "register-password-confirmation-error"
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      aria-label={
                        showPasswordConfirmation
                          ? t("account.hidePasswordConfirmation")
                          : t("account.showPasswordConfirmation")
                      }
                      onClick={() =>
                        setShowPasswordConfirmation((current) => !current)
                      }
                    >
                      {showPasswordConfirmation ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {isRegisterConfirmationInvalid && (
                    <p
                      id="register-password-confirmation-error"
                      className={styles.fieldError}
                    >
                      {t("account.passwordConfirmationMismatchInline")}
                    </p>
                  )}
                </>
              )}

              {accountMode === "login" ? (
                <div className={styles.accountLinksRow}>
                  <button
                    type="button"
                    className={styles.accountTextLink}
                    onClick={() => switchAccountMode("forgot")}
                  >
                    {t("account.forgotPassword")}
                  </button>
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
                    {t("account.backToLogin")}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={styles.loginButton}
                disabled={
                  (accountMode === "register" && isRegisterSubmitting) ||
                  (accountMode === "login" && isLoginSubmitting) ||
                  (accountMode === "forgot" && isForgotPasswordSubmitting)
                }
              >
                {accountMode === "login"
                  ? isLoginSubmitting
                    ? "Logging in..."
                    : t("account.loginButton")
                  : accountMode === "forgot"
                    ? isForgotPasswordSubmitting
                      ? t("account.sendingReset")
                      : t("account.sendResetLink")
                  : isRegisterSubmitting
                    ? t("account.creating")
                    : t("account.createButton")}
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
                <p className={styles.accountToastMessage}>
                  {accountToast.message}
                </p>
                {accountToast.resendVerification && (
                  <button
                    type="button"
                    className={styles.accountToastAction}
                    onClick={handleResendVerificationEmail}
                    disabled={
                      resendCooldown > 0 ||
                      isResendingVerification ||
                      !verificationEmail
                    }
                  >
                    {resendCooldown > 0
                      ? t("account.resendVerificationCooldown").replace(
                          "{seconds}",
                          String(resendCooldown),
                        )
                      : isResendingVerification
                        ? t("account.resendingVerification")
                        : t("account.resendVerification")}
                  </button>
                )}
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
