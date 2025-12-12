import type { AIProvider } from "react-ai-query";
import type { PlaygroundScenarioId } from "./types";
import { ErrorPlayground } from "./error";
import { FeedbackPlayground } from "./feedback";
import { ModerationPlayground } from "./moderation";
import { ExtractionPlayground } from "./extraction";
import { ApiPlayground } from "./api";

export type ScenarioPlaygroundComponent = (props: { provider: AIProvider }) => JSX.Element;

export const scenarioPlaygrounds: Record<PlaygroundScenarioId, ScenarioPlaygroundComponent> = {
    error: ErrorPlayground,
    feedback: FeedbackPlayground,
    moderation: ModerationPlayground,
    extraction: ExtractionPlayground,
    api: ApiPlayground,
};


