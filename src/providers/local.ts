import { AIExecutionResult, AIProvider, ProviderExecuteArgs, AIError } from "../core/types";
import { deriveCost, estimateUSD } from "../core/cost";
import { stableStringify, zodToJsonExample } from "../core/utils";

export interface LocalProviderConfig {
  endpoint?: string;
  model?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

const DEFAULT_ENDPOINT = "http://localhost:11434/v1/chat/completions";
const DEFAULT_MODEL = "llama3";

const safeJsonParse = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    // Try to extract JSON from text that might have extra content after it
    const jsonMatch = value.match(/^\s*(\{[\s\S]*\})\s*(?:\n|$)/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
};

const resolveFetch = () => {
  if (typeof fetch === "function") return fetch;
  throw new AIError("fetch is not available in this environment", "configuration");
};

class LocalProviderImpl implements AIProvider {
  name = "local";
  private config: LocalProviderConfig;

  constructor(config: LocalProviderConfig = {}) {
    this.config = config;
  }

  async execute<T>({ prompt, input, schema, temperature, signal }: ProviderExecuteArgs): Promise<AIExecutionResult<T>> {
    const fetcher = resolveFetch();
    const endpoint = this.config.endpoint ?? DEFAULT_ENDPOINT;
    const model = this.config.model ?? DEFAULT_MODEL;

    // Generate JSON example from Zod schema
    const schemaExample = zodToJsonExample(schema);

    const systemPrompt = [
      "You are a deterministic JSON-only function.",
      "Output ONLY the JSON object. No text before or after.",
      "Use lowercase for enum values (e.g., 'positive' not 'POSITIVE').",
      "DO NOT add notes, explanations, or any text outside the JSON.",
      "If you add anything other than JSON, the system will fail."
    ].join(" ");

    const userContent = [
      `Task: ${prompt}`,
      input ? `Context: ${stableStringify(input)}` : null,
      `Required JSON format: ${schemaExample}`,
      "Return ONLY the JSON object matching this format."
    ].filter(Boolean).join("\n");

    const response = await fetcher(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        ...this.config.headers
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        temperature: temperature ?? 0,
        stream: false
      }),
      signal
    });

    if (!response.ok) {
      throw new AIError(`Local provider responded with ${response.status}`, "provider_error");
    }

    const payload = await response.json();
    const messageContent = payload?.choices?.[0]?.message?.content;
    const rawContent = Array.isArray(messageContent)
      ? messageContent.map((c: unknown) => (typeof c === "string" ? c : (c as { text?: string })?.text ?? "")).join("")
      : messageContent;
    const parsed = typeof rawContent === "string" ? safeJsonParse(rawContent) : rawContent;
    const data = parsed && typeof parsed === "object" && "data" in parsed ? (parsed as { data: unknown }).data : parsed ?? rawContent;

    const validated = schema.safeParse(data);
    if (!validated.success) {
      throw new AIError("Local provider returned invalid schema", "validation_error", validated.error);
    }

    const usageTokens = payload?.usage?.total_tokens;
    const fallbackCost = deriveCost(prompt, input);

    return {
      data: validated.data,
      tokens: usageTokens ?? fallbackCost.tokens,
      estimatedUSD: usageTokens ? estimateUSD(usageTokens) : fallbackCost.estimatedUSD
    };
  }
}

export const createLocalProvider = (config: LocalProviderConfig = {}) => new LocalProviderImpl(config);
export const localProvider = new LocalProviderImpl();
