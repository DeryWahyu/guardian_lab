"use client";

import { Flame, LogOut, Menu, ShieldAlert, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { UserSession } from "@/lib/auth/session";
import { ADMIN_ROUTES, AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

export interface HeaderProps {
  initialUser?: UserSession | null;
}

export function Header({ initialUser }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(initialUser ?? null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();

  // If initialUser was not provided (e.g. client navigation), fetch from /api/auth/me
  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser);
      return;
    }

    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // Silently ignore network failures on auth check
      });

    return () => {
      isMounted = false;
    };
  }, [initialUser]);

  const handleLogout = () => {
    startLogout(async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        if (res.ok) {
          toast.success("Berhasil keluar dari akun.");
          setUser(null);
          router.refresh();
          window.location.href = PUBLIC_ROUTES.home;
        } else {
          toast.error("Gagal logout. Silakan coba kembali.");
        }
      } catch {
        toast.error("Terjadi gangguan koneksi.");
      }
    });
  };

  const navLinks = [
    { label: "Gateway", href: PUBLIC_ROUTES.home },
    { label: "Sandbox", href: PUBLIC_ROUTES.sandboxWeb },
    { label: "APK X-Ray", href: PUBLIC_ROUTES.homeWithTab("apk") },
    { label: "Share Card", href: PUBLIC_ROUTES.act },
    { label: "Academy", href: PROTECTED_ROUTES.academy },
    { label: "Community", href: PROTECTED_ROUTES.community },
    { label: "History", href: PROTECTED_ROUTES.history },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/60 bg-[#FAF9F6]/85 shadow-xs backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href={PUBLIC_ROUTES.home}
          className="group inline-flex cursor-pointer items-center gap-2.5 rounded-xl p-1 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
        >
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200 transition-transform group-hover:scale-105">
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

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-stone-200/40 bg-stone-100/60 p-1.5 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === PUBLIC_ROUTES.home
                ? pathname === PUBLIC_ROUTES.home
                : pathname.startsWith(link.href.split("?")[0]);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white font-bold text-rose-600 shadow-xs"
                    : "text-stone-600 hover:bg-white/50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Action Area */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Daily Streak Flame */}
              <div
                className="inline-flex items-center gap-1 rounded-full border border-orange-200/60 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 shadow-xs"
                title="Daily Streak Aktivitas"
              >
                <Flame className="size-3.5 animate-pulse fill-orange-500 text-orange-500" />
                <span>{user.streakDays || 1}d</span>
              </div>

              {/* EXP Gamification Badge */}
              <div
                className="inline-flex items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 shadow-xs"
                title="Total EXP Guardian"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                <span>{user.exp || 0} EXP</span>
              </div>

              {/* Admin Badge */}
              {user.role === "ADMIN" && (
                <Link
                  href={ADMIN_ROUTES.dashboard}
                  className="cursor-pointer rounded-lg bg-purple-100 px-2 py-1 text-[10px] font-extrabold tracking-wider text-purple-700 uppercase transition-colors hover:bg-purple-200"
                >
                  Admin
                </Link>
              )}

              {/* User Avatar Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white py-1 pr-3 pl-2 shadow-xs">
                <div className="flex size-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate text-xs font-semibold text-slate-800">
                  {user.name}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer rounded-full p-2 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                title="Keluar"
                aria-label="Logout"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={AUTH_ROUTES.login}
                className="cursor-pointer rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-rose-200/60 transition-all hover:bg-rose-700 active:scale-98"
              >
                Masuk
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="cursor-pointer rounded-xl p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          aria-label="Buka Menu"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="space-y-3 border-t border-stone-200 bg-white/95 px-4 py-6 shadow-lg backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{user.name}</span>
                      <span className="text-xs text-stone-500">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">
                      🔥 {user.streakDays || 1}d
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                      ⭐ {user.exp || 0}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-stone-100 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut className="size-4" /> Keluar dari Akun
                </button>
              </div>
            ) : (
              <Link
                href={AUTH_ROUTES.login}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full cursor-pointer rounded-full bg-rose-600 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-rose-200"
              >
                Masuk ke Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
