package com.artgallery.repository;

import com.artgallery.domain.user.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {
    List<UserAddress> findByUserId(UUID userId);
    Optional<UserAddress> findByUserIdAndId(UUID userId, UUID id);
}
