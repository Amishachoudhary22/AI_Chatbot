package com.chatbot.backend.controller;

import com.chatbot.backend.model.Chat;
import com.chatbot.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // ✅ Fetch all chats for logged-in user
    @GetMapping("/history")
    public ResponseEntity<?> getChats(@RequestHeader("Authorization") String token) {
        try {
            List<Chat> chats = chatService.getUserChats(token.replace("Bearer ", ""));
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Create a new empty chat
    @PostMapping("/new")
    public ResponseEntity<?> newChat(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> body) {
        try {
            String title = body.getOrDefault("title", "New Chat");
            Chat newChat = chatService.createNewChat(token.replace("Bearer ", ""), title);
            return ResponseEntity.ok(newChat);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Send a message to a specific chat
    @PostMapping("/{chatId}/message")
public ResponseEntity<?> sendMessage(
        @RequestHeader("Authorization") String token,
        @PathVariable String chatId,
        @RequestBody Map<String, String> body) {
    try {
        String message = body.get("message");
        System.out.println("📩 Received message from frontend: " + message);  // 👈 ADD THIS LINE
        Chat updatedChat = chatService.sendMessage(token.replace("Bearer ", ""), chatId, message);
        return ResponseEntity.ok(updatedChat);
    } catch (Exception e) {
        e.printStackTrace(); // 👈 ADD THIS TOO
        return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
    }
}
@PatchMapping("/{chatId}/rename")
public Chat renameChat(
        @RequestHeader("Authorization") String token,
        @PathVariable String chatId,
        @RequestBody Map<String, String> body) {

    String newTitle = body.get("title");
    return chatService.renameChat(token.replace("Bearer ", ""), chatId, newTitle);
}

@DeleteMapping("/{chatId}")
public Map<String, String> deleteChat(
        @RequestHeader("Authorization") String token,
        @PathVariable String chatId) {

    chatService.deleteChat(token.replace("Bearer ", ""), chatId);
    return Map.of("message", "Chat deleted successfully");
}


}
