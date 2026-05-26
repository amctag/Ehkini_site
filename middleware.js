import { NextResponse } from "next/server";

const AUTH_TOKEN_COOKIE = "ehkini_auth_token";

const GUEST_ONLY_ROUTE_PREFIXES = [
  "/login",
  "/signup"
];

const PROTECTED_ROUTE_PREFIXES = [
  "/discover",
  "/friends",
  "/gifts",
  "/messages",
  "/posts",
  "/profile",
  "/profile-view",
  "/settings",
  "/stories",
  "/wallet"
];

function matchesRoutePrefix(pathname, prefixes) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasAuthToken = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE)?.value);

  if (hasAuthToken && matchesRoutePrefix(pathname, GUEST_ONLY_ROUTE_PREFIXES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/discover";
    return NextResponse.redirect(url);
  }

  if (!hasAuthToken && matchesRoutePrefix(pathname, PROTECTED_ROUTE_PREFIXES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup/:path*",
    "/discover/:path*",
    "/friends/:path*",
    "/gifts/:path*",
    "/messages/:path*",
    "/posts/:path*",
    "/profile/:path*",
    "/profile-view/:path*",
    "/settings/:path*",
    "/stories/:path*",
    "/wallet/:path*"
  ]
};
