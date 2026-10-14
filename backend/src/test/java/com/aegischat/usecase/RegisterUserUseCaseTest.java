package com.aegischat.usecase;

import com.aegischat.domain.model.UserDomain;
import com.aegischat.usecase.gateway.UserRepositoryGateway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterUserUseCaseTest {

    @Mock
    private UserRepositoryGateway userRepositoryGateway;

    @InjectMocks
    private RegisterUserUseCase registerUserUseCase;

    @Test
    @DisplayName("Should successfully register user and profile when data is unique")
    void testRegisterSuccess() {
        when(userRepositoryGateway.existsByEmail("secure@aegischat.com")).thenReturn(false);
        when(userRepositoryGateway.existsByUsername("erickdev")).thenReturn(false);
        when(userRepositoryGateway.save(any(UserDomain.class))).thenAnswer(invocation -> {
            UserDomain u = invocation.getArgument(0);
            u.setId(10L);
            return u;
        });

        UserDomain result = registerUserUseCase.execute(
                "secure@aegischat.com",
                "+5511999999999",
                "strongpassword123",
                "erickdev",
                "Erick Silva"
        );

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("secure@aegischat.com", result.getEmail());
        verify(userRepositoryGateway, times(1)).existsByEmail("secure@aegischat.com");
        verify(userRepositoryGateway, times(1)).existsByUsername("erickdev");
        verify(userRepositoryGateway, times(1)).save(any(UserDomain.class));
    }

    @Test
    @DisplayName("Should throw exception when email is already taken")
    void testRegisterEmailConflict() {
        when(userRepositoryGateway.existsByEmail("taken@aegischat.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                registerUserUseCase.execute(
                        "taken@aegischat.com",
                        "+5511999999999",
                        "password123",
                        "newuser",
                        "New User"
                )
        );

        assertEquals("Email is already in use.", ex.getMessage());
        verify(userRepositoryGateway, never()).save(any(UserDomain.class));
    }
}