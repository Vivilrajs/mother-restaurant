import { NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/auth';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = verifySession(token);
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname.startsWith('/api/upload')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!verifySession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/upload/:path*'],
};
