import React from 'react';
import '../globals.scss';
import { UserProvider } from '../context/UserContext';
import { ChannelProvider } from '../context/ChannelContext';

export const metadata = {
  title: 'Chat App',
  description: 'Chat en tiempo real con Next.js, WebSocket y Redis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <UserProvider>
          <ChannelProvider>
            {children}
          </ChannelProvider>
        </UserProvider>
      </body>
    </html>
  );
}
