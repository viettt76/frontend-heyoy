'use client';

import { paths } from '@/lib/constants';
import { userInfoSelector } from '@/store/features/users/userSlice';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    // const userInfo = useAppSelector(userInfoSelector);

    // const router = useRouter();

    // useEffect(() => {
    //     if (userInfo?.id) {
    //         router.push(paths.home);
    //     }
    // }, []);

    return children;
}
