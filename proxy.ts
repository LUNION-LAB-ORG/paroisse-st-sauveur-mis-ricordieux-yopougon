import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Admin routes require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      // callbackUrl permet de revenir sur la page demandée après login
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Login page: redirect to dashboard if already logged in
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
