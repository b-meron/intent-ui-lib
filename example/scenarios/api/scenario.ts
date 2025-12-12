import { Scenario } from "../types";

export const apiScenario: Scenario = {
  id: "api",
  title: "Natural Language → API",
  icon: "🔌",
  description: "Convert plain English requests into API endpoint suggestions",
  placeholder: `Get all premium users who signed up in the last 30 days and have made at least 2 purchases`,
  prompt: "Convert this request into a REST API call.",
};

