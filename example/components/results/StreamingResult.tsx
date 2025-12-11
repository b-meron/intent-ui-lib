import { StreamingResponse } from "../../schemas";

const moodColors: Record<StreamingResponse["mood"], string> = {
  inspiring: "bg-amber-900/50 text-amber-300",
  thoughtful: "bg-blue-900/50 text-blue-300",
  playful: "bg-pink-900/50 text-pink-300",
  dramatic: "bg-purple-900/50 text-purple-300",
  serene: "bg-emerald-900/50 text-emerald-300",
};

export const StreamingResult = ({ data }: { data: StreamingResponse }) => {
  return (
    <div className="space-y-4">
      {/* Content */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
          {data.content}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm">
        <span className={`px-2 py-1 rounded text-xs font-medium ${moodColors[data.mood]}`}>
          {data.mood}
        </span>
        <span className="text-slate-500">
          {data.wordCount} words
        </span>
      </div>
    </div>
  );
};

