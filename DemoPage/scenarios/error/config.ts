import type { ScenarioConfig } from "../types";
import { errorSummarySchema } from "./schema";
import type { ErrorSummary } from "./types";
import { ErrorResult } from "../../components/results";

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

