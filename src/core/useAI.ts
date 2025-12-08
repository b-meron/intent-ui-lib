import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { executeAI } from "./execution";
import { AIError, ProviderKind, UseAIOptions, UseAIResult } from "./types";
import { stableStringify } from "./utils";

/**
 * Custom hook that returns a stable reference to a value,
 * only updating when the deep value actually changes.
 */
function useStableValue<T>(value: T): T {
  const serialized = stableStringify(value);
  const ref = useRef<T>(value);

  // Only update ref if serialized value changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    ref.current = value;
    return ref.current;
  }, [serialized]);
}

export function useAI<T>(options: UseAIOptions<T>): UseAIResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<AIError | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<number | undefined>(undefined);
  const [estimatedUSD, setEstimatedUSD] = useState<number | undefined>(undefined);
  const [fromCache, setFromCache] = useState<boolean | undefined>(undefined);

  // Stabilize object inputs to prevent infinite re-renders when consumers
  // pass inline objects like `input: { message }` or `fallback: { default: true }`
  const stableInput = useStableValue(options.input);
  const stableFallback = useStableValue(options.fallback);

  const run = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await executeAI<T>({
        prompt: options.prompt,
        input: stableInput,
        schema: options.schema,
        provider: options.provider as ProviderKind,
        temperature: options.temperature,
        cache: options.cache,
        timeoutMs: options.timeoutMs,
        retry: options.retry,
        fallback: stableFallback
      });
      setData(result.data);
      setTokens(result.tokens);
      setEstimatedUSD(result.estimatedUSD);
      setFromCache(result.fromCache);
    } catch (err) {
      const aiError = err instanceof AIError ? err : new AIError("Unknown error", "provider_error", err);
      setError(aiError);
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [
    options.prompt,
    stableInput,
    options.schema,
    options.provider,
    options.temperature,
    options.cache,
    options.timeoutMs,
    options.retry,
    stableFallback
  ]);

  useEffect(() => {
    run();
  }, [run]);

  return {
    data,
    loading,
    error,
    cost: tokens !== undefined && estimatedUSD !== undefined ? { tokens, estimatedUSD } : undefined,
    tokens,
    estimatedUSD,
    fromCache,
    refresh: run
  };
}
