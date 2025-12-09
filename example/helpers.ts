export const GROQ_KEY_STORAGE = "intent-ui-groq-key";
export const OPENAI_KEY_STORAGE = "intent-ui-openai-key";

export type ProviderChoice = "mock" | "openai" | "local" | "groq";

export const formatUSD = (usd?: number) => 
  usd === undefined ? "—" : `$${usd.toFixed(6)}`;

