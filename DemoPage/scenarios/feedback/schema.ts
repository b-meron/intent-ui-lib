import { z } from "zod";

export const feedbackAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  urgency: z.number().min(1).max(5),
  category: z.enum(["bug", "feature_request", "praise", "complaint", "question", "other"]),
  keyPoints: z.array(z.string()),
  suggestedAction: z.string(),
});

export type FeedbackAnalysis = z.infer<typeof feedbackAnalysisSchema>;

