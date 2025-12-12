import { z } from "zod";

export const errorSummarySchema = z.object({
    userFriendlyMessage: z.string(),
    suggestedAction: z.string(),
    severity: z.enum(["info", "warning", "error", "critical"]),
    retryable: z.boolean(),
    technicalContext: z.string(),
});

export type ErrorSummary = z.infer<typeof errorSummarySchema>;

