"use client";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { getSafeRedirectUrl, loginSchema } from "@/lib/validations/auth";
import { AuthHeader } from "../../_components/auth-header";
import { GuardianSecurityBadge } from "../../_components/guardian-security-badge";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirectUrl(searchParams.get("redirect"), PUBLIC_ROUTES.home);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "email") fieldErrors.email = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || data.message || "Gagal masuk. Periksa email dan password.");
          return;
        }

        toast.success("Berhasil masuk! Selamat datang kembali di Guardian Lab.");
        window.location.href = redirectTarget;
      } catch (_error) {
        toast.error("Terjadi gangguan jaringan. Silakan coba kembali.");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-stone-200/70 bg-white/90 p-8 shadow-xl shadow-stone-200/40 backdrop-blur-md sm:p-10">
      <AuthHeader
        badgeText="Akses Terproteksi"
        title="Masuk ke Guardian Lab,"
        highlightText="jaga ruang digitalmu."
        subtitle="Analisis phishing, bedah APK terisolasi, dan bangun perlindungan bersama."
      />

      <GuardianSecurityBadge />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-semibold text-slate-700">
            Email Akun <span className="font-semibold text-rose-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            disabled={isPending}
            className={`h-11 w-full rounded-xl border bg-stone-50/60 px-3.5 text-sm text-slate-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none ${
              errors.email ? "border-rose-500 ring-2 ring-rose-200" : "border-stone-200"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
              Password <span className="font-semibold text-rose-600">*</span>
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter aman"
              disabled={isPending}
              className={`h-11 w-full rounded-xl border bg-stone-50/60 px-3.5 pr-10 text-sm text-slate-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none ${
                errors.password ? "border-rose-500 ring-2 ring-rose-200" : "border-stone-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-stone-400 hover:text-stone-600"
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 text-sm font-semibold text-white shadow-md shadow-rose-200 transition-all hover:bg-rose-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Memproses Masuk...</span>
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              <span>Masuk Sekarang</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-stone-100 pt-5 text-center text-xs text-stone-600">
        Belum memiliki akun Guardian?{" "}
        <Link
          href={`${AUTH_ROUTES.register}?redirect=${encodeURIComponent(redirectTarget)}`}
          className="cursor-pointer font-bold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
