"use client";

import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PROTECTED_ROUTES } from "@/lib/routes";

interface CommunityReplayDetail {
  id: string;
  title: string;
  description: string;
  scamType: string;
}

export function InvestigationGamePlayer({ replayId }: { replayId: string }) {
  const [replay, setReplay] = useState<CommunityReplayDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [_selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bonusEarned, setBonusEarned] = useState(0);

  useEffect(() => {
    async function loadReplay() {
      try {
        const res = await fetch(`/api/community/replays/${replayId}`);
        if (res.ok) {
          const data = await res.json();
          setReplay(data);
        }
      } catch (err) {
        console.error("Error loading replay detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReplay();
  }, [replayId]);

  if (loading) {
    return (
      <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
        Menyiapkan skenario investigasi siber...
      </div>
    );
  }

  if (!replay) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-lg font-bold text-slate-900">Studi Kasus Tidak Ditemukan</h3>
        <Link
          href={PROTECTED_ROUTES.community}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold text-white"
        >
          &larr; Kembali ke Komunitas
        </Link>
      </div>
    );
  }

  const handleAnswerStep = async (guess: string, isCorrect: boolean) => {
    setSelectedGuess(guess);
    if (isCorrect) {
      setFeedback("Tepat sekali! Analisis forensikmu membuka bukti tahap selanjutnya.");
      setTimeout(async () => {
        if (currentStep < 3) {
          setCurrentStep((prev) => prev + 1);
          setSelectedGuess(null);
          setFeedback(null);
        } else {
          // Finish and award bonus EXP
          try {
            const res = await fetch(`/api/community/replays/${replayId}/attempt`, {
              method: "POST",
            });
            if (res.ok) {
              const data = await res.json();
              setBonusEarned(data.bonusExp || 75);
            }
          } catch (err) {
            console.error("Error recording attempt:", err);
          }
          setIsCompleted(true);
        }
      }, 1200);
    } else {
      setFeedback("Kurang tepat. Cermati indikator ancaman pada bukti teks!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href={PROTECTED_ROUTES.community}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Komunitas
        </Link>
        <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
          <Sparkles className="h-3.5 w-3.5" /> Bonus +75 EXP untuk Penyidik
        </span>
      </div>

      {/* Main Game Shell */}
      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
        {/* Scenario Header */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-rose-600 uppercase">
              {replay.scamType}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" /> Data PII Tersanitasi
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{replay.title}</h2>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs leading-relaxed text-slate-600 sm:text-sm">
            "{replay.description}"
          </p>
        </div>

        {isCompleted ? (
          /* Victory Completion Card */
          <div className="mx-auto max-w-md space-y-4 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 text-amber-500 shadow-lg">
              <Sparkles className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Investigasi Kasus Berhasil Dipecahkan!
            </h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Hebat! Kamu berhasil membongkar taktik rekayasa sosial dan infrastruktur penyerang.
              EXP telah ditambahkan ke profilmu.
            </p>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-lg font-black text-rose-700">
              +{bonusEarned} EXP Diberikan 🏅
            </div>
            <Link
              href={PROTECTED_ROUTES.community}
              className="inline-block w-full cursor-pointer rounded-full bg-rose-600 py-3 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
            >
              Cari Kasus Lain di Komunitas &rarr;
            </Link>
          </div>
        ) : (
          /* Step by Step Investigation */
          <div className="space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className={currentStep >= 1 ? "text-rose-600" : ""}>
                Tahap 1: Inspeksi Bukti
              </span>
              <span>&rarr;</span>
              <span className={currentStep >= 2 ? "text-rose-600" : ""}>Tahap 2: Lacak Modus</span>
              <span>&rarr;</span>
              <span className={currentStep >= 3 ? "text-rose-600" : ""}>Tahap 3: Hancurkan C2</span>
            </div>

            {/* Current Challenge */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 sm:text-base">
                {currentStep === 1 &&
                  "Tahap 1: Apa indikator utama kecurigaan pada pesan penipu di atas?"}
                {currentStep === 2 &&
                  "Tahap 2: Trik psikologis apa yang dimanfaatkan pelaku untuk menipu korban?"}
                {currentStep === 3 &&
                  "Tahap 3: Tindakan forensik terbaik untuk memutus rantai serangan ini?"}
              </h4>

              <div className="space-y-2">
                {currentStep === 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAnswerStep("A", true)}
                      className="w-full cursor-pointer rounded-2xl border border-slate-200 p-3.5 text-left text-xs text-slate-800 transition-all hover:border-rose-300"
                    >
                      A. Domain tidak resmi menggunakan TLD berisiko tinggi / file installer
                      ekstensi .apk palsu
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerStep("B", false)}
                      className="w-full cursor-pointer rounded-2xl border border-slate-200 p-3.5 text-left text-xs text-slate-800 transition-all hover:border-rose-300"
                    >
                      B. Tidak ada yang mencurigakan, ini pesan resmi dari kurir
                    </button>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAnswerStep("A", true)}
                      className="w-full cursor-pointer rounded-2xl border border-slate-200 p-3.5 text-left text-xs text-slate-800 transition-all hover:border-rose-300"
                    >
                      A. Menimbulkan rasa panik (urgensi tagihan) atau rasa penasaran (undangan
                      nikah/paket)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerStep("B", false)}
                      className="w-full cursor-pointer rounded-2xl border border-slate-200 p-3.5 text-left text-xs text-slate-800 transition-all hover:border-rose-300"
                    >
                      B. Penyerang menggunakan enkripsi tingkat tinggi yang tidak bisa dihindari
                    </button>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAnswerStep("A", true)}
                      className="w-full cursor-pointer rounded-2xl border border-slate-200 p-3.5 text-left text-xs text-slate-800 transition-all hover:border-rose-300"
                    >
                      A. Buat Guardian Share Card untuk peringatan keluarga & laporkan token C2
                      Telegram
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerStep("B", false)}
                      className="w-full cursor-pointer rounded-2xl border border-slate-200 p-3.5 text-left text-xs text-slate-800 transition-all hover:border-rose-300"
                    >
                      B. Membalas chat penipu dengan kata-kata kasar
                    </button>
                  </>
                )}
              </div>

              {feedback && (
                <div
                  className={`rounded-2xl p-3 text-xs font-semibold ${
                    feedback.includes("Tepat")
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {feedback}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
