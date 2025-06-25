'use client';

import { useUser } from '../src/context/UserContext';
import Login from '../src/components/Login';
import Chat from '../src/components/Chat';
import ChannelList from '../src/components/ChannelList';
import styles from "./page.module.css";

const HomePage: React.FC = () => {
  const { username } = useUser();
  const isLoggedIn = !!username;
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
