import { z } from "zod";

export const apiRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  endpoint: z.string(),
  queryParams: z.array(z.object({ key: z.string(), value: z.string() })),
  description: z.string(),
});

export type ApiRequest = z.infer<typeof apiRequestSchema>;

