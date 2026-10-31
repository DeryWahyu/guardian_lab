"use client";

import { Plus, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Mascot } from "@/components/shared/mascot";
import { CommunityCard, type CommunityCaseItem } from "./community-card";
import { LeaderboardPodium, type LeaderboardUser } from "./leaderboard-podium";

export function CommunityPageView() {
  const [replays, setReplays] = useState<CommunityCaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [scamType, setScamType] = useState("Phishing Perbankan");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const fetchReplays = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community/replays");
      if (res.ok) {
        const data = await res.json();
        setReplays(data);
      }
    } catch (err) {
      console.error("Error loading replays:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReplays();
  }, [fetchReplays]);

  const topGuardians: LeaderboardUser[] = [
    { rank: 1, name: "Master Admin Guardian", role: "ADMIN", exp: 1500, streakDays: 45 },
    { rank: 2, name: "Budi Santoso (Cyber Sentinel)", role: "USER", exp: 580, streakDays: 14 },
    { rank: 3, name: "Rian Security Enthusiast", role: "USER", exp: 420, streakDays: 9 },
    { rank: 4, name: "Siti Rahmawati", role: "USER", exp: 310, streakDays: 6 },
  ];

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          scamType,
          description,
        }),
      });

      if (res.ok) {
        setSubmissionSuccess(true);
        setTimeout(() => {
          setSubmissionSuccess(false);
          setIsSubmitModalOpen(false);
          setTitle("");
          setDescription("");
        }, 1800);
      }
    } catch (err) {
      console.error("Error submitting community case:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Action */}
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 md:flex-row">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
            Community Cyber Shield
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Pusat Studi Kasus Investigasi Nyata
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Setiap temuan link penipuan atau file APK berbahaya yang kamu temukan dapat disumbangkan
            ke sini. Sistem secara otomatis menyaring seluruh data pribadi (Zero PII) agar komunitas
            dapat belajar memecahkan investigasinya secara interaktif.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" /> Sumbangkan Temuan Kasus
        </button>
      </div>

      {/* Grid: Cases on Left, Leaderboard on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cases Feed */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Studi Kasus Forensik Terverifikasi
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {replays.length} Kasus Aktif
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={`skel-rep-${i}`}
                  className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          ) : replays.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {replays.map((item) => (
                <CommunityCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <Mascot size={100} showPills={false} className="mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Belum Ada Kasus Komunitas</h4>
              <p className="text-xs text-slate-500">
                Jadilah analis pertama yang menyumbangkan studi kasus ke komunitas!
              </p>
            </div>
          )}
        </div>

        {/* Hall of Fame Leaderboard */}
        <div className="lg:col-span-1">
          <LeaderboardPodium users={topGuardians} />
        </div>
      </div>

      {/* Case Submission Modal */}
      {isSubmitModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Sumbangkan Temuan Kasus ke Komunitas
              </h3>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="cursor-pointer rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submissionSuccess ? (
              <div className="space-y-2 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-slate-900">Kasus Berhasil Dikirimkan!</h4>
                <p className="text-xs text-slate-500">
                  Data telah disanitasi dari PII dan kini masuk antrean moderasi admin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitCase} className="space-y-3">
                <div>
                  <label
                    htmlFor="case-title"
                    className="mb-1 block text-xs font-semibold text-slate-700"
                  >
                    Judul Modus Ancaman <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="case-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Link Phishing Tagihan Listrik PLN 2026"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-scam-type"
                    className="mb-1 block text-xs font-semibold text-slate-700"
                  >
                    Kategori Kejahatan
                  </label>
                  <select
                    id="case-scam-type"
                    value={scamType}
                    onChange={(e) => setScamType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-800"
                  >
                    <option value="Phishing Perbankan">Phishing Perbankan</option>
                    <option value="Malware Kurir APK">Malware Kurir APK</option>
                    <option value="Quishing QRIS">Quishing QRIS</option>
                    <option value="Modus Undangan Nikah">Modus Undangan Nikah</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="case-desc"
                    className="mb-1 block text-xs font-semibold text-slate-700"
                  >
                    Kronologi & Bukti Teks <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="case-desc"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ceritakan bagaimana penipu menghubungi dan tautan/file yang dikirimkan..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-rose-400"
                  />
                  <span className="mt-1 block text-[10px] text-slate-400">
                    🛡️ Sistem otomatis menghapus nomor HP, NIK, dan data pribadi sebelum
                    diterbitkan.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="cursor-pointer rounded-full px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyaring PII..." : "Kirim Kasus"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
