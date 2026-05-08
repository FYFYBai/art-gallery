package com.artgallery.service;

import com.artgallery.domain.user.User;
import com.artgallery.domain.user.UserAddress;
import com.artgallery.domain.order.RefundRequestEntity;
import com.artgallery.dto.request.AddressRequest;
import com.artgallery.dto.request.RefundRequest;
import com.artgallery.dto.request.UpdatePasswordRequest;
import com.artgallery.dto.response.AddressResponse;
import com.artgallery.dto.response.ProfileOrderResponse;
import com.artgallery.exception.ProfileException;
import com.artgallery.repository.OrderRepository;
import com.artgallery.repository.RefundRequestRepository;
import com.artgallery.repository.UserAddressRepository;
import com.artgallery.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderRepository orderRepository;
    private final RefundRequestRepository refundRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository,
                          UserAddressRepository userAddressRepository,
                          OrderRepository orderRepository,
                          RefundRequestRepository refundRequestRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userAddressRepository = userAddressRepository;
        this.orderRepository = orderRepository;
        this.refundRequestRepository = refundRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> listAddresses(UUID userId) {
        return userAddressRepository.findByUserId(userId)
                .stream()
                .sorted(Comparator.comparing(UserAddress::isDefault).reversed()
                        .thenComparing(UserAddress::getCreatedAt))
                .map(AddressResponse::from)
                .toList();
    }

    @Transactional
    public AddressResponse createAddress(UUID userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ProfileException("User was not found"));
        List<UserAddress> existingAddresses = userAddressRepository.findByUserId(userId);

        UserAddress address = new UserAddress();
        address.setUser(user);
        applyAddress(address, request);
        address.setDefault(request.isPrimary() || existingAddresses.isEmpty());

        if (address.isDefault()) {
            clearDefault(existingAddresses);
        }

        return AddressResponse.from(userAddressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(UUID userId, UUID addressId, AddressRequest request) {
        UserAddress address = findOwnedAddress(userId, addressId);
        applyAddress(address, request);

        if (request.isPrimary()) {
            clearDefault(userAddressRepository.findByUserId(userId), addressId);
            address.setDefault(true);
        }

        return AddressResponse.from(address);
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        UserAddress address = findOwnedAddress(userId, addressId);
        boolean wasDefault = address.isDefault();
        userAddressRepository.delete(address);

        if (wasDefault) {
            userAddressRepository.findByUserId(userId)
                    .stream()
                    .min(Comparator.comparing(UserAddress::getCreatedAt))
                    .ifPresent(nextDefault -> nextDefault.setDefault(true));
        }
    }

    @Transactional
    public AddressResponse makePrimaryAddress(UUID userId, UUID addressId) {
        UserAddress address = findOwnedAddress(userId, addressId);
        clearDefault(userAddressRepository.findByUserId(userId), addressId);
        address.setDefault(true);
        return AddressResponse.from(address);
    }

    @Transactional
    public void updatePassword(UUID userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ProfileException("User was not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ProfileException("New password must be different from the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    }

    @Transactional(readOnly = true)
    public List<ProfileOrderResponse> listOrders(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ProfileOrderResponse::from)
                .toList();
    }

    @Transactional
    public void requestRefund(UUID userId, UUID orderId, RefundRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ProfileException("User was not found"));
        var order = orderRepository.findById(orderId)
                .filter(candidate -> candidate.getUser().getId().equals(userId))
                .orElseThrow(() -> new ProfileException("Order was not found"));

        RefundRequestEntity refundRequest = new RefundRequestEntity();
        refundRequest.setOrder(order);
        refundRequest.setUser(user);
        refundRequest.setReason(request.getReason().trim());
        refundRequest.setContactInfo(request.getContactInfo().trim());
        refundRequestRepository.save(refundRequest);
    }

    private UserAddress findOwnedAddress(UUID userId, UUID addressId) {
        return userAddressRepository.findByUserIdAndId(userId, addressId)
                .orElseThrow(() -> new ProfileException("Address was not found"));
    }

    private void applyAddress(UserAddress address, AddressRequest request) {
        address.setAddressLine1(request.getAddressLine1().trim());
        address.setAddressLine2(blankToNull(request.getAddressLine2()));
        address.setCity(request.getCity().trim());
        address.setProvinceState(request.getProvinceState().trim().toUpperCase());
        address.setPostalCode(normalizePostalCode(request.getPostalCode()));
        address.setCountry("Canada");
    }

    private void clearDefault(List<UserAddress> addresses) {
        addresses.forEach(address -> address.setDefault(false));
    }

    private void clearDefault(List<UserAddress> addresses, UUID exceptAddressId) {
        addresses.stream()
                .filter(address -> !address.getId().equals(exceptAddressId))
                .forEach(address -> address.setDefault(false));
    }

    private static String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private static String normalizePostalCode(String postalCode) {
        String compact = postalCode.trim().replace(" ", "").replace("-", "").toUpperCase();
        return compact.substring(0, 3) + " " + compact.substring(3);
    }
}
