import styles from "./WhyShopSection.module.css";

const cards = [
  {
    icon: "◔",
    title: "Global Selection",
    text: "Explore a worldwide selection of original artwork for sale by thousands of artists.",
  },
  {
    icon: "☺",
    title: "Satisfaction Guaranteed",
    text: "Our 14-day satisfaction guarantee allows you to buy with confidence.",
  },
  {
    icon: "☆",
    title: "Thousands of 5-Star Reviews",
    text: "We deliver world-class customer service to all of our art buyers.",
  },
  {
    icon: "↗",
    title: "Support Emerging Artists",
    text: "We pay our artists more on every sale than other galleries.",
  },
];

export default function WhyShopSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Why Shop On Saatchi Art?</h2>

          <p className={styles.description}>
            Saatchi Art is the best place to buy artwork online with confidence.
            Discover{" "}
            <a href="#" className={styles.link}>
              original paintings
            </a>
            ,{" "}
            <a href="#" className={styles.link}>
              fine art photography
            </a>
            ,{" "}
            <a href="#" className={styles.link}>
              sculpture
            </a>
            , and more from the world&apos;s largest selection of original art.
          </p>
        </header>

        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <div className={styles.icon}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
