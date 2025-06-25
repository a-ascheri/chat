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
        List<Object> rawList = redisTemplate.opsForList().range(redisKey, 0, MAX_HISTORY);
        List<ChatMessage> result = new ArrayList<>();
        if (rawList != null) {
            for (Object obj : rawList) {
                if (obj instanceof ChatMessage) {
                    result.add((ChatMessage) obj);
                } else {
                    // Puede venir como LinkedHashMap, convertir a ChatMessage
                    result.add(objectMapper.convertValue(obj, ChatMessage.class));
                }
            }
        }
        return result;
    }
}
