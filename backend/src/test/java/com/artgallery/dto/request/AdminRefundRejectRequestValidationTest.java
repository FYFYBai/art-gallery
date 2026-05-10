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

class AdminRefundRejectRequestValidationTest {

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
    void validRejectionReasonPassesValidation() {
        AdminRefundRejectRequest request = request("Refund window has passed.");

        Set<ConstraintViolation<AdminRefundRejectRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void blankRejectionReasonFailsValidation() {
        AdminRefundRejectRequest request = request(" ");

        Set<ConstraintViolation<AdminRefundRejectRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("reason");
    }

    @Test
    void tooLongRejectionReasonFailsValidation() {
        AdminRefundRejectRequest request = request("x".repeat(2001));

        Set<ConstraintViolation<AdminRefundRejectRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("reason");
    }

    private static AdminRefundRejectRequest request(String reason) {
        AdminRefundRejectRequest request = new AdminRefundRejectRequest();
        request.setReason(reason);
        return request;
    }
}
