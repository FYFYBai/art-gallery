"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "../../i18n/IntlContext";
import styles from "./CartSection.module.css";
import { CartIcon } from "@/components/header/icons";

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

function imageSrc(imageUrl) {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/uploads/")) return `${API_BASE_URL}${imageUrl}`;
  return imageUrl;
}

function formatPrice(value, currency = "CAD") {
  return Number(value || 0).toLocaleString("en-CA", {
    style: "currency",
    currency,
  });
}

export default function CartSection() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(1);
  const [auth] = useState(() => readStoredAuth());
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(readStoredAuth()?.token));
  const [errorKey, setErrorKey] = useState("");
  const [removingId, setRemovingId] = useState("");

  const STEPS = [t("stepCart"), t("stepCheckout"), t("stepConfirmation")];
  const items = cart?.items ?? [];
  const hasUnavailableItems = items.some((item) => !item.available);
  const canCheckout = Boolean(cart?.canCheckout);

  const progressWidth = `${((currentStep - 0.5) / STEPS.length) * 100}%`;
  const progressTrackWidth = `${((STEPS.length - 0.5) / STEPS.length) * 100}%`;

  const getNextButtonLabel = () => {
    if (currentStep === 1) return t("proceedToCheckout");
    if (currentStep === 2) return t("placeDemoOrder");
    return t("backToCart");
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !canCheckout) return;
    setCurrentStep((prev) => (prev === STEPS.length ? 1 : prev + 1));
  };

  useEffect(() => {
    async function loadCart() {
      if (!auth?.token) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not load cart");
        }

        setCart(await response.json());
      } catch {
        setErrorKey("loadFailed");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [auth?.token]);

  const removeItem = async (itemId) => {
    if (!auth?.token || removingId) return;

    setRemovingId(itemId);
    setErrorKey("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not remove item");
      }

      setCart(await response.json());
      setCurrentStep(1);
    } catch {
      setErrorKey("removeFailed");
    } finally {
      setRemovingId("");
    }
  };

  return (
    <section className={styles.cartPage}>
      <div className={styles.inner}>
        <div className={styles.stepper}>
          <div className={styles.stepperLine} style={{ width: progressTrackWidth }} />
          <div className={styles.stepperFill} style={{ width: progressWidth }} />

          <div className={styles.stepItems}>
            {STEPS.map((label, index) => {
              const stepNumber = index + 1;
              const stepClassName = [
                styles.step,
                stepNumber < currentStep ? styles.completed : "",
                stepNumber === currentStep ? styles.active : "",
              ].filter(Boolean).join(" ");

              return (
                <div key={label} className={stepClassName}>
                  <span className={styles.stepDot} />
                  <span className={styles.stepLabel}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.cartPanel}>
            {currentStep === 1 && (
              <>
                {!auth?.token && (
                  <div className={styles.emptyState}>
                    <div className={styles.bagIcon} aria-hidden="true">
                      <CartIcon className={styles.bagSvg} />
                    </div>
                    <p className={styles.emptyText}>{t("loginRequired")}</p>
                    <p className={styles.promptText}>{t("loginRequiredBody")}</p>
                    <Link href={`/${locale}/artworks`} className={styles.shopButton}>
                      {t("continueShopping")}
                    </Link>
                  </div>
                )}

                {auth?.token && loading && (
                  <p className={styles.statusText}>{t("loading")}</p>
                )}

                {auth?.token && !loading && items.length === 0 && (
                  <div className={styles.emptyState}>
                    <div className={styles.bagIcon} aria-hidden="true">
                      <CartIcon className={styles.bagSvg} />
                    </div>
                    <p className={styles.emptyText}>{t("emptyCart")}</p>
                    <Link href={`/${locale}/artworks`} className={styles.shopButton}>
                      {t("continueShopping")}
                    </Link>
                  </div>
                )}

                {auth?.token && !loading && items.length > 0 && (
                  <div className={styles.cartItems}>
                    <div className={styles.cartHeader}>
                      <div>
                        <p className={styles.panelEyebrow}>{t("stepCart")}</p>
                        <h1 className={styles.panelTitle}>{t("cartTitle")}</h1>
                      </div>
                      <p className={styles.cartCount}>
                        {t("itemCount").replace("{count}", items.length)}
                      </p>
                    </div>

                    {hasUnavailableItems && (
                      <p className={styles.availabilityNotice}>{t("availabilityChanged")}</p>
                    )}

                    <div className={styles.itemList}>
                      {items.map((item) => (
                        <article
                          key={item.id}
                          className={`${styles.cartItem} ${!item.available ? styles.unavailableItem : ""}`}
                        >
                          <Link href={`/${locale}/artworks/${item.slug}`} className={styles.itemImageLink}>
                            {item.imageUrl ? (
                              <img src={imageSrc(item.imageUrl)} alt={item.title} className={styles.itemImage} />
                            ) : (
                              <span className={styles.itemImagePlaceholder} aria-hidden="true" />
                            )}
                          </Link>

                          <div className={styles.itemBody}>
                            <div>
                              <Link href={`/${locale}/artworks/${item.slug}`} className={styles.itemTitle}>
                                {item.title}
                              </Link>
                              <p className={styles.itemMeta}>
                                {[item.size, item.year].filter(Boolean).join(" / ")}
                              </p>
                              {!item.available && (
                                <p className={styles.itemWarning}>{t("itemUnavailable")}</p>
                              )}
                            </div>

                            <div className={styles.itemActions}>
                              <span className={styles.itemPrice}>
                                {formatPrice(item.unitPrice, item.currency)}
                              </span>
                              <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => removeItem(item.id)}
                                disabled={removingId === item.id}
                              >
                                {removingId === item.id ? t("removing") : t("remove")}
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className={styles.cartSummary}>
                      <span>{t("subtotal")}</span>
                      <strong>{formatPrice(cart?.subtotal, "CAD")}</strong>
                    </div>
                  </div>
                )}

                {errorKey && (
                  <p className={styles.errorText}>{t(errorKey)}</p>
                )}
              </>
            )}

            {currentStep === 2 && (
              <div className={styles.checkoutState}>
                <p className={styles.panelEyebrow}>{t("checkoutEyebrow")}</p>
                <h1 className={styles.panelTitle}>{t("checkoutTitle")}</h1>
                <p className={styles.panelText}>{t("checkoutText")}</p>

                <div className={styles.checkoutGrid}>
                  <label className={styles.fieldLabel}>
                    {t("emailLabel")}
                    <input className={styles.fieldInput} type="email" placeholder={t("emailPlaceholder")} />
                  </label>
                  <label className={styles.fieldLabel}>
                    {t("fullNameLabel")}
                    <input className={styles.fieldInput} type="text" placeholder={t("fullNamePlaceholder")} />
                  </label>
                  <label className={styles.fieldLabel}>
                    {t("addressLabel")}
                    <input className={styles.fieldInput} type="text" placeholder={t("addressPlaceholder")} />
                  </label>
                  <label className={styles.fieldLabel}>
                    {t("cityLabel")}
                    <input className={styles.fieldInput} type="text" placeholder={t("cityPlaceholder")} />
                  </label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.confirmationState}>
                <div className={styles.confirmationMark} aria-hidden="true">
                  <span />
                </div>
                <p className={styles.panelEyebrow}>{t("confirmationEyebrow")}</p>
                <h1 className={styles.panelTitle}>{t("confirmationTitle")}</h1>
                <p className={styles.panelText}>{t("confirmationText")}</p>
                <div className={styles.confirmationSummary}>
                  <span>{t("demoOrder")}</span>
                  <strong>AG-2026-001</strong>
                </div>
              </div>
            )}
          </div>

          <aside className={styles.servicePanel}>
            <div className={styles.serviceHeader}>{t("customerService")}</div>
            <div className={styles.serviceBody}>
              <p>{t("serviceHours")}</p>
              <a href="tel:18557708626" className={styles.servicePhone}>1-855-770-8626</a>
            </div>

            <div className={styles.serviceFeatures}>
              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M3 7h11v8H3z" />
                  <path d="M14 10h3l4 3v2h-7z" />
                  <circle cx="7" cy="18" r="1.7" />
                  <circle cx="18" cy="18" r="1.7" />
                </svg>
                <span>{t("freeDelivery")}</span>
              </div>
              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M7 7H21" />
                  <path d="M17 3l4 4-4 4" />
                  <path d="M17 17H3" />
                  <path d="M7 13l-4 4 4 4" />
                </svg>
                <Link href={`/${locale}/refund-shipping-commission`} className={styles.featureLink}>
                  {t("returnsExchanges")}
                </Link>
              </div>
              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  <rect x="5" y="10" width="14" height="10" rx="1" />
                  <path d="M12 14v3" />
                </svg>
                <span>{t("shopSecurely")}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className={styles.demoFlowControls}>
          <button
            type="button"
            className={styles.nextButton}
            onClick={handleNextStep}
            disabled={currentStep === 1 && !canCheckout}
          >
            {getNextButtonLabel()}
          </button>
        </div>
      </div>
    </section>
  );
}
