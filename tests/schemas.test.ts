import { describe, it, expect } from "vitest";
import {
  errorSummarySchema,
  feedbackAnalysisSchema,
  contentModerationSchema,
  dataExtractionSchema,
  apiRequestSchema,
} from "../DemoPage/scenarios";

describe("Schema Validation", () => {
  describe("errorSummarySchema", () => {
    it("validates a valid error summary", () => {
      const validData = {
        userFriendlyMessage: "Something went wrong",
        suggestedAction: "Please try again",
        severity: "error",
        retryable: true,
        technicalContext: "HTTP 500"
      };
      expect(errorSummarySchema.safeParse(validData).success).toBe(true);
    });

    it("validates all severity levels", () => {
      const severities = ["info", "warning", "error", "critical"] as const;
      severities.forEach(severity => {
        const data = {
          userFriendlyMessage: "Test",
          suggestedAction: "Test",
          severity,
          retryable: false,
          technicalContext: "Test"
        };
        expect(errorSummarySchema.safeParse(data).success).toBe(true);
      });
    });

    it("rejects invalid severity", () => {
      const invalidData = {
        userFriendlyMessage: "Test",
        suggestedAction: "Test",
        severity: "fatal", // invalid
        retryable: false,
        technicalContext: "Test"
      };
      expect(errorSummarySchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe("feedbackAnalysisSchema", () => {
    it("validates a valid feedback analysis", () => {
      const validData = {
        sentiment: "negative",
        urgency: 4,
        category: "bug",
        keyPoints: ["Point 1", "Point 2"],
        suggestedAction: "Fix the bug"
      };
      expect(feedbackAnalysisSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects urgency out of range", () => {
      const invalidData = {
        sentiment: "neutral",
        urgency: 6, // invalid: max is 5
        category: "other",
        keyPoints: [],
        suggestedAction: "None"
      };
      expect(feedbackAnalysisSchema.safeParse(invalidData).success).toBe(false);
    });

    it("validates all sentiment values", () => {
      const sentiments = ["positive", "neutral", "negative"] as const;
      sentiments.forEach(sentiment => {
        const data = {
          sentiment,
          urgency: 3,
          category: "other",
          keyPoints: [],
          suggestedAction: "Test"
        };
        expect(feedbackAnalysisSchema.safeParse(data).success).toBe(true);
      });
    });

    it("validates all category values", () => {
      const categories = ["bug", "feature_request", "praise", "complaint", "question", "other"] as const;
      categories.forEach(category => {
        const data = {
          sentiment: "neutral",
          urgency: 3,
          category,
          keyPoints: [],
          suggestedAction: "Test"
        };
        expect(feedbackAnalysisSchema.safeParse(data).success).toBe(true);
      });
    });
  });

  describe("contentModerationSchema", () => {
    it("validates a valid moderation result", () => {
      const validData = {
        safe: true,
        confidence: 95,
        flags: [],
        reason: "Content is appropriate"
      };
      expect(contentModerationSchema.safeParse(validData).success).toBe(true);
    });

    it("validates with flags", () => {
      const validData = {
        safe: false,
        confidence: 78,
        flags: ["spam", "promotional"],
        reason: "Contains promotional content"
      };
      expect(contentModerationSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects confidence out of range", () => {
      const invalidData = {
        safe: true,
        confidence: 150, // invalid: max is 100
        flags: [],
        reason: "Test"
      };
      expect(contentModerationSchema.safeParse(invalidData).success).toBe(false);
    });

    it("rejects negative confidence", () => {
      const invalidData = {
        safe: true,
        confidence: -10, // invalid: min is 0
        flags: [],
        reason: "Test"
      };
      expect(contentModerationSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe("dataExtractionSchema", () => {
    it("validates a valid extraction result", () => {
      const validData = {
        extractedFields: [
          { label: "Email", value: "test@example.com", type: "email" },
          { label: "Amount", value: "$100", type: "amount" }
        ],
        summary: "Extracted 2 fields"
      };
      expect(dataExtractionSchema.safeParse(validData).success).toBe(true);
    });

    it("validates all field types", () => {
      const types = ["date", "amount", "name", "email", "phone", "address", "other"] as const;
      types.forEach(type => {
        const data = {
          extractedFields: [{ label: "Test", value: "Value", type }],
          summary: "Test"
        };
        expect(dataExtractionSchema.safeParse(data).success).toBe(true);
      });
    });

    it("validates empty extractedFields", () => {
      const validData = {
        extractedFields: [],
        summary: "No fields found"
      };
      expect(dataExtractionSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects invalid field type", () => {
      const invalidData = {
        extractedFields: [{ label: "Test", value: "Value", type: "unknown" }],
        summary: "Test"
      };
      expect(dataExtractionSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe("apiRequestSchema", () => {
    it("validates a valid API request", () => {
      const validData = {
        method: "GET",
        endpoint: "/api/users",
        queryParams: [{ key: "limit", value: "10" }],
        description: "Get users list"
      };
      expect(apiRequestSchema.safeParse(validData).success).toBe(true);
    });

    it("validates all HTTP methods", () => {
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
      methods.forEach(method => {
        const data = {
          method,
          endpoint: "/api/test",
          queryParams: [],
          description: "Test"
        };
        expect(apiRequestSchema.safeParse(data).success).toBe(true);
      });
    });

    it("validates empty queryParams", () => {
      const validData = {
        method: "POST",
        endpoint: "/api/users",
        queryParams: [],
        description: "Create user"
      };
      expect(apiRequestSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects invalid HTTP method", () => {
      const invalidData = {
        method: "INVALID",
        endpoint: "/api/test",
        queryParams: [],
        description: "Test"
      };
      expect(apiRequestSchema.safeParse(invalidData).success).toBe(false);
    });
  });
});

