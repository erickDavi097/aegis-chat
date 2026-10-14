package com.aegischat.adapter.out.persistence.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.ZonedDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class UserEntityTest {

    @Test
    @DisplayName("Should correctly instantiate UserEntity and validate default builder values and ZonedDateTime")
    void testUserEntityBuilderAndDefaults() {
        ZonedDateTime now = ZonedDateTime.now();

        UserEntity userEntity = UserEntity.builder()
                .id(1L)
                .email("jpa@aegischat.com")
                .phoneNumber("+5511977777777")
                .passwordHash("hash123")
                .mfaSecret("secret123")
                .isMfaEnabled(true)
                .isActive(false)
                .createdAt(now)
                .updatedAt(now)
                .profiles(new ArrayList<>())
                .build();

        assertNotNull(userEntity);
        assertEquals(1L, userEntity.getId());
        assertEquals("jpa@aegischat.com", userEntity.getEmail());
        assertEquals("+5511977777777", userEntity.getPhoneNumber());
        assertEquals("hash123", userEntity.getPasswordHash());
        assertEquals("secret123", userEntity.getMfaSecret());
        assertTrue(userEntity.getIsMfaEnabled());
        assertFalse(userEntity.getIsActive());
        assertEquals(now, userEntity.getCreatedAt());
        assertEquals(now, userEntity.getUpdatedAt());
        assertNotNull(userEntity.getProfiles());
    }

    @Test
    @DisplayName("Should correctly instantiate MessageEntity with ZonedDateTime expiresAt")
    void testMessageEntityZonedDateTime() {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime futureExpiry = now.plusHours(48);

        MessageEntity messageEntity = MessageEntity.builder()
                .id(100L)
                .chatId(5L)
                .channelId(2L)
                .senderProfileId(12L)
                .encryptedPayload("EncryptedDataPayload==")
                .mediaUrl("http://localhost:9000/media/img.png")
                .mediaType("IMAGE")
                .mediaSizeBytes(102450L)
                .isTemporary(true)
                .expiresAt(futureExpiry)
                .createdAt(now)
                .build();

        assertNotNull(messageEntity);
        assertEquals(100L, messageEntity.getId());
        assertEquals(5L, messageEntity.getChatId());
        assertEquals(2L, messageEntity.getChannelId());
        assertEquals(12L, messageEntity.getSenderProfileId());
        assertEquals("EncryptedDataPayload==", messageEntity.getEncryptedPayload());
        assertTrue(messageEntity.getIsTemporary());
        assertEquals(futureExpiry, messageEntity.getExpiresAt());
        assertEquals(now, messageEntity.getCreatedAt());
    }

    @Test
    @DisplayName("Should correctly instantiate UserKeyEntity for E2EE keys storage")
    void testUserKeyEntity() {
        ZonedDateTime now = ZonedDateTime.now();

        UserKeyEntity keyEntity = UserKeyEntity.builder()
                .id(1L)
                .profileId(3L)
                .publicIdentityKey("IdentityKeyBase64")
                .publicSignedPreKey("SignedPreKeyBase64")
                .createdAt(now)
                .build();

        assertNotNull(keyEntity);
        assertEquals(3L, keyEntity.getProfileId());
        assertEquals("IdentityKeyBase64", keyEntity.getPublicIdentityKey());
        assertEquals("SignedPreKeyBase64", keyEntity.getPublicSignedPreKey());
        assertEquals(now, keyEntity.getCreatedAt());
    }
}