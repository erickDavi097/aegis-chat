package com.aegischat.adapter.out.storage;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MinIoStorageAdapterTest {

    private final MinIoStorageAdapter storageAdapter = new MinIoStorageAdapter();

    @Test
    @DisplayName("Should return simulated bucket URL on file upload")
    void testUploadFile() {
        byte[] data = "mock-file-bytes".getBytes();
        String url = storageAdapter.uploadFile("avatar.png", data, "image/png");

        assertNotNull(url);
        assertTrue(url.contains("avatar.png"));
        assertTrue(url.contains("aegis-bucket"));
    }

    @Test
    @DisplayName("Should return byte array on file download stub")
    void testDownloadFile() {
        byte[] bytes = storageAdapter.downloadFile("http://localhost:9000/aegis-bucket/file.png");
        assertNotNull(bytes);
        assertEquals(0, bytes.length);
    }
}