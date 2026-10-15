package com.aegischat.usecase;

import com.aegischat.adapter.out.persistence.SpringDataMessageRepository;
import com.aegischat.adapter.out.persistence.entity.MessageEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetChatMessagesUseCase {

    private final SpringDataMessageRepository messageRepository;
    // Opcional: injetar ChatRepository para validar se o usuário pertence ao chat

    @Transactional(readOnly = true)
    public Page<MessageEntity> execute(Long chatId, Long requestingProfileId, int page, int size) {

        // TODO: (Segurança) Verificar se o requestingProfileId é membro do chatId
        // if (!chatRepository.isMember(chatId, requestingProfileId)) { throw new AccessDeniedException(...); }

        Pageable pageable = PageRequest.of(page, size);
        return messageRepository.findByChatIdOrderByCreatedAtDesc(chatId, pageable);
    }
}