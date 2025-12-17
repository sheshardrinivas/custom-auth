import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  if (!session && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const auth_session = req.cookies.get("auth_session")?.value;

  if (!auth_session && req.nextUrl.pathname.startsWith("/teacher")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
