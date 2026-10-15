package com.aegischat.infrastructure.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${aegis.rabbitmq.exchange:aegis.chat.exchange}")
    private String exchangeName;

    @Bean
    public TopicExchange chatExchange() {
        // Cria a Exchange automaticamente no RabbitMQ se ela não existir
        return new TopicExchange(exchangeName, true, false);
    }
}