import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const password = request.cookies.get('auth_password')?.value

    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/r/')) {
        return NextResponse.next()
    }

    if (password !== 'Spark2026') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
