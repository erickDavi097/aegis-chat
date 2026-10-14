package com.aegischat.usecase;

import com.aegischat.domain.exception.DomainException;
import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.gateway.MessagePublisherGateway;
import com.aegischat.usecase.gateway.MessageRepositoryGateway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SendMessageUseCaseTest {

    @Mock
    private MessageRepositoryGateway messageRepositoryGateway;

    @Mock
    private MessagePublisherGateway messagePublisherGateway;

    @InjectMocks
    private SendMessageUseCase sendMessageUseCase;

    private MessageDomain sampleMessage;

    @BeforeEach
    void setUp() {
        sampleMessage = MessageDomain.builder()
                .chatId(100L)
                .senderProfileId(5L)
                .encryptedPayload("EncryptedAES256Base64Data==")
                .isTemporary(false)
                .build();
    }

    @Test
    @DisplayName("Should successfully save and publish message when user is a valid participant")
    void testSendMessageSuccess() {
        // Arrange
        when(messageRepositoryGateway.isParticipantInChat(100L, 5L)).thenReturn(true);
        when(messageRepositoryGateway.save(any(MessageDomain.class))).thenAnswer(inv -> {
            MessageDomain msg = inv.getArgument(0);
            msg.setId(1L);
            return msg;
        });

        // Act
        MessageDomain result = sendMessageUseCase.execute(sampleMessage);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertNotNull(result.getCreatedAt());

        // Captura o objeto publicado para garantir que foi enviado ao Broker WebSocket
        ArgumentCaptor<MessageDomain> captor = ArgumentCaptor.forClass(MessageDomain.class);
        verify(messagePublisherGateway, times(1)).publishMessage(captor.capture());
        assertEquals("EncryptedAES256Base64Data==", captor.getValue().getEncryptedPayload());
    }

    @Test
    @DisplayName("Should throw DomainException when user is NOT a member of the chat (Security Test)")
    void testSendMessageUnauthorizedUser() {
        // Arrange: O usuário NÃO é participante do chat
        when(messageRepositoryGateway.isParticipantInChat(100L, 5L)).thenReturn(false);

        // Act & Assert
        DomainException ex = assertThrows(DomainException.class, () ->
                sendMessageUseCase.execute(sampleMessage)
        );

        assertEquals("User is not a member of this chat.", ex.getMessage());

        // Garante que NENHUMA mensagem foi salva nem transmitida no WebSocket
        verify(messageRepositoryGateway, never()).save(any());
        verify(messagePublisherGateway, never()).publishMessage(any());
    }

    @Test
    @DisplayName("Should throw DomainException when encrypted payload is null or blank")
    void testSendMessageEmptyPayload() {
        // Arrange
        sampleMessage.setEncryptedPayload("   ");

        // Act & Assert
        DomainException ex = assertThrows(DomainException.class, () ->
                sendMessageUseCase.execute(sampleMessage)
        );

        assertEquals("Encrypted message payload cannot be empty.", ex.getMessage());
        verify(messageRepositoryGateway, never()).isParticipantInChat(any(), any());
        verify(messagePublisherGateway, never()).publishMessage(any());
    }
}