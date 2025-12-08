import { useCallback, useEffect, useState } from "react";
import { executeAI } from "./execution";
import { AIError, ProviderKind, UseAIOptions, UseAIResult } from "./types";

export function useAI<T>(options: UseAIOptions<T>): UseAIResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<AIError | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<number | undefined>(undefined);
  const [estimatedUSD, setEstimatedUSD] = useState<number | undefined>(undefined);
  const [fromCache, setFromCache] = useState<boolean | undefined>(undefined);

  const run = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await executeAI<T>({
        prompt: options.prompt,
        input: options.input,
        schema: options.schema,
        provider: options.provider as ProviderKind,
        temperature: options.temperature,
        cache: options.cache,
        timeoutMs: options.timeoutMs,
        retry: options.retry,
        fallback: options.fallback
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
  }, [options.prompt, options.input, options.schema, options.provider, options.temperature, options.cache, options.timeoutMs, options.retry, options.fallback]);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
