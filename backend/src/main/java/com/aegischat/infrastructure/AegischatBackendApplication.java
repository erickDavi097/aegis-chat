package com.aegischat.infrastructure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

// 1. Manda o Spring procurar componentes na raiz do projeto inteiro
@SpringBootApplication(scanBasePackages = "com.aegischat")

// 2. Manda o Spring procurar os Repositories e Entities que estão na pasta de adapters
@EnableJpaRepositories(basePackages = "com.aegischat.adapter.out.persistence")
@EntityScan(basePackages = "com.aegischat.adapter.out.persistence.entity")
public class AegischatBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AegischatBackendApplication.class, args);
    }
}