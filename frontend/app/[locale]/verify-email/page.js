"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "../../../i18n/IntlContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(t("loading"));

  useEffect(() => {
    if (!token) {
      return;
    }

    async function verify() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: "POST" },
        );
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setStatus("error");
          setMessage(result?.errors?.[0] || result?.message || t("error"));
          return;
        }

        setStatus("success");
        setMessage(t("success"));
      } catch {
        setStatus("error");
        setMessage(t("networkError"));
      }
    }

    verify();
  }, [token, t]);

  const displayStatus = token ? status : "error";
  const displayMessage = token ? message : t("missingToken");

  return (
    <main style={{ minHeight: "60vh", padding: "96px 24px", textAlign: "center" }}>
      <p style={{ marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.14em" }}>
        {displayStatus === "success" ? t("successEyebrow") : t("pendingEyebrow")}
      </p>
      <h1 style={{ marginBottom: 18 }}>{t("title")}</h1>
      <p style={{ margin: "0 auto 28px", maxWidth: 520, lineHeight: 1.6 }}>
        {displayMessage}
      </p>
      <Link href={`/${locale}`} style={{ textDecoration: "underline" }}>
        {t("homeLink")}
      </Link>
    </main>
  );
}
