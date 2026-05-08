package com.artgallery.dto.response;

import com.artgallery.domain.user.UserAddress;

import java.util.UUID;

public record AddressResponse(
        UUID id,
        String addressLine1,
        String addressLine2,
        String city,
        String provinceState,
        String postalCode,
        String country,
        boolean primary
) {
    public static AddressResponse from(UserAddress address) {
        return new AddressResponse(
                address.getId(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getCity(),
                address.getProvinceState(),
                address.getPostalCode(),
                address.getCountry(),
                address.isDefault()
        );
    }
}
