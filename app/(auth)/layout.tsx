import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { PUBLIC_ROUTES } from "@/lib/routes";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[#FAF9F6] text-slate-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Soft warm pastel glow backdrops */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      {/* Auth Navigation Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href={PUBLIC_ROUTES.home}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-lg p-1 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
        >
          <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200 transition-transform group-hover:scale-105">
            <ShieldAlert className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg leading-tight font-extrabold tracking-tight text-slate-900">
              Guardian<span className="text-rose-600">Lab</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-stone-500">
              Sandbox & Threat X-Ray
            </span>
          </div>
        </Link>
      </header>

      {/* Centered Auth Card Container */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 py-6 text-center text-xs text-stone-500">
        <p>
          &copy; 2026 Guardian Lab &bull; Empowering Digital Guardians Toward a Safer Cyber
          Ecosystem.
        </p>
      </footer>
    </div>
  );
}
