package com.aegischat.adapter.in.websocket;

import com.aegischat.adapter.in.websocket.dto.SendMessageWebSocketDto;
import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.SendMessageUseCase;
import com.aegischat.adapter.out.persistence.SpringDataUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SendMessageUseCase sendMessageUseCase;
    private final SpringDataUserRepository userRepository;

    @MessageMapping("/chat/{chatId}/send")
    @Transactional
    public void handleSendMessage(@DestinationVariable Long chatId, SendMessageWebSocketDto dto, Principal principal) {

        String userEmail = principal.getName();
        var user = userRepository.findByEmail(userEmail).orElseThrow();
        Long authenticatedProfileId = user.getProfiles().get(0).getId();

        MessageDomain messageDomain = MessageDomain.builder()
                .chatId(chatId)
                .channelId(dto.getChannelId())
                .senderProfileId(authenticatedProfileId)
                .encryptedPayload(dto.getEncryptedPayload())
                .mediaUrl(dto.getMediaUrl())
                .mediaType(dto.getMediaType())
                .mediaSizeBytes(dto.getMediaSizeBytes())
                .isTemporary(dto.getIsTemporary() != null && dto.getIsTemporary())
                .build();

        sendMessageUseCase.execute(messageDomain);
    }
}