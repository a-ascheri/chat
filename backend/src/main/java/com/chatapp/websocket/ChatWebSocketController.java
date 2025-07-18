package com.chatapp.websocket;

import com.chatapp.model.ChatMessage;
import com.chatapp.model.User;
import com.chatapp.security.JwtUtil;
import com.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class ChatWebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private ChannelTopic topic;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userService;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message, @Header(value = "Authorization", required = false) String authHeader) {
        try {
            // Validar token JWT
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.err.println("Invalid or missing Authorization header");
                return; // Ignorar mensaje sin token válido
            }
            
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                System.err.println("Invalid JWT token");
                return; // Ignorar mensaje con token inválido
            }
            
            String username = jwtUtil.extractUsername(token);
            
            // Extraer el sessionId del token JWT
            String sessionId = extractSessionId(token);
            
            // Si no se pudo extraer, generar uno (compatible con clientes antiguos)
            if (sessionId == null) {
                sessionId = generateSessionId(authHeader);
            }
            
            User user = userService.addUser(username, sessionId);
            
            // Actualizar actividad del usuario
            userService.updateLastActive(sessionId);
            
            System.out.println("Message from authenticated user: " + username + " (session: " + sessionId + ")");
            
            // Usar el username del usuario autenticado para asegurar integridad
            message.setUser(user.getUsername());
            message.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            // Guardar en Redis
            String redisKey = "chat:messages:" + message.getChannel();
            redisTemplate.opsForList().rightPush(redisKey, message);
            redisTemplate.opsForList().trim(redisKey, -100, -1);
            
            // Publicar en Redis para broadcast
            redisTemplate.convertAndSend(topic.getTopic(), message);
            
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
        }
    }
    
    // Genera un ID de sesión único basado en el token JWT y timestamp
    private String generateSessionId(String authHeader) {
        return String.valueOf((authHeader + System.currentTimeMillis()).hashCode());
    }
    
    // Extrae el sessionId del token JWT
    private String extractSessionId(String token) {
        try {
            // Utilizamos el JwtUtil para extraer el claim "sessionId"
            io.jsonwebtoken.Claims claims = jwtUtil.getClaims(token);
            return claims.get("sessionId", String.class);
        } catch (Exception e) {
            System.err.println("Error extracting sessionId from token: " + e.getMessage());
            return null;
        }
    }

    /**
     * Método para transmitir mensajes a todos los usuarios suscritos al canal
     * Este método es llamado por RedisMessageSubscriber cuando llega un nuevo mensaje
     */
    public void broadcastMessage(ChatMessage message) {
        try {
            // Enviar mensaje a todos los clientes suscritos al canal específico
            String destination = "/topic/" + message.getChannel();
            System.out.println("Broadcasting message to " + destination + " - From: " + message.getUser());
            messagingTemplate.convertAndSend(destination, message);
        } catch (Exception e) {
            System.err.println("Error broadcasting message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
