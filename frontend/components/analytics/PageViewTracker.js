"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "../../i18n/IntlContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function getAnalyticsSessionId() {
  const storageKey = "analyticsSessionId";
  const existing = window.localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const nextId =
    window.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(storageKey, nextId);
  return nextId;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (!pathname) return undefined;

    const timerId = window.setTimeout(() => {
      try {
        const payload = JSON.stringify({
          path: pathname,
          locale,
          sessionId: getAnalyticsSessionId(),
        });

        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon(`${API_BASE_URL}/api/analytics/page-view`, blob);
          return;
        }

        fetch(`${API_BASE_URL}/api/analytics/page-view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      } catch {
        // Analytics must never block the page.
      }
    }, 400);

    return () => window.clearTimeout(timerId);
  }, [locale, pathname]);

  return null;
}
