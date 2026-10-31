import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET() {
  await safeConnection();
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const reviews = await prisma.communityReplay.findMany({
      where: { status: "PENDING_REVIEW" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Admin community reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch pending community cases" }, { status: 500 });
  }
}
