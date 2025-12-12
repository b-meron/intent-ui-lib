import { z } from "zod";

export const streamingResponseSchema = z.object({
    // IMPORTANT: Put short/fixed-length fields FIRST so they get output before variable-length content
    // This helps ensure JSON is complete even if content is truncated
    wordCount: z.number(),
    mood: z.enum(["inspiring", "thoughtful", "playful", "dramatic", "serene"]),
    content: z.string(), // Variable-length field LAST
});

export type StreamingResponse = z.infer<typeof streamingResponseSchema>;

