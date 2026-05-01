import styles from "./DisplaySample.module.css";

const sampleItems = [
  {
    id: 1,
    title: "Séries",
    description:
      "Explorer les variations d'un même motif à travers le temps et la lumière.",
    action: "DÉCOUVRIR",
    image: "/images/display-sample/display1.png",
    alt: "Peinture texturée bleue et blanche avec voilier",
  },
  {
    id: 2,
    title: "Œuvres",
    description: "Découvrir l'ensemble des peintures disponibles.",
    action: "DÉCOUVRIR",
    image: "/images/display-sample/display2.png",
    alt: "Détail d'une peinture texturée blanche et bleue",
  },
  {
    id: 3,
    title: "Processus",
    description:
      "Entre geste, matière et mémoire, la peinture se construit lentement.",
    action: "DÉCOUVRIR",
    image: "/images/display-sample/display3.png",
    alt: "Geste de peinture bleue sur surface blanche texturée",
  },
  {
    id: 4,
    title: "Dans l'espace",
    description:
      "Imaginer l'œuvre dans un intérieur, et la relation qu'elle crée avec le lieu.",
    action: "DÉCOUVRIR",
    image: "/images/display-sample/display4.png",
    alt: "Peinture bleue et blanche encadrée dans un intérieur",
  },
];

const sectionIntro = {
  heading: "Entrer dans l'univers de l'œuvre",
  subheading:
    "Explorer différentes manières de regarder, de ressentir et de s'approprier l'art.",
};

export default function DisplaySample() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{sectionIntro.heading}</h2>
        <p className={styles.subheading}>{sectionIntro.subheading}</p>

        <div className={styles.grid}>
          {sampleItems.map((item) => (
            <article key={item.id} className={styles.card}>
              <a href="#" className={styles.imageLink}>
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    className={styles.image}
                  />
                </div>
              </a>

              <div className={styles.textBlock}>
                <h3 className={styles.title}>{item.title}</h3>
                <span className={styles.cardDivider} aria-hidden="true" />
                <p className={styles.description}>{item.description}</p>
                <a href="#" className={styles.action}>
                  {item.action}
                  <span className={styles.actionArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
