import { ZodSchema } from "zod";
import { AIExecutionResult } from "./types";

interface CacheEntry<T> extends AIExecutionResult<T> {
  timestamp: number;
}

const sessionCache = new Map<string, CacheEntry<unknown>>();

const normalize = (value: unknown, seen: WeakSet<object>): unknown => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "function") return undefined;
  if (Array.isArray(value)) return value.map((item) => normalize(item, seen));
  if (typeof value === "object") {
    if (seen.has(value as object)) return undefined;
    seen.add(value as object);
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        const normalized = normalize((value as Record<string, unknown>)[key], seen);
        if (normalized !== undefined) acc[key] = normalized;
        return acc;
      }, {});
  }
  return undefined;
};

const stableStringify = (value: unknown) => {
  try {
    return JSON.stringify(normalize(value, new WeakSet()));
  } catch (error) {
    return String(value);
  }
};

export const buildCacheKey = <T>(args: {
  prompt: string;
  input?: unknown;
  schema: ZodSchema<T>;
}): string => {
  const schemaId = (args.schema as unknown as { description?: string; _def?: { typeName?: string } }).description ||
    (args.schema as unknown as { _def?: { typeName?: string } })._def?.typeName ||
    args.schema.toString();

  return [
    args.prompt.trim(),
    stableStringify(args.input),
    schemaId
  ].join("::");
};

export const getFromSessionCache = <T>(key: string): AIExecutionResult<T> | undefined => {
  const hit = sessionCache.get(key);
  if (!hit) return undefined;
  return { ...hit, fromCache: true } as AIExecutionResult<T>;
};

export const setSessionCache = <T>(key: string, value: AIExecutionResult<T>): void => {
  sessionCache.set(key, {
    ...value,
    timestamp: Date.now()
  });
};

export const clearSessionCache = (): void => {
  sessionCache.clear();
};
