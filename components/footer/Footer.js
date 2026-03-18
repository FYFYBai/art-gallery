import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <a href="/" className={styles.logo}>
              ART GALLERY
            </a>
            <p className={styles.tagline}>
              Discover original works, curated collections, and timeless pieces
              for your space.
            </p>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            <a href="#" className={styles.link}>
              Paintings
            </a>
            <a href="#" className={styles.link}>
              Drawings
            </a>
            <a href="#" className={styles.link}>
              Trade
            </a>
            <a href="#" className={styles.link}>
              Info
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
