import { Scenario } from "./types";
import { ScenarioConfig } from "./config";
import { streamingResponseSchema, StreamingResponse } from "../schemas";
import { StreamingResult } from "../components/results";

export const streamingScenario: Scenario = {
    id: "streaming",
    title: "Streaming Demo",
    icon: "⚡",
    description: "Real-time streaming with live text updates",
    placeholder: `Write a short poem about the beauty of coding at night`,
    prompt: "Write a creative response to this prompt.",
};

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

