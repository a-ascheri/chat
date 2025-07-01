// [4] ChatMessage.java
// Modelo de datos para los mensajes de chat.
// Usado por todos los controladores y servicios para representar un mensaje.
// Es la estructura que viaja entre frontend, backend y Redis.

package com.chatapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ChatMessage {
    private String user;
    private String content;
    private String timestamp;
    private String channel;
}
