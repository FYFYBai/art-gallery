package com.artgallery.service.payment;

public record StripeCheckoutSessionResult(
        String id,
        String url,
        Long expiresAt
) {}
