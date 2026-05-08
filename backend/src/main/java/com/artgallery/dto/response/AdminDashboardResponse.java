package com.artgallery.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record AdminDashboardResponse(
        long userCount,
        long orderCount,
        long deliveryQueueCount,
        long artworkCount,
        BigDecimal revenueTotal,
        List<MonthlyTransaction> monthlyTransactions,
        List<DailyViews> viewsLast40Days,
        List<AdminOrderResponse> deliveryQueue,
        List<AdminOrderResponse> shippedOrders
) {
    public record MonthlyTransaction(
            String month,
            long orderCount,
            BigDecimal totalAmount
    ) {}

    public record DailyViews(
            String date,
            long views,
            long uniqueViews
    ) {}
}
