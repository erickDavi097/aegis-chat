package com.aegischat.usecase;

import com.aegischat.usecase.gateway.EncryptionGateway;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StoreUserKeysUseCaseTest {

    @Mock
    private EncryptionGateway encryptionGateway;

    @InjectMocks
    private StoreUserKeysUseCase storeUserKeysUseCase;

    @Test
    @DisplayName("Should successfully store valid E2EE keys for a profile")
    void testStoreKeysSuccess() {
        Long profileId = 15L;
        String identityKey = "PubKeyIdentityBase64Data==";
        String signedPreKey = "PubKeySignedPreKeyBase64Data==";

        assertDoesNotThrow(() ->
                storeUserKeysUseCase.execute(profileId, identityKey, signedPreKey)
        );

        verify(encryptionGateway, times(1)).storeUserKeys(profileId, identityKey, signedPreKey);
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when identity key is blank (OWASP Input Validation)")
    void testStoreKeysBlankIdentityKey() {
        Long profileId = 15L;
        String identityKey = "   ";
        String signedPreKey = "PubKeySignedPreKeyBase64Data==";

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                storeUserKeysUseCase.execute(profileId, identityKey, signedPreKey)
        );

        assertEquals("Public identity key and signed pre-key cannot be empty.", ex.getMessage());
        verifyNoInteractions(encryptionGateway);
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when signed pre-key is null")
    void testStoreKeysNullPreKey() {
        Long profileId = 15L;
        String identityKey = "PubKeyIdentityBase64Data==";

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                storeUserKeysUseCase.execute(profileId, identityKey, null)
        );

        assertEquals("Public identity key and signed pre-key cannot be empty.", ex.getMessage());
        verifyNoInteractions(encryptionGateway);
    }
}