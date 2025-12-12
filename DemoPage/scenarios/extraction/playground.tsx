import type { AIProvider } from "react-ai-query";
import { extractionScenario, extractionScenarioConfig } from "./";
import { TextScenarioPlayground } from "../../components/TextScenarioPlayground";

export const ExtractionPlayground = ({ provider }: { provider: AIProvider }) => (
  <TextScenarioPlayground
    scenarioId="extraction"
    scenario={extractionScenario}
    config={extractionScenarioConfig}
    provider={provider}
  />
);


