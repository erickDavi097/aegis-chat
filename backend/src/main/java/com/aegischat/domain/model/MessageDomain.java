package com.aegischat.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDomain {
    private Long id;
    private Long chatId;
    private Long channelId;
    private Long senderProfileId;
    private String encryptedPayload; // Conteúdo E2EE Zero-Knowledge
    private String mediaUrl;
    private String mediaType;
    private Long mediaSizeBytes;
    private Boolean isTemporary;
    private ZonedDateTime expiresAt;
    private ZonedDateTime createdAt;
}