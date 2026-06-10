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

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];

const GUEST_PATHS = ["/dashboard", "/api/bookings", "/api/guest"];

const ADMIN_PATHS = ["/admin", "/api/admin"];

function isPathMatch(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return NextResponse.redirect(loginUrl);
}

function unauthorizedResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return redirectToLogin(request);
}

function forbiddenResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPath = isPathMatch(pathname, AUTH_PATHS);
  const isGuestPath = isPathMatch(pathname, GUEST_PATHS);
  const isAdminPath = isPathMatch(pathname, ADMIN_PATHS);

  // Allow public paths that do not need session-aware redirects.
  if (
    !isAuthPath &&
    !isGuestPath &&
    !isAdminPath &&
    isPathMatch(pathname, PUBLIC_PATHS)
  ) {
    return NextResponse.next();
  }

  if (!isAuthPath && !isGuestPath && !isAdminPath) {
    return NextResponse.next();
  }

  const isProduction = process.env.NODE_ENV === "production";
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    secureCookie: isProduction,
    salt: isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  // Keep signed-in users out of guest-only auth pages.
  if (isAuthPath) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Guest paths - require authentication
  if (isGuestPath) {
    if (!token) {
      return unauthorizedResponse(request);
    }
    return NextResponse.next();
  }

  // Admin paths - require admin role
  if (isAdminPath) {
    if (!token) {
      return unauthorizedResponse(request);
    }
    if (token.role !== "ADMIN") {
      return forbiddenResponse(request);
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
