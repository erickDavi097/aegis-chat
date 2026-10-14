package com.aegischat.adapter.in.websocket;

import com.aegischat.adapter.in.websocket.dto.SendMessageWebSocketDto;
import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.SendMessageUseCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatWebSocketControllerTest {

    @Mock
    private SendMessageUseCase sendMessageUseCase;

    @InjectMocks
    private ChatWebSocketController chatWebSocketController;

    @Test
    @DisplayName("Should map WebSocket DTO to Domain and call SendMessageUseCase")
    void testHandleSendMessageWebSocket() {
        Long chatId = 50L;
        SendMessageWebSocketDto dto = new SendMessageWebSocketDto(
                2L,
                10L,
                "EncryptedPayloadBase64==",
                null,
                null,
                null,
                false
        );

        chatWebSocketController.handleSendMessage(chatId, dto);

        ArgumentCaptor<MessageDomain> captor = ArgumentCaptor.forClass(MessageDomain.class);
        verify(sendMessageUseCase, times(1)).execute(captor.capture());

        MessageDomain captured = captor.getValue();
        assertEquals(50L, captured.getChatId());
        assertEquals(2L, captured.getChannelId());
        assertEquals(10L, captured.getSenderProfileId());
        assertEquals("EncryptedPayloadBase64==", captured.getEncryptedPayload());
        assertFalse(captured.getIsTemporary());
    }
}