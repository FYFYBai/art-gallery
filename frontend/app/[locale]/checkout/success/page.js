"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "@/i18n/IntlContext";
import styles from "../CheckoutResult.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function CheckoutSuccessPage() {
  const locale = useLocale();
  const t = useTranslations("checkoutResult");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) return;

    fetch(`${API_BASE_URL}/api/checkout/stripe-session/status?sessionId=${encodeURIComponent(sessionId)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((result) => setStatus(result))
      .catch(() => setStatus(null));
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>{t("successEyebrow")}</p>
        <h1>{t("successTitle")}</h1>
        <p>{t("successBody")}</p>
        {status?.orderNumber && (
          <div className={styles.summary}>
            <span>{t("orderNumber")}</span>
            <strong>{status.orderNumber}</strong>
          </div>
        )}
        <div className={styles.actions}>
          <Link href={`/${locale}/profile`}>{t("viewOrders")}</Link>
          <Link href={`/${locale}/artworks`}>{t("continueShopping")}</Link>
        </div>
      </section>
    </main>
  );
}
