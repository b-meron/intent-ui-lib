import { Scenario } from "./types";
import { ScenarioConfig } from "./config";
import { apiRequestSchema, ApiRequest } from "../schemas";
import { ApiResult } from "../components/results";

export const apiScenario: Scenario = {
    id: "api",
    title: "Natural Language → API",
    icon: "🔌",
    description: "Convert plain English requests into API endpoint suggestions",
    placeholder: `Get all premium users who signed up in the last 30 days and have made at least 2 purchases`,
    prompt: "Convert this request into a REST API call.",
};

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

