"use client";

import { Plus, Trash2, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

interface AdminQuizItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  expReward: number;
  questions?: unknown[];
}

export function QuizCmsView() {
  const [quizzes, setQuizzes] = useState<AdminQuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("SPOT_THE_PHISH");
  const [difficulty, setDifficulty] = useState("EASY");
  const [expReward, setExpReward] = useState("50");

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/quizzes");
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (err) {
      console.error("Error loading admin quizzes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          expReward: Number(expReward),
          questions: [
            {
              questionText: `Identifikasi modus penipuan pada: ${title}`,
              questionType: "MULTIPLE_CHOICE",
              options: [
                { id: "opt-1", text: "Tautan palsu phish/quishing", isCorrect: true },
                { id: "opt-2", text: "Aplikasi resmi terverifikasi", isCorrect: false },
              ],
              correctAnswers: ["opt-1"],
              explanation: "Tautan tersebut mengarahkan ke server palsu tanpa verifikasi domain.",
            },
          ],
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        fetchQuizzes();
      }
    } catch (err) {
      console.error("Error creating quiz:", err);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Hapus modul kuis ini dari bank soal?")) return;
    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchQuizzes();
      }
    } catch (err) {
      console.error("Error deleting quiz:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
            Admin Panel
          </span>
          <h2 className="mt-0.5 text-2xl font-black text-slate-900">
            CMS Bank Soal Guardian Academy
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" /> Tambah Kuis Baru
        </button>
      </div>

      {/* Quiz Table / Cards */}
      {loading ? (
        <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
      ) : quizzes.length > 0 ? (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 uppercase">
                    {quiz.category}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    +{quiz.expReward} EXP
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {quiz.questions?.length || 0} Pertanyaan
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{quiz.title}</h4>
                <p className="max-w-xl text-xs text-slate-500">{quiz.description}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="cursor-pointer rounded-xl border border-transparent p-2 text-rose-600 transition-colors hover:border-rose-200 hover:bg-rose-50"
                  title="Hapus Kuis"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Belum ada modul kuis di database.
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Tambah Kuis Baru</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3">
              <div>
                <label
                  htmlFor="quiz-title"
                  className="mb-1 block text-xs font-semibold text-slate-700"
                >
                  Judul Kuis <span className="text-rose-500">*</span>
                </label>
                <input
                  id="quiz-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Deteksi Link Phishing BNI"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label
                  htmlFor="quiz-desc"
                  className="mb-1 block text-xs font-semibold text-slate-700"
                >
                  Deskripsi Edukasi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="quiz-desc"
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan latar belakang studi kasus..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    htmlFor="quiz-cat"
                    className="mb-1 block text-xs font-semibold text-slate-700"
                  >
                    Kategori
                  </label>
                  <select
                    id="quiz-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-800"
                  >
                    <option value="SPOT_THE_PHISH">Spot the Phish</option>
                    <option value="SOCIAL_ENGINEERING">Social Engineering</option>
                    <option value="DANGEROUS_PERMISSIONS">Dangerous Permissions</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quiz-diff"
                    className="mb-1 block text-xs font-semibold text-slate-700"
                  >
                    Kesulitan
                  </label>
                  <select
                    id="quiz-diff"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-800"
                  >
                    <option value="EASY">Mudah</option>
                    <option value="MEDIUM">Sedang</option>
                    <option value="HARD">Sulit</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quiz-exp"
                    className="mb-1 block text-xs font-semibold text-slate-700"
                  >
                    Reward EXP
                  </label>
                  <input
                    id="quiz-exp"
                    type="number"
                    value={expReward}
                    onChange={(e) => setExpReward(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-full px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700"
                >
                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
