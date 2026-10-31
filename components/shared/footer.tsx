import { ExternalLink, Heart, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ADMIN_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/80 bg-white text-stone-600 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Column 1: Brand & Mission (Spans 2 columns on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href={PUBLIC_ROUTES.home}
              className="group inline-flex cursor-pointer items-center gap-2.5"
            >
              <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200 transition-transform group-hover:scale-105">
                <ShieldAlert className="size-4.5" />
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

            <p className="max-w-sm text-sm leading-relaxed text-stone-500">
              Platform Sandbox Anti-Phishing & Bedah APK yang mengintegrasikan tiga pilar:{" "}
              <strong className="font-semibold text-slate-800">Recognize</strong>,{" "}
              <strong className="font-semibold text-slate-800">Protect</strong>, dan{" "}
              <strong className="font-semibold text-slate-800">Act</strong>. Melindungi pengguna
              dari jebakan cybercrime tanpa kompromi data pribadi.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
              <Shield className="size-3.5 text-rose-600" />
              <span>MIT-Week 2026: Guardians of the Digital Space</span>
            </div>
          </div>

          {/* Column 2: Fitur Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Fitur Utama
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={PUBLIC_ROUTES.home}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  Gateway Deteksi URL
                </Link>
              </li>
              <li>
                <Link
                  href={PUBLIC_ROUTES.sandboxWeb}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  Browser Web Sandbox
                </Link>
              </li>
              <li>
                <Link
                  href={PUBLIC_ROUTES.homeWithTab("apk")}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  APK X-Ray Engine
                </Link>
              </li>
              <li>
                <Link
                  href={PUBLIC_ROUTES.act}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  Guardian Share Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Edukasi & Komunitas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Edukasi & Gamifikasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={PROTECTED_ROUTES.academy}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  Guardian Academy
                </Link>
              </li>
              <li>
                <Link
                  href={PROTECTED_ROUTES.community}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  Community Forensic Replay
                </Link>
              </li>
              <li>
                <Link
                  href={PROTECTED_ROUTES.history}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  Riwayat Investigasi
                </Link>
              </li>
              <li>
                <Link
                  href={ADMIN_ROUTES.dashboard}
                  className="cursor-pointer transition-colors hover:text-rose-600"
                >
                  Dashboard Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Keamanan & Privasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Keamanan & Privasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-stone-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Zero Real PII Scrubber</span>
              </li>
              <li className="flex items-center gap-1.5 text-stone-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Auto-Destroy Sandbox 180s</span>
              </li>
              <li className="flex items-center gap-1.5 text-stone-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Dataset OJK & IASC 2026</span>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-1 text-stone-500 transition-colors hover:text-slate-800"
                >
                  <span>Open Source Repository</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200/60 pt-8 text-xs text-stone-500 sm:flex-row">
          <p>
            &copy; 2026 Guardian Lab. Dilindungi oleh semangat komunitas keamanan digital Indonesia.
          </p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="size-3.5 fill-rose-500 text-rose-500" />
            <span>untuk ekosistem siber yang lebih aman.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
