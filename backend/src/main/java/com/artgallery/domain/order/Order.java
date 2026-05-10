package com.artgallery.domain.order;

import com.artgallery.domain.BaseEntity;
import com.artgallery.domain.user.User;
import com.artgallery.domain.user.UserAddress;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id", nullable = false)
    private UserAddress shippingAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billing_address_id", nullable = false)
    private UserAddress billingAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 20)
    private OrderStatus orderStatus = OrderStatus.PENDING;

    @Column(name = "order_number", nullable = false, length = 32, unique = true, insertable = false, updatable = false)
    private String orderNumber;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @Column(name = "tax_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal taxAmount;

    @Column(name = "shipping_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal shippingAmount;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 10)
    private String currency = "CAD";

    @Column(name = "tracking_link", length = 1000)
    private String trackingLink;

    @Column(name = "shipped_at")
    private OffsetDateTime shippedAt;

    @Column(name = "delivered_at")
    private OffsetDateTime deliveredAt;

    @Column(name = "stripe_checkout_session_id", length = 255)
    private String stripeCheckoutSessionId;

    @Column(name = "stripe_payment_intent_id", length = 255)
    private String stripePaymentIntentId;

    @Column(name = "stripe_payment_status", length = 50)
    private String stripePaymentStatus;

    @Column(name = "stripe_refund_id", length = 255)
    private String stripeRefundId;

    @Column(name = "stripe_refund_status", length = 50)
    private String stripeRefundStatus;

    @Column(name = "paid_at")
    private OffsetDateTime paidAt;

    @Column(name = "refunded_at")
    private OffsetDateTime refundedAt;

    @Column(name = "checkout_expires_at")
    private OffsetDateTime checkoutExpiresAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public UserAddress getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(UserAddress shippingAddress) { this.shippingAddress = shippingAddress; }
    public UserAddress getBillingAddress() { return billingAddress; }
    public void setBillingAddress(UserAddress billingAddress) { this.billingAddress = billingAddress; }
    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }
    public String getOrderNumber() { return orderNumber; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getShippingAmount() { return shippingAmount; }
    public void setShippingAmount(BigDecimal shippingAmount) { this.shippingAmount = shippingAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getTrackingLink() { return trackingLink; }
    public void setTrackingLink(String trackingLink) { this.trackingLink = trackingLink; }
    public OffsetDateTime getShippedAt() { return shippedAt; }
    public void setShippedAt(OffsetDateTime shippedAt) { this.shippedAt = shippedAt; }
    public OffsetDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(OffsetDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
    public String getStripeCheckoutSessionId() { return stripeCheckoutSessionId; }
    public void setStripeCheckoutSessionId(String stripeCheckoutSessionId) { this.stripeCheckoutSessionId = stripeCheckoutSessionId; }
    public String getStripePaymentIntentId() { return stripePaymentIntentId; }
    public void setStripePaymentIntentId(String stripePaymentIntentId) { this.stripePaymentIntentId = stripePaymentIntentId; }
    public String getStripePaymentStatus() { return stripePaymentStatus; }
    public void setStripePaymentStatus(String stripePaymentStatus) { this.stripePaymentStatus = stripePaymentStatus; }
    public String getStripeRefundId() { return stripeRefundId; }
    public void setStripeRefundId(String stripeRefundId) { this.stripeRefundId = stripeRefundId; }
    public String getStripeRefundStatus() { return stripeRefundStatus; }
    public void setStripeRefundStatus(String stripeRefundStatus) { this.stripeRefundStatus = stripeRefundStatus; }
    public OffsetDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(OffsetDateTime paidAt) { this.paidAt = paidAt; }
    public OffsetDateTime getRefundedAt() { return refundedAt; }
    public void setRefundedAt(OffsetDateTime refundedAt) { this.refundedAt = refundedAt; }
    public OffsetDateTime getCheckoutExpiresAt() { return checkoutExpiresAt; }
    public void setCheckoutExpiresAt(OffsetDateTime checkoutExpiresAt) { this.checkoutExpiresAt = checkoutExpiresAt; }
    public List<OrderItem> getItems() { return items; }
}
