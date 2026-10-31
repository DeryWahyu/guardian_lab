import { Award, Flame, Sparkles } from "lucide-react";
import { calculateRank } from "@/lib/academy/gamification";

interface GamificationHeaderProps {
  exp: number;
  streakDays: number;
}

export function GamificationHeader({ exp, streakDays }: GamificationHeaderProps) {
  const rankInfo = calculateRank(exp);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Streak Flame */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-500 shadow-xs">
            <Flame className="h-7 w-7 animate-bounce fill-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xl font-black text-slate-900">
              {streakDays} Hari
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600">
                Streak Api Menyala 🔥
              </span>
            </div>
            <div className="text-xs text-slate-500">Selesaikan minimal 1 kuis harian</div>
          </div>
        </div>

        {/* Rank Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 shadow-xs">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-rose-600 uppercase">
              Pangkat Guardian
            </div>
            <div className="text-base font-extrabold text-slate-900">{rankInfo.rank}</div>
          </div>
        </div>
      </div>

      {/* EXP Progress Bar */}
      <div className="space-y-1.5 border-t border-slate-100 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1 text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Total Pengalaman (EXP): <strong className="text-slate-900">{exp} XP</strong>
          </span>
          <span className="text-slate-400">
            {rankInfo.progressPercent}% Menuju Pangkat Berikutnya
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 transition-all duration-700"
            style={{ width: `${rankInfo.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
