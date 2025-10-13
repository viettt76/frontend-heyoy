'use client';

import { userInfoSelector } from '@/store/features/users/userSlice';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const userInfo = useAppSelector(userInfoSelector);

    const router = useRouter();
    console.log(userInfo);

    if (!userInfo?.id) {
        router.back();
        return null;
    }

    return children;
}
