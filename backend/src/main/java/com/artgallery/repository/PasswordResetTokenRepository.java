package com.artgallery.repository;

import com.artgallery.domain.user.PasswordResetToken;
import com.artgallery.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);
    Optional<PasswordResetToken> findTopByUserAndUsedAtIsNullOrderByCreatedAtDesc(User user);
}
