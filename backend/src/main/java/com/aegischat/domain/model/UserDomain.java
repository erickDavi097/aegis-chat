package com.aegischat.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDomain {
    private Long id;
    private String email;
    private String phoneNumber;
    private String passwordHash;
    private Boolean isActive;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    @Builder.Default
    private List<UserProfileDomain> profiles = new ArrayList<>();

    public void addProfile(UserProfileDomain profile) {
        if (this.profiles == null) {
            this.profiles = new ArrayList<>();
        }
        this.profiles.add(profile);
        profile.setUser(this);
    }
}