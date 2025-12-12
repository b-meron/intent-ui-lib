import { AIResultPanel } from "./AIResultPanel";
import { SystemPromptPreview } from "./SystemPromptPreview";
import type { AIProvider } from "react-ai-query";
import type { ReactNode } from "react";
import type { ScenarioConfig } from "../scenarios/types";
import type { ScenarioId } from "../scenarios/types";

interface ScenarioPlaygroundLayoutProps<T> {
  provider: AIProvider;
  scenarioId: ScenarioId;
  scenarioPrompt: string;
  config: ScenarioConfig<T>;
  aiInput: unknown;
  previewInput: unknown;
  inputLabel: string;
  inputSection: ReactNode;
}

export const ScenarioPlaygroundLayout = <T,>({
  provider,
  scenarioId,
  scenarioPrompt,
  config,
  aiInput,
  previewInput,
  inputLabel,
  inputSection,
}: ScenarioPlaygroundLayoutProps<T>) => (
  <div className="space-y-4">
    <div className="space-y-2">
      {inputSection}
      <SystemPromptPreview
        appPrompt={scenarioPrompt}
        userInput={previewInput}
        schema={config.schema}
        inputLabel={inputLabel}
      />
    </div>
    <div className="border-t border-slate-800 pt-4">
      <AIResultPanel
        scenarioId={scenarioId}
        prompt={scenarioPrompt}
        input={aiInput}
        schema={config.schema}
        provider={provider}
        fallback={config.fallback}
        loadingText={config.loadingText}
        resultText={config.resultText}
        ResultComponent={config.ResultComponent}
      />
    </div>
  </div>
);


