import type { DataExtraction } from "./types";
import { Tag, BadgeColor, InfoBox } from "../../components/ui";

const typeColors: Record<string, BadgeColor> = {
  date: "blue",
  amount: "emerald",
  name: "purple",
  email: "cyan",
  phone: "amber",
  address: "pink",
  other: "slate"
};

export const ExtractionResult = ({ data }: { data: DataExtraction }) => (
  <div className="space-y-4">
    <div className="grid gap-2 sm:grid-cols-2">
      {data.extractedFields.map((field, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
          <div>
            <p className="text-xs text-slate-500">{field.label}</p>
            <p className="text-slate-100 font-medium">{field.value}</p>
          </div>
          <Tag color={typeColors[field.type] ?? "slate"}>{field.type}</Tag>
        </div>
      ))}
    </div>
    
    <InfoBox label="Summary" borderColor="cyan">{data.summary}</InfoBox>
  </div>
);

