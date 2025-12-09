export const GROQ_KEY_STORAGE = "react-ai-query-groq-key";
export const OPENAI_KEY_STORAGE = "react-ai-query-openai-key";

export type ProviderChoice = "mock" | "openai" | "local" | "groq";

export const formatUSD = (usd?: number) => 
  usd === undefined ? "—" : `$${usd.toFixed(6)}`;

