package com.artgallery.dto.response;

import java.util.UUID;

public record CreateStripeCheckoutResponse(
        UUID orderId,
        String checkoutUrl,
        String stripeCheckoutSessionId
) {}
