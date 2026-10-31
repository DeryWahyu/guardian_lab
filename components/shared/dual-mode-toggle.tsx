"use client";

import { Sparkles, Terminal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";

export interface DualModeToggleProps {
  mode?: "human" | "geek";
  onChange?: (mode: "human" | "geek") => void;
  className?: string;
}

function DualModeToggleInner({ mode: propMode, onChange, className }: DualModeToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentMode = propMode ?? (searchParams.get("mode") === "geek" ? "geek" : "human");

  const handleToggle = useCallback(
    (newMode: "human" | "geek") => {
      if (onChange) {
        onChange(newMode);
        return;
      }

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (newMode === "geek") {
          params.set("mode", "geek");
        } else {
          params.delete("mode");
        }
        const query = params.toString();
        router.replace(`${pathname}${query ? `?${query}` : ""}`, {
          scroll: false,
        });
      });
    },
    [onChange, pathname, router, searchParams],
  );

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-1 transition-all duration-300",
        currentMode === "geek"
          ? "border-slate-800 bg-slate-950/80 shadow-lg shadow-cyan-950/30"
          : "border-stone-200/80 bg-stone-100/90 shadow-inner",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => handleToggle("human")}
        aria-pressed={currentMode === "human"}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm",
          currentMode === "human"
            ? "bg-white text-rose-600 shadow-xs shadow-stone-200"
            : currentMode === "geek"
              ? "text-slate-400 hover:text-slate-200"
              : "text-stone-500 hover:text-stone-800",
        )}
      >
        <Sparkles className="size-3.5 shrink-0 text-rose-500 sm:size-4" />
        <span>Mode Bahasa Manusia</span>
      </button>

      <button
        type="button"
        onClick={() => handleToggle("geek")}
        aria-pressed={currentMode === "geek"}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all duration-200 sm:text-sm",
          currentMode === "geek"
            ? "border border-cyan-500/40 bg-[#0B0F17] text-cyan-400 shadow-xs shadow-cyan-900/50"
            : "text-stone-500 hover:text-stone-800",
        )}
      >
        <Terminal className="size-3.5 shrink-0 text-cyan-400 sm:size-4" />
        <span>Mode Teknis (Geek View)</span>
      </button>
    </div>
  );
}

export function DualModeToggle(props: DualModeToggleProps) {
  return (
    <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded-full bg-stone-200/70" />}>
      <DualModeToggleInner {...props} />
    </Suspense>
  );
}
