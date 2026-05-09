package com.artgallery.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CreateStripeCheckoutRequestValidationTest {

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
    void validCheckoutRequestPassesValidation() {
        CreateStripeCheckoutRequest request = validRequest();

        Set<ConstraintViolation<CreateStripeCheckoutRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }

    @Test
    void missingAddressFailsValidation() {
        CreateStripeCheckoutRequest request = validRequest();
        request.setAddressId(null);

        Set<ConstraintViolation<CreateStripeCheckoutRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("addressId");
    }

    @Test
    void termsMustBeAcceptedBeforeCheckout() {
        CreateStripeCheckoutRequest request = validRequest();
        request.setAcceptedTerms(false);

        Set<ConstraintViolation<CreateStripeCheckoutRequest>> violations = validator.validate(request);

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("acceptedTerms");
    }

    private static CreateStripeCheckoutRequest validRequest() {
        CreateStripeCheckoutRequest request = new CreateStripeCheckoutRequest();
        request.setAddressId(UUID.randomUUID());
        request.setAcceptedTerms(true);
        request.setLocale("en");
        return request;
    }
}
