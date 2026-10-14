package com.aegischat.usecase.gateway;

import com.aegischat.domain.model.MessageDomain;

public interface MessageRepositoryGateway {
    MessageDomain save(MessageDomain message);
    boolean isParticipantInChat(Long chatId, Long profileId);
}