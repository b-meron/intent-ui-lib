# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-12-08

### Added

- Initial release of react ai query
- `useAI<T>()` hook for schema-safe AI inference
- `<AIText />` headless component with render props
- Mock provider for deterministic, zero-cost development
- OpenAI provider with `gpt-4o-mini` support
- Local provider skeleton for OpenAI-compatible local LLMs (Ollama, LM Studio)
- Zod schema validation on all AI responses
- Session caching with configurable policies
- Timeout and retry mechanisms
- Cost estimation (tokens + USD)
- Prompt and input sanitization
- Typed `AIError` with error codes
- Vite + Tailwind demo environment
- Full documentation and examples
