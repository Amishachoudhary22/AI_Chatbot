package com.chatbot.backend.service;

import com.chatbot.backend.model.Chat;
import com.chatbot.backend.model.Message;
import com.chatbot.backend.repository.ChatRepository;
import com.chatbot.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private GeminiService geminiService;


    @Autowired
    private JwtUtil jwtUtil;

    public List<Chat> getUserChats(String token) {
    String email = jwtUtil.extractUsername(token);
    return chatRepository.findByUserEmail(email);
}

    public Chat createNewChat(String token, String title) {
        String email = jwtUtil.extractUsername(token);
        Chat chat = new Chat();
        chat.setUserEmail(email);
        chat.setTitle(title);
        return chatRepository.save(chat);
    }

    public Chat sendMessage(String token, String chatId, String messageContent) throws Exception {
    String email = jwtUtil.extractUsername(token);

    Chat chat = chatRepository.findById(chatId)
            .filter(c -> c.getUserEmail().equals(email))
            .orElseThrow(() -> new RuntimeException("Chat not found"));

    Message userMsg = new Message("user", messageContent);
    chat.getMessages().add(userMsg);

    String botResponse = geminiService.getAIResponse(messageContent);


    Message botMsg = new Message("bot", botResponse);
    chat.getMessages().add(botMsg);

    // 💡 Optional: Update chat title dynamically based on first message
    if (chat.getMessages().size() == 2 && chat.getTitle().equals("New Chat")) {
        String shortTitle = messageContent.length() > 30
                ? messageContent.substring(0, 30) + "..."
                : messageContent;
        chat.setTitle(shortTitle);
    }

    return chatRepository.save(chat);
}
public Chat renameChat(String token, String chatId, String newTitle) {
    String email = jwtUtil.extractUsername(token);
    Chat chat = chatRepository.findById(chatId)
            .filter(c -> c.getUserEmail().equals(email))
            .orElseThrow(() -> new RuntimeException("Chat not found"));

    chat.setTitle(newTitle);
    return chatRepository.save(chat);
}

public void deleteChat(String token, String chatId) {
    String email = jwtUtil.extractUsername(token);
    Chat chat = chatRepository.findById(chatId)
            .filter(c -> c.getUserEmail().equals(email))
            .orElseThrow(() -> new RuntimeException("Chat not found"));

    chatRepository.delete(chat);
}



}
