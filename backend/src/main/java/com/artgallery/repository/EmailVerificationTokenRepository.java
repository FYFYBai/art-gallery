package com.artgallery.repository;

import com.artgallery.domain.user.EmailVerificationToken;
import com.artgallery.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {
    Optional<EmailVerificationToken> findByTokenHash(String tokenHash);
    Optional<EmailVerificationToken> findTopByUserAndUsedAtIsNullOrderByCreatedAtDesc(User user);
}
