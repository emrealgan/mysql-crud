import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(request) {
  
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const adminAuth = Cookies.get('adminAuth');
  const drAuth = Cookies.get('drAuth');
  const citizenAuth = Cookies.get('citizenAuth');

  // Define the protected paths and their corresponding authentication and redirect logic
  const protectedPaths = {
    '/admin': {
      isAuthenticated: adminAuth,
      loginPath: '/adminLogin',
    },
    '/drDash': {
      isAuthenticated: drAuth,
      loginPath: '/drLogin',
    },
    '/citizenDash': {
      isAuthenticated: citizenAuth,
      loginPath: '/citizenLogin',
    }
  };

  // Define the login paths and their corresponding redirection if already authenticated
  const loginPaths = {
    '/adminLogin': {
      isAuthenticated: adminAuth,
      redirectPath: '/admin',
    },
    '/drLogin': {
      isAuthenticated: drAuth,
      redirectPath: '/drDash',
    },
    '/citizenLogin': {
      isAuthenticated: citizenAuth,
      redirectPath: '/citizenDash',
    }
  };

  // Check if the current path is a protected path
  if (protectedPaths[pathname]) {
    if (!protectedPaths[pathname].isAuthenticated) {
      url.pathname = protectedPaths[pathname].loginPath;
      return NextResponse.redirect(url);
    }
  }

  // Check if the current path is a login path
  if (loginPaths[pathname]) {
    if (loginPaths[pathname].isAuthenticated) {
      url.pathname = loginPaths[pathname].redirectPath;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/drDash', '/citizenDash', '/adminLogin', '/drLogin', '/citizenLogin'], 
};

