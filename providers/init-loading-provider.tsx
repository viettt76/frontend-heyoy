'use client';

import apiClient from '@/lib/api/api-client';
import { refreshTokenService } from '@/lib/api/auth.service';
import { paths } from '@/lib/constants';
import { store } from '@/store';
import { clearToken, setAccessToken } from '@/store/features/auth/authSlice';
import { clearUser, fetchCurrentUser } from '@/store/features/users/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function InitLoadingProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isInitialized, setIsInitialized] = useState(false);

    const handleLogout = () => {
        dispatch(clearToken());
        dispatch(clearUser());

        router.push(paths.login);
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await refreshTokenService();
                dispatch(setAccessToken(res.data?.accessToken));

                apiClient.init(store, res.data?.accessToken as string, handleLogout);

                dispatch(fetchCurrentUser());
            } catch (error) {
                console.error(error);
            } finally {
                setIsInitialized(true);
            }
        };

        initAuth();
    }, [dispatch]);

    if (!isInitialized) return null;

    return children;
}
