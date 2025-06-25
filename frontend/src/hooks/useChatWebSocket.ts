import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useChannel } from '../context/ChannelContext';

export interface ChatMessage {
  user: string;
  content: string;
  timestamp: string;
  channel: string;
}

const WS_URL = 'http://localhost:8080/ws';
const API_URL = 'http://localhost:8080/api/messages';

export function useChatWebSocket(username: string) {
  const { channel } = useChannel();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesCache = useRef<{ [key: string]: ChatMessage[] }>({});
  const clientRef = useRef<Client | null>(null);

  // Al cambiar de canal, muestra mensajes cacheados o hace fetch si no están
  useEffect(() => {
    if (!channel) return;
    if (messagesCache.current[channel]) {
      setMessages(messagesCache.current[channel]);
    } else {
      fetch(`${API_URL}/${channel}`)
        .then(res => res.json())
        .then((data: ChatMessage[]) => {
          messagesCache.current[channel] = Array.isArray(data) ? data : [];
          setMessages(messagesCache.current[channel]);
        })
        .catch(() => setMessages([]));
    }
  }, [channel]);

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

  return { messages, sendMessage };
}
