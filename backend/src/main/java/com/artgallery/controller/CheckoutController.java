package com.artgallery.controller;

import com.artgallery.dto.request.CreateStripeCheckoutRequest;
import com.artgallery.dto.response.CheckoutStatusResponse;
import com.artgallery.dto.response.CreateStripeCheckoutResponse;
import com.artgallery.service.CheckoutService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/stripe-session")
    public CreateStripeCheckoutResponse createStripeCheckoutSession(
            Authentication authentication,
            @Valid @RequestBody CreateStripeCheckoutRequest request
    ) {
        return checkoutService.createStripeCheckoutSession(currentUserId(authentication), request);
    }

    @GetMapping("/stripe-session/status")
    public CheckoutStatusResponse checkoutStatus(@RequestParam String sessionId) {
        return checkoutService.checkoutStatus(sessionId);
    }

    @PatchMapping("/stripe-session/cancel")
    public void cancelStripeCheckoutSession(
            Authentication authentication,
            @RequestParam String sessionId
    ) {
        checkoutService.cancelStripeCheckoutSession(currentUserId(authentication), sessionId);
    }

    private UUID currentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
