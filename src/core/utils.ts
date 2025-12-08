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

