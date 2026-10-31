import { Lock, ShieldCheck } from "lucide-react";

export interface BadgeItem {
  id: string;
  code: string;
  title: string;
  description: string;
  expReward: number;
  isUnlocked?: boolean;
}

export function BadgesGrid({ badges }: { badges: BadgeItem[] }) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-rose-600 uppercase">
            Koleksi Lencana
          </span>
          <h3 className="text-lg font-bold text-slate-900">Penghargaan & Prestasi Digital</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          {badges.filter((b) => b.isUnlocked).length}/{badges.length} Terbuka
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {badges.map((badge) => (
          <div
            key={badge.code}
            className={`flex flex-col items-center justify-between space-y-2 rounded-2xl border p-3 text-center transition-all ${
              badge.isUnlocked
                ? "border-rose-200 bg-rose-50/50 shadow-2xs"
                : "border-slate-200 bg-slate-50/70 opacity-60"
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                badge.isUnlocked
                  ? "border border-rose-100 bg-white text-rose-600 shadow-xs"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {badge.isUnlocked ? (
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              ) : (
                <Lock className="h-5 w-5 text-slate-400" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="line-clamp-1 text-[11px] font-bold text-slate-900">{badge.title}</div>
              <div className="text-[10px] font-semibold text-amber-600">+{badge.expReward} XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
