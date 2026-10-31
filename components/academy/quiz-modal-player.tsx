"use client";

import { AlertCircle, CheckCircle2, Flame, Sparkles, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface QuizQuestionItem {
  id: string;
  questionText: string;
  questionType: string;
  options: QuizOption[];
  correctAnswers: string[];
  explanation: string;
}

interface QuizDetailData {
  id: string;
  title: string;
  expReward: number;
  questions: QuizQuestionItem[];
}

interface QuizResultSummary {
  score: number;
  passed: boolean;
  expEarned: number;
  totalQuestions: number;
  correctCount: number;
  newStreak: number;
}

interface QuizModalPlayerProps {
  quizId: string;
  onClose: () => void;
  onCompleted: (expEarned: number) => void;
}

export function QuizModalPlayer({ quizId, onClose, onCompleted }: QuizModalPlayerProps) {
  const [quiz, setQuiz] = useState<QuizDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [answeredCurrent, setAnsweredCurrent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultSummary, setResultSummary] = useState<QuizResultSummary | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/academy/quizzes/${quizId}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
        }
      } catch (err) {
        console.error("Failed to load quiz questions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg animate-pulse rounded-3xl bg-white p-8 text-center text-slate-500">
          Menyiapkan lembar latihan kuis...
        </div>
      </div>
    );
  }

  const questions: QuizQuestionItem[] = quiz?.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (answeredCurrent) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    setAnsweredCurrent(true);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnsweredCurrent(false);
    } else {
      // Submit all answers
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/academy/submit-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId,
            answers: selectedAnswers,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setResultSummary(data);
          onCompleted(data.expEarned);
        }
      } catch (err) {
        console.error("Error submitting quiz:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
      <div className="relative w-full max-w-xl space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        {resultSummary ? (
          /* Completion Screen */
          <div className="space-y-5 py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 text-amber-500 shadow-md">
              <Sparkles className="h-8 w-8 animate-spin" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                Latihan Selesai!
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Skor Akurasi: {resultSummary.score}%
              </h3>
              <p className="text-xs text-slate-500">
                Kamu menjawab benar {resultSummary.correctCount} dari {resultSummary.totalQuestions}{" "}
                pertanyaan tantangan.
              </p>
            </div>

            <div className="flex items-center justify-around rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
              <div>
                <div className="text-xs font-semibold text-rose-500">Reward EXP</div>
                <div className="text-xl font-black text-rose-700">
                  +{resultSummary.expEarned} XP
                </div>
              </div>
              <div className="h-8 w-px bg-rose-200" />
              <div>
                <div className="text-xs font-semibold text-amber-600">Streak Api</div>
                <div className="flex items-center justify-center gap-1 text-xl font-black text-amber-700">
                  <Flame className="h-5 w-5 fill-amber-500" /> {resultSummary.newStreak} Hari
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer rounded-full bg-rose-600 py-3 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
            >
              Lanjutkan Petualangan &rarr;
            </button>
          </div>
        ) : currentQuestion ? (
          /* Question View */
          <div className="space-y-5">
            {/* Header / Progress */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>
                  Pertanyaan {currentIndex + 1} dari {questions.length}
                </span>
                <span className="font-bold text-rose-600">+{quiz?.expReward ?? 50} EXP</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-rose-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-base leading-snug font-bold text-slate-900 sm:text-lg">
              {currentQuestion.questionText}
            </h4>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                const isCorrect = currentQuestion.correctAnswers.includes(opt.id);

                let btnStyle = "bg-white border-slate-200 hover:border-rose-300 text-slate-800";
                if (answeredCurrent) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-rose-50 border-rose-400 text-rose-900 line-through";
                  } else {
                    btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={answeredCurrent}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border p-4 text-left text-xs transition-all sm:text-sm ${btnStyle}`}
                  >
                    <span>{opt.text}</span>
                    {answeredCurrent && isCorrect && (
                      <CheckCircle2 className="ml-2 h-4 w-4 shrink-0 text-emerald-600" />
                    )}
                    {answeredCurrent && isSelected && !isCorrect && (
                      <XCircle className="ml-2 h-4 w-4 shrink-0 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answer */}
            {answeredCurrent && (
              <div className="animate-in fade-in space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <AlertCircle className="h-4 w-4 text-rose-500" /> Penjelasan Forensik:
                </div>
                <p className="leading-relaxed text-slate-600">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Next / Submit Button */}
            {answeredCurrent && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-rose-600 py-3 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
              >
                {isSubmitting
                  ? "Memproses Hasil..."
                  : currentIndex < questions.length - 1
                    ? "Pertanyaan Berikutnya →"
                    : "Selesaikan Latihan & Klaim EXP →"}
              </button>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-slate-500">
            Tidak ada pertanyaan pada kuis ini.
          </div>
        )}
      </div>
    </div>
  );
}
