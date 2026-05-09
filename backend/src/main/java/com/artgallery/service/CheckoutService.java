package com.artgallery.service;

import com.artgallery.domain.artwork.Artwork;
import com.artgallery.domain.cart.Cart;
import com.artgallery.domain.cart.CartItem;
import com.artgallery.domain.cart.CartStatus;
import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderItem;
import com.artgallery.domain.order.OrderStatus;
import com.artgallery.domain.user.User;
import com.artgallery.domain.user.UserAddress;
import com.artgallery.dto.request.CreateStripeCheckoutRequest;
import com.artgallery.dto.response.CheckoutStatusResponse;
import com.artgallery.dto.response.CreateStripeCheckoutResponse;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CartRepository;
import com.artgallery.repository.OrderRepository;
import com.artgallery.repository.UserAddressRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.payment.StripeCheckoutSessionResult;
import com.artgallery.service.payment.StripeLineItem;
import com.artgallery.service.payment.StripePaymentClient;
import com.stripe.exception.StripeException;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final CartRepository cartRepository;
    private final ArtworkRepository artworkRepository;
    private final OrderRepository orderRepository;
    private final StripePaymentClient stripePaymentClient;
    private final String frontendBaseUrl;

    public CheckoutService(UserRepository userRepository,
                           UserAddressRepository userAddressRepository,
                           CartRepository cartRepository,
                           ArtworkRepository artworkRepository,
                           OrderRepository orderRepository,
                           StripePaymentClient stripePaymentClient,
                           @Value("${app.frontend.base-url}") String frontendBaseUrl) {
        this.userRepository = userRepository;
        this.userAddressRepository = userAddressRepository;
        this.cartRepository = cartRepository;
        this.artworkRepository = artworkRepository;
        this.orderRepository = orderRepository;
        this.stripePaymentClient = stripePaymentClient;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Transactional
    public CreateStripeCheckoutResponse createStripeCheckoutSession(UUID userId, CreateStripeCheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User was not found"));
        UserAddress address = userAddressRepository.findByUserIdAndId(userId, request.getAddressId())
                .orElseThrow(() -> new IllegalArgumentException("Address was not found"));
        Cart cart = cartRepository.findActiveCartForCheckout(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        List<CartItem> sortedItems = cart.getItems().stream()
                .sorted(Comparator.comparing(item -> item.getArtwork().getId()))
                .toList();

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(address);
        order.setBillingAddress(address);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setCurrency("CAD");
        order.setTaxAmount(BigDecimal.ZERO);
        order.setShippingAmount(BigDecimal.ZERO);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : sortedItems) {
            Artwork artwork = artworkRepository.findByIdForUpdate(cartItem.getArtwork().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Artwork was not found"));
            if (!artwork.isActive() || artwork.isSoldOut()) {
                throw new IllegalArgumentException("One or more artworks are no longer available");
            }
            if (!"CAD".equalsIgnoreCase(artwork.getCurrency())) {
                throw new IllegalArgumentException("Unsupported artwork currency");
            }

            artwork.setSoldOut(true);
            BigDecimal unitPrice = artwork.getPrice();
            subtotal = subtotal.add(unitPrice);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setArtwork(artwork);
            orderItem.setArtworkTitle(artwork.getTitle());
            orderItem.setQuantity(1);
            orderItem.setUnitPrice(unitPrice);
            orderItem.setTotalPrice(unitPrice);
            order.getItems().add(orderItem);
        }

        order.setSubtotal(subtotal);
        order.setTotalAmount(subtotal);
        order = orderRepository.saveAndFlush(order);

        String currency = order.getCurrency();
        List<StripeLineItem> lineItems = order.getItems().stream()
                .map(item -> new StripeLineItem(
                        item.getArtworkTitle(),
                        toCents(item.getUnitPrice()),
                        currency,
                        1
                ))
                .toList();

        String locale = safeLocale(request.getLocale());
        String successUrl = "%s/%s/checkout/success?session_id={CHECKOUT_SESSION_ID}".formatted(frontendBaseUrl, locale);
        String cancelUrl = "%s/%s/checkout/cancel?session_id={CHECKOUT_SESSION_ID}".formatted(frontendBaseUrl, locale);

        StripeCheckoutSessionResult session;
        try {
            session = stripePaymentClient.createCheckoutSession(
                    lineItems,
                    user.getEmail(),
                    successUrl,
                    cancelUrl,
                    Map.of(
                            "orderId", order.getId().toString(),
                            "userId", user.getId().toString()
                    )
            );
        } catch (StripeException ex) {
            throw new IllegalArgumentException("Could not create Stripe checkout session");
        }

        order.setStripeCheckoutSessionId(session.id());
        order.setStripePaymentStatus("open");
        if (session.expiresAt() != null) {
            order.setCheckoutExpiresAt(OffsetDateTime.ofInstant(Instant.ofEpochSecond(session.expiresAt()), ZoneOffset.UTC));
        }

        return new CreateStripeCheckoutResponse(order.getId(), session.url(), session.id());
    }

    @Transactional(readOnly = true)
    public CheckoutStatusResponse checkoutStatus(String sessionId) {
        Order order = orderRepository.findByStripeCheckoutSessionId(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Checkout session was not found"));
        return new CheckoutStatusResponse(order.getId(), order.getOrderNumber(), order.getOrderStatus());
    }

    @Transactional
    public void cancelStripeCheckoutSession(UUID userId, String sessionId) {
        Order order = orderRepository.findByStripeCheckoutSessionId(sessionId)
                .filter(candidate -> candidate.getUser().getId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Checkout session was not found"));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            return;
        }

        try {
            stripePaymentClient.expireCheckoutSession(sessionId);
        } catch (StripeException ex) {
            throw new IllegalArgumentException("Could not cancel Stripe checkout session");
        }

        releasePendingOrder(order);
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setStripePaymentStatus("cancelled");
    }

    void releasePendingOrder(Order order) {
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            return;
        }
        order.getItems().forEach(item -> item.getArtwork().setSoldOut(false));
    }

    private String safeLocale(String locale) {
        if (locale == null) return "en";
        return switch (locale) {
            case "fr", "zh", "en" -> locale;
            default -> "en";
        };
    }

    private long toCents(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.UNNECESSARY)
                .longValueExact();
    }
}
