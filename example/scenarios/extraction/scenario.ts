import { Scenario } from "../types";

export const extractionScenario: Scenario = {
  id: "extraction",
  title: "Smart Data Extractor",
  icon: "📋",
  description: "Extract structured data from unstructured text like emails or invoices",
  placeholder: `Hi John,

Thanks for your order #INV-2024-0892! Your purchase of $149.99 will ship to 123 Oak Street, Portland OR 97201.

Expected delivery: December 15, 2024
Contact: support@store.com or call (555) 123-4567

Best regards,
Sarah from Customer Success`,
  prompt: "Extract all structured data from this text.",
};

