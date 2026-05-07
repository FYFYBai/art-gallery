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

class ResetPasswordRequestValidationTest {

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
    void validRequestPassesValidation() {
        ResetPasswordRequest request = request("token", "StrongPass!1", "StrongPass!1");

        Set<ConstraintViolation<ResetPasswordRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void missingTokenFailsValidation() {
        ResetPasswordRequest request = request("", "StrongPass!1", "StrongPass!1");

        Set<ConstraintViolation<ResetPasswordRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("token");
    }

    @Test
    void weakPasswordFailsValidation() {
        ResetPasswordRequest request = request("token", "weakpassword", "weakpassword");

        Set<ConstraintViolation<ResetPasswordRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("password");
    }

    @Test
    void passwordMismatchFailsValidation() {
        ResetPasswordRequest request = request("token", "StrongPass!1", "DifferentPass!1");

        Set<ConstraintViolation<ResetPasswordRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .contains("Passwords must match");
    }

    private static ResetPasswordRequest request(String token, String password, String passwordConfirmation) {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken(token);
        request.setPassword(password);
        request.setPasswordConfirmation(passwordConfirmation);
        return request;
    }
}
