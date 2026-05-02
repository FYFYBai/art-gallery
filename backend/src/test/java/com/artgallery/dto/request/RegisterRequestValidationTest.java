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

class RegisterRequestValidationTest {

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
        RegisterRequest request = request("artist@example.com", "password123", "password123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void invalidEmailFailsValidation() {
        RegisterRequest request = request("not-an-email", "password123", "password123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("email");
    }

    @Test
    void shortPasswordFailsValidation() {
        RegisterRequest request = request("artist@example.com", "short", "short");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("password");
    }

    @Test
    void passwordMismatchFailsValidation() {
        RegisterRequest request = request("artist@example.com", "password123", "different123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getMessage())
                .contains("Passwords must match");
    }

    private static RegisterRequest request(String email, String password, String passwordConfirmation) {
        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword(password);
        request.setPasswordConfirmation(passwordConfirmation);
        return request;
    }
}
