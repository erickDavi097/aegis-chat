package com.aegischat.adapter.in.rest;

import com.aegischat.usecase.gateway.EncryptionGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/keys")
@RequiredArgsConstructor
public class KeyController {

    private final EncryptionGateway encryptionGateway;

    @GetMapping("/{profileId}")
    public ResponseEntity<?> getPublicKey(@PathVariable Long profileId) {
        try {
            String publicKey = encryptionGateway.getPublicIdentityKey(profileId);
            return ResponseEntity.ok(Map.of("publicIdentityKey", publicKey));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}