import { type NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/jwt";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

const SESSION_COOKIE_NAME = "guardian_session";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const isAuthenticated = Boolean(session?.userId);
  const isAdmin = session?.role === "ADMIN";

  // 1. Protect Admin API routes: /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized: Otentikasi diperlukan" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Hak akses administrator diperlukan" },
        { status: 403 },
      );
    }

    return NextResponse.next();
  }

  // 2. Protect Admin Web routes: /admin/*
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL(AUTH_ROUTES.login, request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL(PUBLIC_ROUTES.home, request.url));
    }

    return NextResponse.next();
  }

  // 3. Protect User features: /history/* and /academy/*
  if (pathname.startsWith("/history") || pathname.startsWith("/academy")) {
    if (!isAuthenticated) {
      const loginUrl = new URL(AUTH_ROUTES.login, request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 4. Redirect already-authenticated users trying to access /login or /register
  if (pathname === AUTH_ROUTES.login || pathname === AUTH_ROUTES.register) {
    if (isAuthenticated) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const targetUrl =
        redirectParam?.startsWith("/") &&
        !redirectParam.startsWith("//") &&
        !redirectParam.startsWith("/\\")
          ? redirectParam
          : PUBLIC_ROUTES.home;

      return NextResponse.redirect(new URL(targetUrl, request.url));
    }

    return NextResponse.next();
  }

  // All other routes are public
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/history/:path*",
    "/academy/:path*",
    "/login",
    "/register",
  ],
};
