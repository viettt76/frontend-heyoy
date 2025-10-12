'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '@/store';
import apiClient from '@/lib/api/api-client';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>(undefined);
    if (!storeRef.current) {
        storeRef.current = makeStore();
        apiClient.setStore = storeRef.current;
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
