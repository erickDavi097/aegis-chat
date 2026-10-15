package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.UserKeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpringDataUserKeyRepository extends JpaRepository<UserKeyEntity, Long> {
    Optional<UserKeyEntity> findByProfileId(Long profileId);
}