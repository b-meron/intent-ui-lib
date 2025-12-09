# Contributing to react ai query

Thanks for your interest in contributing! 🎉

## Contributor License Agreement (CLA)

By submitting a pull request to this repository, you agree to the following terms:

1. **License Grant:** You grant the project maintainer (Binyamin Meron) a perpetual, worldwide, non-exclusive, royalty-free, irrevocable license to use, reproduce, modify, distribute, sublicense, and otherwise exploit your contribution in any form.

2. **Re-licensing Rights:** You grant the project maintainer the right to re-license your contribution under any license of their choosing, including proprietary licenses, without requiring your additional consent or compensation.

3. **Original Work:** You represent that your contribution is your original work, or you have the necessary rights to submit it under these terms.

4. **No Obligation:** The project maintainer is under no obligation to accept, merge, or use your contribution.

**Why this CLA exists:** This allows the project to potentially change its license in the future (e.g., from MIT to a commercial or dual license for new versions) while still allowing the current version to remain open source.

If you do not agree to these terms, please do not submit a pull request.

---

## Getting Started

1. Fork and clone the repo
2. Run `npm install`
3. Run `npm run dev` for the demo page at http://localhost:5173
4. Run `npm run typecheck` before submitting

## Development Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start Vite dev server with demo page |
| `npm run build`     | Build the library for distribution   |
| `npm run typecheck` | Run TypeScript type checking         |
| `npm run test`      | Run tests with Vitest                |

## Pull Request Process

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make your changes
3. Ensure `npm run typecheck` and `npm run build` pass
4. Write or update tests if applicable
5. Submit a PR with a clear description

## Code Style

- TypeScript strict mode enabled
- No `any` types without justification
- All AI outputs must be Zod-validated
- Prefer explicit return types on exported functions
- Use descriptive variable names

## Core Principles

When contributing, keep these principles in mind:

1. **Deterministic First** — same input should produce same output
2. **Schema Validation Always** — all AI responses validated via Zod
3. **Fail-Safe** — provide fallback or typed error
4. **Headless Only** — no styling, no buttons, no themes by default
5. **Cost-Aware** — consider token usage and caching

## Reporting Bugs

Open an issue with:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, browser, OS)
- Relevant code snippets or error messages

## Feature Requests

I welcome feature requests! Please:

1. Check existing issues to avoid duplicates
2. Describe the use case clearly
3. Explain why this benefits the library's users
4. Consider if it aligns with the core philosophy

## Questions?

Feel free to open a discussion or issue. I'm happy to help!
