package com.chatapp.websocket;

import com.chatapp.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ChannelTopic topic;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {
        // Publicar mensaje en Redis para distribuirlo (incluye canal)
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    // Método para recibir mensajes de Redis y reenviarlos a los clientes WebSocket
    public void broadcastMessage(ChatMessage message) {
        messagingTemplate.convertAndSend("/topic/messages", message);
    }
}
