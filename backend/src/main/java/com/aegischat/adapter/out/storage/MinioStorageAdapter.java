package com.aegischat.adapter.out.storage;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioStorageAdapter {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.url}")
    private String minioUrl;

    public String uploadFile(MultipartFile file) {
        try {
            // 1. Verifica se o bucket existe, se não, cria.
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                log.info("Bucket '{}' criado com sucesso.", bucketName);
            }

            String policy = """
                {
                  "Version": "2012-10-17",
                  "Statement": [
                    {
                      "Effect": "Allow",
                      "Principal": "*",
                      "Action": ["s3:GetObject"],
                      "Resource": ["arn:aws:s3:::%s/*"]
                    }
                  ]
                }
                """.formatted(bucketName);
            minioClient.setBucketPolicy(io.minio.SetBucketPolicyArgs.builder().bucket(bucketName).config(policy).build());

            // 2. Gera um nome único para não sobrescrever arquivos com o mesmo nome
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            // 3. Faz o upload
            try (InputStream inputStream = file.getInputStream()) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
                                .object(uniqueFileName)
                                .stream(inputStream, file.getSize(), -1)
                                .contentType(file.getContentType())
                                .build());
            }

            // 4. Retorna a URL direta do arquivo (no ambiente real, geraremos uma Presigned URL para segurança)
            String fileUrl = minioUrl + "/" + bucketName + "/" + uniqueFileName;
            log.info("Arquivo salvo com sucesso: {}", fileUrl);

            return fileUrl;

        } catch (Exception e) {
            log.error("Erro ao fazer upload no MinIO", e);
            throw new RuntimeException("Falha ao salvar o arquivo.", e);
        }
    }
}