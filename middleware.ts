import { NextRequest, NextResponse } from 'next/server';
import { paths } from './lib/constants';

export default function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    const url = new URL(req.url);

    const publicRoutes = [paths.login, paths.signup];
    const isAdminPage = url.pathname.includes('/admin');

    if (refreshToken && publicRoutes.includes(url.pathname)) {
        return NextResponse.redirect(new URL(paths.login, req.url));
    }
    if (!refreshToken && !publicRoutes.includes(url.pathname)) {
        return NextResponse.redirect(new URL(paths.home, req.url));
    }
}
