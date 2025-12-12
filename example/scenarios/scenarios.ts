import { Scenario, ScenarioId } from "./types";
import { ScenarioConfigMap } from "./config";
import { apiScenario, apiScenarioConfig } from "./api";
import { errorScenario, errorScenarioConfig } from "./error";
import { extractionScenario, extractionScenarioConfig } from "./extraction";
import { feedbackScenario, feedbackScenarioConfig } from "./feedback";
import { moderationScenario, moderationScenarioConfig } from "./moderation";
import { streamingScenario, streamingScenarioConfig } from "./streaming";

export const SCENARIOS: Record<ScenarioId, Scenario> = {
    error: errorScenario,
    feedback: feedbackScenario,
    moderation: moderationScenario,
    extraction: extractionScenario,
    api: apiScenario,
    streaming: streamingScenario,
};

export const scenarioConfigs: ScenarioConfigMap = {
    error: errorScenarioConfig,
    feedback: feedbackScenarioConfig,
    moderation: moderationScenarioConfig,
    extraction: extractionScenarioConfig,
    api: apiScenarioConfig,
    streaming: streamingScenarioConfig,
};

