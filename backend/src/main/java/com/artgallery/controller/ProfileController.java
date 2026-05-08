package com.artgallery.controller;

import com.artgallery.dto.request.AddressRequest;
import com.artgallery.dto.request.RefundRequest;
import com.artgallery.dto.request.UpdatePasswordRequest;
import com.artgallery.dto.response.AddressResponse;
import com.artgallery.dto.response.ProfileOrderResponse;
import com.artgallery.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/addresses")
    public List<AddressResponse> listAddresses(Authentication authentication) {
        return profileService.listAddresses(currentUserId(authentication));
    }

    @PostMapping("/addresses")
    @ResponseStatus(HttpStatus.CREATED)
    public AddressResponse createAddress(Authentication authentication,
                                         @Valid @RequestBody AddressRequest request) {
        return profileService.createAddress(currentUserId(authentication), request);
    }

    @PutMapping("/addresses/{addressId}")
    public AddressResponse updateAddress(Authentication authentication,
                                         @PathVariable UUID addressId,
                                         @Valid @RequestBody AddressRequest request) {
        return profileService.updateAddress(currentUserId(authentication), addressId, request);
    }

    @PatchMapping("/addresses/{addressId}/primary")
    public AddressResponse makePrimaryAddress(Authentication authentication,
                                              @PathVariable UUID addressId) {
        return profileService.makePrimaryAddress(currentUserId(authentication), addressId);
    }

    @DeleteMapping("/addresses/{addressId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(Authentication authentication, @PathVariable UUID addressId) {
        profileService.deleteAddress(currentUserId(authentication), addressId);
    }

    @PatchMapping("/password")
    public ResponseEntity<Map<String, String>> updatePassword(Authentication authentication,
                                                              @Valid @RequestBody UpdatePasswordRequest request) {
        profileService.updatePassword(currentUserId(authentication), request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @GetMapping("/orders")
    public List<ProfileOrderResponse> listOrders(Authentication authentication) {
        return profileService.listOrders(currentUserId(authentication));
    }

    @PostMapping("/orders/{orderId}/refund-request")
    public ResponseEntity<Map<String, String>> requestRefund(Authentication authentication,
                                                             @PathVariable UUID orderId,
                                                             @Valid @RequestBody RefundRequest request) {
        profileService.requestRefund(currentUserId(authentication), orderId, request);
        return ResponseEntity.ok(Map.of("message", "Refund request sent"));
    }

    private UUID currentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
