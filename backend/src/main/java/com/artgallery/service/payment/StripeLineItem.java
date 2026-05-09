package com.artgallery.service.payment;

public record StripeLineItem(
        String name,
        long amountCents,
        String currency,
        long quantity
) {}
