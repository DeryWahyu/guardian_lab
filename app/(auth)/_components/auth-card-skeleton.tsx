export function AuthCardSkeleton({ title = "Memuat..." }: { title?: string }) {
  return (
    <div className="mx-auto w-full max-w-md animate-pulse rounded-3xl border border-stone-200/60 bg-white/85 p-8 shadow-xl shadow-stone-200/40">
      <div className="mx-auto mb-4 h-4 w-28 rounded-full bg-stone-200" />
      <div className="mx-auto mb-2 h-7 w-64 rounded-lg bg-stone-200" />
      <div className="mx-auto mb-6 h-4 w-48 rounded-lg bg-stone-200" />
      <div className="mb-6 h-16 w-full rounded-2xl bg-stone-100" />
      <div className="space-y-4">
        <div className="h-10 w-full rounded-xl bg-stone-100" />
        <div className="h-10 w-full rounded-xl bg-stone-100" />
        <div className="h-11 w-full rounded-full bg-rose-200" />
      </div>
      <p className="mt-4 text-center text-xs text-stone-400">{title}</p>
    </div>
  );
}
