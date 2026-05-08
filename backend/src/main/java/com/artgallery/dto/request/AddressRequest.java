package com.artgallery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AddressRequest {

    @NotBlank(message = "Address line 1 is required")
    @Size(max = 255, message = "Address line 1 is too long")
    private String addressLine1;

    @Size(max = 255, message = "Address line 2 is too long")
    private String addressLine2;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City is too long")
    private String city;

    @NotBlank(message = "Province is required")
    @Pattern(
            regexp = "^(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)$",
            message = "Province must be a valid Canadian province or territory code"
    )
    private String provinceState;

    @NotBlank(message = "Postal code is required")
    @Pattern(
            regexp = "^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$",
            message = "Postal code must be a valid Canadian postal code"
    )
    private String postalCode;

    @NotBlank(message = "Country is required")
    @Pattern(regexp = "^(Canada|CA)$", message = "Country must be Canada")
    private String country = "Canada";

    private boolean primary;

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProvinceState() {
        return provinceState;
    }

    public void setProvinceState(String provinceState) {
        this.provinceState = provinceState;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }
}
