'use client';

import { envs } from '@/lib/constants';
import { accessTokenSelector } from '@/store/features/auth/authSlice';
import { useAppSelector } from '@/store/hooks';
import { SocketContextType } from '@/types/socket';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export default function SocketProvider({ children }: { children: ReactNode }) {
    const accessToken = useAppSelector(accessTokenSelector);

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        const newSocket = io(envs.baseUrl, {
            autoConnect: false,
            extraHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        newSocket.connect();
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket must be used within SocketProvider');
    return context;
};
