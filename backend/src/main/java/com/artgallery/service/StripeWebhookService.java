package com.artgallery.service;

import com.artgallery.domain.cart.CartStatus;
import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderStatus;
import com.artgallery.repository.CartRepository;
import com.artgallery.repository.OrderRepository;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StripeWebhookService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CheckoutService checkoutService;
    private final String webhookSecret;

    public StripeWebhookService(OrderRepository orderRepository,
                                CartRepository cartRepository,
                                CheckoutService checkoutService,
                                @Value("${app.stripe.webhook-secret}") String webhookSecret) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.checkoutService = checkoutService;
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

        StripeObject object = event.getDataObjectDeserializer().getObject().orElse(null);
        if (!(object instanceof Session session)) {
            return;
        }

        if ("checkout.session.completed".equals(event.getType())) {
            markCheckoutCompleted(session);
        } else if ("checkout.session.expired".equals(event.getType())) {
            expireCheckout(session);
        }
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
}
