import { AIExecutionResult, AIProvider, AnyZodSchema, ProviderExecuteArgs } from "../core/types";
import { deriveCost } from "../core/cost";
import { stableStringify } from "../core/utils";

interface ZodDef {
  typeName: string;
  shape?: () => Record<string, { _def: ZodDef }>;
  type?: { _def: ZodDef };
  options?: Array<{ _def: ZodDef }>;
  values?: string[];
  value?: unknown;
  innerType?: { _def: ZodDef };
  defaultValue?: () => unknown;
}

/**
 * Builds realistic mock data based on schema structure and prompt context
 */
const buildMockData = (schema: AnyZodSchema, prompt: string, input?: unknown): unknown => {
  const def = (schema as unknown as { _def: ZodDef })._def;
  const context = input ? stableStringify(input) : "";
  const promptPreview = prompt.slice(0, 50);
  
  return buildMockValue(def, promptPreview, context);
};

const buildMockValue = (def: ZodDef, prompt: string, context: string): unknown => {
  const typeName = def.typeName;

  switch (typeName) {
    case "ZodString":
      return `Mock: ${prompt} (context: ${context.slice(0, 30)})`;
    
    case "ZodNumber":
      return 42;
    
    case "ZodBoolean":
      return true;
    
    case "ZodNull":
      return null;
    
    case "ZodLiteral":
      return def.value;
    
    case "ZodEnum":
      // Return first enum value
      return def.values?.[0] ?? "enum_value";
    
    case "ZodArray":
      if (def.type) {
        // Generate 2-3 mock items
        return [
          buildMockValue(def.type._def, `${prompt}[0]`, context),
          buildMockValue(def.type._def, `${prompt}[1]`, context),
        ];
      }
      return [];
    
    case "ZodObject":
      if (def.shape) {
        const shape = def.shape();
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(shape)) {
          result[key] = buildMockValue(value._def, `${prompt}.${key}`, context);
        }
        return result;
      }
      return {};
    
    case "ZodOptional":
    case "ZodNullable":
      if (def.innerType) {
        return buildMockValue(def.innerType._def, prompt, context);
      }
      return null;
    
    case "ZodDefault":
      if (def.defaultValue) {
        return def.defaultValue();
      }
      if (def.innerType) {
        return buildMockValue(def.innerType._def, prompt, context);
      }
      return null;
    
    case "ZodUnion":
      if (def.options && def.options.length > 0) {
        return buildMockValue(def.options[0]._def, prompt, context);
      }
      return "union_value";
    
    default:
      return `<mock:${typeName}>`;
  }
};

class MockProviderImpl implements AIProvider {
  name = "mock";

  async execute<T>({ prompt, input, schema }: ProviderExecuteArgs): Promise<AIExecutionResult<T>> {
    const cost = deriveCost(prompt, input);
    const data = buildMockData(schema, prompt, input) as T;
    return {
      data,
      tokens: cost.tokens,
      estimatedUSD: cost.estimatedUSD
    };
  }
}

export const mockProvider = new MockProviderImpl();
