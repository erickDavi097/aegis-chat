package com.aegischat.adapter.in.rest;

import com.aegischat.adapter.out.persistence.SpringDataUserRepository;
import com.aegischat.usecase.GetChatMessagesUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {

    private final GetChatMessagesUseCase getChatMessagesUseCase;
    private final SpringDataUserRepository userRepository;

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<?> getChatHistory(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Principal principal) {

        // Extrai a identidade validada pelo Token JWT
        var user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Long authenticatedProfileId = user.getProfiles().get(0).getId();

        Page<?> messages = getChatMessagesUseCase.execute(chatId, authenticatedProfileId, page, size);

        return ResponseEntity.ok(messages);
    }
}