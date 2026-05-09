package com.artgallery.dto.response;

import com.artgallery.domain.cart.Cart;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartResponse(
        UUID id,
        List<CartItemResponse> items,
        int itemCount,
        BigDecimal subtotal,
        boolean canCheckout
) {
    public static CartResponse from(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(CartItemResponse::from)
                .toList();
        BigDecimal subtotal = items.stream()
                .filter(CartItemResponse::available)
                .map(CartItemResponse::unitPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        boolean canCheckout = !items.isEmpty() && items.stream().allMatch(CartItemResponse::available);

        return new CartResponse(cart.getId(), items, items.size(), subtotal, canCheckout);
    }

    public static CartResponse empty() {
        return new CartResponse(null, List.of(), 0, BigDecimal.ZERO, false);
    }
}
