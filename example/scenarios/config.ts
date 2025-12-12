import { ComponentType } from "react";
import { AnyZodSchema } from "react-ai-query";
import {
    ApiRequest,
    ContentModeration,
    DataExtraction,
    ErrorSummary,
    FeedbackAnalysis,
    StreamingResponse,
} from "../schemas";

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

export type ScenarioResultMap = {
    error: ErrorSummary;
    feedback: FeedbackAnalysis;
    moderation: ContentModeration;
    extraction: DataExtraction;
    api: ApiRequest;
    streaming: StreamingResponse;
};

export type ScenarioConfigMap = {
    [K in keyof ScenarioResultMap]: ScenarioConfig<ScenarioResultMap[K]>;
};

