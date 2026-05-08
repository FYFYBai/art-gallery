package com.artgallery.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProfileRequestValidationTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        validatorFactory.close();
    }

    @Test
    void validCanadianAddressPassesValidation() {
        AddressRequest request = addressRequest("H2Y 1Z9", "QC", "Canada");

        Set<ConstraintViolation<AddressRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void compactCanadianPostalCodePassesValidation() {
        AddressRequest request = addressRequest("H2Y1Z9", "QC", "CA");

        Set<ConstraintViolation<AddressRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void invalidCanadianPostalCodeFailsValidation() {
        AddressRequest request = addressRequest("12345", "QC", "Canada");

        Set<ConstraintViolation<AddressRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("postalCode");
    }

    @Test
    void invalidProvinceFailsValidation() {
        AddressRequest request = addressRequest("H2Y 1Z9", "NY", "Canada");

        Set<ConstraintViolation<AddressRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("provinceState");
    }

    @Test
    void nonCanadianCountryFailsValidation() {
        AddressRequest request = addressRequest("H2Y 1Z9", "QC", "United States");

        Set<ConstraintViolation<AddressRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("country");
    }

    @Test
    void validProfilePasswordUpdatePassesValidation() {
        UpdatePasswordRequest request = passwordRequest("StrongPass!1", "StrongPass!1");

        Set<ConstraintViolation<UpdatePasswordRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void weakProfilePasswordUpdateFailsValidation() {
        UpdatePasswordRequest request = passwordRequest("weakpassword", "weakpassword");

        Set<ConstraintViolation<UpdatePasswordRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("password");
    }

    @Test
    void profilePasswordConfirmationMismatchFailsValidation() {
        UpdatePasswordRequest request = passwordRequest("StrongPass!1", "DifferentPass!1");

        Set<ConstraintViolation<UpdatePasswordRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .contains("Passwords must match");
    }

    private static AddressRequest addressRequest(String postalCode, String provinceState, String country) {
        AddressRequest request = new AddressRequest();
        request.setAddressLine1("248 Rue Saint-Paul Ouest");
        request.setCity("Montreal");
        request.setProvinceState(provinceState);
        request.setPostalCode(postalCode);
        request.setCountry(country);
        return request;
    }

    private static UpdatePasswordRequest passwordRequest(String password, String passwordConfirmation) {
        UpdatePasswordRequest request = new UpdatePasswordRequest();
        request.setPassword(password);
        request.setPasswordConfirmation(passwordConfirmation);
        return request;
    }
}
