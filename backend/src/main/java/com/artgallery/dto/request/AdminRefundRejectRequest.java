package com.artgallery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminRefundRejectRequest {

    @NotBlank(message = "Rejection reason is required")
    @Size(max = 2000, message = "Rejection reason is too long")
    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
