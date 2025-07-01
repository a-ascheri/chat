// [1] PUNTO DE ENTRADA: app/page.tsx
// Este archivo es el primer archivo que se ejecuta en el frontend de la app (Next.js App Router)
// Renderiza la página principal del chat y orquesta el flujo de autenticación, canales y chat.
// Está vinculado con los contextos globales y los componentes principales.

'use client';

import { useUser } from '../src/context/UserContext';
import Login from '../src/components/Login';
import Chat from '../src/components/Chat';
import ChannelList from '../src/components/ChannelList';
import styles from "./page.module.css";

const HomePage: React.FC = () => { 
  
  // [1.2] Obtiene el nombre de usuario del contexto global
  // Sintaxis: const { username } = useUser();
  const { username } = useUser();
  
  // [1.3] Determina si el usuario está logueado
  const isLoggedIn = !!username;
  
  // Renderiza la página principal del chat
  return (
    <div className={styles.page}>
      <div className={styles.layoutRow}>
        {isLoggedIn ? (
          <>
            <div className={styles.channelCol}><ChannelList /></div>
            <div className={styles.chatCol}><Chat /></div>
          </>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
};

export default HomePage;

// [1.4] RESUMEN DE FLUJO:
// - Este archivo es el punto de entrada visual de la app.
// - Usa el contexto de usuario para saber si mostrar el login o el chat.
// - Si el usuario está logueado, renderiza ChannelList y Chat (que a su vez usan otros contextos y hooks).
// - Si no, renderiza Login para que el usuario se autentique.
// - El layout usa dos columnas: canales y chat.
// - Todo el flujo de la app parte de aquí y se ramifica a los contextos y componentes hijos.

// Define el componente HomePage como un componente funcional de React 
// (propiedades (props) como entrada y devuelve elementos de React (JSX) que describen la interfaz de usuario.)
// Utiliza el hook useUser para obtener el nombre de usuario del contexto
// Este hook esta definido en el contexto de usuario
// el componente HomePage debe estar envuelto en el proveedor de contexto de usuario
// Esto permite que el componente acceda al estado del usuario y a las funciones para actualizarlo
// El hook useUser debe devolver un objeto con la propiedad username y una función setUsername
// que se utiliza para actualizar el nombre de usuario en el contexto
// Si el usuario está autenticado, se mostrará la lista de canales y el chat
// Si el usuario no está autenticado, se mostrará el formulario de inicio de sesión
// El componente se renderiza dentro de un div (tipo scaffold)
// Dentro de este div, se renderizan dos columnas: una para la lista de canales y otra para el chat
// Si el usuario está autenticado,
// se renderizan los componentes ChannelList y Chat dentro de sus respectivas columnas
// Si el usuario no está autenticado, se renderiza el componente Login
// que permite al usuario ingresar su nombre de usuario para autenticarse
// El componente utiliza un diseño de fila para organizar los componentes en columnas
// y se asegura de que la interfaz sea responsiva y fácil de usar

// =====================
// DIAGRAMA DEL FLUJO COMPLETO FRONTEND + BACKEND
// =====================
/*
┌─────────────────────────────┐
│        FRONTEND (React)     │
└─────────────┬───────────────┘
              │
              │
              ▼
[1] page.tsx (punto de entrada)
   │
   ├─► [2] UserContext.tsx (estado global usuario)
   │
   ├─► [3] ChannelContext.tsx (estado global canal)
   │
   ├─► [4] Login/index.tsx (login, setea usuario)
   │
   ├─► [5] ChannelList/index.tsx (elige canal)
   │
   └─► [6] Chat/index.tsx
           │
           └─► [7] useChatWebSocket.ts
                   │
                   ├─► (al entrar/cambiar canal) fetch /api/messages/{channel}
                   │         │
                   │         ▼
                   │   ┌─────────────────────────────┐
                   │   │   BACKEND: MessageHistory   │
                   │   │   Controller.java [1]       │
                   │   └─────────────────────────────┘
                   │
                   └─► (al enviar mensaje) WebSocket /app/chat.send
                             │
                             ▼
                   ┌─────────────────────────────┐
                   │ BACKEND: ChatWebSocket      │
                   │ Controller.java [2]         │
                   └─────────────┬───────────────┘
                                 │
                                 ▼
                   Guarda mensaje en Redis y publica en canal Redis
                                 │
                                 ▼
                   ┌─────────────────────────────┐
                   │ BACKEND: RedisMessageSubscr.│
                   │ .java [3]                   │
                   └─────────────┬───────────────┘
                                 │
                                 ▼
                   Llama a broadcastMessage() en ChatWebSocketController
                                 │
                                 ▼
                   Envía mensaje a todos los clientes WebSocket suscritos
                                 │
                                 ▼
                   [6] Chat/index.tsx recibe mensaje en tiempo real
*/

// =====================
// RESUMEN DE PUNTOS CLAVE DE CADA BLOQUE
// =====================
/*
[1] page.tsx: Punto de entrada visual. Decide si mostrar login o chat según el usuario.
[2] UserContext.tsx: Contexto global para el usuario (login, setUsername, username).
[3] ChannelContext.tsx: Contexto global para el canal seleccionado.
[4] Login/index.tsx: Formulario de login. Actualiza el usuario global.
[5] ChannelList/index.tsx: Lista de canales. Permite cambiar el canal global.
[6] Chat/index.tsx: Muestra mensajes y permite enviar. Usa useChatWebSocket.
[7] useChatWebSocket.ts: Maneja WebSocket, fetch de historial, cache y envío/recepción de mensajes.
[BACKEND 1] MessageHistoryController.java: Devuelve historial de mensajes de un canal (REST).
[BACKEND 2] ChatWebSocketController.java: Recibe mensajes por WebSocket, los guarda y publica en Redis.
[BACKEND 3] RedisMessageSubscriber.java: Escucha mensajes en Redis y los reenvía a los clientes WebSocket.
*/
// =====================

