import type { ScenarioConfig } from "../types";
import { streamingResponseSchema } from "./schema";
import type { StreamingResponse } from "./types";
import { StreamingResult } from "../../components/results";

export const streamingScenarioConfig: ScenarioConfig<StreamingResponse> = {
  schema: streamingResponseSchema,
  fallback: {
    content: "Unable to generate response - streaming unavailable",
    wordCount: 0,
    mood: "thoughtful",
  },
  loadingText: "Streaming...",
  resultText: "Streamed Response",
  ResultComponent: StreamingResult,
  buildInput: (submittedInput, _, runKey) => ({ prompt: submittedInput, _run: runKey }),
  isStreaming: true,
};

