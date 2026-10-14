package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.MessageEntity;
import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.gateway.MessageRepositoryGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MessageRepositoryAdapter implements MessageRepositoryGateway {

    private final SpringDataMessageRepository springDataMessageRepository;

    @Override
    public MessageDomain save(MessageDomain messageDomain) {
        log.debug("Persisting message for chatId: {} from senderProfileId: {}",
                messageDomain.getChatId(), messageDomain.getSenderProfileId());

        MessageEntity entity = MessageEntity.builder()
                .chatId(messageDomain.getChatId())
                .channelId(messageDomain.getChannelId())
                .senderProfileId(messageDomain.getSenderProfileId())
                .encryptedPayload(messageDomain.getEncryptedPayload())
                .mediaUrl(messageDomain.getMediaUrl())
                .mediaType(messageDomain.getMediaType())
                .mediaSizeBytes(messageDomain.getMediaSizeBytes())
                .isTemporary(messageDomain.getIsTemporary())
                .expiresAt(messageDomain.getExpiresAt())
                .build();

        MessageEntity saved = springDataMessageRepository.save(entity);

        return MessageDomain.builder()
                .id(saved.getId())
                .chatId(saved.getChatId())
                .channelId(saved.getChannelId())
                .senderProfileId(saved.getSenderProfileId())
                .encryptedPayload(saved.getEncryptedPayload())
                .mediaUrl(saved.getMediaUrl())
                .mediaType(saved.getMediaType())
                .mediaSizeBytes(saved.getMediaSizeBytes())
                .isTemporary(saved.getIsTemporary())
                .expiresAt(saved.getExpiresAt())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public boolean isParticipantInChat(Long chatId, Long profileId) {
        log.debug("Checking participation rights for profileId: {} in chatId: {}", profileId, chatId);
        return springDataMessageRepository.isParticipantInChat(chatId, profileId);
    }
}