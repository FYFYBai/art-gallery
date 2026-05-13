import Link from "next/link";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { getLegalDocument } from "./legalContent";
import styles from "./LegalDocumentPage.module.css";

const legalLinks = [
  { key: "privacy", href: "/privacy-policy" },
  { key: "terms", href: "/terms-of-service" },
  { key: "policies", href: "/refund-shipping-commission" },
];

const linkLabels = {
  en: {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    policies: "Refund, Shipping, and Commission",
  },
  fr: {
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    policies: "Remboursement, livraison et commissions",
  },
  zh: {
    privacy: "隐私政策",
    terms: "使用条款",
    policies: "退款、配送与委托创作",
  },
};

export default async function LegalDocumentPage({ params, documentKey }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const document = getLegalDocument(locale, documentKey);
  const labels = linkLabels[locale] ?? linkLabels.fr;

  if (!document) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{document.eyebrow}</p>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.updated}>{document.updated}</p>
        <p className={styles.intro}>{document.intro}</p>
      </section>

      <section className={styles.content} aria-label={document.title}>
        <aside className={styles.toc} aria-label="Legal documents">
          {legalLinks.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              className={`${styles.tocLink} ${link.key === documentKey ? styles.isActive : ""}`}
            >
              {labels[link.key]}
            </Link>
          ))}
        </aside>

        <div className={styles.document}>
          {document.sections.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
