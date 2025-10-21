package com.chatbot.backend.service;

import com.chatbot.backend.model.User;
import com.chatbot.backend.repository.UserRepository;
import com.chatbot.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent())
            return "User already exists!";

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    public String login(String email, String password) {
    var userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) throw new RuntimeException("User not found");
    var user = userOpt.get();

    if (!passwordEncoder.matches(password, user.getPassword()))
        throw new RuntimeException("Invalid password");

    return jwtUtil.generateToken(user.getEmail());
}
}


