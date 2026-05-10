package com.artgallery.dto.response;

import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderStatus;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record AdminOrderResponse(
        UUID id,
        String orderNumber,
        String customerEmail,
        OrderStatus orderStatus,
        BigDecimal totalAmount,
        String currency,
        int itemCount,
        List<String> productNames,
        String trackingLink,
        String stripePaymentIntentId,
        String stripeRefundId,
        String stripeRefundStatus,
        OffsetDateTime createdAt
) {
    public static AdminOrderResponse from(Order order) {
        List<String> productNames = order.getItems().stream()
                .map(item -> item.getArtworkTitle())
                .toList();
        int itemCount = order.getItems().stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();

        return new AdminOrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUser().getEmail(),
                order.getOrderStatus(),
                order.getTotalAmount(),
                order.getCurrency(),
                itemCount,
                productNames,
                order.getTrackingLink(),
                order.getStripePaymentIntentId(),
                order.getStripeRefundId(),
                order.getStripeRefundStatus(),
                order.getCreatedAt()
        );
    }
}
