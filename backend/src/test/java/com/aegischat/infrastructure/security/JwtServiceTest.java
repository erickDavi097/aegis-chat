package com.aegischat.infrastructure.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    @DisplayName("Should successfully generate and validate JWT token for a given email")
    void testGenerateAndValidateToken() {
        String email = "erick@aegischat.com";

        String token = jwtService.generateToken(email);

        assertNotNull(token);
        assertFalse(token.isBlank());

        String extractedEmail = jwtService.extractEmail(token);
        assertEquals(email, extractedEmail);

        boolean isValid = jwtService.isTokenValid(token, email);
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should return false when validating token with mismatched email")
    void testTokenValidationWithWrongEmail() {
        String email = "erick@aegischat.com";
        String token = jwtService.generateToken(email);

        boolean isValid = jwtService.isTokenValid(token, "attacker@aegischat.com");
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should throw exception or fail parsing when token is malformed")
    void testMalformedTokenHandling() {
        String malformedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.malformed.signature";

        assertThrows(Exception.class, () -> {
            jwtService.extractEmail(malformedToken);
        });
    }
}