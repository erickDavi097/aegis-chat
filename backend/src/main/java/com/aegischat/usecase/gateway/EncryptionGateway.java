package com.aegischat.usecase.gateway;

public interface EncryptionGateway {
    // Contrato para gerenciar ou validar chaves de criptografia E2EE do usuário
    void storeUserKeys(Long profileId, String publicIdentityKey, String publicSignedPreKey);
    boolean validateKeyFingerprint(String publicIdentityKey);
}