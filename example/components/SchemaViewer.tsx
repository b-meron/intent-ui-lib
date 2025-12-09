import { ScenarioId } from "../scenarios";

// Schema source code for each scenario (formatted for display)
const SCHEMA_CODE: Record<ScenarioId, string> = {
  error: `const errorSummarySchema = z.object({
  userFriendlyMessage: z.string(),
  suggestedAction: z.string(),
  severity: z.enum(["info", "warning", "error", "critical"]),
  retryable: z.boolean(),
  technicalContext: z.string()
});`,

  feedback: `const feedbackAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  urgency: z.number().min(1).max(5),
  category: z.enum(["bug", "feature_request", "praise", "complaint", "question", "other"]),
  keyPoints: z.array(z.string()),
  suggestedAction: z.string()
});`,

  moderation: `const contentModerationSchema = z.object({
  safe: z.boolean(),
  confidence: z.number().min(0).max(100),
  flags: z.array(z.string()),
  reason: z.string()
});`,

  extraction: `const dataExtractionSchema = z.object({
  extractedFields: z.array(z.object({
    label: z.string(),
    value: z.string(),
    type: z.enum(["date", "amount", "name", "email", "phone", "address", "other"])
  })),
  summary: z.string()
});`,

  api: `const apiRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  endpoint: z.string(),
  queryParams: z.array(z.object({ key: z.string(), value: z.string() })),
  description: z.string()
});`
};

const USAGE_CODE: Record<ScenarioId, string> = {
  error: `const { data, loading } = useAI<ErrorSummary>({
  prompt: "Explain this error to a non-technical user",
  input: { error: serverError },
  schema: errorSummarySchema,
  fallback: { severity: "error", retryable: true, ... }
});`,

  feedback: `const { data, loading } = useAI<FeedbackAnalysis>({
  prompt: "Analyze this customer feedback",
  input: { text: customerMessage },
  schema: feedbackAnalysisSchema,
  fallback: { sentiment: "neutral", urgency: 3, ... }
});`,

  moderation: `const { data, loading } = useAI<ContentModeration>({
  prompt: "Check if this content is safe",
  input: { content: userContent },
  schema: contentModerationSchema,
  fallback: { safe: false, confidence: 0, flags: ["review_required"] }
});`,

  extraction: `const { data, loading } = useAI<DataExtraction>({
  prompt: "Extract structured data from this text",
  input: { text: emailOrInvoice },
  schema: dataExtractionSchema,
  fallback: { extractedFields: [], summary: "Unable to extract" }
});`,

  api: `const { data, loading } = useAI<ApiRequest>({
  prompt: "Convert this to an API request",
  input: { request: naturalLanguageQuery },
  schema: apiRequestSchema,
  fallback: { method: "GET", endpoint: "/api/unknown", queryParams: [] }
});`
};

interface SchemaViewerProps {
  scenarioId: ScenarioId;
}

export const SchemaViewer = ({ scenarioId }: SchemaViewerProps) => (
  <div className="space-y-4">
    {/* Schema Definition */}
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Schema Definition</p>
      <div className="rounded-lg bg-slate-900/70 p-4 overflow-x-auto">
        <pre className="text-sm text-emerald-300">
          <code>{SCHEMA_CODE[scenarioId]}</code>
        </pre>
      </div>
    </div>
    
    {/* Usage Example */}
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Usage</p>
      <div className="rounded-lg bg-slate-900/70 p-4 overflow-x-auto">
        <pre className="text-sm text-slate-200">
          <code>{USAGE_CODE[scenarioId]}</code>
        </pre>
      </div>
    </div>
  </div>
);

