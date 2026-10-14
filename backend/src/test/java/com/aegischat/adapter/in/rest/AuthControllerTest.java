package com.aegischat.adapter.in.rest;

import com.aegischat.adapter.in.rest.dto.RegisterRequestDto;
import com.aegischat.usecase.RegisterUserUseCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RegisterUserUseCase registerUserUseCase;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    @DisplayName("Should successfully process register request and return 201 Created")
    void testRegisterSuccess() throws Exception {
        RegisterRequestDto dto = new RegisterRequestDto(
                "erick@aegischat.com",
                "+5511999999999",
                "StrongP@ss1",
                "erickdev",
                "Erick Silva"
        );

        // Como execute() retorna um valor, não precisamos de doNothing().
        // O mock executará normalmente e o MockMvc validará o status 201.

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        verify(registerUserUseCase, times(1)).execute(
                eq("erick@aegischat.com"),
                eq("+5511999999999"),
                eq("StrongP@ss1"),
                eq("erickdev"),
                eq("Erick Silva")
        );
    }
}