import type { ScenarioConfig } from "../types";
import { feedbackAnalysisSchema } from "./schema";
import type { FeedbackAnalysis } from "./types";
import { FeedbackResult } from "../../components/results";

export const feedbackScenarioConfig: ScenarioConfig<FeedbackAnalysis> = {
  schema: feedbackAnalysisSchema,
  fallback: {
    sentiment: "neutral",
    urgency: 3,
    category: "other",
    keyPoints: ["Unable to analyze feedback"],
    suggestedAction: "Manual review required",
  },
  loadingText: "Analyzing feedback...",
  resultText: "Analysis Result",
  ResultComponent: FeedbackResult,
  buildInput: (submittedInput, _, runKey) => ({ text: submittedInput, _run: runKey }),
};

