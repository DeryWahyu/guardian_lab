import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signSessionToken, verifySessionToken } from "./jwt";

export const SESSION_COOKIE_NAME = "guardian_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  exp: number;
  streakDays: number;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function createSession(user: {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
}): Promise<string> {
  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return token;
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    // 1. Verify cryptographic integrity of JWT
    const payload = await verifySessionToken(token);
    if (!payload?.userId) {
      return null;
    }

    // 2. Query session table directly to enforce server-side revocation and expiration
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

    // Check if session exists in DB, is not expired, and matches user
    if (
      !dbSession ||
      dbSession.expiresAt <= new Date() ||
      !dbSession.user ||
      dbSession.user.id !== payload.userId
    ) {
      return null;
    }

    const user = dbSession.user;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: user.exp,
      streakDays: user.streakDays,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(expectedRole?: "ADMIN" | "USER"): Promise<UserSession> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  if (expectedRole && user.role !== expectedRole) {
    throw new Error(`Forbidden: Insufficient privileges, expected role ${expectedRole}`);
  }

  return user;
}

export async function requireAdmin(): Promise<UserSession> {
  return requireAuth("ADMIN");
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      });
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    try {
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      // In case cookie store is not available
    }
  }
}
