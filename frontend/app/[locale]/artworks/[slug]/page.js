"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "../../../../i18n/IntlContext";
import AddToCartButton from "../../../../components/artworks/AddToCartButton";
import styles from "./ArtworkDetailPage.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const ARTWORK_TYPE_LABEL_KEYS = {
  "oil-paintings": "oilPaintings",
  watercolors: "watercolors",
  drawings: "drawings",
  charcoal: "charcoal",
};

function imageSrc(imageUrl) {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/uploads/")) return `${API_BASE_URL}${imageUrl}`;
  return imageUrl;
}

function cleanTypography(value) {
  return String(value || "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, "\"");
}

export default function ArtworkDetailPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const t = useTranslations("artworkDetail");
  const tTypes = useTranslations("artworkTypes");
  const tSeries = useTranslations("series");
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadArtwork() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/artworks/${slug}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load artwork");
        }

        setArtwork(await response.json());
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError("loadFailed");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadArtwork();
    }

    return () => controller.abort();
  }, [slug]);

  const descriptionParagraphs = useMemo(() => {
    return String(artwork?.description || "")
      .split(/\n+/)
      .map((paragraph) => cleanTypography(paragraph.trim()))
      .filter(Boolean);
  }, [artwork]);

  if (loading) {
    return <main className={styles.page}><p className={styles.statusText}>{t("loading")}</p></main>;
  }

  if (error || !artwork) {
    return <main className={styles.page}><p className={styles.statusText}>{error ? t(error) : t("loadFailed")}</p></main>;
  }

  const bylineKey = artwork.artworkType === "charcoal" ? "charcoalByline" : "oilByline";
  const artworkTypeLabel = ARTWORK_TYPE_LABEL_KEYS[artwork.artworkType]
    ? tTypes(ARTWORK_TYPE_LABEL_KEYS[artwork.artworkType])
    : artwork.artworkType || t("notAvailable");
  const seriesLabels = Array.isArray(artwork.series) && artwork.series.length > 0
    ? artwork.series.map((seriesKey) => tSeries(seriesKey)).join(", ")
    : t("notAvailable");

  return (
    <main className={styles.page}>
      <Link href={`/${locale}/artworks`} className={styles.backLink}>
        {t("backToArtworks")}
      </Link>

      <section className={styles.detail}>
        <div className={styles.imageWrap}>
          {artwork.imageUrl ? (
            <img src={imageSrc(artwork.imageUrl)} alt={artwork.title} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true" />
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{t(bylineKey)}</p>
          <h1>{cleanTypography(artwork.title)}</h1>
          <strong className={styles.uniqueLine}>{t("uniquePiece")}</strong>
          <p className={`${styles.availability} ${artwork.soldOut ? styles.soldAvailability : ""}`}>
            {artwork.soldOut ? t("sold") : t("available")}
          </p>

          <dl className={styles.meta}>
            <div>
              <dt>{t("price")}</dt>
              <dd>
                {Number(artwork.price || 0).toLocaleString("en-CA", {
                  style: "currency",
                  currency: artwork.currency || "CAD",
                })}
              </dd>
            </div>
            <div>
              <dt>{t("size")}</dt>
              <dd>{artwork.size || t("notAvailable")}</dd>
            </div>
            <div>
              <dt>{t("year")}</dt>
              <dd>{artwork.year || t("notAvailable")}</dd>
            </div>
            <div>
              <dt>{t("artworkType")}</dt>
              <dd>{artworkTypeLabel}</dd>
            </div>
            <div>
              <dt>{t("series")}</dt>
              <dd>{seriesLabels}</dd>
            </div>
          </dl>

          <AddToCartButton artworkId={artwork.id} soldOut={artwork.soldOut} variant="detail" />

          <div className={styles.description}>
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
