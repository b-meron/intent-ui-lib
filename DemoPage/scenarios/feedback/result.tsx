import type { FeedbackAnalysis } from "./types";
import { Badge, BadgeColor, InfoBox, SectionLabel } from "../../components/ui";

const sentimentColors: Record<FeedbackAnalysis["sentiment"], BadgeColor> = {
  positive: "emerald",
  neutral: "slate",
  negative: "red"
};

export const FeedbackResult = ({ data }: { data: FeedbackAnalysis }) => {
  const urgencyColor: BadgeColor = data.urgency >= 4 ? "red" : data.urgency >= 3 ? "amber" : "emerald";
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Badge color={sentimentColors[data.sentiment]}>{data.sentiment}</Badge>
        <Badge color={urgencyColor}>urgency: {data.urgency}/5</Badge>
        <Badge color="slate">{data.category.replace("_", " ")}</Badge>
      </div>
      
      <div>
        <SectionLabel>Key Points</SectionLabel>
        <ul className="space-y-1">
          {data.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-200">
              <span className="text-emerald-500 mt-1">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      
      <InfoBox label="Suggested Action" borderColor="emerald">
        {data.suggestedAction}
      </InfoBox>
    </div>
  );
};

