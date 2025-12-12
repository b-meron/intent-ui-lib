import { describe, it, expect } from "vitest";
import { SCENARIOS, ERROR_EXAMPLES, ScenarioId, scenarioConfigs } from "../example/scenarios";

describe("Scenarios Configuration", () => {
  const scenarioIds: ScenarioId[] = ["error", "feedback", "moderation", "extraction", "api"];

  describe("SCENARIOS", () => {
    it("has all required scenarios", () => {
      scenarioIds.forEach(id => {
        expect(SCENARIOS[id]).toBeDefined();
      });
    });

    it("each scenario has required fields", () => {
      scenarioIds.forEach(id => {
        const scenario = SCENARIOS[id];
        expect(scenario.id).toBe(id);
        expect(scenario.title).toBeTruthy();
        expect(scenario.icon).toBeTruthy();
        expect(scenario.description).toBeTruthy();
        expect(scenario.prompt).toBeTruthy();
      });
    });

    it("error scenario has dropdown inputType", () => {
      expect(SCENARIOS.error.inputType).toBe("dropdown");
    });

    it("text scenarios have placeholders", () => {
      const textScenarios: ScenarioId[] = ["feedback", "moderation", "extraction", "api"];
      textScenarios.forEach(id => {
        expect(SCENARIOS[id].placeholder).toBeTruthy();
        expect(SCENARIOS[id].inputType).toBeUndefined();
      });
    });
  });

  describe("ERROR_EXAMPLES", () => {
    it("has at least 5 error examples", () => {
      expect(ERROR_EXAMPLES.length).toBeGreaterThanOrEqual(5);
    });

    it("each error example has required fields", () => {
      ERROR_EXAMPLES.forEach(example => {
        expect(example.id).toBeTruthy();
        expect(example.label).toBeTruthy();
        expect(example.error.code).toBeTruthy();
        expect(example.error.message).toBeTruthy();
      });
    });

    it("all error examples have unique ids", () => {
      const ids = ERROR_EXAMPLES.map(e => e.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it("all error examples have status codes", () => {
      ERROR_EXAMPLES.forEach(example => {
        expect(example.error.status).toBeDefined();
        expect(example.error.status).toBeGreaterThanOrEqual(400);
        expect(example.error.status).toBeLessThanOrEqual(599);
      });
    });

    it("covers different HTTP status ranges", () => {
      const statuses = ERROR_EXAMPLES.map(e => e.error.status ?? 0);
      const has4xx = statuses.some(s => s >= 400 && s < 500);
      const has5xx = statuses.some(s => s >= 500);
      expect(has4xx).toBe(true);
      expect(has5xx).toBe(true);
    });
  });

  describe("scenarioConfigs", () => {
    it("has config for each scenario", () => {
      scenarioIds.forEach(id => {
        expect(scenarioConfigs[id]).toBeDefined();
      });
    });

    it("each config has required fields", () => {
      scenarioIds.forEach(id => {
        const config = scenarioConfigs[id];
        expect(config.schema).toBeDefined();
        expect(config.fallback).toBeDefined();
        expect(config.loadingText).toBeTruthy();
        expect(config.resultText).toBeTruthy();
        expect(config.ResultComponent).toBeDefined();
        expect(typeof config.buildInput).toBe("function");
      });
    });

    it("fallbacks pass schema validation", () => {
      scenarioIds.forEach(id => {
        const config = scenarioConfigs[id];
        const result = config.schema.safeParse(config.fallback);
        expect(result.success).toBe(true);
      });
    });

    it("buildInput returns object with _run key", () => {
      scenarioIds.forEach(id => {
        const config = scenarioConfigs[id];
        const input = config.buildInput("test", { code: "TEST" }, 42);
        expect(input).toHaveProperty("_run", 42);
      });
    });
  });
});

