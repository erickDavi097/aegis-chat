package com.aegischat.adapter.in.rest.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Should pass validation when all fields comply with OWASP and DTO rules")
    void testValidRegisterRequest() {
        RegisterRequestDto dto = new RegisterRequestDto(
                "erick@aegischat.com",
                "+5511999999999",
                "StrongP@ss1",
                "erickdev",
                "Erick Silva"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Expected no validation errors for valid DTO");
    }

    @Test
    @DisplayName("Should fail validation when password does not meet complexity requirements (OWASP)")
    void testWeakPasswordValidation() {
        RegisterRequestDto dto = new RegisterRequestDto(
                "erick@aegischat.com",
                "+5511999999999",
                "weakpass", // Sem maiúscula, número ou caractere especial
                "erickdev",
                "Erick Silva"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        boolean hasPasswordError = violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("password"));
        assertTrue(hasPasswordError, "Expected validation error on password field");
    }

    @Test
    @DisplayName("Should fail validation when email format is invalid")
    void testInvalidEmailValidation() {
        RegisterRequestDto dto = new RegisterRequestDto(
                "invalid-email-format",
                "+5511999999999",
                "StrongP@ss1",
                "erickdev",
                "Erick Silva"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }
}