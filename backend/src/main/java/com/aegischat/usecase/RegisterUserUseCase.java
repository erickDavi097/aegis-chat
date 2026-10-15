package com.aegischat.usecase;

import com.aegischat.domain.model.UserDomain;
import com.aegischat.domain.model.UserProfileDomain;
import com.aegischat.usecase.gateway.UserRepositoryGateway;
import com.aegischat.usecase.gateway.EncryptionGateway; // <-- Import novo
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@RequiredArgsConstructor
public class RegisterUserUseCase {

    private final UserRepositoryGateway userRepositoryGateway;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionGateway encryptionGateway; // <-- Nova injeção de dependência

    // Adicionamos as duas chaves na assinatura do método
    public UserDomain execute(String email, String phoneNumber, String rawPassword, String username, String displayName, String publicIdentityKey, String publicSignedPreKey) {
        log.info("Processing registration for email: {} and username: {}", email, username);

        if (userRepositoryGateway.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        if (userRepositoryGateway.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        UserProfileDomain initialProfile = UserProfileDomain.builder()
                .username(username)
                .displayName(displayName)
                .build();

        UserDomain newUser = UserDomain.builder()
                .email(email)
                .phoneNumber(phoneNumber)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .isActive(true)
                .build();

        newUser.addProfile(initialProfile);

        // Salva o usuário no MySQL
        UserDomain savedUser = userRepositoryGateway.save(newUser);

        // Pega o ID do perfil que acabou de ser criado e salva as chaves E2EE
        Long profileId = savedUser.getProfiles().get(0).getId();
        encryptionGateway.storeUserKeys(profileId, publicIdentityKey, publicSignedPreKey);

        savedUser.setPasswordHash(null);

        log.info("User successfully registered with ID: {}", savedUser.getId());
        return savedUser;
    }
}