import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET() {
  await safeConnection();
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { published: true },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Failed to fetch quizzes:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
