import styles from "./AProposPage.module.css";

const artistText = {
  name: "Sylvaine",
  intro: "Sylvaine est une artiste peintre basée à Montréal.",
  body: "Son travail explore la lumière, la perception et la mémoire du paysage à travers la peinture à l'huile et le dessin.",
};

export const metadata = {
  title: "À propos | Sylvaine",
  description: "À propos de Sylvaine, artiste peintre basée à Montréal.",
};

export default function AProposPage() {
  return (
    <main className={styles.page}>
      <section className={`${styles.section} ${styles.textOnlySection}`}>
        <div className={styles.textOnlyInner}>
          <p className={styles.eyebrow}>À propos</p>
          <h1 className={styles.title}>{artistText.name}</h1>
          <p className={styles.lead}>{artistText.intro}</p>
          <p className={styles.bodyText}>{artistText.body}</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.imageSection}`}>
        <div className={styles.imageInner}>
          <div className={styles.imageWrap}>
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80"
              alt="Atelier avec peinture abstraite"
              className={styles.image}
            />
          </div>

          <div className={styles.imageTextBlock}>
            <p className={styles.eyebrow}>Portrait d&apos;artiste</p>
            <h2 className={styles.title}>{artistText.name}</h2>
            <p className={styles.lead}>{artistText.intro}</p>
            <p className={styles.bodyText}>{artistText.body}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
