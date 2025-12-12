import type { AIProvider } from "react-ai-query";
import type { PlaygroundScenarioId } from "../scenarios/types";
import { scenarioPlaygrounds } from "../scenarios/playgrounds";

interface PlaygroundScenarioProps {
  scenarioId: PlaygroundScenarioId;
  provider: AIProvider;
}

export const PlaygroundScenario = ({ scenarioId, provider }: PlaygroundScenarioProps) => {
  const ScenarioComponent = scenarioPlaygrounds[scenarioId];
  return <ScenarioComponent provider={provider} />;
};
