package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.UserEntity;
import com.aegischat.domain.model.UserDomain;
import com.aegischat.domain.model.UserProfileDomain;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserRepositoryAdapterTest {

    @Mock
    private SpringDataUserRepository springDataUserRepository;

    @InjectMocks
    private UserRepositoryAdapter userRepositoryAdapter;

    @Test
    @DisplayName("Should successfully check if email exists delegating to Spring Data repository")
    void testExistsByEmail() {
        when(springDataUserRepository.existsByEmail("test@aegischat.com")).thenReturn(true);

        boolean exists = userRepositoryAdapter.existsByEmail("test@aegischat.com");

        assertTrue(exists);
        verify(springDataUserRepository, times(1)).existsByEmail("test@aegischat.com");
    }

    @Test
    @DisplayName("Should successfully check if username exists delegating to Spring Data repository")
    void testExistsByUsername() {
        when(springDataUserRepository.existsByProfilesUsername("erickdev")).thenReturn(false);

        boolean exists = userRepositoryAdapter.existsByUsername("erickdev");

        assertFalse(exists);
        verify(springDataUserRepository, times(1)).existsByProfilesUsername("erickdev");
    }

    @Test
    @DisplayName("Should correctly map Domain to Entity, save, and map back to Domain")
    void testSaveUserDomain() {
        ZonedDateTime now = ZonedDateTime.now();

        UserProfileDomain profileDomain = UserProfileDomain.builder()
                .username("erickdev")
                .displayName("Erick Silva")
                .build();

        UserDomain userDomain = UserDomain.builder()
                .email("erick@aegischat.com")
                .phoneNumber("+5511999999999")
                .passwordHash("hashedpassword")
                .isActive(true)
                .profiles(List.of(profileDomain))
                .build();

        UserEntity savedEntityMock = UserEntity.builder()
                .id(1L)
                .email("erick@aegischat.com")
                .phoneNumber("+5511999999999")
                .passwordHash("hashedpassword")
                .isActive(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        when(springDataUserRepository.save(any(UserEntity.class))).thenReturn(savedEntityMock);

        UserDomain result = userRepositoryAdapter.save(userDomain);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("erick@aegischat.com", result.getEmail());
        assertEquals("+5511999999999", result.getPhoneNumber());
        assertTrue(result.getIsActive());

        // Captura o objeto passado ao Spring Data para garantir que mapeou os perfis corretamente
        ArgumentCaptor<UserEntity> captor = ArgumentCaptor.forClass(UserEntity.class);
        verify(springDataUserRepository, times(1)).save(captor.capture());
        assertEquals(1, captor.getValue().getProfiles().size());
        assertEquals("erickdev", captor.getValue().getProfiles().get(0).getUsername());
    }
}