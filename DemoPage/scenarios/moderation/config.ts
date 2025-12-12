import type { ScenarioConfig } from "../types";
import { contentModerationSchema } from "./schema";
import type { ContentModeration } from "./types";
import { ModerationResult } from "../../components/results";

export const moderationScenarioConfig: ScenarioConfig<ContentModeration> = {
  schema: contentModerationSchema,
  fallback: {
    safe: false,
    confidence: 0,
    flags: ["review_required"],
    reason: "AI unavailable - manual review needed",
  },
  loadingText: "Checking content...",
  resultText: "Moderation Result",
  ResultComponent: ModerationResult,
  buildInput: (submittedInput, _, runKey) => ({ content: submittedInput, _run: runKey }),
};

