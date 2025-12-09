export const CODE_EXAMPLE = `const { data, loading, error, cost } = useAI<FeedbackAnalysis>({
  prompt: "Analyze this customer feedback",
  input: { text: userInput },
  schema: feedbackAnalysisSchema, // Zod schema
  provider: groqProvider,
  cache: "session",
  fallback: { sentiment: "neutral", urgency: 3, ... }
});

// Or use the render-props component:
<AIText prompt="..." input={...} schema={schema}>
  {(data, meta) => <YourComponent data={data} loading={meta.loading} />}
</AIText>`;

export const CodeExample = () => (
  <div className="rounded-lg bg-slate-900/70 p-4 overflow-x-auto">
    <pre className="text-sm text-slate-200">
      <code>{CODE_EXAMPLE}</code>
    </pre>
  </div>
);

