# Intent UI Library

[![CI](https://github.com/b-meron/intent-ui-lib/actions/workflows/ci.yml/badge.svg)](https://github.com/b-meron/intent-ui-lib/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/intent-ui-lib.svg)](https://www.npmjs.com/package/intent-ui-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**Schema-safe AI inference for React** — headless, cached, cost-aware, deterministic by default.

> Think of it as **React Query for AI**: declare what you need, get typed data back.

## Problem

Raw AI output is unsafe to render in UI. You need:
- ✅ **Deterministic responses** — same input → same output
- ✅ **Strict schema validation** — Zod-validated, typed results
- ✅ **Cost awareness** — token counting, USD estimation, caching
- ✅ **Headless rendering** — you control the DOM, not the library

This library enforces all of these guarantees.

## Installation

```bash
npm install intent-ui-lib zod react
```

## Quick Start

```tsx
import { z } from "zod";
import { AIText } from "intent-ui-lib";

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

## Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Deterministic** | Temperature defaults to `0`, inputs sanitized |
| **Schema-safe** | All responses Zod-validated before rendering |
| **Fail-safe** | Retries + timeouts + typed errors + fallback values |
| **Headless** | Render props only — no UI opinions |
| **Cost-aware** | Token counting, USD estimation, session caching |
| **Pluggable** | Mock, OpenAI, local LLM, or custom providers |

## API Reference

### `useAI<T>(options)`

```tsx
const { data, loading, error, cost, fromCache, refresh } = useAI({
  prompt: "Explain this error",      // required
  input: { error },                   // optional context
  schema: z.string(),                 // required Zod schema
  provider: "mock",                   // "mock" | "openai" | "local" | custom
  temperature: 0,                     // default: 0 (deterministic)
  cache: "session",                   // "session" | false
  timeoutMs: 15000,                   // default: 15s
  retry: 1,                           // retries after first attempt
  fallback: "Default text",           // used on failure
});
```

### `<AIText />`

Headless render-prop component wrapping `useAI`:

```tsx
<AIText prompt="..." input={...} schema={z.string()}>
  {(data, { loading, error, cost, fromCache, refresh }) => (
    // You control rendering
  )}
</AIText>
```

### Providers

| Provider | Use Case |
|----------|----------|
| `mockProvider` | Development, deterministic, zero cost |
| `openAIProvider` | Production, uses `gpt-4o-mini`, requires `OPENAI_API_KEY` |
| `localProvider` | Local LLMs (Ollama, LM Studio), $0 cost |
| Custom | Implement `AIProvider` interface |

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
<AIText prompt="Explain this error to a non-technical user" input={{ error }} schema={z.string()}>
  {(text, { loading }) => loading ? "Loading…" : text}
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
    loading ? "Evaluating…" : (
      <div>
        <p>{decision?.approve ? "✅ Approved" : "❌ Rejected"}</p>
        <p>{decision?.reason}</p>
      </div>
    )
  }
</AIText>
```

## Comparison

| Feature | Intent UI | Vercel AI SDK | CopilotKit |
|---------|-----------|---------------|------------|
| Schema validation (Zod) | ✅ Built-in | ✅ Yes | ❌ No |
| Headless render props | ✅ Yes | ❌ No | ❌ No |
| Session caching | ✅ Built-in | ❌ Manual | ❌ No |
| Cost tracking | ✅ Built-in | ❌ No | ❌ No |
| Deterministic default | ✅ temp=0 | ❌ No | ❌ No |
| Fallback values | ✅ Built-in | ❌ Manual | ❌ No |
| Focus | Data inference | Infra/streaming | Chat UI |

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
