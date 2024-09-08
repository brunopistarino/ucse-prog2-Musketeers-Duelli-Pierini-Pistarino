import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const authenticated = request.locals.get("authenticated");
  const authenticated = true;
  // const authenticated = false;

  if (request.nextUrl.pathname === "/") {
    if (authenticated) {
      return NextResponse.redirect(new URL("/estadisticas", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
