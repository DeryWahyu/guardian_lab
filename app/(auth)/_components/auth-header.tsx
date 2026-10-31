interface AuthHeaderProps {
  badgeText: string;
  title: string;
  highlightText: string;
  subtitle: string;
}

export function AuthHeader({ badgeText, title, highlightText, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-rose-200/60 bg-rose-50 px-3 py-1 text-xs font-semibold tracking-wider text-rose-600 uppercase">
        {badgeText}
      </div>
      <h1 className="text-2xl leading-snug font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title} <span className="text-rose-600">{highlightText}</span>
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600">{subtitle}</p>
    </div>
  );
}
