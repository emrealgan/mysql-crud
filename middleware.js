import { NextResponse } from 'next/server';
import { verifyToken } from './app/lib/auth';

export async function middleware(request) {
  
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const cookies = request.cookies;

  // const { value: token } = Cookies.get("token") ?? { value: null };
  const adminToken = cookies.get('adminToken');
  const doctorToken = cookies.get('doctorToken');
  const citizenToken = cookies.get('citizenToken');

  // Define the protected paths and their corresponding authentication and redirect logic
  const protectedPaths = {
    '/admin': {
      isAuthenticated: adminToken,
      loginPath: '/adminLogin',
    },
    '/drDash': {
      isAuthenticated: doctorToken,
      loginPath: '/drLogin',
    },
    '/citizenDash': {
      isAuthenticated: citizenToken,
      loginPath: '/citizenLogin',
    }
  };

  // Define the login paths and their corresponding redirection if already authenticated
  const loginPaths = {
    '/adminLogin': {
      isAuthenticated: adminToken,
      redirectPath: '/admin',
    },
    '/drLogin': {
      isAuthenticated: doctorToken,
      redirectPath: '/drDash',
    },
    '/citizenLogin': {
      isAuthenticated: citizenToken,
      redirectPath: '/citizenDash',
    }
  };

  // Check if the current path is a protected path
  if (protectedPaths[pathname]) {
    const control = await verifyToken(protectedPaths[pathname].isAuthenticated)
    if (!control) {
      url.pathname = protectedPaths[pathname].loginPath;
      return NextResponse.redirect(url);
    }
  }

  // Check if the current path is a login path
  if (loginPaths[pathname]) {
    const control = await verifyToken(loginPaths[pathname].isAuthenticated)
    if (control) {
      url.pathname = loginPaths[pathname].redirectPath;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/drDash', '/citizenDash', '/adminLogin', '/drLogin', '/citizenLogin'], 
};

