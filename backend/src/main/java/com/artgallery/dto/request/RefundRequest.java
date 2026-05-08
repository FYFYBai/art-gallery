package com.artgallery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RefundRequest {

    @NotBlank(message = "Reason is required")
    @Size(max = 2000, message = "Reason is too long")
    private String reason;

    @NotBlank(message = "Contact information is required")
    @Size(max = 255, message = "Contact information is too long")
    private String contactInfo;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }
}
