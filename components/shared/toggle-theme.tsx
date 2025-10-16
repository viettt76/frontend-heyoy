'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { DrilldownMenuItem } from './drilldown-menu';

export default function ToggleTheme() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <DrilldownMenuItem
            unstyled={true}
            isAnimated={false}
            className="flex items-center justify-between rounded-md px-3 py-2"
        >
            <span>Đổi chủ đề</span>
            <button
                onClick={toggleTheme}
                className="relative w-12 h-6 bg-muted rounded-full transition-all duration-300 flex items-center justify-between px-1"
            >
                {theme === 'dark' ? (
                    <Moon className="absolute top-1 right-1 w-4 h-4" />
                ) : (
                    <Sun className="absolute color-red top-1 left-1 w-4 h-4" />
                )}
            </button>
        </DrilldownMenuItem>
    );
}
