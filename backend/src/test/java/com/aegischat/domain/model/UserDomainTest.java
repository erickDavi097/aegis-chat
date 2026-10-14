package com.aegischat.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.ZonedDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserDomainTest {

    @Test
    @DisplayName("Should successfully build UserDomain and add profiles maintaining bidirectional reference")
    void testUserDomainAndProfileAssociation() {
        ZonedDateTime now = ZonedDateTime.now();

        UserDomain user = UserDomain.builder()
                .id(1L)
                .email("test@aegischat.com")
                .phoneNumber("+5511988888888")
                .passwordHash("hashedpassword")
                .isActive(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        UserProfileDomain profile = UserProfileDomain.builder()
                .id(10L)
                .username("erickdev")
                .displayName("Erick Silva")
                .bio("Software Developer")
                .avatarUrl("http://localhost:9000/avatar.png")
                .createdAt(now)
                .updatedAt(now)
                .build();

        user.addProfile(profile);

        assertNotNull(user.getProfiles());
        assertEquals(1, user.getProfiles().size());
        assertEquals("erickdev", user.getProfiles().get(0).getUsername());
        // Garante que o vínculo bidirecional do domínio foi estabelecido corretamente
        assertEquals(user, profile.getUser());
    }

    @Test
    @DisplayName("Should initialize profiles list if null when adding a profile")
    void testAddProfileWithNullInitialList() {
        UserDomain user = new UserDomain();
        user.setProfiles(null);

        UserProfileDomain profile = UserProfileDomain.builder()
                .username("testuser")
                .displayName("Test User")
                .build();

        user.addProfile(profile);

        assertNotNull(user.getProfiles());
        assertEquals(1, user.getProfiles().size());
        assertEquals(user, profile.getUser());
    }
}