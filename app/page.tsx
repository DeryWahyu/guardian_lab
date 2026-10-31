import { Suspense } from "react";
import { LandingPageView } from "@/components/landing/landing-page-view";
import { getCurrentUser } from "@/lib/auth/session";

async function LandingContent() {
  const user = await getCurrentUser();
  return <LandingPageView initialUser={user} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<LandingPageView initialUser={null} />}>
      <LandingContent />
    </Suspense>
  );
}
