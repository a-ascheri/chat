// [8] COMPONENTE Message: Renderiza un mensaje individual en el chat.
// Recibe las props de un mensaje (usuario, contenido, timestamp, canal) y las muestra con estilos.
// Es usado dentro del componente Chat para mostrar cada mensaje del array de mensajes.

import React from 'react';
import styles from './styles.module.scss';

// [8.1] Interfaz de las props que recibe el componente Message
interface MessageProps {
  user: string;      // usuario que envió el mensaje
  content: string;   // contenido del mensaje
  timestamp: string; // hora del mensaje
  channel: string;   // canal al que pertenece el mensaje
}

// [8.2] Componente funcional que renderiza el mensaje
const Message: React.FC<MessageProps> = ({ user, content, timestamp }) => (
  <div className={styles.message}>
    <span className={styles.user}>{user}:</span>
    <span className={styles.content}>{content}</span>
    <span className={styles.timestamp}>{timestamp}</span>
  </div>
);

export default Message;

// [8.3] RESUMEN DE FLUJO:
// - Recibe las props de un mensaje y las muestra con estilos.
// - Es usado dentro del componente Chat para renderizar cada mensaje del historial o en tiempo real.
// - Permite separar la lógica de renderizado de mensajes del resto del chat.

// [8.4] Explicación del código:
// - El componente Message recibe props que representan un mensaje de chat.
// - Renderiza el mensaje con el nombre del usuario, el contenido y la hora.
// - Utiliza estilos definidos en styles.module.scss para darle formato.
// - Es un componente reutilizable que puede ser usado en diferentes partes del chat.
// - Permite que el componente Chat se enfoque en la lógica de envío y recepción de mensajes,
//   mientras que Message se encarga de la presentación visual de cada mensaje.

// En resumen el componente Message es responsable de mostrar un mensaje individual en el chat.
// Recibe las props de un mensaje (usuario, contenido, timestamp, canal) y las muestra con estilos.
// Es usado dentro del componente Chat para renderizar cada mensaje del historial o en tiempo 
// real.
// Permite separar la lógica de renderizado de mensajes del resto del chat, haciendo el código 
// más modular y reutilizable.
// Esto facilita el mantenimiento y la comprensión del código, ya que cada componente tiene una 
// responsabilidad clara y específica.
// Este componente es esencial para la visualización de mensajes en el chat, permitiendo que el 
// usuario vea quién envió cada mensaje, qué dijo y cuándo lo hizo.
// Además, al estar estilizado con CSS, mejora la experiencia visual del usuario al interactuar con el chat.
