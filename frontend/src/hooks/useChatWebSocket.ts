// Hook useChatWebSocket: Maneja la conexión WebSocket, fetch de historial y 
// envío/recepción de mensajes en tiempo real con JWT authentication
import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useChannel } from '../context/ChannelContext';

// Interfaz para los mensajes de chat
export interface ChatMessage {
  user: string;
  content: string;
  timestamp: string;
  channel: string;
}


// Hook principal
export function useChatWebSocket(username: string) {
  
  // Obtiene el canal actual desde el contexto global
  const { channel } = useChannel();
  
  // Estado local para los mensajes del canal actual
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Estado para URLs de API
  const [wsUrl, setWsUrl] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');
  
  // Referencias para mantener el cliente WebSocket y cache de mensajes por canal
  const clientRef = useRef<Client | null>(null);
  const messagesCache = useRef<{ [key: string]: ChatMessage[] }>({});

  // Configurar URLs al montar el componente
  useEffect(() => {
    const wsUrl = '/ws'; // Ruta relativa que será manejada por el proxy
    const apiUrl = '/api/messages'; // Ruta relativa que será manejada por el proxy
    
    setWsUrl(wsUrl);
    setApiUrl(apiUrl);
    
    console.log('Using relative URLs with Next.js proxy:', {
      wsUrl,
      apiUrl
    });
  }, []);

  // Función para obtener headers con JWT token
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('jwt');
    const sessionId = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Incluir sessionId y userId en headers para debugging
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    if (userId) {
      headers['X-User-ID'] = userId;
    }
    
    return headers;
  }, []);

  // useEffect: Al cambiar de canal, hace fetch del historial y lo combina con mensajes 
  // en tiempo real (sin duplicados)
  useEffect(() => {
    if (!channel || !apiUrl) return;
    
    console.log(`Fetching history for channel: ${channel} from ${apiUrl}/${channel}`);
    
    fetch(`${apiUrl}/${channel}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include' // Importante para CORS
    })
      .then(res => {
        console.log(`History fetch response status: ${res.status}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: ChatMessage[]) => {
        console.log(`Received ${data.length} messages from history`);
        
        // Mensajes en tiempo real que hayan llegado mientras se hacía fetch
        const liveMessages = messagesCache.current[channel] || [];
        
        // Combinar historial y mensajes en tiempo real, evitando duplicados por timestamp+user+content
        const allMessages = [...data, ...liveMessages].filter((msg, idx, arr) =>
          arr.findIndex(m => m.timestamp === msg.timestamp && m.user === msg.user && m.content === msg.content) === idx
        );
        messagesCache.current[channel] = allMessages;
        setMessages(allMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
        setMessages(messagesCache.current[channel] || []);
      });
  }, [channel, getAuthHeaders, apiUrl]);

  // Inicializa el cliente WebSocket con el token JWT
  const initializeStompClient = useCallback(() => {
    if (!wsUrl) return;
    
    try {
      console.log(`Initializing WebSocket connection to ${wsUrl}`);
      
      // Crear nuevo cliente solo si no existe
      if (clientRef.current) {
        console.log('Client already exists, disconnecting first');
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      
      // Obtener token JWT y sessionId
      const token = localStorage.getItem('jwt');
      const sessionId = localStorage.getItem('sessionId');
      
      if (!token) {
        console.error('No JWT token available, cannot connect to WebSocket');
        return;
      }
      
      // Crear conexión SockJS
      const socket = new SockJS(wsUrl);
      
      // Configurar cliente STOMP
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Session-ID': sessionId || ''
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });
      
      // Configurar handlers de conexión
      client.onConnect = (frame) => {
        console.log('WebSocket Connected:', frame);
        
        // Suscribirse al canal actual
        if (channel) {
          client.subscribe(`/topic/${channel}`, (message) => {
            try {
              const receivedMsg = JSON.parse(message.body) as ChatMessage;
              console.log(`Message received in channel ${channel}:`, receivedMsg);
              
              // Actualizar cache local
              const currentMessages = messagesCache.current[channel] || [];
              messagesCache.current[channel] = [...currentMessages, receivedMsg];
              
              // Actualizar estado de mensajes
              setMessages(prev => [...prev, receivedMsg]);
            } catch (e) {
              console.error('Error parsing message:', e);
            }
          });
          
          console.log(`Subscribed to channel: ${channel}`);
        }
      };
      
      // Manejar error de conexión
      client.onStompError = (frame) => {
        console.error('STOMP error:', frame.headers, frame.body);
      };
      
      // Manejar desconexión
      client.onWebSocketClose = () => {
        console.log('WebSocket connection closed');
      };
      
      // Activar conexión
      client.activate();
      
      // Guardar referencia
      clientRef.current = client;
      
      return () => {
        console.log('Cleaning up WebSocket connection');
        if (clientRef.current) {
          clientRef.current.deactivate();
          clientRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing WebSocket client:', error);
    }
  }, [wsUrl, channel]);

  // useEffect: Conexión y suscripción WebSocket con JWT authentication
  useEffect(() => {
    initializeStompClient();
  }, [initializeStompClient]);

  // Función para enviar mensajes por WebSocket con JWT authentication
  const sendMessage = useCallback(
    (content: string) => {
      if (clientRef.current && clientRef.current.connected && content.trim()) {
        const msg = {
          user: username,
          content,
          timestamp: new Date().toISOString(),
          channel,
        };
        
        const token = localStorage.getItem('jwt');
        const sessionId = localStorage.getItem('sessionId');
        const userId = localStorage.getItem('userId');
        const headers: Record<string, string> = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (sessionId) {
          headers['X-Session-ID'] = sessionId;
        }
        
        if (userId) {
          headers['X-User-ID'] = userId;
        }
        
        console.log('Sending message:', msg);
        
        clientRef.current.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(msg),
          headers,
        });
      } else {
        console.error('Cannot send message: WebSocket not connected or content is empty');
      }
    },
    [username, channel]
  );

  return { messages, sendMessage };
}