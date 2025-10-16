import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Input } from '../ui/input';
import { DrilldownMenu, DrilldownMenuContent, DrilldownMenuItem, DrilldownMenuTrigger } from './drilldown-menu';
import Logo from './logo';
import ToggleLanguage from './toggle-language';
import ToggleTheme from './toggle-theme';
import apiClient from '@/lib/api/api-client';

export default function Header() {
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
                    <DrilldownMenuItem onClick={() => apiClient.getLogout?.()}>Logout</DrilldownMenuItem>
                </DrilldownMenuContent>
            </DrilldownMenu>
        </div>
    );
}
