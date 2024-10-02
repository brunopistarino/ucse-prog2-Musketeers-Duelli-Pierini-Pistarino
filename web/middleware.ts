import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pages } from "./lib/constants";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const authenticated = !!token;
  const { pathname } = request.nextUrl;

  if (!authenticated) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authenticated) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL(pages[0].href, request.url));
    }
    if (pathname === "/login" || pathname === "/register") {
      const response = NextResponse.redirect(new URL(pathname, request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!abc|api|_next/static|images|favicon.ico).*)"],
};
