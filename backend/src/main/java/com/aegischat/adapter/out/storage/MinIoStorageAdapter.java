package com.aegischat.adapter.out.storage;

import com.aegischat.usecase.gateway.StorageGateway;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MinIoStorageAdapter implements StorageGateway {

    @Override
    public String uploadFile(String fileName, byte[] fileData, String contentType) {
        log.info("[MinIO Storage Stub] Uploading file: {} (Size: {} bytes, Type: {})",
                fileName, fileData.length, contentType);

        // Simulação de retorno de URL do bucket MinIO
        return "http://localhost:9000/aegis-bucket/" + fileName;
    }

    @Override
    public byte[] downloadFile(String fileUrl) {
        log.info("[MinIO Storage Stub] Downloading file from URL: {}", fileUrl);
        return new byte[0];
    }
}