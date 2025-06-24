import React from 'react';
import { useChannel } from '../../context/ChannelContext';
import styles from './styles.module.scss';

const channels = ['General', 'Tech', 'Random'];

const ChannelList: React.FC = () => {
  const { channel, setChannel } = useChannel();
  return (
    <div className={styles.channelListContainer}>
      <h2>Canales</h2>
      <ul>
        {channels.map((ch, idx) => (
          <li
            key={idx}
            className={ch === channel ? styles.active : ''}
            onClick={() => setChannel(ch)}
            style={{ cursor: 'pointer' }}
          >
            {ch}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
