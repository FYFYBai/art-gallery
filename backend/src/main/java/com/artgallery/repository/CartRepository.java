package com.artgallery.repository;

import com.artgallery.domain.cart.Cart;
import com.artgallery.domain.cart.CartStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUserIdAndStatus(UUID userId, CartStatus status);

    @EntityGraph(attributePaths = {"items", "items.artwork"})
    @Query("select c from Cart c where c.user.id = :userId and c.status = :status")
    Optional<Cart> findActiveCartForCheckout(@Param("userId") UUID userId, @Param("status") CartStatus status);
}
