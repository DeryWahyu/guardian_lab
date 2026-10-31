import { NextResponse } from "next/server";
import { awardExpAndStreak } from "@/lib/academy/gamification";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { quizId, answers } = body as {
      quizId: string;
      answers: Record<string, string>; // questionId -> selectedOptionId
    };

    if (!quizId || !answers) {
      return NextResponse.json({ error: "quizId and answers are required" }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    for (const question of quiz.questions) {
      const selectedOptionId = answers[question.id];
      const correctAnswers = (question.correctAnswers as string[]) || [];

      if (selectedOptionId && correctAnswers.includes(selectedOptionId)) {
        correctCount += 1;
      }
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= 70;
    const expAwarded = passed ? quiz.expReward : Math.round(quiz.expReward * 0.3);

    // Update user stats
    const updatedStats = await awardExpAndStreak(user.id, expAwarded);

    // Record attempt
    await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        score,
        expEarned: expAwarded,
        passed,
      },
    });

    return NextResponse.json(
      {
        score,
        passed,
        expEarned: expAwarded,
        totalQuestions,
        correctCount,
        newExp: updatedStats.newExp,
        newStreak: updatedStats.newStreak,
        rank: updatedStats.rank,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json({ error: "Failed to evaluate quiz submission" }, { status: 500 });
  }
}
