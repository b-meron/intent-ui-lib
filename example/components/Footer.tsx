export const Footer = () => (
  <footer className="border-t border-slate-900 bg-slate-900/50">
    <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-400">Built for deterministic, schema-safe AI UI.</p>
      <div className="flex gap-2 text-xs text-slate-300">
        <span className="rounded-full bg-slate-800 px-3 py-1">Headless</span>
        <span className="rounded-full bg-slate-800 px-3 py-1">Zod validated</span>
        <span className="rounded-full bg-slate-800 px-3 py-1">Cost aware</span>
      </div>
    </div>
  </footer>
);

