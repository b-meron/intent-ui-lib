import type { ErrorSummary } from "../../schemas";
import { Badge, BadgeColor, InfoBox } from "../ui";

const severityConfig: Record<ErrorSummary["severity"], { color: BadgeColor; icon: string; border: string }> = {
  info: { color: "info", icon: "ℹ️", border: "border-blue-400" },
  warning: { color: "warning", icon: "⚠️", border: "border-amber-400" },
  error: { color: "error", icon: "❌", border: "border-red-400" },
  critical: { color: "red", icon: "🚨", border: "border-red-500" }
};

export const ErrorResult = ({ data }: { data: ErrorSummary }) => {
  const severity = severityConfig[data.severity];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge color={severity.color} icon={severity.icon}>{data.severity}</Badge>
        <Badge color={data.retryable ? "success" : "neutral"}>
          {data.retryable ? "✓ Retryable" : "✗ Not retryable"}
        </Badge>
      </div>
      
      <div className={`rounded-lg p-4 border-l-4 bg-slate-800/30 ${severity.border}`}>
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">User-Friendly Message</p>
        <p className="text-lg text-slate-100">{data.userFriendlyMessage}</p>
      </div>
      
      <InfoBox label="Suggested Action" borderColor="emerald">
        {data.suggestedAction}
      </InfoBox>
      
      <details className="rounded-lg bg-slate-900/50 border border-slate-800">
        <summary className="px-3 py-2 text-xs uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-400">
          Technical Context (for support)
        </summary>
        <p className="px-3 pb-3 text-sm text-slate-400 font-mono">{data.technicalContext}</p>
      </details>
    </div>
  );
};
