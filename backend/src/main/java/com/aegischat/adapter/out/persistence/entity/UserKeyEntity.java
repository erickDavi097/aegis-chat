package com.aegischat.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

@Entity
@Table(name = "user_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserKeyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @Column(name = "profile_id", nullable = false, columnDefinition = "BIGINT UNSIGNED")
    private Long profileId;

    @Lob
    @Column(name = "public_identity_key", nullable = false, columnDefinition = "TEXT")
    private String publicIdentityKey;

    @Lob
    @Column(name = "public_signed_pre_key", nullable = false, columnDefinition = "TEXT")
    private String publicSignedPreKey;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}