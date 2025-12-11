import React from "react";
import { useAIStream } from "../core/useAIStream";
import { AIError, AIStreamProvider, AnyZodSchema, CostBreakdown, StreamChunk } from "../core/types";

interface AIStreamProps<T> {
  /** The prompt/task for the AI */
  prompt: string;
  /** Optional context/input data */
  input?: unknown;
  /** Zod schema for response validation */
  schema: AnyZodSchema;
  /** Streaming-capable provider */
  provider: AIStreamProvider;
  /** Temperature (0 = deterministic) */
  temperature?: number;
  /** Maximum tokens to generate (prevents runaway responses) */
  maxTokens?: number;
  /** Timeout in milliseconds */
  timeoutMs?: number;
  /** Number of retry attempts */
  retry?: number;
  /** Fallback value if all retries fail */
  fallback?: T | (() => T);
  /** Called on each streaming chunk */
  onChunk?: (chunk: StreamChunk) => void;
  /** Don't start streaming automatically */
  manual?: boolean;
  /** Additional provider-specific options */
  providerOptions?: Record<string, unknown>;
  /** Render function receiving streaming state */
  children: (
    text: string,
    data: T | undefined,
    meta: {
      isStreaming: boolean;
      done: boolean;
      loading: boolean;
      error?: AIError;
      cost?: CostBreakdown;
      start: () => Promise<void>;
      abort: () => void;
      refresh: () => Promise<void>;
    }
  ) => React.ReactNode;
}

/**
 * Declarative streaming AI component.
 * Mirrors <AIText> API but with real-time streaming support.
 * 
 * @example
 * ```tsx
 * <AIStream
 *   prompt="Write a short story about a robot"
 *   schema={z.object({ story: z.string() })}
 *   provider={createOpenAIProvider({ apiKey: "..." })}
 * >
 *   {(text, data, { isStreaming, done, error }) => (
 *     <div>
 *       {isStreaming && <span>⏳</span>}
 *       <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
 *       {done && <p>✓ Complete</p>}
 *       {error && <p>{error.message}</p>}
 *     </div>
 *   )}
 * </AIStream>
 * ```
 */
export function AIStream<T>(props: AIStreamProps<T>) {
  const result = useAIStream<T>({
    prompt: props.prompt,
    input: props.input,
    schema: props.schema,
    provider: props.provider,
    temperature: props.temperature,
    maxTokens: props.maxTokens,
    timeoutMs: props.timeoutMs,
    retry: props.retry,
    fallback: props.fallback,
    onChunk: props.onChunk,
    manual: props.manual,
    providerOptions: props.providerOptions,
  });

  return (
    <>
      {props.children(result.text, result.data, {
        isStreaming: result.isStreaming,
        done: result.done,
        loading: result.loading,
        error: result.error,
        cost: result.cost,
        start: result.start,
        abort: result.abort,
        refresh: result.refresh,
      })}
    </>
  );
}

