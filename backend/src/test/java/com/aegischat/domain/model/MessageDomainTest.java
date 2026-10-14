package com.aegischat.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.ZonedDateTime;

import static org.junit.jupiter.api.Assertions.*;

class MessageDomainTest {

    @Test
    @DisplayName("Should correctly instantiate MessageDomain via builder and validate fields")
    void testMessageDomainBuilder() {
        ZonedDateTime now = ZonedDateTime.now();

        MessageDomain message = MessageDomain.builder()
                .id(1L)
                .chatId(10L)
                .channelId(2L)
                .senderProfileId(5L)
                .encryptedPayload("EncryptedData==")
                .mediaUrl("http://localhost:9000/file.png")
                .mediaType("IMAGE")
                .mediaSizeBytes(2048L)
                .isTemporary(false)
                .createdAt(now)
                .build();

        assertNotNull(message);
        assertEquals(1L, message.getId());
        assertEquals(10L, message.getChatId());
        assertEquals(2L, message.getChannelId());
        assertEquals(5L, message.getSenderProfileId());
        assertEquals("EncryptedData==", message.getEncryptedPayload());
        assertEquals("IMAGE", message.getMediaType());
        assertFalse(message.getIsTemporary());
        assertEquals(now, message.getCreatedAt());
    }
}