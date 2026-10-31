import { ArrowRight, Flame, Quote, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";

export function SocialProofSection() {
  const stats = [
    { value: "1,420+", label: "Tautan Phishing Dianalisis" },
    { value: "380+", label: "Modus APK Berbahaya Dibongkar" },
    { value: "700k+", label: "Data OJK & IASC Diintegrasikan" },
  ];

  const leaderboard = [
    { rank: 1, name: "Alfan Gading Saputra", exp: 1510, title: "Cyber Sentinel", streak: 14 },
    { rank: 2, name: "Dery Wahyu Perdana", exp: 865, title: "Junior Analyst", streak: 7 },
    { rank: 3, name: "Riki Andhika Kusna Putra", exp: 560, title: "Junior Analyst", streak: 4 },
  ];

  return (
    <section className="bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-600 uppercase">
            KITA TUMBUH BERSAMA
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Di sini, kamu <span className="text-rose-600">tidak sendirian.</span>
          </h2>
          <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
            Bersama ribuan pengguna dan analis siber muda di seluruh Indonesia, kita bangun
            ekosistem digital yang tangguh dari ancaman rekayasa sosial.
          </p>

          {/* Metric Counters */}
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 text-center shadow-xs"
              >
                <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs font-medium text-stone-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Split Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Card: Cerita Komunitas (Spans 6 cols) */}
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-rose-200/70 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 p-7 shadow-sm lg:col-span-6">
            <div className="space-y-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <Quote className="size-5" />
              </div>
              <h3 className="text-lg leading-snug font-bold text-slate-900 sm:text-xl">
                &ldquo;Modus APK Undangan Nikah hampir menguras rekening orang tua saya. Berkat APK
                X-Ray, ketahuan ada izin RECEIVE_SMS dan token bot Telegram pelaku!&rdquo;
              </h3>
              <p className="text-xs leading-relaxed text-stone-600 sm:text-sm">
                Investigasi bersama komunitas membantu keluarga segera memblokir m-banking dan
                mencegah kerugian finansial.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-rose-200 text-sm font-extrabold text-rose-800">
                  AG
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Alfan Gading Saputra &bull; Mahasiswa
                  </div>
                  <div className="text-[11px] font-medium text-rose-600">Cyber Sentinel</div>
                </div>
              </div>
            </div>

            <Link
              href={PROTECTED_ROUTES.community}
              className="inline-flex cursor-pointer items-center gap-2 pt-2 text-xs font-bold text-rose-600 transition-all hover:gap-3 hover:text-rose-700 sm:text-sm"
            >
              <span>Jelajahi Kasus Komunitas</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Right Card: Hall of Fame Leaderboard Teaser (Spans 6 cols) */}
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-stone-200/80 bg-white/90 p-7 shadow-sm lg:col-span-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Trophy className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                      Hall of Fame Guardian
                    </h3>
                    <span className="text-[11px] text-stone-500">
                      Merayakan kontributor teraktif bulan ini
                    </span>
                  </div>
                </div>
                <div className="rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  TOP EXP
                </div>
              </div>

              {/* Leaderboard Table / Rows */}
              <div className="space-y-2 pt-1">
                {leaderboard.map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center justify-between rounded-2xl border border-stone-200/60 bg-stone-50/80 p-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded-full border border-stone-200 bg-white text-xs font-extrabold text-stone-700">
                        {item.rank}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <span className="text-[10px] text-stone-500">{item.title}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-600">
                        <Flame className="size-3 fill-orange-500 text-orange-500" />
                        <span>{item.streak}d</span>
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-bold text-amber-700">
                        <Sparkles className="size-3 text-amber-500" />
                        <span>{item.exp} EXP</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={PROTECTED_ROUTES.community}
              className="inline-flex cursor-pointer items-center gap-2 pt-2 text-xs font-bold text-slate-800 transition-all hover:gap-3 hover:text-rose-600 sm:text-sm"
            >
              <span>Lihat Semua Peringkat & Kasus Komunitas</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
