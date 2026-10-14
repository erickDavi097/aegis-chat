package com.aegischat.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Habilita o broker de memória para tópicos (broadcast) e filas (direto)
        // Habilita um broker simples de memória para enviar mensagens aos tópicos (ex: /topic/chat)
        registry.enableSimpleBroker("/topic", "/queue");

        // Prefixo para as rotas enviadas pelo cliente (ex: /app/chat/{id}/send)
        // Prefixo para mensagens enviadas do cliente para o servidor (@MessageMapping)
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint principal de conexão WebSocket do AegisChat com SockJS (fallback)
        registry.addEndpoint("/ws-aegis")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}