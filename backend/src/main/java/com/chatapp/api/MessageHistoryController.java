// [1] MessageHistoryController.java
// QUIÉN LO LLAMA: El frontend (React/Next.js) cuando un usuario entra a un canal o cambia de canal.
// CUÁNDO: Cada vez que el usuario necesita ver el historial de mensajes de un canal.
// LLAMADO POR: fetch(`${API_URL}/${channel}`) en useChatWebSocket.ts

package com.chatapp.api;

import com.chatapp.model.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://localhost:3000", 
    "http://172.23.234.53:3000",
    "http://172.23.234.53:5173",
    "https://TU_DOMINIO_FRONTEND.vercel.app"
}, allowedHeaders = "*", allowCredentials = "true")
public class MessageHistoryController {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private static final int MAX_HISTORY = 100;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    public MessageHistoryController(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @GetMapping("/{channel}")
    public List<ChatMessage> getChannelMessages(@PathVariable String channel) {
        
        String redisKey = "chat:messages:" + channel;
        List<Object> rawList = redisTemplate.opsForList().range(redisKey, -MAX_HISTORY, -1);
        List<ChatMessage> result = new ArrayList<>();
        if (rawList != null) {
            for (Object obj : rawList) {
                if (obj instanceof ChatMessage) {
                    result.add((ChatMessage) obj);
                } else {
                    result.add(objectMapper.convertValue(obj, ChatMessage.class));
                }
            }
        }
        return result;
    }
}
