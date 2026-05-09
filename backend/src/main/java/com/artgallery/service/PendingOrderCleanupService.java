package com.artgallery.service;

import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderStatus;
import com.artgallery.repository.OrderRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PendingOrderCleanupService {

    private final OrderRepository orderRepository;

    public PendingOrderCleanupService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Scheduled(fixedDelayString = "${app.orders.pending-cleanup-ms:3600000}")
    @Transactional
    public void deleteExpiredPendingOrders() {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        List<Order> expiredOrders = orderRepository.findByOrderStatusAndCheckoutExpiresAtBefore(OrderStatus.PENDING, now);
        expiredOrders.forEach(order ->
                order.getItems().forEach(item -> item.getArtwork().setSoldOut(false))
        );
        orderRepository.deleteAll(expiredOrders);
    }
}
