import { NextResponse } from 'next/server';

export async function middleware(req, event) {
    // const excludes = ['/library', '/images', '/css', '/icon', '/fav'];
    // const locale = req.cookies['NAMI_LOCALE'];
    // if (excludes.find((rs) => req.nextUrl.pathname.startsWith(rs))) return NextResponse.next();
    // if (!!locale && req.nextUrl.locale !== locale) {
    //     const _locale = locale === 'en' ? '' : '/' + locale;
    //     const _url = `${_locale}${req.nextUrl.pathname}${req.nextUrl.search}`;
    //     return NextResponse.redirect(_url);
    // }
    return NextResponse.next();
}