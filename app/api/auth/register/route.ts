import { NextResponse } from "next/server";
import { signSessionToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validasi data gagal",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda.",
        },
        { status: 409 },
      );
    }

    // Hash password with bcryptjs
    const passwordHash = await hashPassword(password);

    // Create user with default gamification profile: 0 EXP, 1 streak day
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
        exp: 0,
        streakDays: 1,
        lastActiveAt: new Date(),
      },
    });

    // Create signed JWT session token
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Persist session record in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: user.exp,
      streakDays: user.streakDays,
    };

    // Return response with Set-Cookie header attached
    const response = NextResponse.json(
      {
        success: true,
        message: "Registrasi akun Guardian Lab berhasil",
        ...userProfile,
        user: userProfile,
      },
      { status: 201 },
    );

    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return response;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda.",
        },
        { status: 409 },
      );
    }
    console.error("Register API error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal pada server",
      },
      { status: 500 },
    );
  }
}
