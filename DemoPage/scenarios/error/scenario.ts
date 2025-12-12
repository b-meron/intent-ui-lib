import { Scenario } from "../types";

export const errorScenario: Scenario = {
  id: "error",
  title: "Error Summary",
  icon: "⚠️",
  description: "Transform technical errors into user-friendly messages",
  placeholder: "",
  prompt: "Explain this error to a non-technical user in a friendly, helpful way.",
  inputType: "dropdown",
};

