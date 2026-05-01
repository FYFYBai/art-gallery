package com.artgallery.repository;

import com.artgallery.domain.cart.Cart;
import com.artgallery.domain.cart.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUserIdAndStatus(UUID userId, CartStatus status);
}
