export type ScenarioId =
  | "error"
  | "feedback"
  | "moderation"
  | "extraction"
  | "api"
  | "streaming";

export interface Scenario {
  id: ScenarioId;
  title: string;
  icon: string;
  description: string;
  placeholder: string;
  prompt: string;
  inputType?: "textarea" | "dropdown";
}

export type PlaygroundScenarioId = Exclude<ScenarioId, "streaming">;

