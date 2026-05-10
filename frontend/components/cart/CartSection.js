"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "../../i18n/IntlContext";
import styles from "./CartSection.module.css";
import { CartIcon } from "@/components/header/icons";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const emptyAddressDraft = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  provinceState: "QC",
  postalCode: "",
  country: "Canada",
  primary: true,
};

const provinces = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

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

function formatAddress(address) {
  return [
    address.addressLine1,
    address.addressLine2,
    `${address.city}, ${address.provinceState} ${address.postalCode}`,
    address.country,
  ].filter(Boolean).join(", ");
}

function extractApiError(result, fallback) {
  if (result?.errors?.length) return result.errors[0];
  if (result?.message) return result.message;
  return fallback;
}

export default function CartSection() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(1);
  const [auth] = useState(() => readStoredAuth());
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressDraft, setAddressDraft] = useState(emptyAddressDraft);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(() => Boolean(readStoredAuth()?.token));
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [removingId, setRemovingId] = useState("");

  const steps = useMemo(() => [t("stepCart"), t("stepCheckout")], [t]);
  const items = cart?.items ?? [];
  const hasUnavailableItems = items.some((item) => !item.available);
  const canCheckout = Boolean(cart?.canCheckout);
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
  const canStartStripeCheckout = canCheckout && selectedAddressId && acceptedTerms && !checkingOut;

  const progressWidth = `${((currentStep - 0.5) / steps.length) * 100}%`;
  const progressTrackWidth = `${((steps.length - 0.5) / steps.length) * 100}%`;

  useEffect(() => {
    async function loadCart() {
      if (!auth?.token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        if (!response.ok) throw new Error("Could not load cart");

        setCart(await response.json());
      } catch {
        setErrorText(t("loadFailed"));
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [auth?.token, t]);

  useEffect(() => {
    async function loadAddresses() {
      if (!auth?.token || currentStep !== 2) return;

      setAddressesLoading(true);
      setErrorText("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        if (!response.ok) throw new Error("Could not load addresses");

        const result = await response.json();
        setAddresses(result);
        const primary = result.find((address) => address.primary) || result[0];
        setSelectedAddressId(primary?.id || "");
        setShowAddressForm(result.length === 0);
      } catch {
        setErrorText(t("addressLoadFailed"));
      } finally {
        setAddressesLoading(false);
      }
    }

    loadAddresses();
  }, [auth?.token, currentStep, t]);

  const removeItem = async (itemId) => {
    if (!auth?.token || removingId) return;

    setRemovingId(itemId);
    setErrorText("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!response.ok) throw new Error("Could not remove item");

      setCart(await response.json());
      setCurrentStep(1);
    } catch {
      setErrorText(t("removeFailed"));
    } finally {
      setRemovingId("");
    }
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    if (!auth?.token || submittingAddress) return;

    setSubmittingAddress(true);
    setErrorText("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(addressDraft),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(extractApiError(result, t("addressSaveFailed")));
      }

      setAddresses((current) => [result, ...current.filter((address) => address.id !== result.id)]);
      setSelectedAddressId(result.id);
      setAddressDraft(emptyAddressDraft);
      setShowAddressForm(false);
    } catch (error) {
      setErrorText(error.message || t("addressSaveFailed"));
    } finally {
      setSubmittingAddress(false);
    }
  };

  const createStripeCheckout = async () => {
    if (!auth?.token || !canStartStripeCheckout) return;

    setCheckingOut(true);
    setErrorText("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/checkout/stripe-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          acceptedTerms,
          locale,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(extractApiError(result, t("checkoutFailed")));
      }

      window.location.href = result.checkoutUrl;
    } catch (error) {
      setCheckingOut(false);
      setErrorText(error.message || t("checkoutFailed"));
    }
  };

  const goToCheckout = () => {
    if (!canCheckout) return;
    setCurrentStep(2);
    setErrorText("");
  };

  return (
    <section className={styles.cartPage}>
      <div className={styles.inner}>
        <div className={styles.stepper}>
          <div className={styles.stepperLine} style={{ width: progressTrackWidth }} />
          <div className={styles.stepperFill} style={{ width: progressWidth }} />

          <div className={styles.stepItems} style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((label, index) => {
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
              </>
            )}

            {currentStep === 2 && (
              <div className={styles.checkoutState}>
                <p className={styles.panelEyebrow}>{t("checkoutEyebrow")}</p>
                <h1 className={styles.panelTitle}>{t("checkoutTitle")}</h1>
                <p className={styles.panelText}>{t("checkoutText")}</p>

                <div className={styles.checkoutBlocks}>
                  <section className={styles.checkoutBlock}>
                    <div className={styles.checkoutBlockHeader}>
                      <h2>{t("deliveryAddress")}</h2>
                      <button type="button" onClick={() => setShowAddressForm((value) => !value)}>
                        {showAddressForm ? t("cancel") : t("addAddress")}
                      </button>
                    </div>

                    {addressesLoading && <p className={styles.statusText}>{t("loadingAddresses")}</p>}

                    {!addressesLoading && addresses.length > 0 && (
                      <div className={styles.addressList}>
                        {addresses.map((address) => (
                          <label key={address.id} className={styles.addressOption}>
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === address.id}
                              onChange={() => setSelectedAddressId(address.id)}
                            />
                            <span>
                              <strong>{address.primary ? t("primaryAddress") : t("savedAddress")}</strong>
                              {formatAddress(address)}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {showAddressForm && (
                      <form className={styles.addressForm} onSubmit={saveAddress}>
                        <label className={styles.fieldLabel}>
                          {t("addressLabel")}
                          <input
                            className={styles.fieldInput}
                            value={addressDraft.addressLine1}
                            onChange={(event) => setAddressDraft((current) => ({ ...current, addressLine1: event.target.value }))}
                            required
                          />
                        </label>
                        <label className={styles.fieldLabel}>
                          {t("addressLine2")}
                          <input
                            className={styles.fieldInput}
                            value={addressDraft.addressLine2}
                            onChange={(event) => setAddressDraft((current) => ({ ...current, addressLine2: event.target.value }))}
                          />
                        </label>
                        <label className={styles.fieldLabel}>
                          {t("cityLabel")}
                          <input
                            className={styles.fieldInput}
                            value={addressDraft.city}
                            onChange={(event) => setAddressDraft((current) => ({ ...current, city: event.target.value }))}
                            required
                          />
                        </label>
                        <label className={styles.fieldLabel}>
                          {t("province")}
                          <select
                            className={styles.fieldInput}
                            value={addressDraft.provinceState}
                            onChange={(event) => setAddressDraft((current) => ({ ...current, provinceState: event.target.value }))}
                          >
                            {provinces.map((province) => (
                              <option key={province} value={province}>{province}</option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.fieldLabel}>
                          {t("postalCode")}
                          <input
                            className={styles.fieldInput}
                            value={addressDraft.postalCode}
                            onChange={(event) => setAddressDraft((current) => ({ ...current, postalCode: event.target.value }))}
                            placeholder="H2Y 1G5"
                            required
                          />
                        </label>
                        <button type="submit" className={styles.secondaryButton} disabled={submittingAddress}>
                          {submittingAddress ? t("savingAddress") : t("saveAddress")}
                        </button>
                      </form>
                    )}
                  </section>

                  <section className={styles.checkoutBlock}>
                    <h2>{t("payment")}</h2>
                    <p className={styles.panelText}>
                      {t("stripeRedirectText")}
                    </p>
                    {selectedAddress && (
                      <p className={styles.selectedAddress}>{formatAddress(selectedAddress)}</p>
                    )}
                    <label className={styles.termsCheck}>
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(event) => setAcceptedTerms(event.target.checked)}
                      />
                      <span>
                        {t("agreePrefix")}{" "}
                        <Link href={`/${locale}/terms-of-service`}>{t("termsLink")}</Link>{" "}
                        {t("and")}{" "}
                        <Link href={`/${locale}/refund-shipping-commission`}>{t("policyLink")}</Link>.
                      </span>
                    </label>
                  </section>
                </div>
              </div>
            )}

            {errorText && (
              <p className={styles.errorText}>{errorText}</p>
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

        {auth?.token && !loading && items.length > 0 && (
          <div className={styles.checkoutFlowControls}>
            {currentStep === 2 && (
              <button type="button" className={styles.backButton} onClick={() => setCurrentStep(1)}>
                {t("backToCart")}
              </button>
            )}
            <button
              type="button"
              className={styles.nextButton}
              onClick={currentStep === 1 ? goToCheckout : createStripeCheckout}
              disabled={currentStep === 1 ? !canCheckout : !canStartStripeCheckout}
            >
              {currentStep === 1
                ? t("proceedToCheckout")
                : checkingOut
                  ? t("redirectingToStripe")
                  : t("payWithStripe")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
