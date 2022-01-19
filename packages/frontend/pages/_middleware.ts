import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JWT_COOKIE_KEY, JWT_SECRET_KEY } from '../lib/constants';
import jwt from '@tsndr/cloudflare-worker-jwt';

type UserJwtPayload = null | {
  id?: string;
};

async function verifyAuth(request: NextRequest) {
  const token = request.cookies[JWT_COOKIE_KEY];

  if (!token) {
    return { success: false, id: null, message: 'No token provided' };
  }

  if (!(await jwt.verify(token, JWT_SECRET_KEY))) {
    return { success: false, id: null, message: 'Your token has expired.' };
  }

  const jwtPayload: UserJwtPayload = jwt.decode(token);

  return { success: true, id: 1, ...jwtPayload };
}

// eslint-disable-next-line import/prefer-default-export
export async function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname.includes('/login');

  const protectedRoutes = ['/', '/login'];

  if (!protectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  // Add the user token to the response
  const auth = await verifyAuth(req);

  if (!isLogin && !auth?.success) {
    return NextResponse.redirect('/login', 302);
  }
  if (isLogin && auth?.success) {
    return NextResponse.redirect('/', 302);
  }
  return NextResponse.next();
}
