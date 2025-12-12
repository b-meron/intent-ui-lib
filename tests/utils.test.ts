import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
    safeJsonParse,
    zodToJsonExample,
    unwrapLLMResponse,
    caseInsensitiveEnum,
    isPrimitiveSchema,
    getPrimitiveTypeName,
} from "../src/core/utils";

describe("safeJsonParse", () => {
    describe("valid JSON", () => {
        it("parses valid JSON object", () => {
            const result = safeJsonParse('{"name":"John","age":30}');
            expect(result).toEqual({ name: "John", age: 30 });
        });

        it("parses valid JSON array", () => {
            const result = safeJsonParse('[1, 2, 3]');
            expect(result).toEqual([1, 2, 3]);
        });

        it("parses valid JSON with escaped characters", () => {
            const result = safeJsonParse('{"text":"line1\\nline2"}');
            expect(result).toEqual({ text: "line1\nline2" });
        });

        it("parses JSON with unicode", () => {
            const result = safeJsonParse('{"emoji":"👍","text":"café"}');
            expect(result).toEqual({ emoji: "👍", text: "café" });
        });
    });

    describe("literal newlines in strings (LLM quirk)", () => {
        it("handles literal newline inside JSON string value", () => {
            // LLMs sometimes output this - a literal newline instead of \n
            const jsonWithLiteralNewline = '{"content":"line1\nline2"}';
            const result = safeJsonParse(jsonWithLiteralNewline);
            expect(result).toEqual({ content: "line1\nline2" });
        });

        it("handles multiple literal newlines", () => {
            const json = '{"poem":"roses are red\nviolets are blue\ncode is art\nand so are you"}';
            const result = safeJsonParse(json);
            expect(result).toEqual({
                poem: "roses are red\nviolets are blue\ncode is art\nand so are you"
            });
        });

        it("handles literal carriage return", () => {
            const json = '{"text":"line1\rline2"}';
            const result = safeJsonParse(json);
            expect(result).toEqual({ text: "line1\rline2" });
        });

        it("handles literal tab inside string", () => {
            const json = '{"text":"col1\tcol2"}';
            const result = safeJsonParse(json);
            expect(result).toEqual({ text: "col1\tcol2" });
        });

        it("handles mixed literal and escaped newlines", () => {
            const json = '{"text":"literal\nnewline and \\n escaped"}';
            const result = safeJsonParse(json);
            expect(result).toEqual({ text: "literal\nnewline and \n escaped" });
        });

        it("handles complex streaming response with literal newlines", () => {
            // This mimics the actual Groq streaming output that was failing
            const json = `{"content":"under starry skies, the code comes alive,
as night descends, the screens start to thrive,
the world outside fades, and focus takes hold,
in this digital realm, beauty unfold.","wordCount":32,"mood":"inspiring"}`;

            const result = safeJsonParse(json);
            expect(result).toHaveProperty("content");
            expect(result).toHaveProperty("wordCount", 32);
            expect(result).toHaveProperty("mood", "inspiring");
            expect((result as { content: string }).content).toContain("starry skies");
        });

        it("preserves properly escaped sequences", () => {
            // Make sure we don't break already escaped content
            const json = '{"path":"C:\\\\Users\\\\name","text":"line1\\nline2"}';
            const result = safeJsonParse(json);
            expect(result).toEqual({
                path: "C:\\Users\\name",
                text: "line1\nline2"
            });
        });

        it("handles quotes inside strings correctly", () => {
            const json = '{"quote":"He said \\"hello\\" to me"}';
            const result = safeJsonParse(json);
            expect(result).toEqual({ quote: 'He said "hello" to me' });
        });

        it("handles nested objects with literal newlines", () => {
            const json = `{"outer":{"inner":"text with
newline"},"other":"value"}`;
            const result = safeJsonParse(json);
            expect(result).toEqual({
                outer: { inner: "text with\nnewline" },
                other: "value"
            });
        });
    });

    describe("malformed JSON extraction", () => {
        it("extracts JSON from text with trailing content", () => {
            const text = '{"valid": true}\n\nNote: This is extra text';
            const result = safeJsonParse(text);
            expect(result).toEqual({ valid: true });
        });

        it("extracts JSON with leading whitespace", () => {
            const text = '   \n\n{"data": 123}';
            const result = safeJsonParse(text);
            expect(result).toEqual({ data: 123 });
        });

        it("returns undefined for completely invalid input", () => {
            const result = safeJsonParse("not json at all");
            expect(result).toBeUndefined();
        });

        it("returns undefined for empty string", () => {
            const result = safeJsonParse("");
            expect(result).toBeUndefined();
        });
    });

    describe("truncated JSON repair (LLM token limit)", () => {
        it("repairs JSON with truncated string value", () => {
            // Model hit token limit mid-string
            const truncated = '{"wordCount":50,"mood":"inspiring","content":"poem text that got cut off';
            const result = safeJsonParse(truncated);
            expect(result).toHaveProperty("wordCount", 50);
            expect(result).toHaveProperty("mood", "inspiring");
            expect(result).toHaveProperty("content");
        });

        it("repairs JSON missing closing brace", () => {
            const truncated = '{"name":"John","age":30';
            const result = safeJsonParse(truncated);
            expect(result).toEqual({ name: "John", age: 30 });
        });

        it("repairs JSON with unclosed string and brace", () => {
            const truncated = '{"message":"hello world';
            const result = safeJsonParse(truncated);
            expect(result).toHaveProperty("message", "hello world");
        });

        it("repairs nested objects", () => {
            const truncated = '{"outer":{"inner":"value"';
            const result = safeJsonParse(truncated);
            expect(result).toEqual({ outer: { inner: "value" } });
        });

        it("repairs JSON with unclosed array", () => {
            const truncated = '{"items":["a","b","c"';
            const result = safeJsonParse(truncated);
            expect(result).toHaveProperty("items");
            expect((result as { items: string[] }).items).toContain("a");
        });

        it("repairs complex streaming response", () => {
            // This mimics a real truncated Groq streaming response
            const truncated = `{"wordCount":96,"mood":"inspiring","content":"under starry skies, the code comes alive,
as night descends, the screens start to thrive,
the beauty of coding is`;

            const result = safeJsonParse(truncated);
            expect(result).toHaveProperty("wordCount", 96);
            expect(result).toHaveProperty("mood", "inspiring");
            expect(result).toHaveProperty("content");
            expect((result as { content: string }).content).toContain("starry skies");
        });

        it("handles already complete JSON", () => {
            const complete = '{"valid": true}';
            const result = safeJsonParse(complete);
            expect(result).toEqual({ valid: true });
        });

        it("returns undefined for non-JSON starting content", () => {
            const invalid = "Here is the JSON: {\"valid\": true}";
            const result = safeJsonParse(invalid);
            // This should work because we extract JSON that starts with {
            expect(result).toEqual({ valid: true });
        });
    });
});

describe("zodToJsonExample", () => {
    it("generates example for string schema", () => {
        const schema = z.string();
        expect(zodToJsonExample(schema)).toBe('"string"');
    });

    it("generates example for number schema", () => {
        const schema = z.number();
        expect(zodToJsonExample(schema)).toBe("0");
    });

    it("generates example for boolean schema", () => {
        const schema = z.boolean();
        expect(zodToJsonExample(schema)).toBe("true");
    });

    it("generates example for object schema", () => {
        const schema = z.object({
            name: z.string(),
            age: z.number(),
        });
        expect(zodToJsonExample(schema)).toBe('{"name":"string","age":0}');
    });

    it("generates all options for enum schema", () => {
        // Shows all options with | separator - system prompt tells model to pick ONE
        const schema = z.enum(["positive", "neutral", "negative"]);
        expect(zodToJsonExample(schema)).toBe('"positive|neutral|negative"');
    });

    it("generates example for array schema", () => {
        const schema = z.array(z.string());
        expect(zodToJsonExample(schema)).toBe('["string"]');
    });

    it("generates example for nested objects", () => {
        const schema = z.object({
            user: z.object({
                name: z.string(),
            }),
        });
        expect(zodToJsonExample(schema)).toBe('{"user":{"name":"string"}}');
    });

    it("generates example for optional fields", () => {
        const schema = z.object({
            required: z.string(),
            optional: z.string().optional(),
        });
        // Optional fields still appear in the example
        const example = zodToJsonExample(schema);
        expect(example).toContain("required");
        expect(example).toContain("optional");
    });
});

describe("unwrapLLMResponse", () => {
    const stringSchema = z.string();
    const objectSchema = z.object({ name: z.string() });

    it("returns primitive value as-is for primitive schema", () => {
        const result = unwrapLLMResponse("hello", stringSchema);
        expect(result).toBe("hello");
    });

    it("unwraps {data: ...} wrapper", () => {
        const result = unwrapLLMResponse({ data: { name: "John" } }, objectSchema);
        expect(result).toEqual({ name: "John" });
    });

    it("unwraps {result: ...} wrapper for primitives", () => {
        const result = unwrapLLMResponse({ result: "hello" }, stringSchema);
        expect(result).toBe("hello");
    });

    it("unwraps {response: ...} wrapper for primitives", () => {
        const result = unwrapLLMResponse({ response: "hello" }, stringSchema);
        expect(result).toBe("hello");
    });

    it("unwraps single-key object for primitives", () => {
        const result = unwrapLLMResponse({ answer: "hello" }, stringSchema);
        expect(result).toBe("hello");
    });

    it("returns object as-is when no wrapper detected", () => {
        const result = unwrapLLMResponse({ name: "John" }, objectSchema);
        expect(result).toEqual({ name: "John" });
    });

    it("returns null/undefined as-is", () => {
        expect(unwrapLLMResponse(null, stringSchema)).toBeNull();
        expect(unwrapLLMResponse(undefined, stringSchema)).toBeUndefined();
    });
});

describe("caseInsensitiveEnum", () => {
    const sentimentEnum = caseInsensitiveEnum(["positive", "neutral", "negative"]);

    it("validates lowercase values", () => {
        expect(sentimentEnum.safeParse("positive").success).toBe(true);
        expect(sentimentEnum.safeParse("neutral").success).toBe(true);
        expect(sentimentEnum.safeParse("negative").success).toBe(true);
    });

    it("validates uppercase values", () => {
        expect(sentimentEnum.safeParse("POSITIVE").success).toBe(true);
        expect(sentimentEnum.safeParse("NEUTRAL").success).toBe(true);
        expect(sentimentEnum.safeParse("NEGATIVE").success).toBe(true);
    });

    it("validates mixed case values", () => {
        expect(sentimentEnum.safeParse("Positive").success).toBe(true);
        expect(sentimentEnum.safeParse("NeUtRaL").success).toBe(true);
    });

    it("rejects invalid values", () => {
        expect(sentimentEnum.safeParse("invalid").success).toBe(false);
        expect(sentimentEnum.safeParse("").success).toBe(false);
    });

    it("normalizes value to lowercase", () => {
        const result = sentimentEnum.parse("POSITIVE");
        expect(result).toBe("positive");
    });
});

describe("isPrimitiveSchema", () => {
    it("returns true for string schema", () => {
        expect(isPrimitiveSchema(z.string())).toBe(true);
    });

    it("returns true for number schema", () => {
        expect(isPrimitiveSchema(z.number())).toBe(true);
    });

    it("returns true for boolean schema", () => {
        expect(isPrimitiveSchema(z.boolean())).toBe(true);
    });

    it("returns false for object schema", () => {
        expect(isPrimitiveSchema(z.object({ name: z.string() }))).toBe(false);
    });

    it("returns false for array schema", () => {
        expect(isPrimitiveSchema(z.array(z.string()))).toBe(false);
    });

    it("returns false for enum schema", () => {
        expect(isPrimitiveSchema(z.enum(["a", "b"]))).toBe(false);
    });
});

describe("getPrimitiveTypeName", () => {
    it("returns 'string' for string schema", () => {
        expect(getPrimitiveTypeName(z.string())).toBe("string");
    });

    it("returns 'number' for number schema", () => {
        expect(getPrimitiveTypeName(z.number())).toBe("number");
    });

    it("returns 'boolean' for boolean schema", () => {
        expect(getPrimitiveTypeName(z.boolean())).toBe("boolean");
    });

    it("returns null for non-primitive schema", () => {
        expect(getPrimitiveTypeName(z.object({}))).toBeNull();
        expect(getPrimitiveTypeName(z.array(z.string()))).toBeNull();
    });
});

