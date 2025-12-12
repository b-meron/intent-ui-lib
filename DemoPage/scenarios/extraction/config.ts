import type { ScenarioConfig } from "../types";
import { dataExtractionSchema } from "./schema";
import type { DataExtraction } from "./types";
import { ExtractionResult } from "./result";

export const extractionScenarioConfig: ScenarioConfig<DataExtraction> = {
  schema: dataExtractionSchema,
  fallback: {
    extractedFields: [],
    summary: "Unable to extract data - manual review required",
  },
  loadingText: "Extracting data...",
  resultText: "Extracted Data",
  ResultComponent: ExtractionResult,
  buildInput: (submittedInput, _, runKey) => ({ text: submittedInput, _run: runKey }),
};

