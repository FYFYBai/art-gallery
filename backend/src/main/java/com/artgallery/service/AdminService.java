package com.artgallery.service;

import com.artgallery.domain.artwork.Artwork;
import com.artgallery.domain.artwork.ArtworkImage;
import com.artgallery.domain.order.Order;
import com.artgallery.domain.order.OrderStatus;
import com.artgallery.domain.order.RefundRequestEntity;
import com.artgallery.domain.order.RefundRequestStatus;
import com.artgallery.domain.user.User;
import com.artgallery.dto.request.AdminArtworkRequest;
import com.artgallery.dto.response.AdminArtworkResponse;
import com.artgallery.dto.response.AdminDashboardResponse;
import com.artgallery.dto.response.AdminImageUploadResponse;
import com.artgallery.dto.response.AdminOrderResponse;
import com.artgallery.dto.response.AdminRefundRequestResponse;
import com.artgallery.dto.response.AdminUserResponse;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.AnalyticsRepository;
import com.artgallery.repository.OrderRepository;
import com.artgallery.repository.RefundRequestRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.payment.StripePaymentClient;
import com.artgallery.service.payment.StripeRefundResult;
import com.stripe.exception.StripeException;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AdminService {

    private static final List<OrderStatus> DELIVERY_QUEUE_STATUSES =
            List.of(OrderStatus.PAID);
    private static final List<OrderStatus> REVENUE_STATUSES =
            List.of(OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ArtworkRepository artworkRepository;
    private final AnalyticsRepository analyticsRepository;
    private final RefundRequestRepository refundRequestRepository;
    private final EmailService emailService;
    private final StripePaymentClient stripePaymentClient;
    private final boolean devAccountDeleteEnabled;

    public AdminService(UserRepository userRepository,
                        OrderRepository orderRepository,
                        ArtworkRepository artworkRepository,
                        AnalyticsRepository analyticsRepository,
                        RefundRequestRepository refundRequestRepository,
                        EmailService emailService,
                        StripePaymentClient stripePaymentClient,
                        @Value("${app.admin.dev-account-delete-enabled:false}") boolean devAccountDeleteEnabled) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.artworkRepository = artworkRepository;
        this.analyticsRepository = analyticsRepository;
        this.refundRequestRepository = refundRequestRepository;
        this.emailService = emailService;
        this.stripePaymentClient = stripePaymentClient;
        this.devAccountDeleteEnabled = devAccountDeleteEnabled;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse dashboard() {
        List<Order> orders = orderRepository.findAll();
        List<Order> revenueOrders = orders.stream()
                .filter(order -> REVENUE_STATUSES.contains(order.getOrderStatus()))
                .toList();
        BigDecimal revenueTotal = revenueOrders.stream()
                .map(Order::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<AdminDashboardResponse.MonthlyTransaction> monthlyTransactions =
                buildMonthlyTransactions(revenueOrders);
        List<AdminDashboardResponse.DailyViews> viewsLast40Days =
                analyticsRepository.dailyViewsLast40Days();
        List<AdminOrderResponse> deliveryQueue = orderRepository
                .findTop5ByOrderStatusInOrderByCreatedAtAsc(DELIVERY_QUEUE_STATUSES)
                .stream()
                .map(AdminOrderResponse::from)
                .toList();
        List<AdminOrderResponse> shippedOrders = orderRepository
                .findTop5ByOrderStatusOrderByCreatedAtDesc(OrderStatus.SHIPPED)
                .stream()
                .map(AdminOrderResponse::from)
                .toList();

        return new AdminDashboardResponse(
                userRepository.count(),
                orders.size(),
                deliveryQueue.size(),
                artworkRepository.count(),
                revenueTotal,
                monthlyTransactions,
                viewsLast40Days,
                deliveryQueue,
                shippedOrders
        );
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> searchUsers(String query) {
        String normalizedQuery = normalizeQuery(query);
        List<User> users = normalizedQuery.isBlank()
                ? userRepository.findAll()
                : userRepository.searchUsers(normalizedQuery);

        return users.stream()
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .limit(50)
                .map(AdminUserResponse::from)
                .toList();
    }

    @Transactional
    public AdminUserResponse updateUserActive(UUID userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User was not found"));
        user.setActive(active);
        return AdminUserResponse.from(user);
    }

    @Transactional
    public void deleteUserForDevelopment(UUID userId) {
        if (!devAccountDeleteEnabled) {
            throw new IllegalArgumentException("Development account deletion is disabled");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User was not found"));

        if ("ADMIN".equals(user.getRole().name())) {
            throw new IllegalArgumentException("Admin accounts cannot be deleted from this tool");
        }

        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> searchOrders(String query) {
        String normalizedQuery = normalizeQuery(query);
        List<Order> orders = normalizedQuery.isBlank()
                ? orderRepository.findTop5ByOrderStatusInOrderByCreatedAtDesc(List.of(
                        OrderStatus.PENDING,
                        OrderStatus.PAID,
                        OrderStatus.SHIPPED,
                        OrderStatus.DELIVERED,
                        OrderStatus.CANCELLED,
                        OrderStatus.REFUNDED
                ))
                : orderRepository.searchAdminOrders(normalizedQuery);

        return orders.stream()
                .map(AdminOrderResponse::from)
                .limit(5)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> searchShippedOrders(String query) {
        String normalizedQuery = normalizeQuery(query);
        List<Order> orders = normalizedQuery.isBlank()
                ? orderRepository.findTop5ByOrderStatusOrderByCreatedAtDesc(OrderStatus.SHIPPED)
                : orderRepository.searchAdminOrdersByStatus(OrderStatus.SHIPPED, normalizedQuery);

        return orders.stream()
                .map(AdminOrderResponse::from)
                .limit(5)
                .toList();
    }

    @Transactional
    public AdminOrderResponse updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order was not found"));
        order.setOrderStatus(status);
        return AdminOrderResponse.from(order);
    }

    @Transactional
    public AdminOrderResponse shipOrder(UUID orderId, String trackingLink) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order was not found"));

        if (order.getOrderStatus() != OrderStatus.PAID) {
            throw new IllegalArgumentException("Only paid orders can be marked as shipped");
        }

        String normalizedTrackingLink = trackingLink.trim();
        order.setOrderStatus(OrderStatus.SHIPPED);
        order.setTrackingLink(normalizedTrackingLink);
        order.setShippedAt(OffsetDateTime.now(ZoneOffset.UTC));
        order.setDeliveredAt(null);

        AdminOrderResponse response = AdminOrderResponse.from(order);
        emailService.sendOrderShippedEmail(order.getUser().getEmail(), response.orderNumber(), normalizedTrackingLink);
        return response;
    }

    @Transactional
    public AdminOrderResponse markOrderDelivered(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order was not found"));

        if (order.getOrderStatus() != OrderStatus.SHIPPED) {
            throw new IllegalArgumentException("Only shipped orders can be marked as delivered");
        }

        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setDeliveredAt(OffsetDateTime.now(ZoneOffset.UTC));
        AdminOrderResponse response = AdminOrderResponse.from(order);
        emailService.sendOrderDeliveredEmail(order.getUser().getEmail(), response.orderNumber());
        return response;
    }

    @Transactional
    public AdminOrderResponse refundOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order was not found"));

        if (order.getOrderStatus() == OrderStatus.REFUNDED) {
            return AdminOrderResponse.from(order);
        }

        if (order.getOrderStatus() == OrderStatus.PENDING || order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Only paid, shipped or delivered orders can be refunded");
        }

        applyStripeRefund(order);
        order.setOrderStatus(OrderStatus.REFUNDED);
        order.setRefundedAt(OffsetDateTime.now(ZoneOffset.UTC));
        unlockOrderArtworks(order);
        AdminOrderResponse response = AdminOrderResponse.from(order);
        emailService.sendOrderRefundedEmail(
                order.getUser().getEmail(),
                response.orderNumber(),
                formatRefundAmount(order)
        );
        return response;
    }

    @Transactional(readOnly = true)
    public List<AdminRefundRequestResponse> pendingRefundRequests() {
        return refundRequestRepository.findTop20ByStatusOrderByCreatedAtAsc(RefundRequestStatus.PENDING)
                .stream()
                .map(AdminRefundRequestResponse::from)
                .toList();
    }

    @Transactional
    public AdminRefundRequestResponse approveRefundRequest(UUID refundRequestId) {
        RefundRequestEntity refundRequest = refundRequestRepository.findById(refundRequestId)
                .orElseThrow(() -> new EntityNotFoundException("Refund request was not found"));

        if (refundRequest.getStatus() != RefundRequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending refund requests can be approved");
        }

        Order order = refundRequest.getOrder();
        if (order.getOrderStatus() == OrderStatus.PENDING || order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Only paid, shipped or delivered orders can be refunded");
        }

        applyStripeRefund(order);
        order.setOrderStatus(OrderStatus.REFUNDED);
        order.setRefundedAt(OffsetDateTime.now(ZoneOffset.UTC));
        unlockOrderArtworks(order);
        refundRequest.setStatus(RefundRequestStatus.APPROVED);
        refundRequest.setApprovedAt(OffsetDateTime.now(ZoneOffset.UTC));

        emailService.sendOrderRefundedEmail(
                order.getUser().getEmail(),
                order.getOrderNumber(),
                formatRefundAmount(order)
        );
        return AdminRefundRequestResponse.from(refundRequest);
    }

    @Transactional
    public AdminRefundRequestResponse rejectRefundRequest(UUID refundRequestId, String reason) {
        RefundRequestEntity refundRequest = refundRequestRepository.findById(refundRequestId)
                .orElseThrow(() -> new EntityNotFoundException("Refund request was not found"));

        if (refundRequest.getStatus() != RefundRequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending refund requests can be rejected");
        }

        String normalizedReason = reason == null ? "" : reason.trim();
        if (normalizedReason.isBlank()) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

        refundRequest.setStatus(RefundRequestStatus.REJECTED);
        refundRequest.setRejectedAt(OffsetDateTime.now(ZoneOffset.UTC));
        refundRequest.setRejectionReason(normalizedReason);

        emailService.sendRefundRequestRejectedEmail(
                refundRequest.getUser().getEmail(),
                refundRequest.getOrder().getOrderNumber(),
                normalizedReason
        );
        return AdminRefundRequestResponse.from(refundRequest);
    }

    @Transactional(readOnly = true)
    public List<AdminArtworkResponse> searchArtworks(String query) {
        String normalizedQuery = normalizeQuery(query);
        List<Artwork> artworks = normalizedQuery.isBlank()
                ? artworkRepository.findByActiveTrueOrderByCreatedAtDesc()
                : artworkRepository.searchAdminArtworks(normalizedQuery);

        return artworks.stream()
                .sorted(Comparator.comparing(Artwork::getCreatedAt).reversed())
                .limit(50)
                .map(AdminArtworkResponse::from)
                .toList();
    }

    @Transactional
    public AdminArtworkResponse createArtwork(AdminArtworkRequest request) {
        Artwork artwork = new Artwork();
        applyArtworkRequest(artwork, request);
        replacePrimaryImage(artwork, request.getImageUrl());
        return AdminArtworkResponse.from(artworkRepository.save(artwork));
    }

    @Transactional
    public AdminArtworkResponse updateArtwork(UUID artworkId, AdminArtworkRequest request) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new EntityNotFoundException("Artwork was not found"));
        applyArtworkRequest(artwork, request);
        replacePrimaryImage(artwork, request.getImageUrl());
        return AdminArtworkResponse.from(artwork);
    }

    @Transactional
    public void deleteArtwork(UUID artworkId) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new EntityNotFoundException("Artwork was not found"));
        artwork.setActive(false);
    }

    public AdminImageUploadResponse uploadArtworkImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        String originalName = file.getOriginalFilename() == null ? "artwork" : file.getOriginalFilename();
        String extension = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < originalName.length() - 1) {
            extension = originalName.substring(dotIndex).replaceAll("[^A-Za-z0-9.]", "");
        }

        String fileName = UUID.randomUUID() + extension;
        Path uploadDir = Path.of("uploads", "products").toAbsolutePath().normalize();
        Path target = uploadDir.resolve(fileName).normalize();

        try {
            Files.createDirectories(uploadDir);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalArgumentException("Could not save image");
        }

        return new AdminImageUploadResponse("/uploads/products/" + fileName);
    }

    private void applyArtworkRequest(Artwork artwork, AdminArtworkRequest request) {
        artwork.setTitle(request.getName().trim());
        artwork.setSlug(uniqueSlugForTitle(request.getName().trim(), artwork.getId()));
        artwork.setDescription(blankToNull(request.getDescription()));
        artwork.setArtworkType(request.getArtworkType().trim());
        artwork.setSeries(normalizeSeries(request.getSeries()));
        artwork.setArtworkSize(blankToNull(request.getSize()));
        artwork.setArtworkYear(request.getYear());
        artwork.setPrice(request.getPrice());
        artwork.setCurrency("CAD");
        artwork.setSoldOut(request.isSoldOut());
        artwork.setActive(true);
    }

    private void replacePrimaryImage(Artwork artwork, String imageUrl) {
        artwork.getImages().clear();
        ArtworkImage image = new ArtworkImage();
        image.setArtwork(artwork);
        image.setImageUrl(imageUrl.trim());
        image.setAltText(artwork.getTitle());
        image.setPrimary(true);
        image.setDisplayOrder(0);
        artwork.getImages().add(image);
    }

    private List<AdminDashboardResponse.MonthlyTransaction> buildMonthlyTransactions(List<Order> orders) {
        YearMonth currentMonth = YearMonth.now(ZoneOffset.UTC);
        Map<YearMonth, List<Order>> ordersByMonth = new LinkedHashMap<>();

        for (int index = 5; index >= 0; index--) {
            ordersByMonth.put(currentMonth.minusMonths(index), List.of());
        }

        for (Order order : orders) {
            if (order.getCreatedAt() == null) continue;
            YearMonth orderMonth = YearMonth.from(order.getCreatedAt().atZoneSameInstant(ZoneOffset.UTC));
            if (ordersByMonth.containsKey(orderMonth)) {
                ordersByMonth.compute(orderMonth, (month, existingOrders) -> {
                    List<Order> source = existingOrders == null ? List.of() : existingOrders;
                    return java.util.stream.Stream.concat(source.stream(), java.util.stream.Stream.of(order)).toList();
                });
            }
        }

        return ordersByMonth.entrySet().stream()
                .map(entry -> {
                    BigDecimal total = entry.getValue().stream()
                            .map(Order::getTotalAmount)
                            .filter(amount -> amount != null)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new AdminDashboardResponse.MonthlyTransaction(
                            entry.getKey().toString(),
                            entry.getValue().size(),
                            total
                    );
                })
                .toList();
    }

    private String normalizeQuery(String query) {
        return query == null ? "" : query.trim();
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private List<String> normalizeSeries(List<String> series) {
        if (series == null) {
            return List.of();
        }

        return series.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .collect(java.util.stream.Collectors.collectingAndThen(
                        java.util.stream.Collectors.toCollection(LinkedHashSet::new),
                        List::copyOf
                ));
    }

    private String uniqueSlugForTitle(String title, UUID currentArtworkId) {
        String baseSlug = slugify(title);
        String candidate = baseSlug;
        int suffix = 2;

        while (true) {
            java.util.Optional<Artwork> existing = artworkRepository.findBySlug(candidate);
            if (existing.isEmpty() || existing.get().getId().equals(currentArtworkId)) {
                return candidate;
            }
            candidate = baseSlug + "-" + suffix;
            suffix++;
        }
    }

    private String slugify(String value) {
        String normalized = java.text.Normalizer.normalize(value, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(java.util.Locale.ROOT)
                .replace("’", "")
                .replace("'", "")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return normalized.isBlank() ? "artwork" : normalized;
    }

    private String formatRefundAmount(Order order) {
        String currency = order.getCurrency() == null ? "CAD" : order.getCurrency();
        BigDecimal amount = order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount();
        return amount.toPlainString() + " " + currency;
    }

    private void applyStripeRefund(Order order) {
        if (order.getStripePaymentIntentId() == null || order.getStripePaymentIntentId().isBlank()) {
            throw new IllegalArgumentException("This order has no Stripe payment to refund");
        }

        try {
            StripeRefundResult refund = stripePaymentClient.refundPayment(
                    order.getStripePaymentIntentId(),
                    order.getTotalAmount(),
                    order.getCurrency()
            );
            order.setStripeRefundId(refund.id());
            order.setStripeRefundStatus(refund.status());
        } catch (StripeException ex) {
            throw new IllegalArgumentException("Stripe refund failed");
        }
    }

    private void unlockOrderArtworks(Order order) {
        order.getItems().forEach(item -> item.getArtwork().setSoldOut(false));
    }
}
