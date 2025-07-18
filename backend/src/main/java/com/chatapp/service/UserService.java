package com.chatapp.service;

import com.chatapp.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Collection;
import java.util.UUID;

@Service
public class UserService {
    private final Map<String, User> activeUsers = new ConcurrentHashMap<>();
    private final Map<String, String> sessionToUserId = new ConcurrentHashMap<>();
    
    // Tiempo de inactividad en minutos para considerar que un usuario ya no está conectado
    private static final long INACTIVITY_TIMEOUT_MINUTES = 2;

    public User addUser(String username, String sessionId) {
        // Verificar si esta sesión ya existe
        String existingUserId = sessionToUserId.get(sessionId);
        if (existingUserId != null) {
            User existingUser = activeUsers.get(existingUserId);
            if (existingUser != null) {
                existingUser.setLastActive(LocalDateTime.now());
                existingUser.setOnline(true);
                System.out.println("Usuario reconectado con sesión existente: " + existingUser.getUsername() + " (session: " + sessionId + ")");
                return existingUser;
            }
        }

        // Crear nuevo usuario
        String userId = UUID.randomUUID().toString();
        User user = new User(userId, username, sessionId);
        activeUsers.put(userId, user);
        sessionToUserId.put(sessionId, userId);
        
        System.out.println("Nuevo usuario creado: " + username + " (session: " + sessionId + ", userId: " + userId + ")");
        return user;
    }

    public User getUserBySessionId(String sessionId) {
        String userId = sessionToUserId.get(sessionId);
        return userId != null ? activeUsers.get(userId) : null;
    }

    public User getUserById(String userId) {
        return activeUsers.get(userId);
    }

    public void removeUser(String sessionId) {
        String userId = sessionToUserId.remove(sessionId);
        if (userId != null) {
            User user = activeUsers.remove(userId);
            if (user != null) {
                System.out.println("Usuario eliminado completamente: " + user.getUsername() + " (session: " + sessionId + ")");
            }
        }
    }

    public Collection<User> getActiveUsers() {
        // Limpiar usuarios inactivos antes de devolver la lista
        cleanInactiveUsers();
        return activeUsers.values();
    }

    public boolean isUsernameTaken(String username) {
        // Limpiar usuarios inactivos antes de verificar
        cleanInactiveUsers();
        
        return activeUsers.values().stream()
                .anyMatch(user -> user.getUsername().equals(username) && user.isOnline());
    }

    public void updateLastActive(String sessionId) {
        User user = getUserBySessionId(sessionId);
        if (user != null) {
            user.setLastActive(LocalDateTime.now());
        }
    }
    
    // Método para limpiar usuarios inactivos
    private void cleanInactiveUsers() {
        LocalDateTime now = LocalDateTime.now();
        
        // Encontrar usuarios inactivos
        activeUsers.values().forEach(user -> {
            if (user.isOnline() && 
                ChronoUnit.MINUTES.between(user.getLastActive(), now) > INACTIVITY_TIMEOUT_MINUTES) {
                
                user.setOnline(false);
                System.out.println("Usuario marcado como inactivo: " + user.getUsername() + 
                                  " (inactivo por " + ChronoUnit.MINUTES.between(user.getLastActive(), now) + 
                                  " minutos)");
            }
        });
    }
}
