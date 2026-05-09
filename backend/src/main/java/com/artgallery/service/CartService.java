package com.artgallery.service;

import com.artgallery.domain.artwork.Artwork;
import com.artgallery.domain.cart.Cart;
import com.artgallery.domain.cart.CartItem;
import com.artgallery.domain.cart.CartStatus;
import com.artgallery.domain.user.User;
import com.artgallery.dto.response.CartSummaryResponse;
import com.artgallery.dto.response.CartResponse;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CartItemRepository;
import com.artgallery.repository.CartRepository;
import com.artgallery.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ArtworkRepository artworkRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.artworkRepository = artworkRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CartSummaryResponse addArtwork(UUID userId, UUID artworkId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User was not found"));
        Artwork artwork = artworkRepository.findByIdAndActiveTrue(artworkId)
                .orElseThrow(() -> new EntityNotFoundException("Artwork was not found"));

        if (artwork.isSoldOut()) {
            throw new IllegalArgumentException("Artwork is sold");
        }

        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setStatus(CartStatus.ACTIVE);
                    return cartRepository.save(newCart);
                });

        if (cartItemRepository.findByCartIdAndArtworkId(cart.getId(), artworkId).isPresent()) {
            return CartSummaryResponse.from(cart, "Artwork is already in cart");
        }

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setArtwork(artwork);
        item.setQuantity(1);
        item.setUnitPrice(artwork.getPrice());
        cart.getItems().add(item);
        cartItemRepository.save(item);

        return CartSummaryResponse.from(cart, "Artwork added to cart");
    }

    @Transactional(readOnly = true)
    public CartResponse getActiveCart(UUID userId) {
        return cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .map(CartResponse::from)
                .orElseGet(CartResponse::empty);
    }

    @Transactional
    public CartResponse removeItem(UUID userId, UUID itemId) {
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new EntityNotFoundException("Cart was not found"));
        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Cart item was not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return CartResponse.from(cart);
    }
}
