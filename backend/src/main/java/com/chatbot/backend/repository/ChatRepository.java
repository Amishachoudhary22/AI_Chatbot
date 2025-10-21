package com.chatbot.backend.repository;

import com.chatbot.backend.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findByUserEmail(String email);
}
