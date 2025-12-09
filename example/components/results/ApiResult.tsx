import type { ApiRequest } from "../../schemas";
import { SectionLabel, InfoPanel } from "../ui";

const methodColors: Record<string, string> = {
  GET: "bg-emerald-900/50 text-emerald-300",
  POST: "bg-blue-900/50 text-blue-300",
  PUT: "bg-amber-900/50 text-amber-300",
  PATCH: "bg-purple-900/50 text-purple-300",
  DELETE: "bg-red-900/50 text-red-300"
};

export const ApiResult = ({ data }: { data: ApiRequest }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 font-mono">
      <span className={`rounded px-3 py-1 text-sm font-bold ${methodColors[data.method]}`}>
        {data.method}
      </span>
      <code className="text-slate-200 bg-slate-800 rounded px-3 py-1 text-sm">
        {data.endpoint}
      </code>
    </div>
    
    {data.queryParams.length > 0 && (
      <div>
        <SectionLabel>Query Parameters</SectionLabel>
        <div className="font-mono text-sm bg-slate-900 rounded-lg p-3 space-y-1">
          {data.queryParams.map((param, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-cyan-400">{param.key}</span>
              <span className="text-slate-500">=</span>
              <span className="text-amber-300">{param.value}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    
    <InfoPanel label="Description">{data.description}</InfoPanel>
  </div>
);
