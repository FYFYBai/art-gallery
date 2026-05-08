package com.artgallery.service;

import com.artgallery.repository.OrderRepository;
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
        orderRepository.deleteExpiredPendingOrders();
    }
}
