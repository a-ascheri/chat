// [0] ChatApplication.java
// FUNCIÓN: Punto de entrada principal de la aplicación Spring Boot.
// Arranca toda la aplicación backend, incluyendo la configuración de WebSocket, Redis, controladores, etc.
// Es el archivo que ejecuta el servidor y deja todo listo para recibir conexiones y peticiones.

package com.chatapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatApplication {
    public static void main(String[] args) {
        // [0.1] Inicia la aplicación Spring Boot
        SpringApplication.run(ChatApplication.class, args);
    }
}
