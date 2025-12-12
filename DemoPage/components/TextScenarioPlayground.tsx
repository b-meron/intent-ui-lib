import { useEffect, useState } from "react";
import type { AIProvider } from "react-ai-query";
import { ScenarioPlaygroundLayout } from "./ScenarioPlaygroundLayout";
import type { Scenario, ScenarioConfig, PlaygroundScenarioId } from "../scenarios/types";

interface TextScenarioPlaygroundProps<T> {
  scenarioId: PlaygroundScenarioId;
  scenario: Scenario;
  config: ScenarioConfig<T>;
  provider: AIProvider;
  inputLabel?: string;
  submitLabel?: string;
}

export const TextScenarioPlayground = <T,>({
  scenarioId,
  scenario,
  config,
  provider,
  inputLabel,
  submitLabel,
}: TextScenarioPlaygroundProps<T>) => {
  const label = inputLabel ?? "Your Input";
  const buttonText = submitLabel ?? "Analyze";

  const [input, setInput] = useState(scenario.placeholder);
  const [submittedInput, setSubmittedInput] = useState(scenario.placeholder);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    setInput(scenario.placeholder);
    setSubmittedInput(scenario.placeholder);
    setRunKey(0);
  }, [scenario.placeholder]);

  const handleSubmit = () => {
    setSubmittedInput(input);
    setRunKey((previous) => previous + 1);
  };

  const handleReset = () => {
    setInput(scenario.placeholder);
    setSubmittedInput(scenario.placeholder);
  };

  return (
    <ScenarioPlaygroundLayout
      provider={provider}
      scenarioId={scenarioId}
      scenarioPrompt={scenario.prompt}
      config={config}
      aiInput={config.buildInput(submittedInput, undefined, runKey)}
      previewInput={input}
      inputLabel={label}
      inputSection={
        <div className="space-y-2">
          <label className="text-sm text-slate-400">{label}</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 p-4 text-slate-100 placeholder-slate-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
            rows={5}
            placeholder="Enter your text here..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {buttonText}
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-600 hover:text-slate-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      }
    />
  );
};


