import { CheckCircle2, Play } from "lucide-react";

export interface QuizNode {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  expReward: number;
  isCompleted?: boolean;
}

export function SkillTree({
  quizzes,
  onSelectQuiz,
}: {
  quizzes: QuizNode[];
  onSelectQuiz: (quizId: string) => void;
}) {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-rose-600 uppercase">
            Learning Path Gamifikasi (Duolingo Style)
          </span>
          <h3 className="mt-0.5 text-xl font-extrabold text-slate-900">
            Jalur Latihan Deteksi Ancaman Siber
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Asah insting pertahananmu melalui latihan studi kasus interaktif langkah demi langkah.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz, idx) => (
          <div
            key={quiz.id}
            className={`flex flex-col justify-between gap-4 rounded-3xl border p-5 transition-all sm:flex-row sm:items-center ${
              quiz.isCompleted
                ? "border-emerald-200 bg-emerald-50/40 shadow-2xs"
                : "border-slate-200/90 bg-white shadow-xs hover:border-rose-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                  quiz.isCompleted
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "border border-rose-200 bg-rose-50 text-rose-600 shadow-xs"
                }`}
              >
                {quiz.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : `0${idx + 1}`}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {quiz.category.replace(/_/g, " ")}
                  </span>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    +{quiz.expReward} EXP
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Tingkat: {quiz.difficulty}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{quiz.title}</h4>
                <p className="max-w-xl text-xs leading-relaxed text-slate-600">
                  {quiz.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectQuiz(quiz.id)}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 self-end rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700 sm:self-center"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              {quiz.isCompleted ? "Mainkan Ulang" : "Mulai Latihan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
