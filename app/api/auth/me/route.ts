import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/jwt";
import { getCurrentUser, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET(request: Request) {
  await safeConnection();
  try {
    // 1. Try retrieving the user via session helper (DAL)
    const currentUser = await getCurrentUser();
    if (currentUser) {
      return NextResponse.json({
        authenticated: true,
        ...currentUser,
        user: currentUser,
      });
    }

    // 2. Direct Cookie header parsing fallback (for synthetic/test executions)
    const cookieHeader = request.headers.get("cookie") || "";
    const cookiesMap = new Map<string, string>();
    for (const cookie of cookieHeader.split(";")) {
      const parts = cookie.trim().split("=");
      if (parts[0] && parts[1]) {
        cookiesMap.set(parts[0], decodeURIComponent(parts.slice(1).join("=")));
      }
    }

    const token = cookiesMap.get(SESSION_COOKIE_NAME);
    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          error: "Sesi tidak ditemukan atau telah kedaluwarsa",
        },
        { status: 401 },
      );
    }

    // Cryptographic JWT verification
    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          error: "Token sesi tidak valid",
        },
        { status: 401 },
      );
    }

    // Query session table directly to verify active status and enforce revocation
    const dbSession = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            exp: true,
            streakDays: true,
          },
        },
      },
    });

    if (
      !dbSession ||
      dbSession.expiresAt <= new Date() ||
      !dbSession.user ||
      dbSession.user.id !== payload.userId
    ) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          error: "Sesi tidak ditemukan atau telah kedaluwarsa",
        },
        { status: 401 },
      );
    }

    const dbUser = dbSession.user;

    return NextResponse.json({
      authenticated: true,
      ...dbUser,
      user: dbUser,
    });
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Auth me API error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: "Terjadi kesalahan internal pada server",
      },
      { status: 500 },
    );
  }
}
