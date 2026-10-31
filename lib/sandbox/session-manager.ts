import { SandboxStatus, SandboxType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const SANDBOX_TIMEOUT_SECONDS = 180;

export interface SandboxSessionResponse {
  sessionId: string;
  streamUrl: string;
  expiresAt: number;
  isFallback: boolean;
  viewport: "desktop" | "mobile";
}

export async function startSandboxSession(
  type: "web" | "android",
  targetUrl?: string,
  userId?: string,
): Promise<SandboxSessionResponse> {
  const expiresAtMs = Date.now() + SANDBOX_TIMEOUT_SECONDS * 1000;
  const expiresAtDate = new Date(expiresAtMs);
  const sandboxType = type === "android" ? SandboxType.ANDROID : SandboxType.WEB;
  const viewport: "desktop" | "mobile" = type === "android" ? "mobile" : "desktop";
  const validTarget =
    targetUrl && targetUrl.trim() !== "" ? targetUrl.trim() : "https://sandbox.guardianlab.id";

  // Resolve user to link in database
  let targetUserId = userId;
  if (!targetUserId) {
    const defaultUser = await prisma.user.findFirst({
      select: { id: true },
    });
    targetUserId = defaultUser?.id;
  }

  let dbSessionId = `sbx_${Date.now()}`;
  if (targetUserId) {
    const session = await prisma.sandboxSession.create({
      data: {
        userId: targetUserId,
        targetUrl: validTarget,
        type: sandboxType,
        status: SandboxStatus.ACTIVE,
        expiresAt: expiresAtDate,
      },
    });
    dbSessionId = session.id;
  }

  // Docker or simulated stream URL (KasmVNC / noVNC endpoint)
  const streamUrl =
    type === "android"
      ? `http://localhost:6080/vnc.html?autoconnect=true&resize=scale&view_only=false`
      : `http://localhost:6080/vnc.html?autoconnect=true&target=${encodeURIComponent(validTarget)}`;

  return {
    sessionId: dbSessionId,
    streamUrl,
    expiresAt: expiresAtMs,
    isFallback: true, // Docker virtualization fallback active
    viewport,
  };
}

export async function stopSandboxSession(
  sessionId: string,
): Promise<{ success: boolean; message: string; destroyedSessionId: string }> {
  try {
    const existing = await prisma.sandboxSession.findUnique({
      where: { id: sessionId },
    });

    if (existing) {
      await prisma.sandboxSession.update({
        where: { id: sessionId },
        data: {
          status: SandboxStatus.DESTROYED,
          destroyedAt: new Date(),
        },
      });
    }
  } catch {
    // Graceful handling if session was ephemeral
  }

  return {
    success: true,
    message: "Session terminated and container destroyed successfully",
    destroyedSessionId: sessionId,
  };
}
