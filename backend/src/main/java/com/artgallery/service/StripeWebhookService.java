package com.artgallery.service;

import com.artgallery.domain.cart.CartStatus;
import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderStatus;
import com.artgallery.domain.payment.ProcessedStripeEvent;
import com.artgallery.repository.CartRepository;
import com.artgallery.repository.OrderRepository;
import com.artgallery.repository.ProcessedStripeEventRepository;
import com.stripe.model.Event;
import com.stripe.model.Refund;
import com.stripe.model.StripeObject;
import com.stripe.model.RefundCollection;
import com.stripe.model.Charge;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StripeWebhookService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProcessedStripeEventRepository processedStripeEventRepository;
    private final CheckoutService checkoutService;
    private final EmailService emailService;
    private final String webhookSecret;

    public StripeWebhookService(OrderRepository orderRepository,
                                CartRepository cartRepository,
                                ProcessedStripeEventRepository processedStripeEventRepository,
                                CheckoutService checkoutService,
                                EmailService emailService,
                                @Value("${app.stripe.webhook-secret}") String webhookSecret) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.processedStripeEventRepository = processedStripeEventRepository;
        this.checkoutService = checkoutService;
        this.emailService = emailService;
        this.webhookSecret = webhookSecret;
    }

    @Transactional
    public void handleWebhook(String payload, String signatureHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid Stripe webhook signature");
        }

        if (processedStripeEventRepository.existsById(event.getId())) {
            return;
        }

        StripeObject object = event.getDataObjectDeserializer().getObject().orElse(null);
        if (object instanceof Session session) {
            if ("checkout.session.completed".equals(event.getType())) {
                markCheckoutCompleted(session);
            } else if ("checkout.session.expired".equals(event.getType())) {
                expireCheckout(session);
            }
        } else if (object instanceof Refund refund) {
            reconcileRefund(refund);
        } else if (object instanceof Charge charge) {
            reconcileChargeRefunds(charge);
        }

        processedStripeEventRepository.save(new ProcessedStripeEvent(event.getId(), event.getType()));
    }

    private void markCheckoutCompleted(Session session) {
        Order order = orderRepository.findByStripeCheckoutSessionId(session.getId()).orElse(null);
        if (order == null || order.getOrderStatus() != OrderStatus.PENDING) {
            return;
        }

        if (!"paid".equalsIgnoreCase(session.getPaymentStatus())) {
            return;
        }

        order.setOrderStatus(OrderStatus.PAID);
        order.setStripePaymentStatus(session.getPaymentStatus());
        order.setStripePaymentIntentId(session.getPaymentIntent());
        order.setPaidAt(OffsetDateTime.now(ZoneOffset.UTC));
        order.getItems().forEach(item -> item.getArtwork().setSoldOut(true));

        cartRepository.findByUserIdAndStatus(order.getUser().getId(), CartStatus.ACTIVE)
                .ifPresent(cart -> cart.setStatus(CartStatus.CHECKED_OUT));

        emailService.sendOrderReceiptEmail(
                order.getUser().getEmail(),
                order.getOrderNumber(),
                formatAmount(order.getTotalAmount(), order.getCurrency())
        );
    }

    private void expireCheckout(Session session) {
        Order order = orderRepository.findByStripeCheckoutSessionId(session.getId()).orElse(null);
        if (order == null || order.getOrderStatus() != OrderStatus.PENDING) {
            return;
        }

        checkoutService.releasePendingOrder(order);
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setStripePaymentStatus("expired");
    }

    private void reconcileRefund(Refund refund) {
        if (refund.getId() == null || refund.getId().isBlank()) {
            return;
        }

        Order order = orderRepository.findByStripeRefundId(refund.getId()).orElse(null);
        if (order == null) {
            return;
        }

        applyRefundStatus(order, refund);
    }

    private void reconcileChargeRefunds(Charge charge) {
        RefundCollection refunds = charge.getRefunds();
        if (refunds == null || refunds.getData() == null) {
            return;
        }

        refunds.getData().forEach(this::reconcileRefund);
    }

    private void applyRefundStatus(Order order, Refund refund) {
        order.setStripeRefundId(refund.getId());
        order.setStripeRefundStatus(refund.getStatus());

        if ("succeeded".equalsIgnoreCase(refund.getStatus())) {
            order.setOrderStatus(OrderStatus.REFUNDED);
            if (order.getRefundedAt() == null) {
                order.setRefundedAt(OffsetDateTime.now(ZoneOffset.UTC));
            }
            order.getItems().forEach(item -> item.getArtwork().setSoldOut(false));
        }
    }

    private String formatAmount(BigDecimal amount, String currency) {
        String safeCurrency = currency == null ? "CAD" : currency;
        BigDecimal safeAmount = amount == null ? BigDecimal.ZERO : amount;
        return safeAmount.toPlainString() + " " + safeCurrency;
    }
}
