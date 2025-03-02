import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Korumalı rotalar - token olmadan erişilemez
const protectedRoutes = ["/profile", "/profile/edit"];

// Kimlik doğrulama rotaları - token varsa erişilemez
const authRoutes = ["/auth/login", "/auth/register"];

// Token'ın geçerli olup olmadığını kontrol eden fonksiyon
const isValidToken = (token: string): boolean => {
  // Token formatını kontrol et (Bearer ile başlıyor mu?)
  if (!token.startsWith("Bearer ")) {
    return false;
  }
  return true;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;
  const hasValidToken = token ? isValidToken(token) : false;

  // Ana sayfa için özel durum - her zaman erişilebilir
  //giriş yapılmamışsa erişilemez
  if (
    !hasValidToken &&
    pathname !== "/auth/login" &&
    pathname !== "/auth/register"
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  // 1. Korumalı rotalara erişim kontrolü
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // Token yoksa login sayfasına yönlendir
    if (!hasValidToken) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirectUrl", pathname);
      return NextResponse.redirect(url);
    }
    // Token varsa erişime izin ver
    return NextResponse.next();
  }

  // 2. Kimlik doğrulama sayfalarına erişim kontrolü
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isAuthRoute) {
    // Token varsa ana sayfaya yönlendir
    if (hasValidToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Token yoksa erişime izin ver
    return NextResponse.next();
  }

  // Diğer tüm rotalar için erişime izin ver
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
