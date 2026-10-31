import { Suspense } from "react";
import { InvestigationGamePlayer } from "@/components/community/investigation-game-player";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export const instant = false;

interface CommunityReplayPageProps {
  params: Promise<{ replayId: string }>;
}

async function ReplayContent({ params }: { params: Promise<{ replayId: string }> }) {
  const { replayId } = await params;
  return <InvestigationGamePlayer replayId={replayId} />;
}

export default function CommunityReplayPage({ params }: CommunityReplayPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <Suspense
          fallback={
            <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
              Menyiapkan arena penyidikan siber...
            </div>
          }
        >
          <ReplayContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
