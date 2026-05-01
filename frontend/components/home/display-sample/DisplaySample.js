import styles from "./DisplaySample.module.css";

const sampleItems = [
  {
    id: 1,
    title: "Find Your Statement",
    action: "SEE NEW ARRIVALS",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80",
    alt: "Sample artwork 1",
  },
  {
    id: 2,
    title: "Find Your Art Style",
    action: "TAKE OUR QUIZ",
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80",
    alt: "Sample artwork 2",
  },
  {
    id: 3,
    title: "The Contemporary Still Life",
    action: "EXPLORE THE EXHIBITION",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
    alt: "Sample artwork 3",
  },
  {
    id: 4,
    title: "Lucky Art Finds",
    action: "SEE AFFORDABLE PICKS",
    image:
      "https://images.unsplash.com/photo-1579965342575-16428a7c8881?auto=format&fit=crop&w=900&q=80",
    alt: "Sample artwork 4",
  },
];

export default function DisplaySample() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          Experience the Joy of Living with Original Art
        </h2>

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
                <p className={styles.title}>{item.title}</p>
                <a href="#" className={styles.action}>
                  {item.action}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
