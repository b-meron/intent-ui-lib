# react ai query

[![CI](https://github.com/b-meron/react-ai-query/actions/workflows/ci.yml/badge.svg)](https://github.com/b-meron/react-ai-query/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/react-ai-query.svg)](https://www.npmjs.com/package/react-ai-query)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**Schema-safe AI inference for React** — headless, cached, cost-aware, deterministic by default.

> Think of it as **React Query for AI**: declare what you need, get typed data back.

**[▶️ Try the Live Demo](https://b-meron.github.io/react-ai-query/)**

## Problem

Raw AI output is unsafe to render in UI. You need:

- ✅ **Deterministic responses** — same input → same output
- ✅ **Strict schema validation** — Zod-validated, typed results
- ✅ **Cost awareness** — token counting, USD estimation, caching
- ✅ **Headless rendering** — you control the DOM, not the library

This library enforces all of these guarantees.

## Installation

```bash
npm install react-ai-query zod react
```

## Quick Start

```tsx
import { z } from "zod";
import { AIText } from "react-ai-query";

export function ErrorSummary({ error }: { error: Error }) {
  return (
    <AIText
      prompt="Explain this error to a non-technical user"
      input={{ error }}
      schema={z.string()}
    >
      {(text, { loading, error: aiError }) =>
        loading ? "Loading…" : aiError ? "AI failed safely" : text
      }
    </AIText>
  );
}
```

## How It Works

When you provide a Zod schema, react-ai-query automatically:

1. **Converts** your schema to a human-readable JSON example
2. **Injects** it into the LLM prompt — the AI knows exactly what format to return
3. **Validates** the response against your schema
4. **Returns** typed, safe data to your component

```tsx
// You write this:
schema: z.object({
  summary: z.string(),
  sentiment: z.enum(["positive", "neutral", "negative"]),
});

// The LLM receives:
// "Required format: {"summary":"string","sentiment":"positive | neutral | negative"}"
```

You declare intent, we handle the rest.

## Core Principles

| Principle         | Implementation                                           |
| ----------------- | -------------------------------------------------------- |
| **Deterministic** | Temperature defaults to `0`, inputs sanitized            |
| **Schema-safe**   | Auto schema injection + Zod validation before rendering  |
| **Fail-safe**     | Retries + timeouts + typed errors + observable fallbacks |
| **Headless**      | Render props only — no UI opinions                       |
| **Cost-aware**    | Token counting, USD estimation, session caching          |
| **Pluggable**     | Mock, OpenAI, local LLM, or custom providers             |

## Fallback Observability

When AI fails (timeout, validation error, provider error), the library gracefully falls back to your default value. You can **observe** when this happens:

```tsx
const { data, usedFallback, fallbackReason } = useAI({
  prompt: "Summarize this article",
  input: { article },
  schema: z.string(),
  fallback: "Summary unavailable",
});

// Know when fallback was used
if (usedFallback) {
  console.log(`AI failed: ${fallbackReason}`);
  // e.g., "AI call timed out" or "Provider returned invalid shape"
}
```

| Field            | Type      | Description                               |
| ---------------- | --------- | ----------------------------------------- |
| `usedFallback`   | `boolean` | `true` if AI failed and fallback was used |
| `fallbackReason` | `string`  | Why the fallback was triggered            |

This enables better UX decisions, debugging, and analytics.

## API Reference

### `useAI<T>(options)`

```tsx
const {
  data,
  loading,
  error,
  cost,
  fromCache,
  usedFallback,
  fallbackReason,
  refresh,
} = useAI({
  prompt: "Explain this error", // required
  input: { error }, // optional context
  schema: z.string(), // required Zod schema
  provider: mockProvider, // default: mockProvider
  temperature: 0, // default: 0 (deterministic)
  cache: "session", // "session" | false
  timeoutMs: 15000, // default: 15s
  retry: 1, // retries after first attempt
  fallback: "Default text", // used on failure
});
```

### `<AIText />`

Headless render-prop component wrapping `useAI`:

```tsx
<AIText prompt="..." input={...} schema={z.string()}>
  {(data, { loading, error, cost, fromCache, usedFallback, fallbackReason, refresh }) => (
    // You control rendering
  )}
</AIText>
```

### Providers

| Provider               | Use Case                                              |
| ---------------------- | ----------------------------------------------------- |
| `mockProvider`         | Development, deterministic, zero cost                 |
| `createGroqProvider`   | Free cloud LLMs via Groq, uses `llama-3.1-8b-instant` |
| `createOpenAIProvider` | Production, uses `gpt-4o-mini` by default             |
| `createLocalProvider`  | Local LLMs (Ollama, LM Studio), $0 cost               |
| Custom                 | Implement `AIProvider` interface                      |

#### Groq Provider (Free)

Groq offers free API access with fast inference. Get a free key at [console.groq.com](https://console.groq.com):

```tsx
import { createGroqProvider, useAI } from "react-ai-query";

const groqProvider = createGroqProvider({ apiKey: "your-groq-api-key" });

const { data } = useAI({
  prompt: "Summarize this text",
  input: { text },
  schema: z.string(),
  provider: groqProvider,
});
```

#### OpenAI Provider

```tsx
import { createOpenAIProvider, useAI } from "react-ai-query";

const openaiProvider = createOpenAIProvider({
  apiKey: "your-openai-api-key",
  model: "gpt-4o-mini", // optional, this is the default
});

const { data } = useAI({
  prompt: "Analyze this data",
  input: { data },
  schema: z.object({ summary: z.string() }),
  provider: openaiProvider,
});
```

#### Local Provider (Ollama, LM Studio)

```tsx
import { createLocalProvider, useAI } from "react-ai-query";

const localProvider = createLocalProvider({
  endpoint: "http://localhost:11434/v1/chat/completions", // Ollama default
  model: "llama3",
});

const { data } = useAI({
  prompt: "Explain this concept",
  schema: z.string(),
  provider: localProvider,
});
```

### ⚠️ Security: API Keys in Production

> **Important:** Never expose API keys directly in browser code for production applications.

The examples in this documentation use client-side keys for simplicity, but in production you should **proxy requests through your backend** to keep keys secure.

#### Option 1: Next.js API Route (App Router)

Create a route handler at `app/api/ai/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Secure server-side key
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        messages,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch AI response" },
      { status: 500 }
    );
  }
}
```

#### Option 2: Express Proxy

```ts
import express from "express";
import fetch from "node-fetch"; // Required for Node < 18

const app = express();
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  try {
    const { messages, model } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        messages,
        temperature: 0,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
});

app.listen(3001);
```

#### Custom Provider for Proxy

Define a provider in your frontend that calls your secure endpoint:

```tsx
import type { AIProvider } from "react-ai-query";

export const proxyProvider: AIProvider = {
  name: "proxy",
  call: async ({ prompt, input }) => {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `${prompt}\n\nInput: ${JSON.stringify(input)}`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("Proxy call failed");

    const data = await response.json();
    const contentStr = data.choices?.[0]?.message?.content || "";

    // ⚠️ Important: Attempt to parse the JSON string from the LLM
    // If your schema is a primitive string, you might skip this.
    let parsedData = contentStr;
    try {
      parsedData = JSON.parse(contentStr);
    } catch {
      // Keep as string if parsing fails (or if the schema expects a raw string)
    }

    return {
      data: parsedData,
      tokens: data.usage?.total_tokens || 0,
      estimatedUSD: ((data.usage?.total_tokens || 0) / 1000) * 0.002,
    };
  },
};

// Usage
const { data } = useAI({
  prompt: "Analyze this",
  schema: z.object({ summary: z.string() }),
  provider: proxyProvider, // ✅ Secure!
});
```

This pattern keeps your API keys server-side while still using all of react-ai-query's features.

### LLM Quirk Handling

LLMs sometimes return unexpected formats. react-ai-query handles common quirks automatically:

| Quirk                                        | Handling                             |
| -------------------------------------------- | ------------------------------------ |
| Wrapped responses (`{"data": ...}`)          | Auto-unwrapped                       |
| Other wrappers (`{"result": ...}`, etc.)     | Auto-unwrapped for primitive schemas |
| Extra text after JSON (`{...}\n\nNote: ...`) | Extracted JSON, ignored text         |
| Extra whitespace                             | Trimmed before parsing               |
| Enum casing (`"POSITIVE"` vs `"positive"`)   | **Opt-in** via helper (below)        |
| Primitive schemas (string, number, boolean)  | Smart prompts to avoid JSON wrapping |

### `caseInsensitiveEnum(values)`

LLMs often return enum values in different cases. Use this helper for case-insensitive enum validation:

```tsx
import { caseInsensitiveEnum } from "react-ai-query";
import { z } from "zod";

const schema = z.object({
  sentiment: caseInsensitiveEnum(["positive", "neutral", "negative"]),
});

// All of these will validate successfully:
// { sentiment: "positive" }
// { sentiment: "POSITIVE" }
// { sentiment: "Positive" }
```

This is explicit opt-in — you control which enums are case-insensitive.

### `zodToJsonExample(schema)`

Converts a Zod schema to the JSON example string injected into LLM prompts. Useful for debugging or custom providers:

```tsx
import { zodToJsonExample } from "react-ai-query";
import { z } from "zod";

const schema = z.object({
  approved: z.boolean(),
  reason: z.string(),
});

console.log(zodToJsonExample(schema));
// {"approved":true,"reason":"string"}
```

## Provider Contract

Providers return JSON, never React components:

```json
{
  "data": "Your validated result",
  "tokens": 42,
  "estimatedUSD": 0.002
}
```

Rendering is always client-side via `useAI()` or `<AIText />`.

## Cost Model

- **Token estimation**: `ceil(prompt.length/4) + ceil(input.length/4) + 8`
- **USD estimation**: `tokens / 1000 * 0.002`
- **Session caching**: Enabled by default, avoids repeated API calls
- **Real usage**: If provider returns actual token count, it's used instead

## Examples

### Error Explanation

```tsx
<AIText
  prompt="Explain this error to a non-technical user"
  input={{ error }}
  schema={z.string()}
>
  {(text, { loading }) => (loading ? "Loading…" : text)}
</AIText>
```

### Feature Gating

```tsx
const { data: enabled } = useAI({
  prompt: "Should this user see the beta feature?",
  input: { usage, plan, behavior },
  schema: z.boolean(),
});
```

### Structured Decisions

```tsx
<AIText
  prompt="Decide if this expense should be approved"
  input={{ user, amount, vendor, history }}
  schema={z.object({ approve: z.boolean(), reason: z.string() })}
>
  {(decision, { loading }) =>
    loading ? (
      "Evaluating…"
    ) : (
      <div>
        <p>{decision?.approve ? "✅ Approved" : "❌ Rejected"}</p>
        <p>{decision?.reason}</p>
      </div>
    )
  }
</AIText>
```

## Comparison

| Feature                 | react-ai-query | Vercel AI SDK   | CopilotKit | LangChain.js  | Instructor        |
| ----------------------- | -------------- | --------------- | ---------- | ------------- | ----------------- |
| Schema validation (Zod) | ✅ Built-in    | ✅ Yes          | ❌ No      | ❌ Manual     | ✅ Yes            |
| React hooks/components  | ✅ Yes         | ✅ Yes          | ✅ Yes     | ❌ No         | ❌ No             |
| Headless render props   | ✅ Yes         | ❌ No           | ❌ No      | ❌ No         | ❌ No             |
| Session caching         | ✅ Built-in    | ❌ Manual       | ❌ No      | ❌ Manual     | ❌ No             |
| Cost tracking           | ✅ Built-in    | ❌ No           | ❌ No      | ❌ No         | ❌ No             |
| Deterministic default   | ✅ temp=0      | ❌ No           | ❌ No      | ❌ No         | ❌ No             |
| Fallback values         | ✅ Built-in    | ❌ Manual       | ❌ No      | ❌ Manual     | ❌ No             |
| Focus                   | Data inference | Infra/streaming | Chat UI    | Orchestration | Structured output |

## Development

```bash
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Build library
npm run typecheck # Type check
npm run test      # Run tests
```

Demo page in `example/DemoPage.tsx` shows all features.

## Roadmap

- [ ] Streaming support
- [ ] `<AIForm />` — AI-assisted form validation
- [ ] `<AIDecision />` — boolean decisions with reasoning
- [ ] Multi-step inference chains
- [ ] Tool/function calling
- [ ] Devtools & debug panel

## License

MIT