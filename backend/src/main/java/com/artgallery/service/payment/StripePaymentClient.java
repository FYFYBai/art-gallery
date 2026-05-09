package com.artgallery.service.payment;

import com.stripe.exception.StripeException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface StripePaymentClient {
    StripeCheckoutSessionResult createCheckoutSession(
            List<StripeLineItem> lineItems,
            String customerEmail,
            String successUrl,
            String cancelUrl,
            Map<String, String> metadata
    ) throws StripeException;

    void expireCheckoutSession(String sessionId) throws StripeException;

    void refundPayment(String paymentIntentId, BigDecimal amount, String currency) throws StripeException;
}
