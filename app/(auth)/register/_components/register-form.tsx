"use client";

import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { getSafeRedirectUrl, registerFormSchema } from "@/lib/validations/auth";
import { AuthHeader } from "../../_components/auth-header";
import { GuardianSecurityBadge } from "../../_components/guardian-security-badge";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirectUrl(searchParams.get("redirect"), PUBLIC_ROUTES.home);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerFormSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = String(issue.path[0]);
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || data.message || "Pendaftaran gagal. Periksa data Anda.");
          if (response.status === 409) {
            setErrors({
              email: "Email sudah terdaftar. Silakan gunakan email lain atau masuk.",
            });
          }
          return;
        }

        toast.success("Akun berhasil dibuat! Selamat datang di Guardian Lab.");
        window.location.href = redirectTarget;
      } catch (_error) {
        toast.error("Terjadi gangguan jaringan saat mendaftar. Silakan coba kembali.");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-stone-200/70 bg-white/90 p-8 shadow-xl shadow-stone-200/40 backdrop-blur-md sm:p-10">
      <AuthHeader
        badgeText="Langkah Kecil Dimulai"
        title="Daftar Akun,"
        highlightText="jadilah Guardian Tangguh."
        subtitle="Mulai pelacakan ancaman siber, pelajari modus APK, dan dapatkan EXP."
      />

      <GuardianSecurityBadge />

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold text-slate-700">
            Nama Lengkap <span className="font-semibold text-rose-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Pratama"
            disabled={isPending}
            className={`h-11 w-full rounded-xl border bg-stone-50/60 px-3.5 text-sm text-slate-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none ${
              errors.name ? "border-rose-500 ring-2 ring-rose-200" : "border-stone-200"
            }`}
          />
          {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
        </div>

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
          <label htmlFor="password" className="mb-1 block text-xs font-semibold text-slate-700">
            Password <span className="font-semibold text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter huruf & angka"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-xs font-semibold text-slate-700"
          >
            Konfirmasi Password <span className="font-semibold text-rose-600">*</span>
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password di atas"
            disabled={isPending}
            className={`h-11 w-full rounded-xl border bg-stone-50/60 px-3.5 text-sm text-slate-900 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none ${
              errors.confirmPassword ? "border-rose-500 ring-2 ring-rose-200" : "border-stone-200"
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 text-sm font-semibold text-white shadow-md shadow-rose-200 transition-all hover:bg-rose-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Mendaftarkan Akun...</span>
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              <span>Daftar Akun Sekarang</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-stone-100 pt-5 text-center text-xs text-stone-600">
        Sudah terdaftar sebagai Guardian?{" "}
        <Link
          href={`${AUTH_ROUTES.login}?redirect=${encodeURIComponent(redirectTarget)}`}
          className="cursor-pointer font-bold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Masuk di Sini
        </Link>
      </div>
    </div>
  );
}
