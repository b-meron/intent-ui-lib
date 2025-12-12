import { describe, it, expect } from "vitest";
import { mockProvider } from "../src/providers/mock";
import {
    errorSummarySchema,
    feedbackAnalysisSchema,
    contentModerationSchema,
    dataExtractionSchema,
    apiRequestSchema,
} from "../DemoPage/scenarios";
import { ERROR_EXAMPLES, SCENARIOS } from "../DemoPage/scenarios";

describe("Mock Provider - Scenario Integration", () => {
    describe("Error Summary Scenario", () => {
        it("generates valid error summary for each error example", async () => {
            for (const example of ERROR_EXAMPLES) {
                const result = await mockProvider.execute({
                    prompt: SCENARIOS.error.prompt,
                    input: { error: example.error },
                    schema: errorSummarySchema,
                    temperature: 0
                });

                expect(errorSummarySchema.safeParse(result.data).success).toBe(true);
                expect(result.tokens).toBeGreaterThan(0);
            }
        });

        it("returns appropriate severity based on error context", async () => {
            const serverError = ERROR_EXAMPLES.find(e => e.error.status === 500);
            if (serverError) {
                const result = await mockProvider.execute({
                    prompt: SCENARIOS.error.prompt,
                    input: { error: serverError.error },
                    schema: errorSummarySchema,
                    temperature: 0
                });

                const data = result.data as { severity: string };
                expect(["error", "critical"]).toContain(data.severity);
            }
        });
    });

    describe("Feedback Analysis Scenario", () => {
        it("generates valid feedback analysis", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.feedback.prompt,
                input: { text: SCENARIOS.feedback.placeholder },
                schema: feedbackAnalysisSchema,
                temperature: 0
            });

            expect(feedbackAnalysisSchema.safeParse(result.data).success).toBe(true);
        });

        it("detects negative sentiment from frustrated text", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.feedback.prompt,
                input: { text: "This is terrible and frustrating! Very angry about this." },
                schema: feedbackAnalysisSchema,
                temperature: 0
            });

            const data = result.data as { sentiment: string };
            expect(data.sentiment).toBe("negative");
        });

        it("detects positive sentiment from happy text", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.feedback.prompt,
                input: { text: "I love this product! It's amazing and great!" },
                schema: feedbackAnalysisSchema,
                temperature: 0
            });

            const data = result.data as { sentiment: string };
            expect(data.sentiment).toBe("positive");
        });
    });

    describe("Content Moderation Scenario", () => {
        it("generates valid moderation result", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.moderation.prompt,
                input: { content: SCENARIOS.moderation.placeholder },
                schema: contentModerationSchema,
                temperature: 0
            });

            expect(contentModerationSchema.safeParse(result.data).success).toBe(true);
        });

        it("flags spam-like content", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.moderation.prompt,
                input: { content: "This is spam content and a scam to steal your money!" },
                schema: contentModerationSchema,
                temperature: 0
            });

            const data = result.data as { safe: boolean };
            expect(data.safe).toBe(false);
        });
    });

    describe("Data Extraction Scenario", () => {
        it("generates valid extraction result", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.extraction.prompt,
                input: { text: SCENARIOS.extraction.placeholder },
                schema: dataExtractionSchema,
                temperature: 0
            });

            expect(dataExtractionSchema.safeParse(result.data).success).toBe(true);
        });

        it("extracts email when present in text", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.extraction.prompt,
                input: { text: "Contact me at test@example.com" },
                schema: dataExtractionSchema,
                temperature: 0
            });

            const data = result.data as { extractedFields: Array<{ type: string }> };
            const hasEmail = data.extractedFields.some(f => f.type === "email");
            expect(hasEmail).toBe(true);
        });

        it("extracts amount when price present", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.extraction.prompt,
                input: { text: "The total is $149.99" },
                schema: dataExtractionSchema,
                temperature: 0
            });

            const data = result.data as { extractedFields: Array<{ type: string }> };
            const hasAmount = data.extractedFields.some(f => f.type === "amount");
            expect(hasAmount).toBe(true);
        });
    });

    describe("API Request Scenario", () => {
        it("generates valid API request", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.api.prompt,
                input: { request: SCENARIOS.api.placeholder },
                schema: apiRequestSchema,
                temperature: 0
            });

            expect(apiRequestSchema.safeParse(result.data).success).toBe(true);
        });

        it("suggests POST for create operations", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.api.prompt,
                input: { request: "Create a new user with name John" },
                schema: apiRequestSchema,
                temperature: 0
            });

            const data = result.data as { method: string };
            expect(data.method).toBe("POST");
        });

        it("suggests DELETE for remove operations", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.api.prompt,
                input: { request: "remove the user record with id 123" },
                schema: apiRequestSchema,
                temperature: 0
            });

            const data = result.data as { method: string };
            expect(data.method).toBe("DELETE");
        });

        it("defaults to GET for query operations", async () => {
            const result = await mockProvider.execute({
                prompt: SCENARIOS.api.prompt,
                input: { request: "Get all users" },
                schema: apiRequestSchema,
                temperature: 0
            });

            const data = result.data as { method: string };
            expect(data.method).toBe("GET");
        });
    });
});

