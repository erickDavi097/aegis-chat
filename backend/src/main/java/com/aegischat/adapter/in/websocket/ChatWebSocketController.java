package com.aegischat.adapter.in.websocket;

import com.aegischat.adapter.in.websocket.dto.SendMessageWebSocketDto;
import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.SendMessageUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SendMessageUseCase sendMessageUseCase;

    @MessageMapping("/chat/{chatId}/send")
    public void handleSendMessage(@DestinationVariable Long chatId, SendMessageWebSocketDto dto) {
        MessageDomain messageDomain = MessageDomain.builder()
                .chatId(chatId)
                .channelId(dto.getChannelId())
                .senderProfileId(dto.getSenderProfileId())
                .encryptedPayload(dto.getEncryptedPayload())
                .mediaUrl(dto.getMediaUrl())
                .mediaType(dto.getMediaType())
                .mediaSizeBytes(dto.getMediaSizeBytes())
                .isTemporary(dto.getIsTemporary() != null && dto.getIsTemporary())
                .build();

        sendMessageUseCase.execute(messageDomain);
    }
}