import styles from "./CuratedExperienceSection.module.css";

export default function CuratedExperienceSection() {
  return (
    <section className={styles.section}>
      <div className={styles.backgroundLayer} />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h2 className={styles.title}>Personalized, Curated Experience</h2>

        <p className={styles.description}>
          Discovering art you love should be easy and enjoyable. Our expert
          curators create weekly collections to simplify browsing and offer
          complimentary art advisory services, providing one-on-one guidance
          tailored to your taste, space, and budget.
        </p>

        <a href="#" className={styles.button}>
          CONNECT WITH AN ADVISOR
        </a>
      </div>
    </section>
  );
}
