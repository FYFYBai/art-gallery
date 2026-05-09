"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale, useTranslations } from "@/i18n/IntlContext";
import styles from "../CheckoutResult.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function readStoredAuth() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function CheckoutCancelPage() {
  const locale = useLocale();
  const t = useTranslations("checkoutResult");

  useEffect(() => {
    const auth = readStoredAuth();
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!auth?.token || !sessionId) return;

    fetch(`${API_BASE_URL}/api/checkout/stripe-session/cancel?sessionId=${encodeURIComponent(sessionId)}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${auth.token}` },
    }).catch(() => {});
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>{t("cancelEyebrow")}</p>
        <h1>{t("cancelTitle")}</h1>
        <p>{t("cancelBody")}</p>
        <div className={styles.actions}>
          <Link href={`/${locale}/cart`}>{t("returnToCart")}</Link>
          <Link href={`/${locale}/artworks`}>{t("continueShopping")}</Link>
        </div>
      </section>
    </main>
  );
}
