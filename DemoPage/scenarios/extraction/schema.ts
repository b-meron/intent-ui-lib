import { z } from "zod";

export const dataExtractionSchema = z.object({
  extractedFields: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      type: z.enum(["date", "amount", "name", "email", "phone", "address", "other"]),
    }),
  ),
  summary: z.string(),
});

export type DataExtraction = z.infer<typeof dataExtractionSchema>;

