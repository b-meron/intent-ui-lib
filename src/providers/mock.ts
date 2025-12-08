import { z, ZodSchema } from "zod";
import { AIExecutionResult, AIProvider, ProviderExecuteArgs } from "../core/types";
import { deriveCost } from "../core/cost";

const stableStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value, Object.keys(value as object).sort());
  } catch (error) {
    return String(value);
  }
};

const buildMockData = <T>(schema: ZodSchema<T>, prompt: string, input?: unknown): T => {
  const base = `Mock response for: ${prompt}`;
  const withInput = input ? `${base} | input: ${stableStringify(input)}` : base;
  if ((schema as unknown as { _def?: { typeName?: string } })._def?.typeName === z.string()._def.typeName) {
    return schema.parse(withInput);
  }
  if ((schema as unknown as { _def?: { typeName?: string } })._def?.typeName === z.object({})._def.typeName) {
    return schema.parse({ message: withInput });
  }
  return schema.parse(withInput as unknown as T);
};

class MockProviderImpl implements AIProvider {
  name = "mock";

  async execute<T>({ prompt, input, schema }: ProviderExecuteArgs<T>): Promise<AIExecutionResult<T>> {
    const cost = deriveCost(prompt, input);
    const data = buildMockData(schema, prompt, input);
    return {
      data,
      tokens: cost.tokens,
      estimatedUSD: cost.estimatedUSD
    };
  }
}

export const mockProvider = new MockProviderImpl();
