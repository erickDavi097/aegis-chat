package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.UserEntity;
import com.aegischat.adapter.out.persistence.entity.UserProfileEntity;
import com.aegischat.domain.model.UserDomain;
import com.aegischat.usecase.gateway.UserRepositoryGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryGateway {

    private final SpringDataUserRepository springDataUserRepository;

    @Override
    public boolean existsByEmail(String email) {
        return springDataUserRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return springDataUserRepository.existsByUsername(username);
    }

    @Override
    public UserDomain save(UserDomain userDomain) {
        UserEntity entity = UserEntity.builder()
                .email(userDomain.getEmail())
                .phoneNumber(userDomain.getPhoneNumber())
                .passwordHash(userDomain.getPasswordHash())
                .isActive(userDomain.getIsActive())
                .build();

        if (userDomain.getProfiles() != null) {
            var profileEntities = userDomain.getProfiles().stream().map(p ->
                    UserProfileEntity.builder()
                            .user(entity)
                            .username(p.getUsername())
                            .displayName(p.getDisplayName())
                            .build()
            ).collect(Collectors.toList());
            entity.setProfiles(profileEntities);
        }

        UserEntity saved = springDataUserRepository.save(entity);

        return UserDomain.builder()
                .id(saved.getId())
                .email(saved.getEmail())
                .phoneNumber(saved.getPhoneNumber())
                .passwordHash(saved.getPasswordHash())
                .isActive(saved.getIsActive())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }
}