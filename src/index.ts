// Core hooks
export { useAI } from "./core/useAI";
export { useAIStream } from "./core/useAIStream";

// Components
export { AIText } from "./components/AIText";
export { AIStream } from "./components/AIStream";

// Providers
export { mockProvider } from "./providers/mock";
export { createOpenAIProvider } from "./providers/openai";
export { createLocalProvider } from "./providers/local";
export { createGroqProvider } from "./providers/groq";

// Utilities
export { clearSessionCache } from "./core/cache";
export {
    caseInsensitiveEnum,
    zodToJsonExample,
    isPrimitiveSchema,
    getPrimitiveTypeName,
    unwrapLLMResponse,
    safeJsonParse,
    buildSystemPrompt,
    buildUserContent,
    parseAndValidateResponse,
    parseAndValidateStreamResponse
} from "./core/utils";

// Types
export * from "./core/types";
