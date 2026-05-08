package com.artgallery.dto.response;

import com.artgallery.domain.user.Role;
import com.artgallery.domain.user.User;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AdminUserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        boolean active,
        boolean emailVerified,
        Role role,
        OffsetDateTime createdAt
) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.isActive(),
                user.isEmailVerified(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
