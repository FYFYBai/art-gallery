"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "../../i18n/IntlContext";
import { CartIcon } from "../header/icons";
import styles from "./AddToCartButton.module.css";

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

export default function AddToCartButton({ artworkId, soldOut, variant = "card" }) {
  const t = useTranslations("artworkActions");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [submitting, setSubmitting] = useState(false);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (nextMessage, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setMessageType(type);
    setMessage(nextMessage);
    toastTimerRef.current = setTimeout(() => {
      setMessage("");
      toastTimerRef.current = null;
    }, 3000);
  };

  const addToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (soldOut || submitting) return;

    const auth = readStoredAuth();
    if (!auth?.token) {
      showToast(t("loginRequired"), "error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ artworkId }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Could not add artwork");
      }

      const result = await response.json();
      const alreadyInCart = result.message === "Artwork is already in cart";
      showToast(alreadyInCart ? t("alreadyInCart") : t("added"), alreadyInCart ? "error" : "success");
    } catch (error) {
      showToast(error.message === "Artwork is sold" ? t("sold") : t("failed"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.wrap} ${variant === "detail" ? styles.detail : ""}`}>
      <button
        type="button"
        className={styles.button}
        onClick={addToCart}
        disabled={soldOut || submitting}
      >
        <CartIcon className={styles.icon} />
        <span>{soldOut ? t("sold") : submitting ? t("adding") : t("addToCart")}</span>
      </button>
      {message && (
        <div
          className={`${styles.toast} ${messageType === "success" ? styles.toastSuccess : styles.toastError}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </div>
  );
}
