// [2] ChatWebSocketController.java
// QUIÉN LO LLAMA: El frontend (React/Next.js) cuando un usuario envía un mensaje por WebSocket.
// CUÁNDO: Cada vez que un usuario envía un mensaje en el chat.
// LLAMADO POR: clientRef.current.publish({ destination: '/app/chat.send', ... }) en useChatWebSocket.ts

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

        String redisKey = "chat:messages:" + message.getChannel();
        redisTemplate.opsForList().rightPush(redisKey, message);
        redisTemplate.opsForList().trim(redisKey, -100, -1);
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }

    // QUIÉN LO LLAMA: RedisMessageSubscriber (cuando llega un mensaje nuevo a Redis)
    // CUÁNDO: Cada vez que se publica un mensaje en Redis
    public void broadcastMessage(ChatMessage message) {
        // Envía el mensaje a todos los clientes WebSocket suscritos a /topic/messages
        messagingTemplate.convertAndSend("/topic/messages", message);
    }
}
