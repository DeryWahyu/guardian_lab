import { Difficulty, type Prisma, QuestionType, QuizCategory } from "@prisma/client";
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

    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Admin quizzes error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes for admin" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { title, description, category, difficulty, expReward, questions } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "title, description, and category are required" },
        { status: 400 },
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        category: (category as QuizCategory) || QuizCategory.SPOT_THE_PHISH,
        difficulty: (difficulty as Difficulty) || Difficulty.EASY,
        expReward: Number(expReward) || 50,
        published: true,
        questions: {
          create: Array.isArray(questions)
            ? questions.map(
                (
                  q: {
                    questionText: string;
                    questionType?: QuestionType;
                    options?: unknown;
                    correctAnswers?: unknown;
                    explanation?: string;
                  },
                  idx: number,
                ) => ({
                  questionText: q.questionText,
                  questionType: q.questionType || QuestionType.MULTIPLE_CHOICE,
                  options: (q.options || []) as Prisma.InputJsonValue,
                  correctAnswers: (q.correctAnswers || []) as Prisma.InputJsonValue,
                  explanation: q.explanation || "",
                  order: idx + 1,
                }),
              )
            : [],
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Admin create quiz error:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
