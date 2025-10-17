import { Button } from '@/components/ui/button';
import { logoutService } from '@/lib/api/auth.service';
import { paths } from '@/lib/constants';
import { clearToken } from '@/store/features/auth/authSlice';
import { clearUser } from '@/store/features/users/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { DrilldownMenu, DrilldownMenuContent, DrilldownMenuItem, DrilldownMenuTrigger } from './drilldown-menu';
import Logo from './logo';
import ToggleLanguage from './toggle-language';
import ToggleTheme from './toggle-theme';

export default function Header() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await logoutService();
            dispatch(clearToken());
            dispatch(clearUser());

            router.push(paths.login);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex justify-between items-center px-5 py-2 shadow-sm">
            <Logo width={50} height={50} />

            <Input className="w-80" placeholder="Tìm kiếm" />

            <DrilldownMenu>
                <DrilldownMenuTrigger>
                    <Button variant="outline">
                        <Settings />
                    </Button>
                </DrilldownMenuTrigger>
                <DrilldownMenuContent position="bottom-left">
                    <ToggleLanguage />
                    <ToggleTheme />
                    <DrilldownMenuItem onClick={handleLogout}>Logout</DrilldownMenuItem>
                </DrilldownMenuContent>
            </DrilldownMenu>
        </div>
    );
}
