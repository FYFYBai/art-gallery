package com.artgallery.service.payment;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripePaymentClientImpl implements StripePaymentClient {

    public StripePaymentClientImpl(@Value("${app.stripe.secret-key}") String secretKey) {
        Stripe.apiKey = secretKey;
    }

    @Override
    public StripeCheckoutSessionResult createCheckoutSession(
            List<StripeLineItem> lineItems,
            String customerEmail,
            String successUrl,
            String cancelUrl,
            Map<String, String> metadata
    ) throws StripeException {
        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCustomerEmail(customerEmail)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putAllMetadata(metadata);

        for (StripeLineItem item : lineItems) {
            builder.addLineItem(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(item.quantity())
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency(item.currency().toLowerCase())
                                            .setUnitAmount(item.amountCents())
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(item.name())
                                                            .build()
                                            )
                                            .build()
                            )
                            .build()
            );
        }

        Session session = Session.create(builder.build());
        return new StripeCheckoutSessionResult(session.getId(), session.getUrl(), session.getExpiresAt());
    }

    @Override
    public void expireCheckoutSession(String sessionId) throws StripeException {
        Session.retrieve(sessionId).expire();
    }

    @Override
    public void refundPayment(String paymentIntentId, BigDecimal amount, String currency) throws StripeException {
        Refund.create(
                RefundCreateParams.builder()
                        .setPaymentIntent(paymentIntentId)
                        .setAmount(toCents(amount))
                        .build()
        );
    }

    private long toCents(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.UNNECESSARY)
                .longValueExact();
    }
}
