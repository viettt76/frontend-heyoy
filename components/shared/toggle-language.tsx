'use client';

import { languages } from '@/lib/constants';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
    DrilldownMenuItem,
    DrilldownMenuSub,
    DrilldownMenuSubContent,
    DrilldownMenuSubTrigger,
} from './drilldown-menu';

export default function ToggleLanguage() {
    const { i18n } = useTranslation();

    const setLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem('i18nConfig', language);
    };

    return (
        <DrilldownMenuSub>
            <DrilldownMenuSubTrigger>
                <div className="w-full flex justify-between items-center me-4">
                    <span>Đổi ngôn ngữ</span>
                    <Image
                        src={languages.find((lng) => lng.value === i18n.language)?.icon || ''}
                        alt="icon"
                        width={30}
                        height={10}
                    />
                </div>
            </DrilldownMenuSubTrigger>
            <DrilldownMenuSubContent>
                {languages.map((lng) => (
                    <DrilldownMenuItem
                        className={`space-x-2 ${lng.value === i18n.language ? 'bg-input' : ''}`}
                        onClick={() => setLanguage(lng.value)}
                        key={`language-${lng.value}`}
                        onCloseWhenClick={false}
                    >
                        <Image src={lng.icon} alt="icon" width={30} height={10} />
                        <span>{lng.label}</span>
                    </DrilldownMenuItem>
                ))}
            </DrilldownMenuSubContent>
        </DrilldownMenuSub>
    );
}
