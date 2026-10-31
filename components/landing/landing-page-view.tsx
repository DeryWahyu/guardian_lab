"use client";

import { useRef, useState } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import type { UserSession } from "@/lib/auth/session";
import type { ThreatAnalysisResult } from "@/types/analysis";
import { AnalysisGateway } from "./analysis-gateway";
import { CaseStudiesSection } from "./case-studies-section";
import { CtaBanner } from "./cta-banner";
import { HeroSection } from "./hero";
import { MilestoneFlowSection } from "./milestone-flow";
import { PillarsSection } from "./pillars-section";
import { ResultPresenter } from "./results/result-presenter";
import { SocialProofSection } from "./social-proof-section";

export interface LandingPageViewProps {
  initialUser?: UserSession | null;
}

export function LandingPageView({ initialUser }: LandingPageViewProps) {
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    // Smooth scroll to results area
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleAnalysisSuccess = (result: ThreatAnalysisResult) => {
    setIsAnalyzing(false);
    setAnalysisResult(result);
    setAnalysisError(null);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleAnalysisError = (err: string) => {
    setIsAnalyzing(false);
    setAnalysisError(err);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Global Sticky Header */}
      <Header initialUser={initialUser} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Soft Ambient Background Orbs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-rose-100/40 blur-3xl" />
          <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-amber-100/30 blur-3xl" />
          <div className="absolute bottom-10 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-100/30 blur-3xl" />
        </div>

        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. 3-Tab Analysis Gateway */}
        <div className="mx-auto -mt-4 mb-12 max-w-7xl px-4 sm:-mt-6 sm:px-6 lg:px-8">
          <AnalysisGateway
            currentUser={initialUser}
            onAnalysisStart={handleAnalysisStart}
            onAnalysisSuccess={handleAnalysisSuccess}
            onAnalysisError={handleAnalysisError}
          />
        </div>

        {/* 3. Dual-Mode Results Presenter Section (Rendered when loading, error, or result exists) */}
        {(isAnalyzing || analysisResult || analysisError) && (
          <div
            ref={resultsRef}
            className="mx-auto my-10 max-w-7xl scroll-mt-24 px-4 sm:my-14 sm:px-6 lg:px-8"
          >
            <ResultPresenter
              result={analysisResult}
              isLoading={isAnalyzing}
              error={analysisError}
              onRetry={handleAnalysisStart}
            />
          </div>
        )}

        {/* 4. 4-Card Highlight Pillars */}
        <PillarsSection />

        {/* 5. 4-Step Interactive Milestone Flow */}
        <MilestoneFlowSection />

        {/* 6. Social Proof & Community Leaderboard */}
        <SocialProofSection />

        {/* 7. Real-World Case Studies */}
        <CaseStudiesSection />

        {/* 8. Bottom CTA Banner */}
        <CtaBanner />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
