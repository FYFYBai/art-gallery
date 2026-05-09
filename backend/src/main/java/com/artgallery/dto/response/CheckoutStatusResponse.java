package com.artgallery.dto.response;

import com.artgallery.domain.order.OrderStatus;
import java.util.UUID;

public record CheckoutStatusResponse(
        UUID orderId,
        String orderNumber,
        OrderStatus status
) {}
