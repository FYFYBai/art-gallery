package com.artgallery.dto.response;

import java.util.List;

public record ApiErrorResponse(
        String message,
        List<String> errors
) {
    public static ApiErrorResponse of(String message, List<String> errors) {
        return new ApiErrorResponse(message, errors);
    }
}
