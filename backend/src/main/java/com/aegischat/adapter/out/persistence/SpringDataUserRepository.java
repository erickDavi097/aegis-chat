package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataUserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(p) > 0 FROM UserProfileEntity p WHERE p.username = :username")
    boolean existsByUsername(@Param("username") String username);
}