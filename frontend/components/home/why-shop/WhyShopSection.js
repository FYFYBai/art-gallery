"use client";

import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./WhyShopSection.module.css";

const CARD_ICONS = ["◔", "☺", "☆", "↗"];

export default function WhyShopSection() {
  const t = useTranslations("home");

  const cards = [
    { icon: CARD_ICONS[0], titleKey: "whyCard1Title", textKey: "whyCard1Text" },
    { icon: CARD_ICONS[1], titleKey: "whyCard2Title", textKey: "whyCard2Text" },
    { icon: CARD_ICONS[2], titleKey: "whyCard3Title", textKey: "whyCard3Text" },
    { icon: CARD_ICONS[3], titleKey: "whyCard4Title", textKey: "whyCard4Text" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>{t("whyShopTitle")}</h2>
          <p className={styles.description}>
            {t("whyShopDescription")}
          </p>
        </header>

        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.titleKey} className={styles.card}>
              <div className={styles.icon}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{t(card.titleKey)}</h3>
              <p className={styles.cardText}>{t(card.textKey)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
