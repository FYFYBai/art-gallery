"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Not logged in — redirect to home
        router.replace(`/${locale}`);
      }
    } catch {
      router.replace(`/${locale}`);
    }
  }, [locale, router]);

  const handleLogout = async () => {
    const token = user?.token;

    // Clear local state immediately
    localStorage.removeItem("auth");
    // Notify the header (same tab) that auth was cleared
    window.dispatchEvent(new StorageEvent("storage", { key: "auth", newValue: null }));
    setUser(null);

    // Invalidate the token on the server (best-effort)
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore network errors — token is already cleared locally
      }
    }

    router.replace(`/${locale}`);
  };

  if (!user) return null;

  return (
    <div style={{ padding: "60px 32px" }}>
      <p>{user.email}</p>
      <p>{user.role}</p>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
