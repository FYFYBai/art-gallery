"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "../../../i18n/IntlContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function isStrongPassword(password) {
  return (
    password.length > 10 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function getResetErrorMessage(message, t) {
  if (message === "New password must be different from the current password") {
    return t("samePassword");
  }

  return message || t("error");
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18 }}>
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18 }}>
      <path
        d="m3 3 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.2 5.4A10.6 10.6 0 0 1 12 5c6 0 9.5 7 9.5 7a18.2 18.2 0 0 1-2.9 3.7M6.2 6.9C3.8 8.7 2.5 12 2.5 12s3.5 7 9.5 7a9.7 9.7 0 0 0 4.3-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 10.4a2.8 2.8 0 0 0 3.4 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [status, setStatus] = useState(token ? "idle" : "error");
  const [message, setMessage] = useState(token ? "" : t("missingToken"));

  const passwordInvalid = password.length > 0 && !isStrongPassword(password);
  const confirmationInvalid =
    passwordConfirmation.length > 0 && password !== passwordConfirmation;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage(t("missingToken"));
      return;
    }

    if (!isStrongPassword(password)) {
      setStatus("error");
      setMessage(t("passwordInvalid"));
      return;
    }

    if (password !== passwordConfirmation) {
      setStatus("error");
      setMessage(t("passwordMismatch"));
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, passwordConfirmation }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setMessage(
          getResetErrorMessage(result?.errors?.[0] || result?.message, t),
        );
        return;
      }

      setStatus("success");
      setMessage(t("success"));
      setPassword("");
      setPasswordConfirmation("");
    } catch {
      setStatus("error");
      setMessage(t("networkError"));
    }
  }

  return (
    <main style={{ minHeight: "60vh", padding: "96px 24px" }}>
      <section style={{ width: "min(420px, 100%)", margin: "0 auto" }}>
        <p style={{ marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.14em" }}>
          {status === "success" ? t("successEyebrow") : t("eyebrow")}
        </p>
        <h1 style={{ marginBottom: 14 }}>{t("title")}</h1>
        <p style={{ margin: "0 0 28px", lineHeight: 1.6 }}>{t("description")}</p>

        {status !== "success" && (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
              {t("passwordLabel")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t("passwordPlaceholder")}
                style={{
                  width: "100%",
                  height: 44,
                  border: passwordInvalid ? "1px solid #9a4a3a" : "1px solid #d5cfc4",
                  borderRadius: 8,
                  padding: "0 44px 0 13px",
                }}
              />
              <button
                type="button"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                onClick={() => setShowPassword((current) => !current)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 8,
                  width: 32,
                  height: 32,
                  border: "none",
                  background: "transparent",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {passwordInvalid && (
              <p style={{ margin: "-4px 0 0", color: "#7c382c", fontSize: "0.82rem" }}>
                {t("passwordInvalid")}
              </p>
            )}

            <label style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
              {t("passwordConfirmationLabel")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPasswordConfirmation ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
                placeholder={t("passwordConfirmationPlaceholder")}
                style={{
                  width: "100%",
                  height: 44,
                  border: confirmationInvalid ? "1px solid #9a4a3a" : "1px solid #d5cfc4",
                  borderRadius: 8,
                  padding: "0 44px 0 13px",
                }}
              />
              <button
                type="button"
                aria-label={
                  showPasswordConfirmation
                    ? t("hidePasswordConfirmation")
                    : t("showPasswordConfirmation")
                }
                onClick={() => setShowPasswordConfirmation((current) => !current)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 8,
                  width: 32,
                  height: 32,
                  border: "none",
                  background: "transparent",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPasswordConfirmation ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {confirmationInvalid && (
              <p style={{ margin: "-4px 0 0", color: "#7c382c", fontSize: "0.82rem" }}>
                {t("passwordMismatch")}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                height: 46,
                border: "1px solid #2f2a24",
                borderRadius: 8,
                background: "#2f2a24",
                color: "#fff",
                cursor: status === "submitting" ? "wait" : "pointer",
              }}
            >
              {status === "submitting" ? t("submitting") : t("submit")}
            </button>
          </form>
        )}

        {message && (
          <p style={{ margin: "18px 0 0", color: status === "success" ? "#315c3e" : "#7c382c" }}>
            {message}
          </p>
        )}

        <Link href={`/${locale}`} style={{ display: "inline-block", marginTop: 24, textDecoration: "underline" }}>
          {t("homeLink")}
        </Link>
      </section>
    </main>
  );
}
