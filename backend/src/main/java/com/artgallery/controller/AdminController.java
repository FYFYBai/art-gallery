package com.artgallery.controller;

import com.artgallery.dto.request.AdminArtworkRequest;
import com.artgallery.dto.request.AdminOrderStatusRequest;
import com.artgallery.dto.request.AdminShipOrderRequest;
import com.artgallery.dto.request.AdminUserActiveRequest;
import com.artgallery.dto.response.AdminArtworkResponse;
import com.artgallery.dto.response.AdminDashboardResponse;
import com.artgallery.dto.response.AdminImageUploadResponse;
import com.artgallery.dto.response.AdminOrderResponse;
import com.artgallery.dto.response.AdminRefundRequestResponse;
import com.artgallery.dto.response.AdminUserResponse;
import com.artgallery.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> users(@RequestParam(defaultValue = "") String query) {
        return adminService.searchUsers(query);
    }

    @PatchMapping("/users/{userId}/active")
    public AdminUserResponse updateUserActive(
            @PathVariable UUID userId,
            @Valid @RequestBody AdminUserActiveRequest request
    ) {
        return adminService.updateUserActive(userId, request.isActive());
    }

    @DeleteMapping("/users/{userId}/dev")
    public void deleteUserForDevelopment(@PathVariable UUID userId) {
        adminService.deleteUserForDevelopment(userId);
    }

    @GetMapping("/orders")
    public List<AdminOrderResponse> orders(@RequestParam(defaultValue = "") String query) {
        return adminService.searchOrders(query);
    }

    @GetMapping("/orders/shipped")
    public List<AdminOrderResponse> shippedOrders(@RequestParam(defaultValue = "") String query) {
        return adminService.searchShippedOrders(query);
    }

    @PatchMapping("/orders/{orderId}/status")
    public AdminOrderResponse updateOrderStatus(
            @PathVariable UUID orderId,
            @Valid @RequestBody AdminOrderStatusRequest request
    ) {
        return adminService.updateOrderStatus(orderId, request.getOrderStatus());
    }

    @PatchMapping("/orders/{orderId}/ship")
    public AdminOrderResponse shipOrder(
            @PathVariable UUID orderId,
            @Valid @RequestBody AdminShipOrderRequest request
    ) {
        return adminService.shipOrder(orderId, request.getTrackingLink());
    }

    @PatchMapping("/orders/{orderId}/deliver")
    public AdminOrderResponse markOrderDelivered(@PathVariable UUID orderId) {
        return adminService.markOrderDelivered(orderId);
    }

    @GetMapping("/refund-requests")
    public List<AdminRefundRequestResponse> refundRequests() {
        return adminService.pendingRefundRequests();
    }

    @PatchMapping("/refund-requests/{refundRequestId}/approve")
    public AdminRefundRequestResponse approveRefundRequest(@PathVariable UUID refundRequestId) {
        return adminService.approveRefundRequest(refundRequestId);
    }

    @GetMapping("/artworks")
    public List<AdminArtworkResponse> artworks(@RequestParam(defaultValue = "") String query) {
        return adminService.searchArtworks(query);
    }

    @PostMapping("/artworks")
    public AdminArtworkResponse createArtwork(@Valid @RequestBody AdminArtworkRequest request) {
        return adminService.createArtwork(request);
    }

    @PutMapping("/artworks/{artworkId}")
    public AdminArtworkResponse updateArtwork(
            @PathVariable UUID artworkId,
            @Valid @RequestBody AdminArtworkRequest request
    ) {
        return adminService.updateArtwork(artworkId, request);
    }

    @PostMapping("/artworks/image")
    public AdminImageUploadResponse uploadArtworkImage(@RequestParam("image") MultipartFile image) {
        return adminService.uploadArtworkImage(image);
    }
}
