import React from "react";
import { useAI } from "../core/useAI";
import { AIError, AIProvider, AnyZodSchema, CachePolicy } from "../core/types";

interface AITextProps<T> {
  prompt: string;
  input?: unknown;
  schema: AnyZodSchema;
  provider?: AIProvider;
  temperature?: number;
  cache?: CachePolicy;
  timeoutMs?: number;
  retry?: number;
  fallback?: T | (() => T);
  children: (
    data: T | undefined,
    meta: {
      loading: boolean;
      error?: AIError;
      cost?: { tokens: number; estimatedUSD: number };
      tokens?: number;
      estimatedUSD?: number;
      fromCache?: boolean;
      usedFallback?: boolean;
      fallbackReason?: string;
      refresh: () => Promise<void>;
    }
  ) => React.ReactNode;
}

export function AIText<T>(props: AITextProps<T>) {
  const result = useAI<T>({
    prompt: props.prompt,
    input: props.input,
    schema: props.schema,
    provider: props.provider,
    temperature: props.temperature,
    cache: props.cache,
    timeoutMs: props.timeoutMs,
    retry: props.retry,
    fallback: props.fallback
  });

  return <>{props.children(result.data, {
    loading: result.loading,
    error: result.error,
    cost: result.cost,
    tokens: result.tokens,
    estimatedUSD: result.estimatedUSD,
    fromCache: result.fromCache,
    usedFallback: result.usedFallback,
    fallbackReason: result.fallbackReason,
    refresh: result.refresh
  })}</>;
}
