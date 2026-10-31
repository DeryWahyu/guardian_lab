import { NextResponse } from "next/server";
import { stopSandboxSession } from "@/lib/sandbox/session-manager";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const result = await stopSandboxSession(sessionId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to stop sandbox session:", error);
    return NextResponse.json({ error: "Failed to terminate sandbox session" }, { status: 500 });
  }
}
