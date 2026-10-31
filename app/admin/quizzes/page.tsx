import { Suspense } from "react";
import { QuizCmsView } from "@/components/admin/quiz-cms-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function AdminQuizzesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <Suspense
          fallback={
            <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
              Memuat CMS kuis...
            </div>
          }
        >
          <QuizCmsView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
