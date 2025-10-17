'use client';

import { DrilldownMenu, DrilldownMenuContent, DrilldownMenuTrigger } from '@/components/shared/drilldown-menu';
import ToggleLanguage from '@/components/shared/toggle-language';
import ToggleTheme from '@/components/shared/toggle-theme';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative">
            <div className="flex items-center space-x-4 absolute right-4 top-4 z-[100]">
                <DrilldownMenu>
                    <DrilldownMenuTrigger>
                        <Button variant="outline">
                            <Settings />
                        </Button>
                    </DrilldownMenuTrigger>
                    <DrilldownMenuContent position="bottom-left">
                        <ToggleLanguage />
                        <ToggleTheme />
                    </DrilldownMenuContent>
                </DrilldownMenu>
            </div>
            {children}
        </div>
    );
}
