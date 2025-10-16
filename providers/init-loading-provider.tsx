'use client';

import apiClient from '@/lib/api/api-client';
import { logoutService, refreshTokenService } from '@/lib/api/auth.service';
import { paths } from '@/lib/constants';
import { store } from '@/store';
import { logout, setAccessToken } from '@/store/features/auth/authSlice';
import { clearUser, fetchCurrentUser } from '@/store/features/users/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function InitLoadingProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutService();
            dispatch(logout());
            dispatch(clearUser());

            router.push(paths.login);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await refreshTokenService();
                dispatch(setAccessToken(res.data?.accessToken));

                apiClient.init(store, res.data?.accessToken as string, handleLogout);

                fetchCurrentUser();
            } catch (error) {
                console.error(error);
            }
        };

        initAuth();
    }, [dispatch]);

    return children;
}
