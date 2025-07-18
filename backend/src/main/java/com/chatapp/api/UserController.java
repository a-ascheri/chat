package com.chatapp.api;

import com.chatapp.model.User;
import com.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://localhost:3000", 
    "http://172.23.234.53:3000",
    "http://172.23.234.53:5173",
    "https://TU_DOMINIO_FRONTEND.vercel.app"
}, allowedHeaders = "*", allowCredentials = "true")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/active")
    public ResponseEntity<Collection<User>> getActiveUsers() {
        try {
            Collection<User> activeUsers = userService.getActiveUsers();
            return ResponseEntity.ok(activeUsers);
        } catch (Exception e) {
            System.err.println("Error getting active users: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("available", false));
            }
            
            boolean available = !userService.isUsernameTaken(username.trim());
            return ResponseEntity.ok(Map.of("available", available));
            
        } catch (Exception e) {
            System.err.println("Error checking username: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("available", false));
        }
    }
}
