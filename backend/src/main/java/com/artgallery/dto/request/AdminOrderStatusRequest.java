package com.artgallery.dto.request;

import com.artgallery.domain.order.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class AdminOrderStatusRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus orderStatus;

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }
}
