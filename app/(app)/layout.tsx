'use client';

import Header from '@/components/shared/header';
import InitLoadingProvider from '@/providers/init-loading-provider';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <InitLoadingProvider>
            <Header />
            {children}
        </InitLoadingProvider>
    );
}
