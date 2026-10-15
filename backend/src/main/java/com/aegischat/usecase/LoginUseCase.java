package com.aegischat.usecase;

import com.aegischat.adapter.out.persistence.SpringDataUserRepository;
import com.aegischat.adapter.out.persistence.entity.UserEntity;
import com.aegischat.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class LoginUseCase {

    private final SpringDataUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Map<String, Object> execute(String email, String rawPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        String token = jwtService.generateToken(user.getEmail());

        // Retorna o perfil principal do usuário (posição 0)
        var primaryProfile = user.getProfiles().get(0);

        return Map.of(
                "token", token,
                "user", Map.of(
                        "id", primaryProfile.getId(), // Usamos o Profile ID para o chat
                        "username", primaryProfile.getUsername(),
                        "displayName", primaryProfile.getDisplayName(),
                        "email", user.getEmail(),
                        "avatarUrl", primaryProfile.getAvatarUrl() != null ? primaryProfile.getAvatarUrl() : ""
                )
        );
    }
}