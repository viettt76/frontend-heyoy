'use client';

import ToggleLanguage from '@/components/shared/toggle-language';
import ToggleTheme from '@/components/shared/toggle-theme';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative">
            <div className="flex items-center space-x-4 absolute right-4 top-4">
                <ToggleLanguage />
                <ToggleTheme />
            </div>
            {children}
        </div>
    );
}
