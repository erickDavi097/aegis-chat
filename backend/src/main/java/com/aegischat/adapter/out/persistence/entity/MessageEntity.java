package com.aegischat.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_msg_chat_created", columnList = "chat_id, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @Column(name = "chat_id", nullable = false, columnDefinition = "BIGINT UNSIGNED")
    private Long chatId;

    @Column(name = "channel_id", columnDefinition = "BIGINT UNSIGNED")
    private Long channelId; // Opcional para canais tipo Discord

    @Column(name = "sender_profile_id", nullable = false, columnDefinition = "BIGINT UNSIGNED")
    private Long senderProfileId;

    @Lob
    @Column(name = "encrypted_payload", nullable = false, columnDefinition = "TEXT")
    private String encryptedPayload; // Conteúdo E2EE Zero-Knowledge

    @Column(name = "media_url", length = 508)
    private String mediaUrl; // Referência MinIO

    @Column(name = "media_type", length = 50)
    private String mediaType; // 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'STICKER'

    @Column(name = "media_size_bytes", columnDefinition = "BIGINT UNSIGNED")
    @Builder.Default
    private Long mediaSizeBytes = 0L; // Usado pelo Gerenciador de Armazenamento

    @Column(name = "is_temporary", nullable = false)
    @Builder.Default
    private Boolean isTemporary = false;

    @Column(name = "expires_at")
    private ZonedDateTime expiresAt; // Para mensagens que somem após 48h

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}