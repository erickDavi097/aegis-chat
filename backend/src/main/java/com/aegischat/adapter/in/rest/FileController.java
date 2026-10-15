package com.aegischat.adapter.in.rest;

import com.aegischat.adapter.out.storage.MinioStorageAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final MinioStorageAdapter storageAdapter;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Arquivo vazio."));
        }

        String fileUrl = storageAdapter.uploadFile(file);

        // Retornamos um JSON com a URL final para o Frontend injetar na mensagem do WebSocket
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}