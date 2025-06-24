import React from 'react';
import { useUser } from '../context/UserContext';
import Login from '../components/Login';
import Chat from '../components/Chat';
import ChannelList from '../components/ChannelList';

const HomePage: React.FC = () => {
  const { username } = useUser();
  const isLoggedIn = !!username;

  return (
    <main>
      {isLoggedIn ? (
        <>
          <ChannelList />
          <Chat />
        </>
      ) : (
        <Login />
      )}
    </main>
  );
};

export default HomePage;
