package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.UserEntity;
import com.aegischat.adapter.out.persistence.entity.UserProfileEntity;
import com.aegischat.domain.model.UserDomain;
import com.aegischat.domain.model.UserProfileDomain;
import com.aegischat.usecase.gateway.UserRepositoryGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserRepositoryGatewayImpl implements UserRepositoryGateway {

    private final SpringDataUserRepository userRepository;

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByProfilesUsername(username);
    }

    @Override
    public UserDomain save(UserDomain userDomain) {
        // 1. Converte o Domínio puro para a Entidade do Banco (JPA)
        UserEntity entity = toEntity(userDomain);

        // 2. Salva no banco de dados (o Hibernate gera o ID aqui)
        UserEntity savedEntity = userRepository.save(entity);

        // 3. Converte de volta para o Domínio e devolve para o UseCase
        return toDomain(savedEntity);
    }

    // --- MÉTODOS DE MAPEAMENTO (DE DOMÍNIO PARA BANCO E VICE-VERSA) ---

    private UserEntity toEntity(UserDomain domain) {
        if (domain == null) return null;

        UserEntity entity = new UserEntity();
        entity.setId(domain.getId());
        entity.setEmail(domain.getEmail());
        entity.setPhoneNumber(domain.getPhoneNumber());
        entity.setPasswordHash(domain.getPasswordHash());
        entity.setIsActive(domain.getIsActive());

        if (domain.getProfiles() != null) {
            entity.setProfiles(domain.getProfiles().stream().map(profileDomain -> {
                UserProfileEntity profileEntity = new UserProfileEntity();
                profileEntity.setId(profileDomain.getId());
                profileEntity.setUsername(profileDomain.getUsername());
                profileEntity.setDisplayName(profileDomain.getDisplayName());
                profileEntity.setAvatarUrl(profileDomain.getAvatarUrl());

                // IMPORTANTE: Amarração bidirecional para o Hibernate salvar as duas tabelas
                profileEntity.setUser(entity);
                return profileEntity;
            }).collect(Collectors.toList()));
        }
        return entity;
    }

    private UserDomain toDomain(UserEntity entity) {
        if (entity == null) return null;

        UserDomain domain = UserDomain.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .passwordHash(entity.getPasswordHash())
                .isActive(entity.getIsActive())
                .build();

        if (entity.getProfiles() != null) {
            entity.getProfiles().forEach(profileEntity -> {
                UserProfileDomain profileDomain = UserProfileDomain.builder()
                        .id(profileEntity.getId())
                        .username(profileEntity.getUsername())
                        .displayName(profileEntity.getDisplayName())
                        .avatarUrl(profileEntity.getAvatarUrl())
                        .build();
                domain.addProfile(profileDomain);
            });
        }
        return domain;
    }
}