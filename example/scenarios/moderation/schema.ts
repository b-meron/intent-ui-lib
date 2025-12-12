import { z } from "zod";

export const contentModerationSchema = z.object({
  safe: z.boolean(),
  confidence: z.number().min(0).max(100),
  flags: z.array(z.string()),
  reason: z.string(),
});

export type ContentModeration = z.infer<typeof contentModerationSchema>;

