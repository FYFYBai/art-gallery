package com.artgallery.service.payment;

public record StripeRefundResult(
        String id,
        String status
) {}
