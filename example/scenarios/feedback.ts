import { Scenario } from "./types";
import { ScenarioConfig } from "./config";
import { feedbackAnalysisSchema, FeedbackAnalysis } from "../schemas";
import { FeedbackResult } from "../components/results";

export const feedbackScenario: Scenario = {
    id: "feedback",
    title: "Customer Feedback Analyzer",
    icon: "💬",
    description: "Analyze customer reviews and feedback with structured insights",
    placeholder: `The new dashboard update is frustrating. I've been a premium user for 2 years and suddenly my saved filters are gone. The export feature also seems slower than before. Please fix this ASAP - I rely on this for my daily reports.`,
    prompt: "Analyze this customer feedback for a support team.",
};

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

