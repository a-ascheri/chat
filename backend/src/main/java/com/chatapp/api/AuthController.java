package com.chatapp.api;

import com.chatapp.model.User;
import com.chatapp.security.JwtUtil;
import com.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            System.out.println("Login attempt received: " + body);
            
            String username = body.get("username");
            if (username == null || username.trim().isEmpty()) {
                System.out.println("Login failed: Username required");
                return ResponseEntity.badRequest().body(Map.of("error", "Username required"));
            }
            
            String trimmedUsername = username.trim();
            
            // Verificar si el nombre de usuario ya está en uso
            // Solo rechazamos si el usuario está actualmente online
            if (userService.isUsernameTaken(trimmedUsername)) {
                System.out.println("Login failed: Username already taken - " + trimmedUsername);
                return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
            }
            
            // Generar sessionId único para esta sesión
            String sessionId = UUID.randomUUID().toString();
            
            // Crear usuario y obtener su ID
            User user = userService.addUser(trimmedUsername, sessionId);
            
            // Generar token JWT que incluye el sessionId
            String token = jwtUtil.generateTokenWithSession(trimmedUsername, sessionId);
            
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", trimmedUsername);
            response.put("sessionId", sessionId);
            response.put("userId", user.getId());
            
            System.out.println("Login successful for user: " + trimmedUsername + " (session: " + sessionId + ", userId: " + user.getId() + ")");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal server error"));
        }
    }
}
