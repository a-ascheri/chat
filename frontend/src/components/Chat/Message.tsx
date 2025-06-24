import React from 'react';
import styles from './styles.module.scss';

interface MessageProps {
  user: string;
  content: string;
  timestamp: string;
  channel: string;
}

const Message: React.FC<MessageProps> = ({ user, content, timestamp }) => (
  <div className={styles.message}>
    <span className={styles.user}>{user}:</span>
    <span className={styles.content}>{content}</span>
    <span className={styles.timestamp}>{timestamp}</span>
  </div>
);

export default Message;
