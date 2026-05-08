"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "../../../i18n/IntlContext";
import styles from "./AdminPage.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const emptyArtworkForm = {
  imageUrl: "",
  artworkType: "",
  series: "",
  description: "",
  name: "",
  price: "",
  size: "",
  year: "2026",
};

const sampleDashboard = {
  userCount: 24,
  orderCount: 18,
  deliveryQueueCount: 4,
  artworkCount: 36,
  revenueTotal: 28420,
  monthlyTransactions: [
    { month: "2026-01", orderCount: 2, totalAmount: 2140 },
    { month: "2026-02", orderCount: 3, totalAmount: 4180 },
    { month: "2026-03", orderCount: 5, totalAmount: 7600 },
    { month: "2026-04", orderCount: 4, totalAmount: 6400 },
    { month: "2026-05", orderCount: 4, totalAmount: 8100 },
  ],
  viewsLast40Days: Array.from({ length: 40 }, (_, index) => ({
    date: `D-${39 - index}`,
    views: 42 + ((index * 17) % 38),
  })),
  deliveryQueue: [
    {
      id: "sample-order-1",
      orderNumber: "SA-014",
      customerEmail: "collector@example.com",
      orderStatus: "PAID",
      totalAmount: 1280,
      currency: "CAD",
      itemCount: 1,
      productNames: ["Paysage ouvert"],
      createdAt: "2026-05-04T10:00:00Z",
    },
  ],
  shippedOrders: [
    {
      id: "sample-order-3",
      orderNumber: "SA-011",
      customerEmail: "collector@example.com",
      orderStatus: "SHIPPED",
      totalAmount: 1460,
      currency: "CAD",
      itemCount: 1,
      productNames: ["Présence urbaine"],
      trackingLink: "https://tracking.example.com/SA-011",
      createdAt: "2026-05-01T10:00:00Z",
    },
  ],
  refundRequests: [
    {
      id: "sample-refund-1",
      orderId: "sample-order-2",
      orderNumber: "SA-009",
      customerEmail: "privatebuyer@example.com",
      reason: "The color does not work in the intended room.",
      contactInfo: "privatebuyer@example.com",
      status: "PENDING",
      totalAmount: 760,
      currency: "CAD",
      productNames: ["Silence nocturne"],
      createdAt: "2026-05-07T10:00:00Z",
    },
  ],
};

const sampleUsers = [
  {
    id: "sample-user-1",
    email: "collector@example.com",
    firstName: "Claire",
    lastName: "Martin",
    active: true,
    emailVerified: true,
    role: "USER",
    createdAt: "2026-04-14T10:00:00Z",
  },
  {
    id: "sample-user-2",
    email: "privatebuyer@example.com",
    firstName: "Daniel",
    lastName: "Lee",
    active: true,
    emailVerified: false,
    role: "USER",
    createdAt: "2026-05-02T10:00:00Z",
  },
];

const sampleOrders = [
  ...sampleDashboard.deliveryQueue,
  ...sampleDashboard.shippedOrders,
  {
    id: "sample-order-2",
    orderNumber: "SA-009",
    customerEmail: "privatebuyer@example.com",
    orderStatus: "DELIVERED",
    totalAmount: 760,
    currency: "CAD",
    itemCount: 1,
    productNames: ["Silence nocturne"],
    createdAt: "2026-03-16T10:00:00Z",
  },
];

const sampleArtworks = [
  {
    id: "sample-artwork-1",
    imageUrl: "/images/curator-favorites/2.jpg",
    artworkType: "Oil painting",
    series: "Paysages",
    description: "A quiet blue landscape study for the admin product preview.",
    name: "Paysage ouvert",
    price: 980,
    currency: "CAD",
    size: "40 x 50 cm",
    year: 2026,
    active: true,
    soldOut: false,
    createdAt: "2026-04-20T10:00:00Z",
  },
];

function readStoredAuth() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function formatCurrency(value, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatShortDate(value) {
  const parts = String(value || "").split("-");
  if (parts.length !== 3) return value;
  return `${parts[1]}/${parts[2]}`;
}

function buildWeeklyViews(dailyViews) {
  const weeks = [];

  for (let index = 0; index < dailyViews.length; index += 7) {
    const days = dailyViews.slice(index, index + 7);
    const views = days.reduce((sum, item) => sum + Number(item.views || 0), 0);
    const uniqueViews = days.reduce(
      (sum, item) => sum + Number(item.uniqueViews || 0),
      0,
    );
    const firstDay = formatShortDate(days[0]?.date || "");
    const lastDay = formatShortDate(days[days.length - 1]?.date || "");
    weeks.push({
      label: firstDay && lastDay ? `${firstDay} - ${lastDay}` : `Week ${weeks.length + 1}`,
      views,
      uniqueViews,
    });
  }

  return weeks;
}

export default function AdminPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const { locale } = useParams();
  const [auth, setAuth] = useState(null);
  const [dashboard, setDashboard] = useState(sampleDashboard);
  const [users, setUsers] = useState(sampleUsers);
  const [orders, setOrders] = useState(sampleOrders);
  const [shippedOrders, setShippedOrders] = useState(sampleDashboard.shippedOrders);
  const [refundRequests, setRefundRequests] = useState(sampleDashboard.refundRequests);
  const [artworks, setArtworks] = useState(sampleArtworks);
  const [userQuery, setUserQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [shippedOrderQuery, setShippedOrderQuery] = useState("");
  const [artworkQuery, setArtworkQuery] = useState("");
  const [artworkForm, setArtworkForm] = useState(emptyArtworkForm);
  const [editingArtworkId, setEditingArtworkId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [accessVerified, setAccessVerified] = useState(false);

  const maxMonthlyValue = useMemo(
    () =>
      Math.max(
        1,
        ...dashboard.monthlyTransactions.map((item) =>
          Number(item.totalAmount || 0),
        ),
      ),
    [dashboard.monthlyTransactions],
  );

  const weeklyViews = useMemo(
    () => buildWeeklyViews(dashboard.viewsLast40Days),
    [dashboard.viewsLast40Days],
  );
  const maxWeeklyViews = useMemo(
    () => Math.max(1, ...weeklyViews.map((item) => item.views)),
    [weeklyViews],
  );

  const apiFetch = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
        ...(options.headers || {}),
      },
    });

    if (response.status === 401 || response.status === 403) {
      router.replace(`/${locale}`);
      throw new Error("Not authorised");
    }

    return response;
  };

  const loadAdminData = async () => {
    if (!auth) return;

    setLoading(true);

    try {
      const dashboardResponse = await apiFetch("/api/admin/dashboard");
      const dashboardResult = await dashboardResponse.json();
      setAccessVerified(true);

      const [usersResponse, ordersResponse, artworksResponse, refundRequestsResponse] =
        await Promise.all([
          apiFetch("/api/admin/users"),
          apiFetch("/api/admin/orders"),
          apiFetch("/api/admin/artworks"),
          apiFetch("/api/admin/refund-requests"),
        ]);

      setDashboard(dashboardResult);
      setShippedOrders(dashboardResult.shippedOrders || []);
      setUsers(await usersResponse.json());
      setOrders(await ordersResponse.json());
      setArtworks(await artworksResponse.json());
      setRefundRequests(await refundRequestsResponse.json());
    } catch (error) {
      if (error.message !== "Not authorised") {
        setNotice(t("sampleFallback"));
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshOrderData = async () => {
    if (!auth) return;

    const [dashboardResponse, ordersResponse, shippedOrdersResponse, refundRequestsResponse] =
      await Promise.all([
        apiFetch("/api/admin/dashboard"),
        apiFetch(`/api/admin/orders?query=${encodeURIComponent(orderQuery)}`),
        apiFetch(
          `/api/admin/orders/shipped?query=${encodeURIComponent(shippedOrderQuery)}`,
        ),
        apiFetch("/api/admin/refund-requests"),
      ]);

    setDashboard(await dashboardResponse.json());
    setOrders(await ordersResponse.json());
    setShippedOrders(await shippedOrdersResponse.json());
    setRefundRequests(await refundRequestsResponse.json());
  };

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const storedAuth = readStoredAuth();

      if (!storedAuth || storedAuth.role !== "ADMIN") {
        window.localStorage.removeItem("auth");
        window.dispatchEvent(new StorageEvent("storage", { key: "auth", newValue: null }));
        router.replace(`/${locale}`);
        return;
      }

      setAuth(storedAuth);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [locale, router]);

  useEffect(() => {
    if (!auth) return undefined;

    const timerId = window.setTimeout(() => {
      loadAdminData();
    }, 0);

    return () => window.clearTimeout(timerId);
    // Admin data intentionally reloads only when the authenticated admin changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const searchUsers = async (event) => {
    event.preventDefault();
    if (!auth) return;

    try {
      const response = await apiFetch(
        `/api/admin/users?query=${encodeURIComponent(userQuery)}`,
      );
      setUsers(await response.json());
    } catch {
      setNotice(t("actionFailed"));
    }
  };

  const searchOrders = async (event) => {
    event.preventDefault();
    if (!auth) return;

    try {
      const response = await apiFetch(
        `/api/admin/orders?query=${encodeURIComponent(orderQuery)}`,
      );
      setOrders(await response.json());
    } catch {
      setNotice(t("actionFailed"));
    }
  };

  const searchShippedOrders = async (event) => {
    event.preventDefault();
    if (!auth) return;

    try {
      const response = await apiFetch(
        `/api/admin/orders/shipped?query=${encodeURIComponent(shippedOrderQuery)}`,
      );
      setShippedOrders(await response.json());
    } catch {
      setNotice(t("actionFailed"));
    }
  };

  const searchArtworks = async (event) => {
    event.preventDefault();
    if (!auth) return;

    try {
      const response = await apiFetch(
        `/api/admin/artworks?query=${encodeURIComponent(artworkQuery)}`,
      );
      setArtworks(await response.json());
    } catch {
      setNotice(t("actionFailed"));
    }
  };

  const updateUserActive = async (user) => {
    if (!auth || user.id.startsWith("sample")) return;

    if (user.active && !window.confirm(t("banUserConfirm"))) {
      return;
    }

    try {
      const response = await apiFetch(`/api/admin/users/${user.id}/active`, {
        method: "PATCH",
        body: JSON.stringify({ active: !user.active }),
      });
      const updated = await response.json();
      setUsers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch {
      setNotice(t("actionFailed"));
    }
  };

  const deleteUserForDevelopment = async (user) => {
    if (!auth || user.id.startsWith("sample")) return;

    if (!window.confirm(t("deleteUserConfirm"))) {
      return;
    }

    try {
      await apiFetch(`/api/admin/users/${user.id}/dev`, {
        method: "DELETE",
      });
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setNotice(t("userDeleted"));
      await loadAdminData();
    } catch {
      setNotice(t("userDeleteFailed"));
    }
  };

  const shipOrder = async (order) => {
    if (!auth || order.id.startsWith("sample")) return;

    const trackingLink = window.prompt(t("trackingLinkPrompt"));
    if (!trackingLink) return;

    try {
      await apiFetch(`/api/admin/orders/${order.id}/ship`, {
        method: "PATCH",
        body: JSON.stringify({ trackingLink }),
      });
      setNotice(t("orderShipped"));
      await refreshOrderData();
    } catch {
      setNotice(t("orderShipFailed"));
    }
  };

  const markOrderDelivered = async (order) => {
    if (!auth || order.id.startsWith("sample")) return;

    if (!window.confirm(t("markDeliveredConfirm"))) {
      return;
    }

    try {
      await apiFetch(`/api/admin/orders/${order.id}/deliver`, {
        method: "PATCH",
      });
      setNotice(t("orderDelivered"));
      await refreshOrderData();
    } catch {
      setNotice(t("actionFailed"));
    }
  };

  const approveRefundRequest = async (refundRequest) => {
    if (!auth || refundRequest.id.startsWith("sample")) return;

    if (!window.confirm(t("approveRefundConfirm"))) {
      return;
    }

    try {
      await apiFetch(`/api/admin/refund-requests/${refundRequest.id}/approve`, {
        method: "PATCH",
      });
      setNotice(t("refundApproved"));
      await refreshOrderData();
    } catch {
      setNotice(t("refundApproveFailed"));
    }
  };

  const editArtwork = (artwork) => {
    setEditingArtworkId(artwork.id);
    setShowProductForm(true);
    setArtworkForm({
      imageUrl: artwork.imageUrl || "",
      artworkType: artwork.artworkType || "",
      series: artwork.series || "",
      description: artwork.description || "",
      name: artwork.name || "",
      price: artwork.price || "",
      size: artwork.size || "",
      year: artwork.year || "",
    });
  };

  const startAddProduct = () => {
    setEditingArtworkId(null);
    setArtworkForm(emptyArtworkForm);
    setShowProductForm(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !auth) return;

    const formData = new FormData();
    formData.append("image", file);
    setIsUploadingImage(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/artworks/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setArtworkForm((current) => ({ ...current, imageUrl: result.imageUrl }));
    } catch {
      setNotice(t("imageUploadFailed"));
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const submitArtwork = async (event) => {
    event.preventDefault();
    if (!auth) return;

    const payload = {
      ...artworkForm,
      price: Number(artworkForm.price),
      year: artworkForm.year ? Number(artworkForm.year) : null,
    };

    try {
      const response = await apiFetch(
        editingArtworkId
          ? `/api/admin/artworks/${editingArtworkId}`
          : "/api/admin/artworks",
        {
          method: editingArtworkId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );
      const saved = await response.json();
      setArtworks((current) => {
        const withoutSaved = current.filter((item) => item.id !== saved.id);
        return [saved, ...withoutSaved];
      });
      setArtworkForm(emptyArtworkForm);
      setEditingArtworkId(null);
      setShowProductForm(false);
      setNotice(t("productSaved"));
      await loadAdminData();
    } catch {
      setNotice(t("productSaveFailed"));
    }
  };

  if (!auth || !accessVerified) return null;

  return (
    <main className={styles.adminPage}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>
        <div className={styles.adminIdentity}>
          <span>{t("signedIn")}</span>
          <strong>{auth.email}</strong>
          <small>{loading ? t("syncing") : t("synced")}</small>
        </div>
      </section>

      {notice && <p className={styles.notice}>{notice}</p>}

      <section className={styles.metricGrid} aria-label={t("metrics")}>
        <Metric label={t("users")} value={dashboard.userCount} />
        <Metric label={t("orders")} value={dashboard.orderCount} />
        <Metric label={t("deliveryQueue")} value={dashboard.deliveryQueueCount} />
        <Metric label={t("products")} value={dashboard.artworkCount} />
        <Metric
          label={t("revenue")}
          value={formatCurrency(dashboard.revenueTotal)}
        />
      </section>

      <section className={styles.dashboardGrid}>
        <Panel title={t("transactionsByMonth")} eyebrow={t("actualNumbers")}>
          <div className={styles.barChart}>
            {dashboard.monthlyTransactions.map((item) => (
              <div key={item.month} className={styles.barRow}>
                <span>{item.month}</span>
                <div>
                  <i
                    style={{
                      width: `${Math.max(
                        6,
                        (Number(item.totalAmount || 0) / maxMonthlyValue) * 100,
                      )}%`,
                    }}
                  />
                </div>
                <strong>
                  {item.orderCount} / {formatCurrency(item.totalAmount)}
                </strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={t("viewsLast40Days")} eyebrow={t("traffic")}>
          <div className={styles.weeklyViewsChart}>
            {weeklyViews.map((item, index) => (
              <div key={`${item.label}-${index}`} className={styles.weeklyViewBar}>
                <span>{t("weekLabel")} {index + 1}</span>
                <div>
                  <i
                    style={{
                      height: `${Math.max(8, (item.views / maxWeeklyViews) * 100)}%`,
                    }}
                  />
                </div>
                <strong>{item.views}</strong>
                <small>{t("uniqueViews")}: {item.uniqueViews}</small>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className={styles.managementGrid}>
        <Panel title={t("accountLookup")} eyebrow={t("accountManagement")}>
          <SearchForm
            value={userQuery}
            placeholder={t("searchUserPlaceholder")}
            button={t("search")}
            onChange={setUserQuery}
            onSubmit={searchUsers}
          />
          <div className={styles.listStack}>
            {users.map((user) => (
              <article key={user.id} className={styles.rowCard}>
                <div>
                  <strong>{user.email}</strong>
                  <span>
                    {user.role} / {user.emailVerified ? t("verified") : t("unverified")}
                  </span>
                </div>
                <div className={styles.rowActions}>
                  <button type="button" onClick={() => updateUserActive(user)}>
                    {user.active ? t("ban") : t("enable")}
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => deleteUserForDevelopment(user)}
                  >
                    {t("deleteDev")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title={t("orderSearch")} eyebrow={t("orderManagement")}>
          <SearchForm
            value={orderQuery}
            placeholder={t("searchOrderPlaceholder")}
            button={t("search")}
            onChange={setOrderQuery}
            onSubmit={searchOrders}
          />
          <div className={styles.listStack}>
            {orders.map((order) => (
              <article key={order.id} className={styles.rowCard}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <span>
                    {order.customerEmail} / {order.productNames.join(", ")}
                  </span>
                  <small>{formatCurrency(order.totalAmount, order.currency)}</small>
                </div>
                <StatusPill status={order.orderStatus} />
              </article>
            ))}
          </div>
        </Panel>

        <Panel title={t("refundRequestsTitle")} eyebrow={t("refundRequests")}>
          <div className={styles.listStack}>
            {refundRequests.length === 0 ? (
              <p className={styles.emptyText}>{t("noRefundRequests")}</p>
            ) : (
              refundRequests.map((refundRequest) => (
                <article key={refundRequest.id} className={styles.rowCard}>
                  <div>
                    <strong>{refundRequest.orderNumber}</strong>
                    <span>
                      {refundRequest.customerEmail} / {refundRequest.productNames.join(", ")}
                    </span>
                    <small>{formatCurrency(refundRequest.totalAmount, refundRequest.currency)}</small>
                    <small>{t("refundReasonLabel")}: {refundRequest.reason}</small>
                    <small>{t("refundContactLabel")}: {refundRequest.contactInfo}</small>
                  </div>
                  <div className={styles.rowActions}>
                    <StatusPill status={refundRequest.status} />
                    <button type="button" onClick={() => approveRefundRequest(refundRequest)}>
                      {t("approveRefund")}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </Panel>

        <Panel title={t("deliveryQueueTitle")} eyebrow={t("deliveryQueue")}>
          <div className={styles.listStack}>
            {dashboard.deliveryQueue.length === 0 ? (
              <p className={styles.emptyText}>{t("noDeliveryOrders")}</p>
            ) : (
              dashboard.deliveryQueue.map((order) => (
                <article key={order.id} className={styles.rowCard}>
                  <div>
                    <strong>{order.orderNumber}</strong>
                    <span>
                      {order.customerEmail} / {order.productNames.join(", ")}
                    </span>
                    <small>{formatCurrency(order.totalAmount, order.currency)}</small>
                  </div>
                  <div className={styles.rowActions}>
                    <StatusPill status={order.orderStatus} />
                    <button type="button" onClick={() => shipOrder(order)}>
                      {t("markShipped")}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </Panel>

        <Panel title={t("shippedOrdersTitle")} eyebrow={t("shippedOrders")}>
          <SearchForm
            value={shippedOrderQuery}
            placeholder={t("searchOrderPlaceholder")}
            button={t("search")}
            onChange={setShippedOrderQuery}
            onSubmit={searchShippedOrders}
          />
          <div className={styles.listStack}>
            {shippedOrders.length === 0 ? (
              <p className={styles.emptyText}>{t("noShippedOrders")}</p>
            ) : (
              shippedOrders.map((order) => (
                <article key={order.id} className={styles.rowCard}>
                  <div>
                    <strong>{order.orderNumber}</strong>
                    <span>
                      {order.customerEmail} / {order.productNames.join(", ")}
                    </span>
                    <small>{order.trackingLink || t("noTrackingLink")}</small>
                  </div>
                  <div className={styles.rowActions}>
                    <StatusPill status={order.orderStatus} />
                    <button type="button" onClick={() => markOrderDelivered(order)}>
                      {t("markDelivered")}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </Panel>
      </section>

      <section className={styles.productPanel}>
        <Panel title={t("productManagement")} eyebrow={t("inventory")}>
          <div className={styles.productToolbar}>
            <SearchForm
              value={artworkQuery}
              placeholder={t("searchProductPlaceholder")}
              button={t("search")}
              onChange={setArtworkQuery}
              onSubmit={searchArtworks}
            />
            <button type="button" onClick={startAddProduct}>
              {t("addProduct")}
            </button>
          </div>

          {showProductForm && (
            <form className={styles.productForm} onSubmit={submitArtwork}>
              <div className={styles.uploadField}>
                <span>{t("image")}</span>
                <input id="admin-product-image" type="file" accept="image/*" onChange={handleImageUpload} />
                <label htmlFor="admin-product-image">
                  {isUploadingImage ? t("uploadingImage") : t("uploadImage")}
                </label>
                {artworkForm.imageUrl && <small>{artworkForm.imageUrl}</small>}
              </div>
              <label>{t("artworkType")}<input required value={artworkForm.artworkType} onChange={(event) => setArtworkForm((current) => ({ ...current, artworkType: event.target.value }))} /></label>
              <label>{t("series")}<input value={artworkForm.series} onChange={(event) => setArtworkForm((current) => ({ ...current, series: event.target.value }))} /></label>
              <label>{t("name")}<input required value={artworkForm.name} onChange={(event) => setArtworkForm((current) => ({ ...current, name: event.target.value }))} /></label>
              <label>{t("price")}<input required type="number" min="0.01" step="0.01" value={artworkForm.price} onChange={(event) => setArtworkForm((current) => ({ ...current, price: event.target.value }))} /></label>
              <label>{t("size")}<input value={artworkForm.size} onChange={(event) => setArtworkForm((current) => ({ ...current, size: event.target.value }))} /></label>
              <label>{t("year")}<input type="number" min="1900" max="2100" value={artworkForm.year} onChange={(event) => setArtworkForm((current) => ({ ...current, year: event.target.value }))} /></label>
              <label className={styles.descriptionField}>{t("description")}<textarea value={artworkForm.description} onChange={(event) => setArtworkForm((current) => ({ ...current, description: event.target.value }))} /></label>
              <div className={styles.formActions}>
                <button type="submit" disabled={!artworkForm.imageUrl || isUploadingImage}>
                  {editingArtworkId ? t("updateProduct") : t("saveProduct")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingArtworkId(null);
                    setArtworkForm(emptyArtworkForm);
                    setShowProductForm(false);
                  }}
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          )}

          <div className={styles.productGrid}>
            {artworks.map((artwork) => (
              <article key={artwork.id} className={styles.productCard}>
                {artwork.imageUrl && <img src={artwork.imageUrl} alt={artwork.name} />}
                <div>
                  <strong>{artwork.name}</strong>
                  <span>
                    {artwork.artworkType} / {artwork.series || t("noSeries")}
                  </span>
                  <small>
                    {formatCurrency(artwork.price, artwork.currency)} / {artwork.size || t("noSize")} / {artwork.year || t("noYear")}
                  </small>
                  <button type="button" onClick={() => editArtwork(artwork)}>
                    {t("edit")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <article className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Panel({ title, eyebrow, children }) {
  return (
    <article className={styles.panel}>
      <p className={styles.panelEyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </article>
  );
}

function StatusPill({ status }) {
  const statusClass = styles[`status${status}`] || "";

  return (
    <span className={`${styles.statusPill} ${statusClass}`}>
      {status}
    </span>
  );
}

function SearchForm({ value, placeholder, button, onChange, onSubmit }) {
  return (
    <form className={styles.searchForm} onSubmit={onSubmit}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit">{button}</button>
    </form>
  );
}
