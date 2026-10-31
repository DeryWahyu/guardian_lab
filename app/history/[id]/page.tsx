import { Suspense } from "react";
import { HistoryDetailView } from "@/components/history/history-detail-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export const instant = false;

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

async function HistoryDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HistoryDetailView recordId={id} />;
}

export default function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <Suspense
          fallback={
            <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
              Memuat detail laporan forensik...
            </div>
          }
        >
          <HistoryDetailContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
