package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.UserKeyEntity;
import com.aegischat.usecase.gateway.EncryptionGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EncryptionGatewayAdapter implements EncryptionGateway {

    // Agora o repositório é real!
    private final SpringDataUserKeyRepository keyRepository;

    @Override
    public void storeUserKeys(Long profileId, String publicIdentityKey, String publicSignedPreKey) {
        log.info("Salvando chaves reais no MySQL para o profileId: {}", profileId);

        UserKeyEntity entity = UserKeyEntity.builder()
                .profileId(profileId)
                .publicIdentityKey(publicIdentityKey)
                .publicSignedPreKey(publicSignedPreKey)
                .build();

        keyRepository.save(entity);
    }

    @Override
    public String getPublicIdentityKey(Long profileId) {
        log.info("Buscando chave pública no MySQL para o profileId: {}", profileId);
        return keyRepository.findByProfileId(profileId)
                .map(UserKeyEntity::getPublicIdentityKey)
                .orElseThrow(() -> new RuntimeException("Chave pública não encontrada para o perfil: " + profileId));
    }

    @Override
    public boolean validateKeyFingerprint(String publicIdentityKey) {
        return true; // Deixaremos a validação de Fingerprint para o futuro
    }
}