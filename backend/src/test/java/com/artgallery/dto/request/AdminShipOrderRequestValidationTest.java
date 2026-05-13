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

class AdminShipOrderRequestValidationTest {

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
    void validTrackingLinkPassesValidation() {
        AdminShipOrderRequest request = request("https://carrier.example/track/SA-000010");

        Set<ConstraintViolation<AdminShipOrderRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void plainTrackingNumberFailsValidation() {
        AdminShipOrderRequest request = request("TRACKING-123");

        Set<ConstraintViolation<AdminShipOrderRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("trackingLink");
    }

    @Test
    void blankTrackingLinkFailsValidation() {
        AdminShipOrderRequest request = request(" ");

        Set<ConstraintViolation<AdminShipOrderRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("trackingLink");
    }

    private static AdminShipOrderRequest request(String trackingLink) {
        AdminShipOrderRequest request = new AdminShipOrderRequest();
        request.setTrackingLink(trackingLink);
        return request;
    }
}
