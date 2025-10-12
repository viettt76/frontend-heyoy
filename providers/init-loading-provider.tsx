'use client';

import apiClient from '@/lib/api/api-client';
import { logoutService, refreshTokenService } from '@/lib/api/auth.service';
import { setAccessToken } from '@/store/features/auth/authSlice';
import { fetchCurrentUser } from '@/store/features/users/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { ReactNode, useEffect } from 'react';

export default function InitLoadingProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    // const handleLogout = async () => {
    //     try {
    //         await logoutService();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // apiClient.setHandleLogout = handleLogout;

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await refreshTokenService();
                dispatch(setAccessToken(res.data?.accessToken));

                fetchCurrentUser();
            } catch (error) {
                console.error(error);
            }
        };

        initAuth();
    }, [dispatch]);

    return children;
}
