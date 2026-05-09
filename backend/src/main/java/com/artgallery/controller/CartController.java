package com.artgallery.controller;

import com.artgallery.dto.request.AddCartItemRequest;
import com.artgallery.dto.response.CartResponse;
import com.artgallery.dto.response.CartSummaryResponse;
import com.artgallery.service.CartService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/items")
    public CartSummaryResponse addItem(Authentication authentication,
                                       @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addArtwork(UUID.fromString(authentication.getName()), request.getArtworkId());
    }

    @GetMapping
    public CartResponse getCart(Authentication authentication) {
        return cartService.getActiveCart(UUID.fromString(authentication.getName()));
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(Authentication authentication,
                                   @PathVariable UUID itemId) {
        return cartService.removeItem(UUID.fromString(authentication.getName()), itemId);
    }
}
