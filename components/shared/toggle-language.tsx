'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function ToggleLanguage() {
    const { i18n } = useTranslation();

    const data = [
        {
            value: 'vi',
            label: 'Tiếng Việt',
            icon: '/images/flags/ic-flag-vi.svg',
        },
        {
            value: 'en',
            label: 'English',
            icon: '/images/flags/ic-flag-en.svg',
        },
    ];

    const currentLanguage = data.find((lng) => lng.value === i18n.language);

    const setLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem('i18nConfig', language);
    };

    return (
        <>
            {currentLanguage && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Image src={currentLanguage.icon} alt="icon" width={30} height={10} />
                            <span className="sr-only">Toggle language</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {data.map((lng) => (
                            <DropdownMenuItem onClick={() => setLanguage(lng.value)} key={`language-${lng.value}`}>
                                <Image src={lng.icon} alt="icon" width={30} height={10} />
                                {lng.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    );
}
