import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { startSandboxSession } from "@/lib/sandbox/session-manager";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const type: "web" | "android" = body?.type === "android" ? "android" : "web";
    const target: string =
      typeof body?.target === "string" ? body.target : "https://sandbox.guardianlab.id";

    const user = await getCurrentUser();
    const session = await startSandboxSession(type, target, user?.id);

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error("Failed to start sandbox session:", error);
    return NextResponse.json(
      { error: "Failed to initialize sandbox environment" },
      { status: 500 },
    );
  }
}
