import { createContext, useContext, useState } from 'react';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

const EXPO_PUBLIC_SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL!;

type SocketContextType = {
  socket: Socket;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
  subscribeToEvent: <T = any>(
    eventName: string,
    callback: (data: T) => void,
  ) => void;
  unsubscribeFromEvent: (eventName: string) => void;
  emitEvent: (
    eventName: string,
    data: {
      token: string;
      data?: any;
    },
  ) => void;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType,
);

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socket, _] = useState<Socket>(
    io(EXPO_PUBLIC_SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
    }),
  );

  // Function to connect the socket manually, accepting query parameters
  const connectSocket = (token: string): void => {
    socket.io.opts.query = {
      token,
    };
    socket.connect();
    setIsConnected(true);
  };

  // Function to disconnect the socket
  const disconnectSocket = (): void => {
    if (socket.connected) {
      socket.disconnect();
      setIsConnected(false);
    }
  };

  // Function to subscribe to an event
  const subscribeToEvent = <T = any,>(
    eventName: string,
    callback: (data: T) => void,
  ): void => {
    if (!socket) return;

    socket.on(eventName, callback);
  };

  // Function to unsubscribe from an event
  const unsubscribeFromEvent = (eventName: string): void => {
    if (!socket) return;

    socket.off(eventName);
  };

  // Function to emit an event
  const emitEvent = (
    eventName: string,
    data: {
      token: string;
      data?: any;
    },
  ): void => {
    if (!socket) return;

    socket.emit(eventName, data);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connectSocket,
        disconnectSocket,
        subscribeToEvent,
        unsubscribeFromEvent,
        emitEvent,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
