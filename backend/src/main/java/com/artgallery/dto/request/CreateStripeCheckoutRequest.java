package com.artgallery.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateStripeCheckoutRequest {

    @NotNull(message = "Address is required")
    private UUID addressId;

    @AssertTrue(message = "Terms and policies must be accepted before checkout")
    private boolean acceptedTerms;

    private String locale = "en";

    public UUID getAddressId() { return addressId; }
    public void setAddressId(UUID addressId) { this.addressId = addressId; }
    public boolean isAcceptedTerms() { return acceptedTerms; }
    public void setAcceptedTerms(boolean acceptedTerms) { this.acceptedTerms = acceptedTerms; }
    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }
}
