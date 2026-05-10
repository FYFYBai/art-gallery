"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./ProfilePage.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const accountSections = ["overview", "addresses", "security", "orders"];

const emptyAddressDraft = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  provinceState: "QC",
  postalCode: "",
  country: "Canada",
  primary: false,
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

function isStrongPassword(password) {
  return password.length > 10 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
}

function isValidCanadianPostalCode(postalCode) {
  return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode.trim());
}

function normalizePostalCode(postalCode) {
  const compact = postalCode.trim().replace(/[ -]/g, "").toUpperCase();
  return compact.length === 6 ? `${compact.slice(0, 3)} ${compact.slice(3)}` : postalCode;
}

function formatCurrency(value, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function normalizeOrder(order) {
  const status = order.orderStatus || order.status;
  const timeline = ["Order received"];

  if (["PAID", "SHIPPED", "DELIVERED", "REFUNDED"].includes(status)) {
    timeline.push("Payment confirmed");
  }

  if (["SHIPPED", "DELIVERED"].includes(status)) {
    timeline.push("Shipped");
  }

  if (status === "DELIVERED") {
    timeline.push("Delivered");
  }

  if (status === "REFUNDED") {
    timeline.push("Refunded");
  }

  return {
    id: order.orderNumber || order.id,
    uuid: order.id,
    date: formatDate(order.createdAt),
    status,
    total: formatCurrency(order.totalAmount, order.currency),
    delivery:
      status === "DELIVERED" && order.deliveredAt
        ? `Delivered ${formatDate(order.deliveredAt)}`
        : status === "SHIPPED"
          ? order.trackingLink || "Shipped"
          : status === "PAID"
            ? "Payment confirmed"
            : status,
    shippingAddress: order.shippingAddress || "",
    payment: order.paymentSummary || "",
    refundRequestFiled: Boolean(order.refundRequestFiled),
    items: (order.items || []).map((item) => ({
      title: item.title,
      detail: `Quantity ${item.quantity || 1}`,
      price: formatCurrency(item.totalPrice || item.unitPrice, order.currency),
    })),
    timeline,
  };
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.passwordIcon}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.passwordIcon}>
      <path d="m3 3 18 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M9.2 5.4A10.6 10.6 0 0 1 12 5c6 0 9.5 7 9.5 7a18.2 18.2 0 0 1-2.9 3.7M6.2 6.9C3.8 8.7 2.5 12 2.5 12s3.5 7 9.5 7a9.7 9.7 0 0 0 4.3-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M10.2 10.4a2.8 2.8 0 0 0 3.4 3.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations("profile");
  const [user, setUser] = useState(readStoredAuth);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [refundOrder, setRefundOrder] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundContactInfo, setRefundContactInfo] = useState("");
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundMessage, setRefundMessage] = useState(null);
  const [pageNotice, setPageNotice] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState("");
  const [addressDraft, setAddressDraft] = useState(emptyAddressDraft);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [securityPassword, setSecurityPassword] = useState("");
  const [securityPasswordConfirmation, setSecurityPasswordConfirmation] = useState("");
  const [showSecurityPassword, setShowSecurityPassword] = useState(false);
  const [showSecurityPasswordConfirmation, setShowSecurityPasswordConfirmation] = useState(false);
  const [securityMessage, setSecurityMessage] = useState(null);
  const [securitySubmitting, setSecuritySubmitting] = useState(false);

  const visibleOrders = orders;
  const selectedOrder = useMemo(
    () => visibleOrders.find((order) => order.id === selectedOrderId) || visibleOrders[0],
    [selectedOrderId, visibleOrders],
  );
  const visibleAddresses = addresses;
  const primaryAddress = visibleAddresses.find((address) => address.primary);
  const otherAddresses = visibleAddresses.filter((address) => !address.primary);
  const securityPasswordInvalid = securityPassword.length > 0 && !isStrongPassword(securityPassword);
  const securityConfirmationInvalid =
    securityPasswordConfirmation.length > 0 && securityPassword !== securityPasswordConfirmation;
  const addressPostalInvalid =
    addressDraft.postalCode.length > 0 && !isValidCanadianPostalCode(addressDraft.postalCode);

  useEffect(() => {
    if (!pageNotice) return;
    const timerId = window.setTimeout(() => setPageNotice(null), 3000);
    return () => window.clearTimeout(timerId);
  }, [pageNotice]);

  const handleSessionExpired = () => {
    localStorage.removeItem("auth");
    window.dispatchEvent(new StorageEvent("storage", { key: "auth", newValue: null }));
    setUser(null);
    router.replace(`/${locale}?session=expired`);
  };

  const apiFetch = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
        ...(options.headers || {}),
      },
    });

    if (response.status === 401 || response.status === 403) {
      handleSessionExpired();
      throw new Error("Session expired");
    }

    return response;
  };

  const fetchAddresses = async () => {
    setAddressesLoading(true);
    setAddressesError("");

    try {
      const response = await apiFetch("/api/profile/addresses");
      const result = await response.json();
      setAddresses(result);
    } catch (error) {
      if (error.message !== "Session expired") {
        setAddressesError(t("addressLoadFailed"));
      }
    } finally {
      setAddressesLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");

    try {
      const response = await apiFetch("/api/profile/orders");
      const result = await response.json();
      const nextOrders = result.map(normalizeOrder);
      setOrders(nextOrders);
      setSelectedOrderId((current) => nextOrders.find((order) => order.id === current)?.id || nextOrders[0]?.id || "");
    } catch (error) {
      if (error.message !== "Session expired") {
        setOrdersError(t("ordersLoadFailed"));
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace(`/${locale}`);
      return;
    }

    const timerId = window.setTimeout(() => {
      fetchAddresses();
      fetchOrders();
    }, 0);

    return () => window.clearTimeout(timerId);
    // Address loading intentionally runs when the authenticated user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, router, user]);

  const handleLogout = async () => {
    const token = user?.token;
    localStorage.removeItem("auth");
    window.dispatchEvent(new StorageEvent("storage", { key: "auth", newValue: null }));
    setUser(null);

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Token is already cleared locally.
      }
    }

    router.replace(`/${locale}`);
  };

  const startAddAddress = () => {
    setAddressDraft(emptyAddressDraft);
    setEditingAddressId(null);
    setShowAddressForm(true);
    setAddressesError("");
  };

  const startEditAddress = (address) => {
    setAddressDraft({ ...address, primary: address.primary });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    setAddressesError("");
  };

  const handleAddressChange = (field, value) => {
    setAddressDraft((current) => ({ ...current, [field]: value }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    if (addressPostalInvalid) return;

    setAddressSubmitting(true);
    setAddressesError("");

    const payload = {
      ...addressDraft,
      postalCode: normalizePostalCode(addressDraft.postalCode),
      country: "Canada",
    };

    try {
      const response = await apiFetch(
        editingAddressId ? `/api/profile/addresses/${editingAddressId}` : "/api/profile/addresses",
        {
          method: editingAddressId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );
      const savedAddress = await response.json();

      setAddresses((current) => {
        const withoutSaved = current.filter((address) => address.id !== savedAddress.id);
        const next = savedAddress.primary
          ? withoutSaved.map((address) => ({ ...address, primary: false }))
          : withoutSaved;
        return [savedAddress, ...next].sort((a, b) => Number(b.primary) - Number(a.primary));
      });
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressDraft(emptyAddressDraft);
    } catch (error) {
      if (error.message !== "Session expired") {
        setAddressesError(t("addressSaveFailed"));
      }
    } finally {
      setAddressSubmitting(false);
    }
  };

  const makePrimaryAddress = async (addressId) => {
    try {
      const response = await apiFetch(`/api/profile/addresses/${addressId}/primary`, { method: "PATCH" });
      const updatedAddress = await response.json();
      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          primary: address.id === updatedAddress.id,
        })),
      );
    } catch (error) {
      if (error.message !== "Session expired") {
        setAddressesError(t("addressSaveFailed"));
      }
    }
  };

  const removeAddress = async (addressId) => {
    try {
      await apiFetch(`/api/profile/addresses/${addressId}`, { method: "DELETE" });
      await fetchAddresses();
    } catch (error) {
      if (error.message !== "Session expired") {
        setAddressesError(t("addressRemoveFailed"));
      }
    }
  };

  const handleSecuritySubmit = async (event) => {
    event.preventDefault();
    setSecurityMessage(null);

    if (!isStrongPassword(securityPassword) || securityPassword !== securityPasswordConfirmation) {
      return;
    }

    setSecuritySubmitting(true);

    try {
      const response = await apiFetch("/api/profile/password", {
        method: "PATCH",
        body: JSON.stringify({
          password: securityPassword,
          passwordConfirmation: securityPasswordConfirmation,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const apiMessage = result?.errors?.[0] || result?.message;
        setSecurityMessage({
          type: "error",
          text:
            apiMessage === "New password must be different from the current password"
              ? t("samePassword")
              : t("passwordUpdateFailed"),
        });
        return;
      }

      setSecurityPassword("");
      setSecurityPasswordConfirmation("");
      setSecurityMessage({ type: "success", text: t("passwordUpdated") });
    } catch (error) {
      if (error.message !== "Session expired") {
        setSecurityMessage({ type: "error", text: t("passwordUpdateFailed") });
      }
    } finally {
      setSecuritySubmitting(false);
    }
  };

  const openRefundModal = (order) => {
    setRefundOrder(order);
    setRefundReason("");
    setRefundContactInfo(user.email || "");
    setRefundMessage(null);
  };

  const closeRefundModal = () => {
    setRefundOrder(null);
    setRefundReason("");
    setRefundContactInfo("");
    setRefundMessage(null);
  };

  const submitRefundRequest = async (event) => {
    event.preventDefault();
    if (!refundOrder || !refundReason.trim() || !refundContactInfo.trim()) return;

    setRefundSubmitting(true);
    setRefundMessage(null);

    try {
      const response = await apiFetch(`/api/profile/orders/${refundOrder.uuid}/refund-request`, {
        method: "POST",
        body: JSON.stringify({
          reason: refundReason,
          contactInfo: refundContactInfo,
        }),
      });

      if (!response.ok) {
        setRefundMessage({ type: "error", text: t("refundRequestFailed") });
        return;
      }

      closeRefundModal();
      setOrders((current) =>
        current.map((order) =>
          order.uuid === refundOrder.uuid ? { ...order, refundRequestFiled: true } : order,
        ),
      );
      setPageNotice({ type: "success", text: t("refundRequestSent") });
    } catch (error) {
      if (error.message !== "Session expired") {
        setRefundMessage({ type: "error", text: t("refundRequestFailed") });
      }
    } finally {
      setRefundSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <main className={styles.accountPage}>
      {pageNotice && (
        <div className={`${styles.pageNotice} ${pageNotice.type === "success" ? styles.pageNoticeSuccess : styles.pageNoticeError}`}>
          {pageNotice.text}
        </div>
      )}
      <header className={styles.accountHero}>
        <div>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p className={styles.heroText}>{t("subtitle")}</p>
        </div>
        <div className={styles.identityPanel}>
          <span>{t("signedInAs")}</span>
          <strong>{user.email}</strong>
          <button type="button" onClick={handleLogout}>{t("logout")}</button>
        </div>
      </header>

      <div className={styles.accountShell}>
        <aside className={styles.sidebar} aria-label={t("sectionNav")}>
          {accountSections.map((section) => (
            <button
              key={section}
              type="button"
              className={activeSection === section ? styles.activeNavItem : ""}
              onClick={() => setActiveSection(section)}
            >
              {t(`${section}Nav`)}
            </button>
          ))}
        </aside>

        <section className={styles.contentPanel}>
          {activeSection === "overview" && (
            <div className={styles.sectionStack}>
              <SectionHeader eyebrow={t("overviewEyebrow")} title={t("overviewTitle")} />
              <div className={styles.metricsGrid}>
                <Metric label={t("savedAddresses")} value={String(visibleAddresses.length)} />
                <Metric label={t("ordersThisYear")} value={String(visibleOrders.length)} />
              </div>
              <div className={styles.previewGrid}>
                {visibleOrders[0] ? (
                  <SummaryBlock title={t("nextDelivery")} body={`${visibleOrders[0].id} - ${visibleOrders[0].delivery}`} action={t("viewOrder")} onClick={() => { setSelectedOrderId(visibleOrders[0].id); setActiveSection("orders"); }} />
                ) : (
                  <EmptyState title={t("noOrdersTitle")} body={t("noOrdersBody")} />
                )}
                <SummaryBlock title={t("primaryAddress")} body={primaryAddress ? formatAddress(primaryAddress) : t("noPrimaryAddress")} action={t("manageAddresses")} onClick={() => setActiveSection("addresses")} />
              </div>
            </div>
          )}

          {activeSection === "addresses" && (
            <div className={styles.sectionStack}>
              <SectionHeader eyebrow={t("addressesEyebrow")} title={t("addressesTitle")} />
              <div className={styles.leftToolbar}><button type="button" onClick={startAddAddress}>{t("addAddress")}</button></div>
              {addressesLoading && <p className={styles.mutedText}>{t("loadingAddresses")}</p>}
              {addressesError && <p className={styles.panelError}>{addressesError}</p>}
              {showAddressForm && (
                <AddressForm
                  draft={addressDraft}
                  provinces={provinces}
                  t={t}
                  editing={Boolean(editingAddressId)}
                  submitting={addressSubmitting}
                  postalInvalid={addressPostalInvalid}
                  onChange={handleAddressChange}
                  onCancel={() => { setShowAddressForm(false); setEditingAddressId(null); setAddressDraft(emptyAddressDraft); }}
                  onSubmit={handleAddressSubmit}
                />
              )}

              <div className={styles.addressSection}>
                <p className={styles.groupTitle}>{t("primaryAddressLabel")}</p>
                {primaryAddress ? (
                  <AddressCard address={primaryAddress} actions={<><button type="button" onClick={() => startEditAddress(primaryAddress)}>{t("update")}</button><button type="button" onClick={() => removeAddress(primaryAddress.id)}>{t("remove")}</button></>} />
                ) : (
                  <EmptyState title={t("noPrimaryAddress")} body={t("noAddressBody")} />
                )}
              </div>

              <div className={styles.addressSection}>
                <p className={styles.groupTitle}>{t("otherAddresses")}</p>
                {otherAddresses.length > 0 ? (
                  <div className={styles.addressGrid}>
                    {otherAddresses.map((address) => (
                      <AddressCard key={address.id} address={address} actions={<><button type="button" onClick={() => makePrimaryAddress(address.id)}>{t("makePrimary")}</button><button type="button" onClick={() => startEditAddress(address)}>{t("update")}</button><button type="button" onClick={() => removeAddress(address.id)}>{t("remove")}</button></>} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title={t("noOtherAddresses")} body={t("noAddressBody")} />
                )}
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className={styles.sectionStack}>
              <SectionHeader eyebrow={t("securityEyebrow")} title={t("securityTitle")} />
              <form className={styles.securityForm} onSubmit={handleSecuritySubmit}>
                <label>
                  {t("newPassword")}
                  <PasswordField value={securityPassword} show={showSecurityPassword} invalid={securityPasswordInvalid} placeholder={t("newPasswordPlaceholder")} ariaLabel={showSecurityPassword ? t("hidePassword") : t("showPassword")} onChange={setSecurityPassword} onToggle={() => setShowSecurityPassword((current) => !current)} />
                </label>
                <p className={styles.passwordHint}>{t("passwordRequirements")}</p>
                {securityPasswordInvalid && <p className={styles.fieldError}>{t("passwordInvalid")}</p>}
                <label>
                  {t("confirmPassword")}
                  <PasswordField value={securityPasswordConfirmation} show={showSecurityPasswordConfirmation} invalid={securityConfirmationInvalid} placeholder={t("confirmPasswordPlaceholder")} ariaLabel={showSecurityPasswordConfirmation ? t("hidePasswordConfirmation") : t("showPasswordConfirmation")} onChange={setSecurityPasswordConfirmation} onToggle={() => setShowSecurityPasswordConfirmation((current) => !current)} />
                </label>
                {securityConfirmationInvalid && <p className={styles.fieldError}>{t("passwordMismatch")}</p>}
                {securityMessage && <p className={securityMessage.type === "success" ? styles.panelSuccess : styles.panelError}>{securityMessage.text}</p>}
                <button type="submit" disabled={securitySubmitting}>{securitySubmitting ? t("updatingPassword") : t("updatePassword")}</button>
              </form>
            </div>
          )}

          {activeSection === "orders" && (
            <div className={styles.ordersLayout}>
              <div className={styles.sectionStack}>
                <SectionHeader eyebrow={t("ordersEyebrow")} title={t("ordersTitle")} />
                {ordersLoading && <p className={styles.mutedText}>{t("loadingOrders")}</p>}
                {ordersError && <p className={styles.panelError}>{ordersError}</p>}
                <div className={styles.listStack}>
                  {visibleOrders.length === 0 ? (
                    <EmptyState title={t("noOrdersTitle")} body={t("noOrdersBody")} />
                  ) : (
                    visibleOrders.map((order) => (
                      <button key={order.id} type="button" className={`${styles.orderButton} ${selectedOrderId === order.id ? styles.selectedOrder : ""}`} onClick={() => setSelectedOrderId(order.id)}>
                        <span><strong>{order.id}</strong><small>{order.date}</small></span>
                        <span>{order.total}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
              {selectedOrder ? (
                <OrderDetail order={selectedOrder} t={t} onRefundRequest={openRefundModal} />
              ) : (
                <EmptyState title={t("noOrdersTitle")} body={t("noOrdersBody")} />
              )}
            </div>
          )}
        </section>
      </div>
      {refundOrder && (
        <RefundRequestModal
          order={refundOrder}
          t={t}
          reason={refundReason}
          contactInfo={refundContactInfo}
          submitting={refundSubmitting}
          message={refundMessage}
          onReasonChange={setRefundReason}
          onContactInfoChange={setRefundContactInfo}
          onClose={closeRefundModal}
          onSubmit={submitRefundRequest}
        />
      )}
    </main>
  );
}

function formatAddress(address) {
  return `${address.addressLine1}, ${address.city}, ${address.provinceState} ${address.postalCode}`;
}

function SectionHeader({ eyebrow, title }) {
  return <div className={styles.sectionHeader}><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2></div>;
}

function Metric({ label, value }) {
  return <div className={styles.metric}><span>{label}</span><strong>{value}</strong></div>;
}

function PasswordField({ value, show, invalid, placeholder, ariaLabel, onChange, onToggle }) {
  return (
    <div className={styles.passwordInputWrap}>
      <input type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className={invalid ? styles.inputError : ""} aria-invalid={invalid} />
      <button type="button" className={styles.passwordToggle} aria-label={ariaLabel} onClick={onToggle}>{show ? <EyeOffIcon /> : <EyeIcon />}</button>
    </div>
  );
}

function AddressForm({ draft, provinces, t, editing, submitting, postalInvalid, onChange, onCancel, onSubmit }) {
  return (
    <form className={styles.addressForm} onSubmit={onSubmit}>
      <label>{t("addressLine1")}<input required value={draft.addressLine1} onChange={(event) => onChange("addressLine1", event.target.value)} /></label>
      <label>{t("addressLine2")}<input value={draft.addressLine2 || ""} onChange={(event) => onChange("addressLine2", event.target.value)} /></label>
      <label>{t("city")}<input required value={draft.city} onChange={(event) => onChange("city", event.target.value)} /></label>
      <label>{t("province")}<select value={draft.provinceState} onChange={(event) => onChange("provinceState", event.target.value)}>{provinces.map((province) => <option key={province} value={province}>{province}</option>)}</select></label>
      <label>{t("postalCode")}<input required value={draft.postalCode} onChange={(event) => onChange("postalCode", event.target.value)} className={postalInvalid ? styles.inputError : ""} placeholder="H2Y 1Z9" /></label>
      {postalInvalid && <p className={styles.fieldError}>{t("postalCodeInvalid")}</p>}
      <label className={styles.checkboxLabel}><input type="checkbox" checked={draft.primary} onChange={(event) => onChange("primary", event.target.checked)} />{t("setAsPrimary")}</label>
      <div className={styles.formActions}><button type="submit" disabled={submitting || postalInvalid}>{submitting ? t("saving") : editing ? t("saveAddress") : t("addAddress")}</button><button type="button" onClick={onCancel}>{t("cancel")}</button></div>
    </form>
  );
}

function AddressCard({ address, actions }) {
  return (
    <article className={styles.addressBlock}>
      <p className={styles.rowTitle}>{address.addressLine1}</p>
      {address.addressLine2 && <p>{address.addressLine2}</p>}
      <p>{address.city}, {address.provinceState} {address.postalCode}</p>
      <p>{address.country}</p>
      <div className={styles.rowActions}>{actions}</div>
    </article>
  );
}

function EmptyState({ title, body }) {
  return <div className={styles.emptyState}><h3>{title}</h3><p>{body}</p></div>;
}

function SummaryBlock({ title, body, action, onClick }) {
  return <article className={styles.summaryBlock}><h3>{title}</h3><p>{body}</p><button type="button" onClick={onClick}>{action}</button></article>;
}

function canRequestRefund(order) {
  return Boolean(order.uuid) && !order.refundRequestFiled && ["PAID", "SHIPPED", "DELIVERED"].includes(order.status);
}

function OrderDetail({ order, t, onRefundRequest }) {
  return (
    <article className={styles.orderDetail}>
      <div className={styles.detailHeader}><div><p className={styles.eyebrow}>{t("orderDetail")}</p><h3>{order.id}</h3></div><span className={styles.statusPill}>{order.status}</span></div>
      <dl className={styles.detailGrid}>
        <div><dt>{t("delivery")}</dt><dd>{order.delivery}</dd></div>
        <div><dt>{t("payment")}</dt><dd>{order.payment}</dd></div>
        <div><dt>{t("shippingAddress")}</dt><dd>{order.shippingAddress}</dd></div>
        <div><dt>{t("total")}</dt><dd>{order.total}</dd></div>
      </dl>
      <div className={styles.itemsList}>{order.items.map((item) => <div key={`${order.id}-${item.title}`}><span><strong>{item.title}</strong><small>{item.detail}</small></span><span>{item.price}</span></div>)}</div>
      <ol className={styles.timeline}>{order.timeline.map((step) => <li key={step}>{step}</li>)}</ol>
      {Boolean(order.uuid) && ["PAID", "SHIPPED", "DELIVERED"].includes(order.status) && (
        <div className={styles.refundActionRow}>
          <button
            type="button"
            onClick={() => onRefundRequest(order)}
            disabled={order.refundRequestFiled}
          >
            {order.refundRequestFiled ? t("refundRequestReceived") : t("requestRefund")}
          </button>
        </div>
      )}
    </article>
  );
}

function RefundRequestModal({
  order,
  t,
  reason,
  contactInfo,
  submitting,
  message,
  onReasonChange,
  onContactInfoChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <form className={styles.refundModal} onSubmit={onSubmit} onClick={(event) => event.stopPropagation()}>
        <div className={styles.detailHeader}>
          <div>
            <p className={styles.eyebrow}>{t("refundRequestEyebrow")}</p>
            <h3>{t("refundRequestTitle")} {order.id}</h3>
          </div>
          <button type="button" className={styles.modalCloseButton} onClick={onClose}>
            {t("cancel")}
          </button>
        </div>
        <p className={styles.mutedText}>{t("refundRequestDescription")}</p>
        <label>
          {t("refundReason")}
          <textarea required value={reason} onChange={(event) => onReasonChange(event.target.value)} />
        </label>
        <label>
          {t("refundContactInfo")}
          <input required value={contactInfo} onChange={(event) => onContactInfoChange(event.target.value)} />
        </label>
        {message && (
          <p className={message.type === "success" ? styles.panelSuccess : styles.panelError}>
            {message.text}
          </p>
        )}
        <div className={styles.formActions}>
          <button type="submit" disabled={submitting || !reason.trim() || !contactInfo.trim()}>
            {submitting ? t("sending") : t("sendRefundRequest")}
          </button>
          <button type="button" onClick={onClose}>{t("cancel")}</button>
        </div>
      </form>
    </div>
  );
}
