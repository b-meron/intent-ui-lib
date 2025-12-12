import { stableStringify } from "./utils";

const USD_PER_1K_TOKENS = 0.002;

export const estimateTokens = (prompt: string, input?: unknown): number => {
  const promptTokens = Math.ceil(prompt.length / 4);
  const inputTokens = input ? Math.ceil(stableStringify(input).length / 4) : 0;
  return promptTokens + inputTokens + 8; // small buffer for system instructions
};

export const estimateUSD = (tokens: number, usdPer1kTokens: number = USD_PER_1K_TOKENS): number => {
  const usd = (tokens / 1000) * usdPer1kTokens;
  return Math.round(usd * 1_000_000) / 1_000_000;
};

export const deriveCost = (prompt: string, input?: unknown): { tokens: number; estimatedUSD: number } => {
  const tokens = estimateTokens(prompt, input);
  return { tokens, estimatedUSD: estimateUSD(tokens) };
};

/**
 * Resolve cost from provider result or fall back to estimation.
 * Uses explicit undefined checks to handle 0 as a valid token count.
 * 
 * @param resultTokens - Token count from provider (may be undefined)
 * @param resultUSD - USD cost from provider (may be undefined)
 * @param prompt - Original prompt for fallback estimation
 * @param input - Original input for fallback estimation
 * @returns Resolved cost breakdown
 */
export const resolveCost = (
  resultTokens: number | undefined,
  resultUSD: number | undefined,
  prompt: string,
  input?: unknown
): { tokens: number; estimatedUSD: number } => {
  // Use explicit undefined checks - 0 is a valid value
  if (resultTokens !== undefined && resultUSD !== undefined) {
    return { tokens: resultTokens, estimatedUSD: resultUSD };
  }
  return deriveCost(prompt, input);
};
