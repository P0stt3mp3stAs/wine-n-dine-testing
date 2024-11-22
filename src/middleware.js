// src/middleware.js
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/utils/auth';

export async function middleware(request) {
  // Check if user is authenticated
  const user = await getCurrentUser();
  
  // If the user is not authenticated and trying to access protected routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If the user is authenticated and trying to access auth pages
  if (user && (request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};