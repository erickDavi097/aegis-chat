package com.aegischat.usecase.gateway;

import com.aegischat.domain.model.UserDomain;
import java.util.Optional;

public interface UserRepositoryGateway {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    UserDomain save(UserDomain user);
}