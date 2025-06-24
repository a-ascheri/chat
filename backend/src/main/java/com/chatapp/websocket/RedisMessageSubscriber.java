package com.chatapp.websocket;

import com.chatapp.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class RedisMessageSubscriber implements MessageListener {
    @Autowired
    private ChatWebSocketController chatWebSocketController;

    private final GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer();

    @Override
    public void onMessage(@NonNull Message message, @Nullable byte[] pattern) {
        ChatMessage chatMessage = (ChatMessage) serializer.deserialize(message.getBody());
        if (chatMessage != null && chatMessage.getChannel() != null) {
            chatWebSocketController.broadcastMessage(chatMessage);
        }
    }
}
