interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="font-semibold text-slate-100 mb-1">{title}</h3>
    <p className="text-sm text-slate-400">{description}</p>
  </div>
);

// Pre-defined features for the library
export const FEATURES = [
  {
    icon: "📐",
    title: "Schema-Validated",
    description: "Every response is validated against a Zod schema. No surprises, no runtime errors from malformed AI output."
  },
  {
    icon: "💾",
    title: "Cache-First",
    description: "Same prompt + input = same result. Session caching ensures deterministic behavior and cost control."
  },
  {
    icon: "🛡️",
    title: "Safe Fallbacks",
    description: "When AI fails, your app doesn't. Typed fallbacks ensure graceful degradation with full observability."
  }
] as const;

