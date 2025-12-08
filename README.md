# Intent UI Library (V1)

[![CI](https://github.com/b-meron/intent-ui-lib/actions/workflows/ci.yml/badge.svg)](https://github.com/b-meron/intent-ui-lib/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/intent-ui-lib.svg)](https://www.npmjs.com/package/intent-ui-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

AI-native, intent-driven React runtime: deterministic, schema-safe, headless by default.

## Problem
Raw AI output is unsafe to render in UI. Teams need deterministic responses, strict schema validation, cost awareness, and headless rendering so they control the DOM. This library enforces those guarantees.

## One-Sentence Vision
Declarative React + intent-first execution: prompts in, typed JSON out, validated with Zod, rendered headlessly.

## Determinism & Safety
- Temperature defaults to `0` and inputs are sanitized.
- Providers return structured JSON only (no JSX/HTML), always Zod-validated.
- Fail-safe paths: retries + timeouts + typed `AIError` + optional fallback values.
- Session caching keeps repeated prompts deterministic and cost-aware.

## Provider / Server Contract
Providers never return React components. They return JSON `{ data, tokens?, estimatedUSD? }` that must pass the caller’s Zod schema. Rendering happens on the client via `useAI()` or `<AIText />`.

## Installation
```bash
npm install intent-ui-lib zod react
# dev/build tooling
npm install -D typescript tsup vitest
# demo/dev server
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

## Quick Start (Headless)
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
      {(text, { loading, error }) =>
        loading ? "Loading…" : error ? "AI failed safely" : text
      }
    </AIText>
  );
}
```

## API Reference

### `useAI<T>(options)`
Options (defaults):
- `prompt` (required): string
- `input`: unknown
- `schema` (required): `ZodSchema<T>`
- `provider`: `"mock" | "openai" | "local" | AIProvider` (default `"mock"`)
- `temperature`: number (default `0`)
- `cache`: `"session" | false` (default `"session"`)
- `timeoutMs`: number (default `15000`)
- `retry`: number of retries after first attempt (default `1`)
- `fallback`: `T | () => T`

Returns `{ data, loading, error, cost, tokens, estimatedUSD, fromCache, refresh }`.

### `<AIText />`
Headless render-prop component that wraps `useAI`.
- Props mirror `useAI` plus `children: (data, meta) => ReactNode`.
- `meta` contains loading/error/cost/tokens/fromCache/refresh.

### Providers
- `mockProvider`: deterministic, zero cost, browser-only.
- `openAIProvider` / `createOpenAIProvider`: uses `OPENAI_API_KEY` (or `VITE_OPENAI_API_KEY` in Vite) and `gpt-4o-mini` by default; enforces JSON-only output.
- `localProvider` / `createLocalProvider`: openai-compatible local endpoint (e.g., Ollama/LM Studio at `http://localhost:11434/v1/chat/completions`).
- Custom: implement `AIProvider.execute({ prompt, input, schema, temperature, signal })` → `{ data, tokens, estimatedUSD }`.

## Cost Model
- Default estimation: `tokens = ceil(len(prompt)/4 + len(input)/4) + 8`.
- USD estimation: `tokens / 1000 * 0.002` (rounded to 6 decimals).
- If the provider supplies usage, it is surfaced; otherwise estimated cost is used.

## Deployment Models
- Browser → Provider (default for dev/internal tools).
- Browser → Server → Provider (production, audit logs, secrets isolation).
- Browser → Local LLM (Ollama/LM Studio, $0 cost) via `localProvider`.

## Examples
- Error Explanation:
```tsx
<AIText prompt="Explain this error to a non-technical user" input={{ error }} schema={z.string()}>
  {(text, { loading }) => loading ? "Loading…" : text}
</AIText>
```

- Feature Gating:
```tsx
const enabled = useAI({
  prompt: "Enable this feature only for power users unlikely to churn",
  input: { usage, plan, behavior },
  schema: z.boolean(),
});
```

- Internal Approval:
```tsx
<AIText
  prompt="Decide if this expense should be approved safely"
  input={{ user, amount, vendor, history }}
  schema={z.object({ approve: z.boolean(), reason: z.string() })}
>
  {(decision, meta) => meta.loading ? "Scoring…" : JSON.stringify(decision)}
</AIText>
```

## Dev Experience (Vite + Tailwind demo)
- `npm install`
- `npm run dev`
- Open `http://localhost:5173`
- Demo lives in `example/DemoPage.tsx` and shows:
  - AI output, loading, and error states
  - Cost + token reporting
  - Cache hits
  - Provider switching (mock / OpenAI / local)

## Competition
- Vercel AI SDK: infra only, not a headless UI runtime.
- LangChain: workflow engine, not UI-native.
- CopilotKit: chat assistants, not headless intent components.
- Retool AI: closed SaaS.
- Builder.io AI: UI generation, not runtime execution.

## Roadmap (Phase 2)
- `<AIForm />`
- `<AIDecision />` component
- Streaming
- Devtools & audit logs
- Edge execution & additional local adapters

## Development
- Build library: `npm run build`
- Dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Test: `npm run test`

## License
MIT
