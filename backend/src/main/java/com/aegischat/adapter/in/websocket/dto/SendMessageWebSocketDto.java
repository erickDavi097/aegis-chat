package com.aegischat.adapter.in.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageWebSocketDto {
    private Long channelId;
    private Long senderProfileId;
    private String encryptedPayload;
    private String mediaUrl;
    private String mediaType;
    private Long mediaSizeBytes;
    private Boolean isTemporary;
}