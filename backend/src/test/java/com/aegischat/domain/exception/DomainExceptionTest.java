package com.aegischat.domain.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DomainExceptionTest {

    @Test
    @DisplayName("Should correctly hold message in DomainException")
    void testDomainExceptionMessage() {
        String errorMsg = "Business rule violation error";
        DomainException ex = new DomainException(errorMsg);

        assertNotNull(ex);
        assertEquals(errorMsg, ex.getMessage());
    }
}