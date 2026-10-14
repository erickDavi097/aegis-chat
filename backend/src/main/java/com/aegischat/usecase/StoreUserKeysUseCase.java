package com.aegischat.usecase;

import com.aegischat.usecase.gateway.EncryptionGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class StoreUserKeysUseCase {

    private final EncryptionGateway encryptionGateway;

    public void execute(Long profileId, String publicIdentityKey, String publicSignedPreKey) {
        log.info("Storing E2EE public keys for profileId: {}", profileId);

        if (publicIdentityKey == null || publicIdentityKey.isBlank() ||
                publicSignedPreKey == null || publicSignedPreKey.isBlank()) {
            throw new IllegalArgumentException("Public identity key and signed pre-key cannot be empty.");
        }

        encryptionGateway.storeUserKeys(profileId, publicIdentityKey, publicSignedPreKey);
        log.info("E2EE keys successfully registered for profileId: {}", profileId);
    }
}