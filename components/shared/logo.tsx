import { cn } from '@/lib/utils/tailwind-merge';
import Image from 'next/image';

export interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'none' | 'full';
}

export default function Logo({ className, width = 60, height = 60, rounded }: LogoProps) {
    return (
        <Image
            className={cn(`rounded-${rounded}`, className)}
            priority
            src="/images/logo.png"
            width={width}
            height={height}
            alt="logo"
        />
    );
}
