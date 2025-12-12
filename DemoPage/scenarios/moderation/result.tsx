import type { ContentModeration } from "./types";
import { Badge, SectionLabel, InfoPanel } from "../../components/ui";

export const ModerationResult = ({ data }: { data: ContentModeration }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Badge color={data.safe ? "success" : "error"} icon={data.safe ? "✓" : "⚠"}>
        {data.safe ? "Safe" : "Flagged"}
      </Badge>
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 rounded-full bg-slate-800 overflow-hidden">
          <div 
            className={`h-full transition-all ${data.confidence >= 80 ? "bg-emerald-500" : data.confidence >= 50 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${data.confidence}%` }}
          />
        </div>
        <span className="text-sm text-slate-400">{data.confidence}% confidence</span>
      </div>
    </div>
    
    {data.flags.length > 0 && (
      <div>
        <SectionLabel>Flags</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {data.flags.map((flag, i) => (
            <Badge key={i} color="amber">{flag}</Badge>
          ))}
        </div>
      </div>
    )}
    
    <InfoPanel label="Reasoning">{data.reason}</InfoPanel>
  </div>
);

