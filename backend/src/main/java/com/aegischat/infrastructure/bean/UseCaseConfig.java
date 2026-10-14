package com.aegischat.infrastructure.bean;

import com.aegischat.usecase.RegisterUserUseCase;
import com.aegischat.usecase.SendMessageUseCase;
import com.aegischat.usecase.StoreUserKeysUseCase;
import com.aegischat.usecase.gateway.EncryptionGateway;
import com.aegischat.usecase.gateway.MessagePublisherGateway;
import com.aegischat.usecase.gateway.MessageRepositoryGateway;
import com.aegischat.usecase.gateway.UserRepositoryGateway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {

    @Bean
    public RegisterUserUseCase registerUserUseCase(UserRepositoryGateway userRepositoryGateway) {
        return new RegisterUserUseCase(userRepositoryGateway);
    }
    @Bean
    public SendMessageUseCase sendMessageUseCase(
            MessageRepositoryGateway messageRepositoryGateway,
            MessagePublisherGateway messagePublisherGateway
    ) {
        return new SendMessageUseCase(messageRepositoryGateway, messagePublisherGateway);
    }
    @Bean
    public StoreUserKeysUseCase storeUserKeysUseCase(
            EncryptionGateway encryptionGateway
    ) {
        return new StoreUserKeysUseCase(encryptionGateway);
    }
}