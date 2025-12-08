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
