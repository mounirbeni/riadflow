import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/rooms",
  "/experiences",
  "/gallery",
  "/about",
  "/contact",
  "/booking",
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
  "/api/rooms",
  "/api/experiences",
  "/api/gallery",
  "/api/reviews",
  "/api/contact",
  "/api/seed",
];

const GUEST_PATHS = ["/dashboard", "/api/bookings", "/api/guest"];

const ADMIN_PATHS = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (
    PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    return NextResponse.next();
  }

  // Check auth for protected paths
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Guest paths - require authentication
  if (GUEST_PATHS.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Admin paths - require admin role
  if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|images|assets).*)",
  ],
};
