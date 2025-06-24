package com.chatapp.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
public class RedisListenerConfig {
    @Autowired
    private RedisMessageSubscriber redisMessageSubscriber;

    @Bean
    public MessageListenerAdapter listenerAdapter() {
        return new MessageListenerAdapter(redisMessageSubscriber, "onMessage");
    }
}
