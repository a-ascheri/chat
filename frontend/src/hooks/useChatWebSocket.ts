// [7] HOOK useChatWebSocket: Maneja la conexión WebSocket, fetch de historial y 
// envío/recepción de mensajes en tiempo real. Se usa dentro del componente Chat.
import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useChannel } from '../context/ChannelContext';

// [7.1] Interfaz para los mensajes de chat
export interface ChatMessage {
  user: string;
  content: string;
  timestamp: string;
  channel: string;
}

// [7.2] Constantes de URL para WebSocket y API REST
const WS_URL = 'https://192.168.0.156:8080/ws';
const API_URL = 'https://192.168.0.156:8080/api/messages';

// [7.3] Hook principal
export function useChatWebSocket(username: string) {
  
  // [7.4] Obtiene el canal actual desde el contexto global
  const { channel } = useChannel();
  
  // [7.5] Estado local para los mensajes del canal actual
  // Sintaxis: const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // [7.6] Ref para cachear mensajes por canal (no dispara renders)
  const messagesCache = useRef<{ [key: string]: ChatMessage[] }>({});
  
  // [7.7] Ref para el cliente WebSocket
  const clientRef = useRef<Client | null>(null);

  // [7.8] useEffect: Al cambiar de canal, hace fetch del historial y lo combina con mensajes 
  // en tiempo real (sin duplicados)
  // Este efecto se ejecuta cada vez que cambia el canal (loop reactivo)
  useEffect(() => {
    if (!channel) return;
    fetch(`${API_URL}/${channel}`)
      .then(res => res.json())
      .then((data: ChatMessage[]) => {
        
        // Mensajes en tiempo real que hayan llegado mientras se hacía fetch
        const liveMessages = messagesCache.current[channel] || [];
        
        // Combinar historial y mensajes en tiempo real, evitando duplicados por timestamp+user+content
        const allMessages = [...data, ...liveMessages].filter((msg, idx, arr) =>
          arr.findIndex(m => m.timestamp === msg.timestamp && m.user === msg.user && m.content === msg.content) === idx
        );
        messagesCache.current[channel] = allMessages;
        setMessages(allMessages);
      })
      .catch(() => setMessages(messagesCache.current[channel] || []));
  }, [channel]);

  // [7.9] useEffect: Conexión y suscripción WebSocket. Se ejecuta al montar el hook o cambiar 
  // de canal.
  // Queda "escuchando" mensajes nuevos en tiempo real (loop)
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      client.subscribe('/topic/messages', (msg: IMessage) => {
        const message: ChatMessage = JSON.parse(msg.body);
        if (message.channel === channel) {
          setMessages(prev => {
            const updated = [...prev, message];
            messagesCache.current[channel] = updated;
            return updated;
          });
        } else {
          
          // Si el mensaje es de otro canal, agrégalo al cache de ese canal
          messagesCache.current[message.channel] = [
            ...(messagesCache.current[message.channel] || []),
            message,
          ];
        }
      });
    };
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, [channel]);

  // [7.10] Función para enviar mensajes por WebSocket
  // Sintaxis: const sendMessage = useCallback(...)
  const sendMessage = useCallback(
    (content: string) => {
      if (clientRef.current && clientRef.current.connected) {
        const msg: ChatMessage = {
          user: username,
          content,
          timestamp: new Date().toLocaleTimeString(),
          channel,
        };
        clientRef.current.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(msg),
        });
      }
    },
    [username, channel]
  );

  // [7.11] Devuelve el array de mensajes y la función para enviar mensajes
  return { messages, sendMessage };
}

// [7.12] RESUMEN DE FLUJO:
// - Conecta al WebSocket y escucha mensajes en tiempo real.
// - Al cambiar de canal, fetch del historial y combina con mensajes en tiempo real.
// - Envía mensajes usando WebSocket y actualiza el estado local.
// - Usa un cache para evitar duplicados y mejorar eficiencia.
// - Devuelve mensajes y función sendMessage para usar en el componente Chat.
// - Permite que el chat sea reactivo y en tiempo real, actualizando la UI automáticamente al 
// recibir nuevos mensajes.
// - Es usado dentro del componente Chat para mostrar mensajes y enviar nuevos.

// En resumen este componente useChatWebSocket maneja:
// - La conexión WebSocket y la suscripción a mensajes en tiempo real.
// - El fetch del historial de mensajes al cambiar de canal.
// - La lógica para enviar mensajes y actualizar el estado local de mensajes.
// - Utiliza un cache para evitar duplicados y mejorar la eficiencia.
// - Es usado dentro del componente Chat para mostrar mensajes y enviar nuevos.
// - Permite que el chat sea reactivo y en tiempo real, actualizando la UI automáticamente 
// al recibir nuevos mensajes.

// ================================
// Configuración para salida a LAN:
// ================================
//    Tu servidor Next.js y Spring Boot están corriendo dentro de WSL, pero WSL2 NO expone los puertos automáticamente a la red local.
//    Por eso, desde el teléfono o desde Windows, no puedes acceder a los puertos de WSL usando la IP 192.168.0.156.
// 1. Asegúrate de que tu servidor esté escuchando en todas las interfaces
//    de red, no solo en localhost. Esto se puede hacer configurando el servidor para
//    escuchar en `0.0.0.0`. configura tu servidor para que escuche en todas las interfaces:
//    - Para Next.js, puedes iniciar el servidor con `npx next dev --hostname 0.0.0.0`
//    - Para Express, puedes usar `app.listen(3000, '0.0.0.0')`
// 2. Configura el WebSocket para que use la dirección IP de tu máquina en la red local.
//    - Cambia la URL del WebSocket a `ws://<tu-ip-local>:8080/ws`
//    - const WS_URL = 'http://192.168.0.156:8080/ws';
//    - const API_URL = 'http://192.168.0.156:8080/api/messages';
//    - Asegúrate de que el servidor WebSocket esté configurado para aceptar conexiones desde esa IP.
// 3. Si estás detrás de un firewall o router, asegúrate de que los puertos necesarios estén abiertos.
//    - Por ejemplo, si tu WebSocket está en el puerto 8080, asegúrate de que ese puerto esté abierto 
//      en el firewall y redirigido correctamente si es necesario.
// 4. Exponer puertos de WSL a la red local:
//    - Si estás utilizando WSL, es posible que también necesites exponer los puertos de tu servidor
//    en la configuración de WSL.
//    Puedes hacer esto ejecutando comandos como:
//    - Powershell:
//    netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.23.234.53
//    netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=172.23.234.53
//    - Para eliminarlos:
//    netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0
//    netsh interface portproxy delete v4tov4 listenport=8080 listenaddress=0.0.0.0
//    Cofigurar el archivo `application.yml` de Spring Boot para que escuche en todas las interfaces:
//    ```yaml
//    server:
//      port: 8080
//      address: 0.0.0.0 # Permite el acceso desde cualquier dirección IP
//    ```
// 5. Verifica la IP de tu máquina en la red local:
//    - Puedes usar el comando `ip addr` en WSL para ver la IP asignada a tu interfaz de red.
//    - Busca la línea que dice `inet` y muestra la IP de la interfaz que estás usando (por ejemplo, `eth0`).
//    - Asegúrate de que la IP sea accesible desde otros dispositivos en la red local.
//    - Si estás usando WSL2, la IP de tu máquina puede cambiar cada vez que inicias WSL.
//    - Puedes usar el comando `ip addr` para ver la IP actual de tu máquina (en WSL).
//    - Busca la línea que dice `inet` y muestra la IP de la interfaz que estás usando (por ejemplo, `eth0`).
//    - Asegúrate de que la IP sea accesible desde otros dispositivos en la red local.
// 6. Prueba la conexión desde otro dispositivo:
//    - Desde otro dispositivo en la misma red local (como tu teléfono), intenta acceder a
//      la URL del WebSocket y la API REST usando la IP de tu máquina.
//    - Por ejemplo, si tu IP es `192.168.0.156`, las URLs serían:
//      - WebSocket: `ws://192.168.0.156:8080/ws`
//      - API REST: `http://192.168.0.156:8080/api/messages`
// 7. Verifica que el firewall de tu máquina no esté bloqueando las conexiones entrantes
//    - Asegúrate de que el firewall de tu máquina permita conexiones entrantes en los puertos
//      que estás utilizando (por ejemplo, 8080 para WebSocket y API REST).
//    - Puedes probar desactivando temporalmente el firewall para ver si eso soluciona el problema.
// 8. Si estás usando un proxy o VPN, asegúrate de que no esté bloqueando las conexiones
//    - Algunos proxies o VPN pueden bloquear conexiones WebSocket o redirigir el tráfico de manera que no funcione correctamente.
//    - Intenta desactivar cualquier proxy o VPN y prueba nuevamente.
// 9. Verifica la configuración de tu router:
//    - Asegúrate de que tu router no esté bloqueando las conexiones entrantes
//      a los puertos que estás utilizando.
//    - Algunos routers tienen configuraciones de seguridad que pueden bloquear ciertos tipos de tráfico.
//    - Por ejemplo, pueden bloquear conexiones WebSocket o limitar el tráfico en puertos específicos.