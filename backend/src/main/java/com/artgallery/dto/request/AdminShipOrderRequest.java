package com.artgallery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AdminShipOrderRequest {

    @NotBlank(message = "Tracking link is required")
    @Size(max = 1000, message = "Tracking link is too long")
    @Pattern(regexp = "^https?://.+", message = "Tracking link must start with http:// or https://")
    private String trackingLink;

    public String getTrackingLink() {
        return trackingLink;
    }

    public void setTrackingLink(String trackingLink) {
        this.trackingLink = trackingLink;
    }
}
