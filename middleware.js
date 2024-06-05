import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const isAuthenticated = true; // Bu durumu kendi doğrulama mantığınıza göre güncelleyin

  const protectedPaths = ['/admin', '/drDash', '/citizenDash'];

  // Eğer kullanıcı kimlik doğrulaması yapılmamışsa ve korunan yollardan birine erişmeye çalışıyorsa, login sayfasına yönlendir
  if (!isAuthenticated && protectedPaths.includes(pathname)) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/drDash', '/citizenDash'], // Bu middleware'in çalışacağı yolları belirler
};
