'use client';

import apiClient from '@/lib/api/api-client';
import { logoutService } from '@/lib/api/auth.service';
import { logout } from '@/store/features/auth/authSlice';
import { clearUser } from '@/store/features/users/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await logoutService();
            dispatch(logout());
            dispatch(clearUser());
        } catch (error) {
            console.log(error);
        }
    };

    apiClient.setHandleLogout = handleLogout;

    return children;
}
