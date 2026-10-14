package com.aegischat.usecase;

import com.aegischat.domain.model.UserDomain;
import com.aegischat.domain.model.UserProfileDomain;
import com.aegischat.usecase.gateway.UserRepositoryGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class RegisterUserUseCase {

    private final UserRepositoryGateway userRepositoryGateway;

    public UserDomain execute(String email, String phoneNumber, String rawPassword, String username, String displayName) {
        log.info("Processing registration for email: {} and username: {}", email, username);

        if (userRepositoryGateway.existsByEmail(email)) {
            log.warn("Registration rejected: Email already registered -> {}", email);
            throw new IllegalArgumentException("Email is already in use.");
        }

        if (userRepositoryGateway.existsByUsername(username)) {
            log.warn("Registration rejected: Username already taken -> {}", username);
            throw new IllegalArgumentException("Username is already taken.");
        }

        // Criação do domínio do perfil inicial
        UserProfileDomain initialProfile = UserProfileDomain.builder()
                .username(username)
                .displayName(displayName)
                .build();

        // Criação do domínio do usuário principal
        UserDomain newUser = UserDomain.builder()
                .email(email)
                .phoneNumber(phoneNumber)
                .passwordHash(rawPassword) // Nota: Futuramente será aplicado encoder de segurança
                .isActive(true)
                .build();

        newUser.addProfile(initialProfile);

        UserDomain savedUser = userRepositoryGateway.save(newUser);
        log.info("User and primary profile successfully registered with ID: {}", savedUser.getId());

        return savedUser;
    }
}