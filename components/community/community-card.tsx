import { Play, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";

export interface CommunityCaseItem {
  id: string;
  title: string;
  description: string;
  scamType: string;
  sanitizedData?: Record<string, unknown>;
  user?: {
    name: string;
    role: string;
  };
  _count?: {
    attempts: number;
  };
}

export function CommunityCard({ item }: { item: CommunityCaseItem }) {
  return (
    <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-rose-200 hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-rose-600 uppercase">
            {item.scamType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" /> PII Terverifikasi Bersih
          </span>
        </div>

        <div>
          <h4 className="line-clamp-1 text-base font-bold text-slate-900">{item.title}</h4>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {item.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <UserCheck className="h-3.5 w-3.5 text-slate-400" />
          <span>Oleh {item.user?.name || "Guardian Analyst"}</span>
        </div>

        <Link
          href={PROTECTED_ROUTES.communityReplay(item.id)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-700"
        >
          <Play className="h-3 w-3 fill-white" /> Investigasi &rarr;
        </Link>
      </div>
    </div>
  );
}
