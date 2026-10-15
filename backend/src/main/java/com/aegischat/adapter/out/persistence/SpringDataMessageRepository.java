package com.aegischat.adapter.out.persistence;

import com.aegischat.adapter.out.persistence.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface SpringDataMessageRepository extends JpaRepository<MessageEntity, Long> {

    /*@Query("SELECT COUNT(cp) > 0 FROM UserProfileEntity p " +
            "JOIN ChatParticipantEntity cp ON cp.profile.id = p.id " +
            "WHERE cp.chat.id = :chatId AND p.id = :profileId")
    boolean isParticipantInChat(@Param("chatId") Long chatId, @Param("profileId") Long profileId);*/

    Page<MessageEntity> findByChatIdOrderByCreatedAtDesc(Long chatId, Pageable pageable);

}