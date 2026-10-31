import { ArrowRight, Clock, FileCode2, QrCode, Terminal } from "lucide-react";
import Link from "next/link";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

export function CaseStudiesSection() {
  const articles = [
    {
      id: "apk-undangan-nikah",
      tag: "MALWARE ANDROID",
      readTime: "3 Menit Baca",
      title: "Anatomi APK Undangan Nikah & Modus Kurir Paket",
      excerpt:
        "Bagaimana malware SMS-stealer membajak izin RECEIVE_SMS untuk mencegat kode OTP perbankan dan menguras rekening korban.",
      href: PUBLIC_ROUTES.homeWithTab("apk"),
      Icon: FileCode2,
      accentBg: "from-rose-500/10 to-transparent",
      tagColor: "bg-rose-100 text-rose-700",
    },
    {
      id: "quishing-qris",
      tag: "QR PHISHING",
      readTime: "4 Menit Baca",
      title: "Waspada Quishing QRIS Palsu di Tempat Ibadah & Parkir",
      excerpt:
        "Eksploitasi stiker QRIS donasi palsu yang mengalihkan pembayaran ke rekening penampung sindikat penipuan.",
      href: PUBLIC_ROUTES.homeWithTab("qr"),
      Icon: QrCode,
      accentBg: "from-amber-500/10 to-transparent",
      tagColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "c2-telegram",
      tag: "FORENSIK TEKNIS",
      readTime: "5 Menit Baca",
      title: "C2 Telegram Bot: Jalur Rahasia Sindikat Phishing",
      excerpt:
        "Membongkar teknik pelaku memanfaatkan bot Telegram API sebagai Command & Control (C2) untuk menerima data korban secara instan.",
      href: PROTECTED_ROUTES.academy,
      Icon: Terminal,
      accentBg: "from-purple-500/10 to-transparent",
      tagColor: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <section className="border-t border-stone-200/60 bg-stone-50/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-600 uppercase">
            BACAAN & EDUKASI FORENSIK
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Sedikit wawasan, <span className="text-rose-600">lebih banyak perlindungan.</span>
          </h2>
          <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
            Pelajari anatomi serangan siber nyata yang marak terjadi di Indonesia berdasarkan data
            OJK & IASC.
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group flex flex-col justify-between gap-6 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-7"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${article.tagColor}`}
                  >
                    {article.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-400">
                    <Clock className="size-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div className="flex size-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-700 transition-transform group-hover:scale-105">
                  <article.Icon className="size-5" />
                </div>

                <h3 className="text-lg leading-snug font-bold text-slate-900 transition-colors group-hover:text-rose-600">
                  {article.title}
                </h3>

                <p className="text-xs leading-relaxed text-stone-600 sm:text-sm">
                  {article.excerpt}
                </p>
              </div>

              <Link
                href={article.href}
                className="inline-flex cursor-pointer items-center gap-1.5 pt-2 text-xs font-bold text-slate-800 transition-colors hover:text-rose-600"
              >
                <span>Pelajari Anatomi Modus</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
