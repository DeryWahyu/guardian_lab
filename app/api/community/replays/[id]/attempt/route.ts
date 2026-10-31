import { NextResponse } from "next/server";
import { awardExpAndStreak } from "@/lib/academy/gamification";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    const { id } = await params;
    const bonusExp = 75;

    // Record attempt
    await prisma.replayAttempt.create({
      data: {
        userId: user.id,
        replayId: id,
        solved: true,
        expEarned: bonusExp,
      },
    });

    // Update user stats
    const updated = await awardExpAndStreak(user.id, bonusExp);

    return NextResponse.json(
      {
        success: true,
        message: "Studi kasus berhasil dipecahkan!",
        bonusExp,
        newTotalExp: updated.newExp,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Replay attempt error:", error);
    return NextResponse.json({ error: "Failed to record replay attempt" }, { status: 500 });
  }
}
