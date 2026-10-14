package com.aegischat.usecase;

import com.aegischat.domain.exception.DomainException;
import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.gateway.MessagePublisherGateway;
import com.aegischat.usecase.gateway.MessageRepositoryGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.ZonedDateTime;

@Slf4j
@RequiredArgsConstructor
public class SendMessageUseCase {

    private final MessageRepositoryGateway messageRepositoryGateway;
    private final MessagePublisherGateway messagePublisherGateway;

    public MessageDomain execute(MessageDomain messageToSave) {
        log.info("Executing SendMessageUseCase for chatId: {} from senderProfileId: {}",
                messageToSave.getChatId(), messageToSave.getSenderProfileId());

        if (messageToSave.getEncryptedPayload() == null || messageToSave.getEncryptedPayload().isBlank()) {
            log.warn("Blocked empty payload message send attempt from profileId: {}", messageToSave.getSenderProfileId());
            throw new DomainException("Encrypted message payload cannot be empty.");
        }

        // Validação de segurança: O remetente realmente faz parte deste chat?
        boolean isParticipant = messageRepositoryGateway.isParticipantInChat(
                messageToSave.getChatId(),
                messageToSave.getSenderProfileId()
        );

        if (!isParticipant) {
            log.warn("Security Alert: ProfileId {} attempted to send a message to ChatId {} without being a participant!",
                    messageToSave.getSenderProfileId(), messageToSave.getChatId());
            throw new DomainException("User is not a member of this chat.");
        }

        messageToSave.setCreatedAt(ZonedDateTime.now());

        // 1. Persiste no banco de dados (MySQL via Gateway)
        MessageDomain savedMessage = messageRepositoryGateway.save(messageToSave);
        log.info("Message persisted with ID: {}", savedMessage.getId());

        // 2. Transmite em tempo real para os inscritos no tópico WebSocket
        messagePublisherGateway.publishMessage(savedMessage);
        log.info("Message published to real-time broker for chatId: {}", savedMessage.getChatId());

        return savedMessage;
    }
}