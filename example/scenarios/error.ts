import { Scenario } from "./types";
import { ScenarioConfig } from "./config";
import { errorSummarySchema, ErrorSummary } from "../schemas";
import { ErrorResult } from "../components/results";

export const errorScenario: Scenario = {
    id: "error",
    title: "Error Summary",
    icon: "⚠️",
    description: "Transform technical errors into user-friendly messages",
    placeholder: "",
    prompt: "Explain this error to a non-technical user in a friendly, helpful way.",
    inputType: "dropdown",
};

export const errorScenarioConfig: ScenarioConfig<ErrorSummary> = {
    schema: errorSummarySchema,
    fallback: {
        userFriendlyMessage: "Something went wrong. Please try again.",
        suggestedAction: "Contact support if the problem persists.",
        severity: "error",
        retryable: true,
        technicalContext: "Fallback response - AI unavailable",
    },
    loadingText: "Generating explanation...",
    resultText: "User-Friendly Explanation",
    ResultComponent: ErrorResult,
    buildInput: (_, submittedError, runKey) => ({ error: submittedError, _run: runKey }),
};

