import type { AIProvider } from "react-ai-query";
import { moderationScenario, moderationScenarioConfig } from "./";
import { TextScenarioPlayground } from "../../components/TextScenarioPlayground";

export const ModerationPlayground = ({ provider }: { provider: AIProvider }) => (
  <TextScenarioPlayground
    scenarioId="moderation"
    scenario={moderationScenario}
    config={moderationScenarioConfig}
    provider={provider}
  />
);


