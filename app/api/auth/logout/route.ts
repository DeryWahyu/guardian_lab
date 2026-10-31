import { NextResponse } from "next/server";
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  try {
    await destroySession();

    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal pada server",
      },
      { status: 500 },
    );
  }
}
