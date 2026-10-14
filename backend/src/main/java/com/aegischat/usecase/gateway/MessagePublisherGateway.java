package com.aegischat.usecase.gateway;

import com.aegischat.domain.model.MessageDomain;

public interface MessagePublisherGateway {
    void publishMessage(MessageDomain message);
}