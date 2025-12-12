/**
 * @fileoverview Type definitions for react-ai-query.
 * 
 * This module exports all public types organized by domain:
 * - **Common**: Base types, error handling, cost tracking
 * - **Provider**: AI provider interfaces and execution types
 * - **Streaming**: Real-time streaming types (powered by Vercel AI SDK)
 * - **Hooks**: React hook options and results
 * 
 * @module react-ai-query/types
 * 
 * @example
 * ```ts
 * import type { 
 *   AIProvider, 
 *   UseAIOptions, 
 *   UseAIStreamResult,
 *   AIError 
 * } from "react-ai-query";
 * ```
 */

// ─────────────────────────────────────────────────────────────────
// Common Types
// ─────────────────────────────────────────────────────────────────

export type { AnyZodSchema, ErrorCode, CostBreakdown, CachePolicy, ModelOptions } from "./common";
export { AIError } from "./common";

// ─────────────────────────────────────────────────────────────────
// Provider Types
// ─────────────────────────────────────────────────────────────────

export type { AIExecutionResult, ProviderExecuteArgs, AIProvider } from "./provider";

// ─────────────────────────────────────────────────────────────────
// Streaming Types
// ─────────────────────────────────────────────────────────────────

export type {
  StreamChunk,
  StreamExecuteArgs,
  AIStreamProvider,
  UseAIStreamOptions,
  UseAIStreamResult,
} from "./streaming";

// ─────────────────────────────────────────────────────────────────
// Hook Types
// ─────────────────────────────────────────────────────────────────

export type { UseAIOptions, UseAIResult } from "./hooks";

