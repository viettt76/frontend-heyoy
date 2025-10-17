'use client';

import apiClient from '@/lib/api/api-client';
import { refreshTokenService } from '@/lib/api/auth.service';
import { store } from '@/store';
import { setAccessToken } from '@/store/features/auth/authSlice';
import { fetchCurrentUser } from '@/store/features/users/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { ReactNode, useEffect } from 'react';

export default function InitLoadingProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await refreshTokenService();
                dispatch(setAccessToken(res.data?.accessToken));

                apiClient.init(store, res.data?.accessToken as string);

                dispatch(fetchCurrentUser());
            } catch (error) {
                console.error(error);
            }
        };

        initAuth();
    }, [dispatch]);

    return children;
}
