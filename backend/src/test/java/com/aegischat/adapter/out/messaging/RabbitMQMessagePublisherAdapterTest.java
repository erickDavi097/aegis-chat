package com.aegischat.adapter.out.messaging;

import com.aegischat.domain.model.MessageDomain;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RabbitMQMessagePublisherAdapterTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private RabbitMQMessagePublisherAdapter rabbitMQMessagePublisherAdapter;

    @Test
    @DisplayName("Should successfully publish message to RabbitMQ exchange")
    void testPublishMessageSuccess() {
        MessageDomain message = MessageDomain.builder()
                .id(1L)
                .chatId(100L)
                .encryptedPayload("EncryptedData==")
                .build();

        assertDoesNotThrow(() -> rabbitMQMessagePublisherAdapter.publishMessage(message));

        verify(rabbitTemplate, times(1)).convertAndSend(
                eq("aegis.chat.exchange"),
                eq("chat.message.100"),
                eq(message)
        );
    }

    @Test
    @DisplayName("Should throw RuntimeException when RabbitMQ broker fails")
    void testPublishMessageFailure() {
        MessageDomain message = MessageDomain.builder()
                .id(1L)
                .chatId(100L)
                .encryptedPayload("EncryptedData==")
                .build();

        doThrow(new RuntimeException("Broker connection error")).when(rabbitTemplate)
                .convertAndSend(anyString(), anyString(), any(Object.class));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                rabbitMQMessagePublisherAdapter.publishMessage(message)
        );

        assertEquals("Could not dispatch real-time message event.", ex.getMessage());
    }
}