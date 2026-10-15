package com.aegischat.adapter.out.messaging;

import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.gateway.MessagePublisherGateway;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RabbitMQMessagePublisherAdapter implements MessagePublisherGateway {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Value("${aegis.rabbitmq.exchange:aegis.chat.exchange}")
    private String exchange;

    @Override
    public void publishMessage(MessageDomain message) {
        String routingKey = "chat.message." + message.getChatId();
        log.info("Publishing message ID {} to RabbitMQ Exchange [{}] with routing key [{}]",
                message.getId(), exchange, routingKey);

        try {
            // Converte o objeto Java para String (JSON) antes de jogar na fila
            String jsonPayload = objectMapper.writeValueAsString(message);

            rabbitTemplate.convertAndSend(exchange, routingKey, jsonPayload);

        } catch (JsonProcessingException e) {
            log.error("Erro ao converter MessageDomain para JSON: {}", e.getMessage());
            throw new RuntimeException("Falha ao serializar mensagem para o RabbitMQ", e);
        } catch (Exception e) {
            log.error("CRITICAL: Failed to publish message ID {} to RabbitMQ", message.getId(), e);
            throw new RuntimeException("Could not dispatch real-time message event.", e);
        }
    }
}