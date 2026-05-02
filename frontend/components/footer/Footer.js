"use client";

import Link from "next/link";
import { useTranslations } from "../../i18n/IntlContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.subscribeBlock}>
            <h2 className={styles.subscribeTitle}>{t("subscribeTitle")}</h2>
            <p className={styles.subscribeText}>{t("subscribeText")}</p>

            <form className={styles.subscribeForm}>
              <label htmlFor="footer-email" className={styles.visuallyHidden}>
                {t("emailLabel")}
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className={styles.emailInput}
              />
              <button type="submit" className={styles.submitButton}>
                {t("subscribe")}
              </button>
            </form>
          </div>

          <nav className={styles.nav} aria-label={t("navLabel")}>
            <Link href="/artworks" className={styles.link}>{tNav("artworks")}</Link>
            <Link href="/artworks" className={styles.link}>{tNav("series")}</Link>
            <Link href="/a-propos" className={styles.link}>{tNav("about")}</Link>
            <a href="#" className={styles.link}>{tNav("exhibitions")}</a>
            <a href="#" className={styles.link}>{tNav("contact")}</a>
          </nav>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copy}>{t("copyright")}</p>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>{t("privacy")}</a>
            <a href="#" className={styles.legalLink}>{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
