package com.aegischat.adapter.in.rest;

import com.aegischat.adapter.in.rest.dto.RegisterRequestDto;
import com.aegischat.domain.model.UserDomain;
import com.aegischat.usecase.RegisterUserUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;

    @PostMapping("/register")
    public ResponseEntity<UserDomain> register(@RequestBody @Valid RegisterRequestDto request) {
        UserDomain registeredUser = registerUserUseCase.execute(
                request.email(),
                request.phoneNumber(),
                request.password(),
                request.username(),
                request.displayName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }
}