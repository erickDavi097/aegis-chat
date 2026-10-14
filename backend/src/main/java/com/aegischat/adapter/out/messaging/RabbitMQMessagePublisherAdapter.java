package com.aegischat.adapter.out.messaging;

import com.aegischat.domain.model.MessageDomain;
import com.aegischat.usecase.gateway.MessagePublisherGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RabbitMQMessagePublisherAdapter implements MessagePublisherGateway {

    private final RabbitTemplate rabbitTemplate;

    public static final String EXCHANGE_NAME = "aegis.chat.exchange";
    public static final String ROUTING_KEY_PREFIX = "chat.message.";

    @Override
    public void publishMessage(MessageDomain message) {
        String routingKey = ROUTING_KEY_PREFIX + message.getChatId();
        log.info("Publishing message ID {} to RabbitMQ Exchange [{}] with routing key [{}]",
                message.getId(), EXCHANGE_NAME, routingKey);

        try {
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, routingKey, message);
            log.debug("Message ID {} successfully sent to RabbitMQ broker", message.getId());
        } catch (Exception e) {
            log.error("CRITICAL: Failed to publish message ID {} to RabbitMQ", message.getId(), e);
            throw new RuntimeException("Could not dispatch real-time message event.", e);
        }
    }
}