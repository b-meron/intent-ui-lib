import { AnyZodSchema } from "./types";

/**
 * Recursively normalize string values that look like enum values to lowercase.
 * Handles LLMs returning "POSITIVE" instead of "positive".
 */
export const normalizeEnumValues = (value: unknown): unknown => {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    // If it looks like an enum value (all caps or title case, no spaces), lowercase it
    if (/^[A-Z][A-Z_]*$/.test(value) || /^[A-Z][a-z]+$/.test(value)) {
      return value.toLowerCase();
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeEnumValues);
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = normalizeEnumValues(val);
    }
    return result;
  }

  return value;
};

/**
 * Stable JSON serialization that handles edge cases:
 * - Circular references (returns "[Circular]")
 * - Functions (ignored/undefined)
 * - Sorts object keys for consistent output
 * - Falls back to String() on error
 */
export const stableStringify = (value: unknown): string => {
  const seen = new WeakSet();

  const serialize = (val: unknown): unknown => {
    if (val === null || val === undefined) return val;
    if (typeof val === "function") return undefined;
    if (typeof val !== "object") return val;

    if (seen.has(val as object)) return "[Circular]";
    seen.add(val as object);

    if (Array.isArray(val)) {
      return val.map(serialize);
    }

    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(val as object).sort()) {
      const serialized = serialize((val as Record<string, unknown>)[key]);
      if (serialized !== undefined) {
        sorted[key] = serialized;
      }
    }
    return sorted;
  };

  try {
    return JSON.stringify(serialize(value));
  } catch {
    return String(value);
  }
};

/**
 * Converts a Zod schema to a human-readable JSON example string.
 * This helps LLMs understand exactly what format to return.
 */
export const zodToJsonExample = (schema: AnyZodSchema): string => {
  const def = (schema as unknown as { _def: ZodDef })._def;
  return JSON.stringify(buildExample(def), null, 0);
};

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

const buildExample = (def: ZodDef): unknown => {
  const typeName = def.typeName;

  switch (typeName) {
    case "ZodString":
      return "string";
    case "ZodNumber":
      return 0;
    case "ZodBoolean":
      return true;
    case "ZodNull":
      return null;
    case "ZodUndefined":
      return undefined;
    case "ZodLiteral":
      return def.value;
    case "ZodEnum":
      // Show all enum options: "positive" | "neutral" | "negative"
      return def.values?.join(" | ") ?? "enum";
    case "ZodNativeEnum":
      return "enum_value";
    case "ZodArray":
      if (def.type) {
        return [buildExample(def.type._def)];
      }
      return ["item"];
    case "ZodObject":
      if (def.shape) {
        const shape = def.shape();
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(shape)) {
          result[key] = buildExample(value._def);
        }
        return result;
      }
      return {};
    case "ZodOptional":
    case "ZodNullable":
      if (def.innerType) {
        return buildExample(def.innerType._def);
      }
      return null;
    case "ZodDefault":
      if (def.defaultValue) {
        return def.defaultValue();
      }
      if (def.innerType) {
        return buildExample(def.innerType._def);
      }
      return null;
    case "ZodUnion":
      // Return the first option as example
      if (def.options && def.options.length > 0) {
        return buildExample(def.options[0]._def);
      }
      return "union_value";
    case "ZodTuple":
      return ["tuple_item"];
    case "ZodRecord":
      return { key: "value" };
    case "ZodAny":
      return "any_value";
    case "ZodUnknown":
      return "unknown_value";
    default:
      return `<${typeName}>`;
  }
};

