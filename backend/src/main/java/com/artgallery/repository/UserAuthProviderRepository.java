package com.artgallery.repository;

import com.artgallery.domain.user.OAuthProvider;
import com.artgallery.domain.user.UserAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserAuthProviderRepository extends JpaRepository<UserAuthProvider, UUID> {
    Optional<UserAuthProvider> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);
    List<UserAuthProvider> findByUserId(UUID userId);
}
