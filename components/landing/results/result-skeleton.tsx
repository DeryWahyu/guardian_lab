"use client";

import { cn } from "@/lib/utils";

export function ResultSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-busy="true"
      className={cn(
        "mx-auto w-full max-w-4xl animate-pulse space-y-6 rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-xl shadow-stone-200/30 sm:p-8",
        className,
      )}
    >
      {/* Top Bar Skeleton */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded-full bg-stone-200" />
          <div className="h-6 w-56 rounded-lg bg-stone-200" />
        </div>
        <div className="h-9 w-64 rounded-full bg-stone-200" />
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Column: Gauge Skeleton */}
        <div className="flex flex-col items-center rounded-3xl border border-stone-200/60 bg-stone-50/70 p-6 lg:col-span-2">
          <div className="mb-4 h-4 w-28 rounded-full bg-stone-200" />
          <div className="mb-4 flex size-40 items-center justify-center rounded-full border-8 border-stone-200 bg-stone-100">
            <div className="h-8 w-16 rounded-lg bg-stone-200" />
          </div>
          <div className="mb-4 h-6 w-32 rounded-full bg-stone-200" />
          <div className="h-14 w-full rounded-2xl bg-stone-200/60" />
        </div>

        {/* Right Column: Kedok Card Skeleton */}
        <div className="space-y-4 rounded-3xl border border-stone-200/60 bg-stone-50/70 p-6 lg:col-span-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-stone-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 rounded-full bg-stone-200" />
              <div className="h-5 w-48 rounded-lg bg-stone-200" />
            </div>
          </div>
          <div className="h-20 w-full rounded-2xl bg-stone-200/60" />
          <div className="space-y-2">
            <div className="h-3 w-36 rounded-full bg-stone-200" />
            <div className="h-10 w-full rounded-xl bg-stone-200/60" />
            <div className="h-10 w-full rounded-xl bg-stone-200/60" />
          </div>
        </div>
      </div>

      {/* Action Plan Skeletons */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-32 rounded-3xl border border-stone-200/60 bg-stone-100" />
        <div className="h-32 rounded-3xl border border-stone-200/60 bg-stone-100" />
      </div>

      {/* Button Actions Skeleton */}
      <div className="flex flex-col items-center justify-end gap-3 pt-2 sm:flex-row">
        <div className="h-10 w-44 rounded-full bg-stone-200" />
        <div className="h-10 w-48 rounded-full bg-stone-200" />
      </div>
    </div>
  );
}
