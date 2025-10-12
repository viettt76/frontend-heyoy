import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import I18nProvider from '@/providers/i18n-provider';
import QueryProvider from '@/providers/query-provider';
import StoreProvider from '@/providers/store-provider';

import './globals.css';
import InitLoadingProvider from '@/providers/init-loading-provider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Heyoy',
    description: 'Social media Heyoy',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <I18nProvider>
                        <QueryProvider>
                            <StoreProvider>
                                <InitLoadingProvider>{children}</InitLoadingProvider>
                            </StoreProvider>
                        </QueryProvider>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
