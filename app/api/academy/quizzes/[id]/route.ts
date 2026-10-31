import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await safeConnection();
  try {
    const { id } = await params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Failed to fetch quiz detail:", error);
    return NextResponse.json({ error: "Failed to fetch quiz detail" }, { status: 500 });
  }
}
