package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.MessageEntity;
import com.aegischat.domain.model.MessageDomain;
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
class MessageRepositoryAdapterTest {

    @Mock
    private SpringDataMessageRepository springDataMessageRepository;

    @InjectMocks
    private MessageRepositoryAdapter messageRepositoryAdapter;

    @Test
    @DisplayName("Should successfully save message domain translating to entity and back")
    void testSaveMessageDomain() {
        ZonedDateTime now = ZonedDateTime.now();

        MessageDomain messageDomain = MessageDomain.builder()
                .chatId(10L)
                .channelId(2L)
                .senderProfileId(5L)
                .encryptedPayload("EncryptedAESPayload==")
                .mediaUrl("http://localhost:9000/file.png")
                .mediaType("IMAGE")
                .mediaSizeBytes(51200L)
                .isTemporary(false)
                .build();

        MessageEntity savedEntityMock = MessageEntity.builder()
                .id(42L)
                .chatId(10L)
                .channelId(2L)
                .senderProfileId(5L)
                .encryptedPayload("EncryptedAESPayload==")
                .mediaUrl("http://localhost:9000/file.png")
                .mediaType("IMAGE")
                .mediaSizeBytes(51200L)
                .isTemporary(false)
                .createdAt(now)
                .build();

        when(springDataMessageRepository.save(any(MessageEntity.class))).thenReturn(savedEntityMock);

        MessageDomain result = messageRepositoryAdapter.save(messageDomain);

        assertNotNull(result);
        assertEquals(42L, result.getId());
        assertEquals(10L, result.getChatId());
        assertEquals("EncryptedAESPayload==", result.getEncryptedPayload());
        assertEquals(now, result.getCreatedAt());

        // Verifica o mapeamento correto dos campos de mídia e tempo real
        ArgumentCaptor<MessageEntity> captor = ArgumentCaptor.forClass(MessageEntity.class);
        verify(springDataMessageRepository, times(1)).save(captor.capture());
        assertEquals("IMAGE", captor.getValue().getMediaType());
        assertEquals(51200L, captor.getValue().getMediaSizeBytes());
    }

    @Test
    @DisplayName("Should check if participant belongs to chat delegating to repository query")
    void testIsParticipantInChat() {
        when(springDataMessageRepository.isParticipantInChat(10L, 5L)).thenReturn(true);

        boolean isParticipant = messageRepositoryAdapter.isParticipantInChat(10L, 5L);

        assertTrue(isParticipant);
        verify(springDataMessageRepository, times(1)).isParticipantInChat(10L, 5L);
    }
}