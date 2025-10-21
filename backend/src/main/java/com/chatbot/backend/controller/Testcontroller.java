package com.chatbot.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // optional since global CORS is already added
public class Testcontroller {

    @GetMapping("/api/test")
    public String testConnection() {
        return "✅ Hello from Spring Boot Backend!";
    }
}

