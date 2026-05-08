package com.artgallery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PageViewRequest {

    @NotBlank(message = "Path is required")
    @Size(max = 512, message = "Path is too long")
    private String path;

    @NotBlank(message = "Locale is required")
    @Size(max = 10, message = "Locale is too long")
    private String locale;

    @NotBlank(message = "Session id is required")
    @Size(max = 128, message = "Session id is too long")
    private String sessionId;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
