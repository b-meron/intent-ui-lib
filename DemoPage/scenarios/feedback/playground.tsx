import type { AIProvider } from "react-ai-query";
import { feedbackScenario, feedbackScenarioConfig } from "./";
import { TextScenarioPlayground } from "../../components/TextScenarioPlayground";

export const FeedbackPlayground = ({ provider }: { provider: AIProvider }) => (
  <TextScenarioPlayground
    scenarioId="feedback"
    scenario={feedbackScenario}
    config={feedbackScenarioConfig}
    provider={provider}
  />
);


