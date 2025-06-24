'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChannelContextType {
  channel: string;
  setChannel: (ch: string) => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [channel, setChannel] = useState('General');
  return (
    <ChannelContext.Provider value={{ channel, setChannel }}>
      {children}
    </ChannelContext.Provider>
  );
};

export function useChannel() {
  const context = useContext(ChannelContext);
  if (!context) throw new Error('useChannel must be used within a ChannelProvider');
  return context;
}
