import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Korumalı rotalar
const protectedRoutes = ["/"];

// Herkese açık rotalar
const publicRoutes = ["/auth/login", "/auth/register"];

// Token'ın geçerli olup olmadığını kontrol eden fonksiyon
const isValidToken = (token: string): boolean => {
  // Token formatını kontrol et (Bearer ile başlıyor mu?)
  if (!token.startsWith("Bearer ")) {
    return false;
  }

  // Gerçek bir uygulamada burada JWT token'ın geçerliliğini kontrol edebilirsiniz
  // Örneğin: token'ın süresi dolmuş mu, imzası geçerli mi, vb.

  return true;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  // Token varsa geçerliliğini kontrol et
  const hasValidToken = token ? isValidToken(token) : false;

  // Eğer korumalı bir rotaya erişilmeye çalışılıyorsa ve geçerli token yoksa
  if (protectedRoutes.includes(pathname) && !hasValidToken) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirectUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Eğer kullanıcı giriş yapmışsa ve login/register sayfalarına erişmeye çalışıyorsa
  if (publicRoutes.includes(pathname) && hasValidToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
