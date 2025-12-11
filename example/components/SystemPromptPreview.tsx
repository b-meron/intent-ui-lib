import { useState } from "react";

interface SystemPromptPreviewProps {
  systemPrompt: string;
  userInput: unknown;
  /** Label for the user input field name in preview */
  inputLabel?: string;
}

/**
 * Component that shows users what's actually being sent to the AI model.
 * Helps users understand why certain outputs occur by revealing the hidden
 * system prompt that gets combined with their input.
 */
export const SystemPromptPreview = ({
  systemPrompt,
  userInput,
  inputLabel = "User Input",
}: SystemPromptPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatInput = (input: unknown): string => {
    if (input === null || input === undefined) return "(none)";
    if (typeof input === "string") return input || "(empty)";
    try {
      return JSON.stringify(input, null, 2);
    } catch {
      return String(input);
    }
  };

  return (
    <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-amber-900/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-sm">💡</span>
          <span className="text-amber-300 text-sm font-medium">
            What the AI actually receives
          </span>
        </div>
        <span className="text-amber-500 text-xs">
          {isExpanded ? "▲ Hide" : "▼ Show"}
        </span>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-amber-800/30">
          {/* System Prompt Section */}
          <div className="pt-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-900/50 text-blue-300">
                System Prompt
              </span>
              <span className="text-slate-500 text-xs">(Hidden instructions)</span>
            </div>
            <div className="rounded border border-slate-700/50 bg-slate-900/50 p-2">
              <p className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {systemPrompt}
              </p>
            </div>
          </div>

          {/* User Input Section */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-900/50 text-emerald-300">
                {inputLabel}
              </span>
              <span className="text-slate-500 text-xs">(Your input)</span>
            </div>
            <div className="rounded border border-slate-700/50 bg-slate-900/50 p-2">
              <pre className="text-emerald-300 text-sm whitespace-pre-wrap font-mono">
                {formatInput(userInput)}
              </pre>
            </div>
          </div>

          {/* Info note */}
          <p className="text-slate-500 text-xs pt-1 border-t border-slate-800/50">
            The AI combines the system prompt with your input to generate responses.
            This explains why short inputs can produce elaborate outputs.
          </p>
        </div>
      )}
    </div>
  );
};

