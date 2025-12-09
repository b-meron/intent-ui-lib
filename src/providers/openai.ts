import OpenAI from "openai";
import { AIExecutionResult, AIProvider, ProviderExecuteArgs } from "../core/types";
import { deriveCost, estimateUSD } from "../core/cost";
import { AIError } from "../core/types";
import { stableStringify, zodToJsonExample, unwrapLLMResponse } from "../core/utils";

export interface OpenAIProviderConfig {
  apiKey: string;
  model?: string;
  baseURL?: string;
  dangerouslyAllowBrowser?: boolean;
}

const DEFAULT_MODEL = "gpt-4o-mini";

const safeJsonParse = (content: string): unknown => {
  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
};

class OpenAIProviderImpl implements AIProvider {
  name = "openai";
  private config: OpenAIProviderConfig;
  private client: OpenAI;

  constructor(config: OpenAIProviderConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      dangerouslyAllowBrowser: config.dangerouslyAllowBrowser ?? true
    });
  }

  async execute<T>({ prompt, input, schema, temperature, signal }: ProviderExecuteArgs): Promise<AIExecutionResult<T>> {

    // Generate JSON example from Zod schema
    const schemaExample = zodToJsonExample(schema);

    const systemPrompt = [
      "You are a deterministic function for a React UI runtime.",
      "Always respond with strict JSON object: { \"data\": <value> }.",
      "The <value> must match the exact schema format provided.",
      "Never include code, JSX, HTML, or explanations.",
      "If uncertain, return a safe, minimal value within schema."
    ].join(" ");

    const userContent = [
      `Task: ${prompt}`,
      input ? `Context: ${stableStringify(input)}` : undefined,
      `Required format for <value>: ${schemaExample}`,
      "Return JSON: { \"data\": <your_response> }"
    ].filter(Boolean).join("\n");

    const completion = await this.client.chat.completions.create({
      model: this.config.model ?? DEFAULT_MODEL,
      temperature: temperature ?? 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      response_format: { type: "json_object" }
    }, { signal });

    const messageContent = completion.choices[0]?.message?.content;
    const content = Array.isArray(messageContent)
      ? messageContent.map((c) => (typeof c === "string" ? c : c.text ?? "")).join("")
      : (messageContent ?? "");

    const parsed = typeof content === "string" ? safeJsonParse(content) : undefined;
    const data = unwrapLLMResponse(parsed, schema);

    if (data === undefined) {
      throw new AIError("OpenAI returned no data", "provider_error");
    }

    const validated = schema.safeParse(data);
    if (!validated.success) {
      throw new AIError("OpenAI returned invalid schema", "validation_error", validated.error);
    }

    const usageTokens = completion.usage?.total_tokens;
    const estimated = deriveCost(prompt, input);

    return {
      data: validated.data,
      tokens: usageTokens ?? estimated.tokens,
      estimatedUSD: usageTokens ? estimateUSD(usageTokens) : estimated.estimatedUSD
    };
  }
}

export const createOpenAIProvider = (config: OpenAIProviderConfig) => new OpenAIProviderImpl(config);
