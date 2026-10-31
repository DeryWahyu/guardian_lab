import { Flame, Medal, Trophy } from "lucide-react";

export interface LeaderboardUser {
  rank: number;
  name: string;
  role: string;
  exp: number;
  streakDays: number;
}

export function LeaderboardPodium({ users }: { users: LeaderboardUser[] }) {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 font-bold text-amber-500">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
              Papan Peringkat Komunitas
            </span>
            <h3 className="text-lg font-bold text-slate-900">Hall of Fame Guardians</h3>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">Musim MIT-Week 2026</span>
      </div>

      <div className="space-y-3">
        {users.map((u) => {
          const isGold = u.rank === 1;
          const isSilver = u.rank === 2;
          const isBronze = u.rank === 3;

          let rankBadgeBg = "bg-slate-100 text-slate-600";
          if (isGold) rankBadgeBg = "bg-amber-100 text-amber-700 border border-amber-300";
          if (isSilver) rankBadgeBg = "bg-slate-200 text-slate-700 border border-slate-300";
          if (isBronze) rankBadgeBg = "bg-orange-100 text-orange-700 border border-orange-300";

          return (
            <div
              key={u.name}
              className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                isGold
                  ? "border-amber-200 bg-amber-50/40 shadow-2xs"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${rankBadgeBg}`}
                >
                  {isGold ? <Medal className="h-4 w-4" /> : `#${u.rank}`}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 sm:text-sm">
                    {u.name}
                    {isGold && (
                      <span className="py-0.2 rounded-full bg-amber-100 px-2 text-[10px] font-bold text-amber-800">
                        Top Sentinel
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{u.role}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 font-semibold text-amber-600">
                      <Flame className="h-3 w-3 fill-amber-500" /> {u.streakDays} hari streak
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-800">
                {u.exp} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
