"use client";

import { Check, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface CommunityReviewItem {
  id: string;
  title: string;
  description: string;
  scamType: string;
  user?: {
    name: string;
    email: string;
  };
}

export function CommunityReviewsView() {
  const [reviews, setReviews] = useState<CommunityReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/community-reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error loading community reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/community-reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes:
            status === "APPROVED"
              ? "Disetujui untuk konsumsi edukasi komunitas."
              : "Ditolak: data kurang lengkap.",
        }),
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error("Error processing review:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
          Admin Moderasi
        </span>
        <h2 className="mt-0.5 text-2xl font-black text-slate-900">
          Antrean Moderasi Kasus Komunitas
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Tinjau keaslian temuan dan pastikan data pribadi korban telah tersaring 100% sebelum
          dipublikasikan ke Community Forensic Replay.
        </p>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 uppercase">
                    {rev.scamType}
                  </span>
                  <span className="text-xs text-slate-400">
                    Oleh: {rev.user?.name} ({rev.user?.email})
                  </span>
                </div>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                  Menunggu Persetujuan
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{rev.title}</h4>
                <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs text-slate-600">
                  "{rev.description}"
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => handleReviewAction(rev.id, "REJECTED")}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <X className="h-3.5 w-3.5 text-rose-500" /> Tolak Kasus
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction(rev.id, "APPROVED")}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> Setujui & Terbitkan
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Semua antrean kasus komunitas telah selesai ditinjau. Bersih!
        </div>
      )}
    </div>
  );
}
