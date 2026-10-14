package com.aegischat.usecase.gateway;

public interface StorageGateway {
    String uploadFile(String fileName, byte[] fileData, String contentType);
    byte[] downloadFile(String fileUrl);
}