package com.artgallery.dto.response;

import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderStatus;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ProfileOrderResponse(
        UUID id,
        String orderNumber,
        OrderStatus orderStatus,
        BigDecimal totalAmount,
        String currency,
        String shippingAddress,
        String paymentSummary,
        String trackingLink,
        OffsetDateTime createdAt,
        OffsetDateTime shippedAt,
        OffsetDateTime deliveredAt,
        List<Item> items
) {
    public static ProfileOrderResponse from(Order order) {
        String address = "%s, %s, %s %s".formatted(
                order.getShippingAddress().getAddressLine1(),
                order.getShippingAddress().getCity(),
                order.getShippingAddress().getProvinceState(),
                order.getShippingAddress().getPostalCode()
        );
        String payment = order.getPaymentMethod().getCardBrand() == null
                ? order.getPaymentMethod().getPaymentType().name()
                : "%s ending in %s".formatted(
                        order.getPaymentMethod().getCardBrand(),
                        order.getPaymentMethod().getCardLast4()
                );

        return new ProfileOrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getOrderStatus(),
                order.getTotalAmount(),
                order.getCurrency(),
                address,
                payment,
                order.getTrackingLink(),
                order.getCreatedAt(),
                order.getShippedAt(),
                order.getDeliveredAt(),
                order.getItems().stream()
                        .map(item -> new Item(
                                item.getArtworkTitle(),
                                item.getQuantity(),
                                item.getUnitPrice(),
                                item.getTotalPrice()
                        ))
                        .toList()
        );
    }

    public record Item(
            String title,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice
    ) {}
}
