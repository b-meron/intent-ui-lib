import type { ScenarioConfig } from "../types";
import { apiRequestSchema } from "./schema";
import type { ApiRequest } from "./types";
import { ApiResult } from "./result";

export const apiScenarioConfig: ScenarioConfig<ApiRequest> = {
  schema: apiRequestSchema,
  fallback: {
    method: "GET",
    endpoint: "/api/unknown",
    queryParams: [],
    description: "Unable to generate API request - please try again",
  },
  loadingText: "Generating API...",
  resultText: "Generated API Request",
  ResultComponent: ApiResult,
  buildInput: (submittedInput, _, runKey) => ({ request: submittedInput, _run: runKey }),
};

