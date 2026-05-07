package com.artgallery.dto.response;

import java.util.UUID;

public record LoginResponse(
        UUID id,
        String email,
        String role,
        String token
) {
}
