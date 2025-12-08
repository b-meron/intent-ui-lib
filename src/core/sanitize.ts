const BLOCKED_PATTERNS = [/script/i, /<\/?[^>]+>/, /javascript:/i];

const cleanText = (value: string): string =>
  value
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim();

const sanitizeObject = (value: Record<string, unknown>, seen: WeakSet<object>): Record<string, unknown> => {
  if (seen.has(value)) return {};
  seen.add(value);

  return Object.keys(value)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      const next = (value as Record<string, unknown>)[key];
      const sanitized = sanitizeInput(next, seen);
      if (sanitized !== undefined) {
        acc[key] = sanitized;
      }
      return acc;
    }, {});
};

export const sanitizePrompt = (prompt: string): string => {
  const safe = cleanText(String(prompt ?? ""));
  const flagged = BLOCKED_PATTERNS.some((pattern) => pattern.test(safe));
  if (!flagged) return safe;
  return safe.replace(/[^a-zA-Z0-9\s.,;:!?-]/g, "").trim();
};

export const sanitizeInput = (input?: unknown, seen: WeakSet<object> = new WeakSet()): unknown => {
  if (input === undefined || input === null) return input;
  if (typeof input === "string") return cleanText(input);
  if (typeof input === "number" || typeof input === "boolean" || input instanceof Date) return input;
  if (typeof input === "function") return undefined;
  if (Array.isArray(input)) return input.map((item) => sanitizeInput(item, seen));
  if (typeof input === "object") return sanitizeObject(input as Record<string, unknown>, seen);
  return undefined;
};

