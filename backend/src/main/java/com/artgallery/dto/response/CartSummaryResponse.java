package com.artgallery.dto.response;

import com.artgallery.domain.cart.Cart;
import java.math.BigDecimal;
import java.util.UUID;

public record CartSummaryResponse(
        UUID id,
        int itemCount,
        BigDecimal subtotal,
        String message
) {
    public static CartSummaryResponse from(Cart cart, String message) {
        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int itemCount = cart.getItems().stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();

        return new CartSummaryResponse(cart.getId(), itemCount, subtotal, message);
    }
}
