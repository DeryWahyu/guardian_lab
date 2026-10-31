import { ArrowRight, FileCode2, Globe, Share2, Shield } from "lucide-react";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/lib/routes";

export function PillarsSection() {
  const pillars = [
    {
      id: "recognize",
      category: "Pilar 1: Recognize",
      title: "Kenali Tautan Palsu",
      description:
        "Deteksi leksikal typosquatting nama bank, Shannon entropy, serta verifikasi tautan QR phishing secara instan.",
      actionLabel: "Coba Analisis URL",
      href: PUBLIC_ROUTES.homeWithTab("url"),
      Icon: Globe,
      cardBg: "bg-rose-50/70 border-rose-200/70 text-rose-950",
      iconBg: "bg-rose-100 text-rose-600",
      accentText: "text-rose-600",
    },
    {
      id: "protect",
      category: "Pilar 2: Protect",
      title: "Browser Sandbox Terisolasi",
      description:
        "Buka situs mencurigakan di browser cloud Chromium tanpa risiko malware merusak sistem atau mencuri data lokalmu.",
      actionLabel: "Buka Web Sandbox",
      href: PUBLIC_ROUTES.sandboxWeb,
      Icon: Shield,
      cardBg: "bg-amber-50/70 border-amber-200/70 text-amber-950",
      iconBg: "bg-amber-100 text-amber-700",
      accentText: "text-amber-700",
    },
    {
      id: "investigate",
      category: "Pilar 3: Investigate",
      title: "Bedah Kedok APK",
      description:
        "Reverse engineering static file APK kurir/undangan, telusuri izin berbahaya, dan intip token bot Telegram penipu.",
      actionLabel: "Bongkar APK",
      href: PUBLIC_ROUTES.homeWithTab("apk"),
      Icon: FileCode2,
      cardBg: "bg-sky-50/70 border-sky-200/70 text-sky-950",
      iconBg: "bg-sky-100 text-sky-600",
      accentText: "text-sky-600",
    },
    {
      id: "act",
      category: "Pilar 4: Act & Educate",
      title: "Lindungi Sekitarmu",
      description:
        "Cetak Guardian Share Card untuk grup chat keluarga dan asah insting keamanan digitalmu di Guardian Academy.",
      actionLabel: "Buat Share Card",
      href: PUBLIC_ROUTES.act,
      Icon: Share2,
      cardBg: "bg-purple-50/70 border-purple-200/70 text-purple-950",
      iconBg: "bg-purple-100 text-purple-600",
      accentText: "text-purple-600",
    },
  ];

  return (
    <section className="bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-600 uppercase">
            KENALAN DULU, YUK
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Banyak cara untuk <span className="text-rose-600">merasa lebih aman.</span>
          </h2>
          <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
            Tak perlu panik saat menerima tautan atau file asing. Pilih instrumen perlindungan yang
            kamu butuhkan hari ini.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className={`flex flex-col justify-between gap-6 rounded-3xl border p-6 transition-all hover:scale-[1.02] hover:shadow-lg sm:p-7 ${pillar.cardBg}`}
            >
              <div className="space-y-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl shadow-xs ${pillar.iconBg}`}
                >
                  <pillar.Icon className="size-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-75">
                    {pillar.category}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight">{pillar.title}</h3>
                </div>
                <p className="text-xs leading-relaxed opacity-90 sm:text-sm">
                  {pillar.description}
                </p>
              </div>

              <Link
                href={pillar.href}
                className={`inline-flex cursor-pointer items-center gap-2 text-xs font-bold transition-all hover:gap-3 sm:text-sm ${pillar.accentText}`}
              >
                <span>{pillar.actionLabel}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
