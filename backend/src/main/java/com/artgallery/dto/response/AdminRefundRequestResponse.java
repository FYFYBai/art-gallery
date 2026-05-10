package com.artgallery.dto.response;

import com.artgallery.domain.order.RefundRequestEntity;
import com.artgallery.domain.order.RefundRequestStatus;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record AdminRefundRequestResponse(
        UUID id,
        UUID orderId,
        String orderNumber,
        String customerEmail,
        String reason,
        String contactInfo,
        RefundRequestStatus status,
        String rejectionReason,
        BigDecimal totalAmount,
        String currency,
        List<String> productNames,
        String stripeRefundId,
        String stripeRefundStatus,
        OffsetDateTime createdAt
) {
    public static AdminRefundRequestResponse from(RefundRequestEntity request) {
        return new AdminRefundRequestResponse(
                request.getId(),
                request.getOrder().getId(),
                request.getOrder().getOrderNumber(),
                request.getUser().getEmail(),
                request.getReason(),
                request.getContactInfo(),
                request.getStatus(),
                request.getRejectionReason(),
                request.getOrder().getTotalAmount(),
                request.getOrder().getCurrency(),
                request.getOrder().getItems().stream()
                        .map(item -> item.getArtworkTitle())
                        .toList(),
                request.getOrder().getStripeRefundId(),
                request.getOrder().getStripeRefundStatus(),
                request.getCreatedAt()
        );
    }
}
