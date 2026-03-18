import styles from "./CuratorFavoritesSection.module.css";

const curatorItems = [
  {
    title: "Best Of 2026",
    image: "/images/curator-1.jpg",
  },
  {
    title: "Arresting Abstracts",
    image: "/images/curator-2.jpg",
  },
  {
    title: "Featured Sculptures",
    image: "/images/curator-3.jpg",
  },
  {
    title: "Powerful Portraits",
    image: "/images/curator-4.jpg",
  },
  {
    title: "Vibrant Landscapes",
    image: "/images/curator-5.jpg",
  },
];

export default function CuratorFavoritesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Curator Favorites</h2>

          <div className={styles.controls} aria-hidden="true">
            <button
              type="button"
              className={`${styles.arrowButton} ${styles.arrowMuted}`}
            >
              <span className={styles.arrowLeft} />
            </button>

            <button type="button" className={styles.arrowButton}>
              <span className={styles.arrowRight} />
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {curatorItems.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.image}
                />
              </div>

              <h3 className={styles.cardTitle}>{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
