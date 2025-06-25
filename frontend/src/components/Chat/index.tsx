'use client';
import React, { useState } from 'react';
import Message from './Message';
import styles from './styles.module.scss';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import { useUser } from '../../context/UserContext';

const Chat: React.FC = () => {
  const { username } = useUser();
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChatWebSocket(username);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesBox}>
        {messages.map((msg, idx) => (
          <Message key={idx} {...msg} />
        ))}
      </div>
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
