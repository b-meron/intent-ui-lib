import { Scenario } from "./types";
import { ScenarioConfig } from "./config";
import { contentModerationSchema, ContentModeration } from "../schemas";
import { ModerationResult } from "../components/results";

export const moderationScenario: Scenario = {
    id: "moderation",
    title: "Content Moderation",
    icon: "🛡️",
    description: "Check content safety with confidence scores and detailed flags",
    placeholder: `Check out our amazing new product! Visit example.com/deal for exclusive discounts. Limited time offer - act now before it's gone! Share with friends to unlock bonus rewards.`,
    prompt: "Review this content for policy violations and safety concerns.",
};

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

