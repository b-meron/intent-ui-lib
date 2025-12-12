import type { AIProvider } from "react-ai-query";
import { apiScenario, apiScenarioConfig } from "./";
import { TextScenarioPlayground } from "../../components/TextScenarioPlayground";

export const ApiPlayground = ({ provider }: { provider: AIProvider }) => (
  <TextScenarioPlayground
    scenarioId="api"
    scenario={apiScenario}
    config={apiScenarioConfig}
    provider={provider}
    submitLabel="Generate API"
  />
);


