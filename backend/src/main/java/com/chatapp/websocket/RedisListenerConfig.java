// [7] RedisListenerConfig.java
// FUNCIÓN: Configura el adaptador que conecta Redis con la app Spring Boot para escuchar mensajes en tiempo real.
// Permite que Redis invoque el método onMessage de RedisMessageSubscriber cuando llega un mensaje al canal.
// Esencial para que el backend reciba eventos de Redis y reenvíe mensajes a los clientes WebSocket.

package com.chatapp.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
public class RedisListenerConfig {
    @Autowired
    private RedisMessageSubscriber redisMessageSubscriber;

    // [7.1] Define el bean que adapta los mensajes de Redis a métodos Java
    // Cuando llega un mensaje a Redis, llama a redisMessageSubscriber.onMessage(...)
    @Bean
    public MessageListenerAdapter listenerAdapter() {
        return new MessageListenerAdapter(redisMessageSubscriber, "onMessage");
    }
}
