import { formatUSD } from "../helpers";

interface CostBadgeProps {
  tokens?: number;
  usd?: number;
  fromCache?: boolean;
  usedFallback?: boolean;
}

export const CostBadge = ({ tokens, usd, fromCache, usedFallback }: CostBadgeProps) => (
  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
    <span className="rounded-full bg-slate-800 px-3 py-1">tokens: {tokens ?? "—"}</span>
    <span className="rounded-full bg-slate-800 px-3 py-1">usd: {formatUSD(usd)}</span>
    {fromCache ? <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-emerald-300">cache hit</span> : null}
    {usedFallback ? <span className="rounded-full bg-amber-900/50 px-3 py-1 text-amber-300">fallback</span> : null}
  </div>
);

