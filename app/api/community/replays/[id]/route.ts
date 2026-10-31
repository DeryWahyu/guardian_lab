import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await safeConnection();
  try {
    const { id } = await params;
    const replay = await prisma.communityReplay.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, role: true },
        },
      },
    });

    if (!replay) {
      return NextResponse.json({ error: "Community case not found" }, { status: 404 });
    }

    return NextResponse.json(replay, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Failed to fetch community replay:", error);
    return NextResponse.json({ error: "Failed to fetch community replay" }, { status: 500 });
  }
}
