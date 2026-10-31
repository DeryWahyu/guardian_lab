import { ReplayStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET(request: Request) {
  await safeConnection();
  try {
    const { searchParams } = new URL(request.url);
    const scamType = searchParams.get("scamType");

    const replays = await prisma.communityReplay.findMany({
      where: {
        status: ReplayStatus.APPROVED,
        ...(scamType ? { scamType } : {}),
      },
      include: {
        user: {
          select: { name: true, role: true },
        },
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(replays, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Failed to fetch community replays:", error);
    return NextResponse.json({ error: "Failed to fetch community replays" }, { status: 500 });
  }
}
