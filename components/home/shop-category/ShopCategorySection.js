import styles from "./ShopCategorySection.module.css";

const categories = ["PAINTINGS", "PHOTOGRAPHY", "FINE ART PRINTS", "SCULPTURE"];

export default function ShopCategorySection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Shop by Category</h2>

        <div className={styles.buttonRow}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={styles.categoryButton}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
