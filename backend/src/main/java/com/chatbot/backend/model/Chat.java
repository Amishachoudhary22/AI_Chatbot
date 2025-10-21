package com.chatbot.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "chats")
public class Chat {

    @Id  // ✅ Only this one — from org.springframework.data.annotation.Id
    private String id;

    @Field("userEmail")
    private String userEmail;

    private String title;

    private List<Message> messages = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
}


