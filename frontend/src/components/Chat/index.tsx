// [6] COMPONENTE Chat: Muestra el chat y permite enviar mensajes. Se monta cuando el usuario está logueado y 
// ha seleccionado un canal.
'use client';
import React, { useState } from 'react';
import Message from './Message';
import styles from './styles.module.scss';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import { useUser } from '../../context/UserContext';

// [6.1] Componente principal del chat
const Chat: React.FC = () => {
  
  // [6.2] Hook de contexto de usuario: obtiene el nombre de usuario global
  // Sintaxis: const { username } = useUser();
  const { username } = useUser();

  // [6.3] Estado local para el input del mensaje
  // Sintaxis: const [input, setInput] = useState('');
  const [input, setInput] = useState('');

  // [6.4] Hook personalizado para WebSocket y mensajes
  // Sintaxis: const { messages, sendMessage } = useChatWebSocket(username);
  // - messages: array de mensajes del canal actual
  // - sendMessage: función para enviar un mensaje
  // Este hook queda "escuchando" mensajes nuevos en tiempo real (loop)
  const { messages, sendMessage } = useChatWebSocket(username);

  // [6.5] Maneja el envío del formulario de mensaje
  // Previene el submit por defecto, envía el mensaje si no está vacío y limpia el input
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  // [6.6] Renderiza la UI del chat: lista de mensajes y formulario de envío
  return (
    <div className={styles.chatContainer}>
      
      {/* [6.7] Renderiza la lista de mensajes usando el componente Message */}
      {/* messages es un array de objetos con las propiedades user, content, timestamp y channel */}
      {/* Cada mensaje se renderiza con su propio componente Message */}
      <div className={styles.messagesBox}>
        {messages.map((msg, idx) => (
          <Message key={idx} {...msg} />
        ))}
      </div>
      
      {/* [6.8] Formulario para escribir y enviar mensajes */}
      {/* El formulario tiene un input para el mensaje y un botón de enviar */}
      {/* Al enviar, se llama a handleSend que envía el mensaje y limpia el input */}
      <form onSubmit={handleSend} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;

// [6.9] RESUMEN DE FLUJO:
// - Muestra el chat del canal actual.
// - Permite enviar mensajes en tiempo real.
// - Usa WebSocket para recibir mensajes nuevos automáticamente.
// - Cada mensaje se renderiza con su propio componente Message.
// - Usa el contexto de usuario para saber quién envía los mensajes.
// - El input se limpia después de enviar un mensaje.
// - Esencial para la interacción en el canal seleccionado.
// - Debe estar montado solo si el usuario está logueado y ha seleccionado un canal.
// - El componente Chat es el corazón de la experiencia de chat, permitiendo a los usuarios
//   comunicarse en tiempo real dentro del canal seleccionado.

// En resumen este componente Chat es responsable de mostrar el chat en tiempo real,
// permitiendo a los usuarios enviar mensajes y ver los mensajes de otros usuarios en el canal seleccionado
// Utiliza el contexto de usuario para obtener el nombre del usuario actual y el hook useChatWebSocket para manejar la conexión WebSocket y los mensajes en tiempo real
// El componente renderiza una lista de mensajes utilizando el componente Message, que muestra el usuario, contenido y timestamp de cada mensaje
// También incluye un formulario para enviar nuevos mensajes, que actualiza el estado local del input y llama a la función sendMessage del hook useChatWebSocket al enviar el formulario
// El componente utiliza estilos CSS para organizar la interfaz de usuario y hacerla responsiva
// El flujo de datos es el siguiente:
// 1. El usuario escribe un mensaje en el input.
// 2. Al enviar el formulario, se llama a handleSend.
// 3. Si el input no está vacío, se envía el mensaje a través del hook useChatWebSocket.
// 4. El hook maneja la conexión WebSocket y actualiza la lista de mensajes en tiempo real.
// 5. Los mensajes se renderizan en la UI, mostrando el usuario, contenido y timestamp de cada mensaje.
// 6. El input se limpia para permitir escribir un nuevo mensaje.

