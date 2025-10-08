import { getMyInfo } from '@/lib/api/user.service';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function InitLoadingProvider({ children }: { children: ReactNode }) {
    const dispatch = useDispatch();

    const { data } = useQuery({
        queryKey: ['myInfo'],
        queryFn: getMyInfo,
    });

    useEffect(() => {
        // dispatch()
    }, [data, dispatch]);

    return children;
}
