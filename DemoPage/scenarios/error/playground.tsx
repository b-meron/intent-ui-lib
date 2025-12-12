import { useEffect, useState } from "react";
import type { AIProvider } from "react-ai-query";
import { errorScenario, errorScenarioConfig } from "./";
import { ERROR_EXAMPLES } from "./examples";
import { ScenarioPlaygroundLayout } from "../../components/ScenarioPlaygroundLayout";

export const ErrorPlayground = ({ provider }: { provider: AIProvider }) => {
  const [selectedErrorId, setSelectedErrorId] = useState(ERROR_EXAMPLES[0].id);
  const [submittedError, setSubmittedError] = useState(ERROR_EXAMPLES[0].error);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    setSelectedErrorId(ERROR_EXAMPLES[0].id);
    setSubmittedError(ERROR_EXAMPLES[0].error);
    setRunKey(0);
  }, [errorScenario.placeholder]);

  const selectedError = ERROR_EXAMPLES.find((example) => example.id === selectedErrorId) ?? ERROR_EXAMPLES[0];

  const handleSubmit = () => {
    setSubmittedError(selectedError.error);
    setRunKey((previous) => previous + 1);
  };

  const handleReset = () => {
    setSelectedErrorId(ERROR_EXAMPLES[0].id);
    setSubmittedError(ERROR_EXAMPLES[0].error);
  };

  return (
    <ScenarioPlaygroundLayout
      provider={provider}
      scenarioId="error"
      scenarioPrompt={errorScenario.prompt}
      config={errorScenarioConfig}
      aiInput={errorScenarioConfig.buildInput("", submittedError, runKey)}
      previewInput={selectedError.error}
      inputLabel="Error Object"
      inputSection={
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Select an Error</label>
          <ErrorDropdownInput
            selectedErrorId={selectedErrorId}
            onSelect={setSelectedErrorId}
            selectedError={selectedError}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
            >
              Explain Error
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

const ErrorDropdownInput = ({
  selectedErrorId,
  onSelect,
  selectedError,
}: {
  selectedErrorId: string;
  onSelect: (id: string) => void;
  selectedError: typeof ERROR_EXAMPLES[0];
}) => {
  const statusColor = (status: number = 500) =>
    status >= 500 ? "bg-red-900/50 text-red-300" :
    status >= 400 ? "bg-amber-900/50 text-amber-300" :
    "bg-blue-900/50 text-blue-300";

  return (
    <div className="space-y-3">
      <select
        value={selectedErrorId}
        onChange={(event) => onSelect(event.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-slate-100 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
      >
        {ERROR_EXAMPLES.map((example) => (
          <option key={example.id} value={example.id}>
            {example.label}
          </option>
        ))}
      </select>
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 font-mono text-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColor(selectedError.error.status)}`}>
            {selectedError.error.status ?? "ERR"}
          </span>
          <span className="text-slate-400">{selectedError.error.code}</span>
        </div>
        <p className="text-slate-300 mb-1">{selectedError.error.message}</p>
        {selectedError.error.details && (
          <p className="text-slate-500 text-xs">{selectedError.error.details}</p>
        )}
      </div>
    </div>
  );
};


