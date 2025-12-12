import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// ERROR SUMMARY
// ─────────────────────────────────────────────────────────────────────────────

export const errorSummarySchema = z.object({
  userFriendlyMessage: z.string(),
  suggestedAction: z.string(),
  severity: z.enum(["info", "warning", "error", "critical"]),
  retryable: z.boolean(),
  technicalContext: z.string()
});

export type ErrorSummary = z.infer<typeof errorSummarySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

export const feedbackAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  urgency: z.number().min(1).max(5),
  category: z.enum(["bug", "feature_request", "praise", "complaint", "question", "other"]),
  keyPoints: z.array(z.string()),
  suggestedAction: z.string()
});

export type FeedbackAnalysis = z.infer<typeof feedbackAnalysisSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT MODERATION
// ─────────────────────────────────────────────────────────────────────────────

export const contentModerationSchema = z.object({
  safe: z.boolean(),
  confidence: z.number().min(0).max(100),
  flags: z.array(z.string()),
  reason: z.string()
});

export type ContentModeration = z.infer<typeof contentModerationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// DATA EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

export const dataExtractionSchema = z.object({
  extractedFields: z.array(z.object({
    label: z.string(),
    value: z.string(),
    type: z.enum(["date", "amount", "name", "email", "phone", "address", "other"])
  })),
  summary: z.string()
});

export type DataExtraction = z.infer<typeof dataExtractionSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// API REQUEST GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export const apiRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  endpoint: z.string(),
  queryParams: z.array(z.object({ key: z.string(), value: z.string() })),
  description: z.string()
});

export type ApiRequest = z.infer<typeof apiRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// STREAMING RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

export const streamingResponseSchema = z.object({
  // IMPORTANT: Put short/fixed-length fields FIRST so they get output before variable-length content
  // This helps ensure JSON is complete even if content is truncated
  wordCount: z.number(),
  mood: z.enum(["inspiring", "thoughtful", "playful", "dramatic", "serene"]),
  content: z.string(),  // Variable-length field LAST
});

export type StreamingResponse = z.infer<typeof streamingResponseSchema>;

