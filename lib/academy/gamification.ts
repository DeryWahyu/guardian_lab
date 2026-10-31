import { prisma } from "@/lib/prisma";

export type GuardianRank = "Recruit" | "Junior Analyst" | "Cyber Sentinel" | "Forensic Master";

export interface RankInfo {
  rank: GuardianRank;
  currentExp: number;
  nextRankExp: number;
  progressPercent: number;
}

export function calculateRank(exp: number): RankInfo {
  if (exp < 100) {
    return {
      rank: "Recruit",
      currentExp: exp,
      nextRankExp: 100,
      progressPercent: Math.min(100, Math.round((exp / 100) * 100)),
    };
  }
  if (exp < 300) {
    return {
      rank: "Junior Analyst",
      currentExp: exp,
      nextRankExp: 300,
      progressPercent: Math.min(100, Math.round(((exp - 100) / 200) * 100)),
    };
  }
  if (exp < 600) {
    return {
      rank: "Cyber Sentinel",
      currentExp: exp,
      nextRankExp: 600,
      progressPercent: Math.min(100, Math.round(((exp - 300) / 300) * 100)),
    };
  }
  return {
    rank: "Forensic Master",
    currentExp: exp,
    nextRankExp: 1000,
    progressPercent: 100,
  };
}

export async function awardExpAndStreak(
  userId: string,
  expAward: number,
): Promise<{ newExp: number; newStreak: number; rank: GuardianRank }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { exp: true, streakDays: true, lastActiveAt: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  const lastActive = new Date(user.lastActiveAt);
  const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

  // If last active was between 16 and 48 hours ago, increment streak; if within 16 hours, keep streak
  let newStreak = user.streakDays;
  if (diffHours >= 16 && diffHours <= 48) {
    newStreak += 1;
  } else if (diffHours > 48) {
    newStreak = 1; // streak reset
  }

  const newExp = user.exp + expAward;

  await prisma.user.update({
    where: { id: userId },
    data: {
      exp: newExp,
      streakDays: newStreak,
      lastActiveAt: now,
    },
  });

  const rankInfo = calculateRank(newExp);
  return {
    newExp,
    newStreak,
    rank: rankInfo.rank,
  };
}
