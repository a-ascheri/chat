package com.chatapp.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        String env = System.getenv("SPRING_PROFILES_ACTIVE");
        if (env != null && env.equals("prod")) {
            // Configuración de producción
            registry.addEndpoint("/ws")
                .setAllowedOrigins("https://TU_DOMINIO_FRONTEND.vercel.app")
                .withSockJS();
        } else {
            // Configuración de desarrollo - permitir todos los orígenes
            registry.addEndpoint("/ws")
                // Permitir cualquier origen en desarrollo usando patrones
                .setAllowedOriginPatterns("*")
                // La siguiente línea permite también orígenes específicos para mayor compatibilidad
                .withSockJS();
                
            // Registrar un segundo endpoint sin SockJS para clientes que no lo soporten
            registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
                
            System.out.println("WebSocket configurado para aceptar conexiones desde cualquier origen");
        }
    }
}
