import { ComponentType } from "react";
import { AnyZodSchema } from "react-ai-query";
import type { ApiRequest } from "../api";
import type { ContentModeration } from "../moderation";
import type { DataExtraction } from "../extraction";
import type { ErrorSummary } from "../error";
import type { FeedbackAnalysis } from "../feedback";
import type { StreamingResponse } from "../streaming";

interface ScenarioResultMap {
    error: ErrorSummary;
    feedback: FeedbackAnalysis;
    moderation: ContentModeration;
    extraction: DataExtraction;
    api: ApiRequest;
    streaming: StreamingResponse;
}

export interface ScenarioConfig<T = unknown> {
    schema: AnyZodSchema;
    fallback: T;
    loadingText: string;
    resultText: string;
    ResultComponent: ComponentType<{ data: T }>;
    buildInput: (submittedInput: string, submittedError: unknown, runKey: number) => unknown;
    /** If true, this scenario uses streaming (useAIStream) instead of useAI */
    isStreaming?: boolean;
}

export type ScenarioConfigMap = {
    [K in keyof ScenarioResultMap]: ScenarioConfig<ScenarioResultMap[K]>;
};

