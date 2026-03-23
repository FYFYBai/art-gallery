import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.subscribeBlock}>
            <h2 className={styles.subscribeTitle}>Stay close to the studio</h2>
            <p className={styles.subscribeText}>
              Receive occasional updates on new works, exhibitions, and quiet
              moments from the gallery.
            </p>

            <form className={styles.subscribeForm}>
              <label htmlFor="footer-email" className={styles.visuallyHidden}>
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email address"
                className={styles.emailInput}
              />
              <button type="submit" className={styles.submitButton}>
                Subscribe
              </button>
            </form>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            <a href="#" className={styles.link}>
              Œuvres
            </a>
            <a href="#" className={styles.link}>
              Séries
            </a>
            <a href="#" className={styles.link}>
              À propos
            </a>
            <a href="#" className={styles.link}>
              Expositions
            </a>
            <a href="#" className={styles.link}>
              Contact
            </a>
          </nav>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copy}>
            © 2026 Art Gallery. All rights reserved.
          </p>

          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>
              Privacy
            </a>
            <a href="#" className={styles.legalLink}>
              Terms
            </a>
            <a href="#" className={styles.legalLink}>
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
