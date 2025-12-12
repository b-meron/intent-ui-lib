import React from "react";

const borderColors = {
  emerald: "border-emerald-500",
  cyan: "border-cyan-500",
  blue: "border-blue-400",
  amber: "border-amber-400",
  red: "border-red-400",
  slate: "border-slate-700",
} as const;

type BorderColor = keyof typeof borderColors;

interface InfoBoxProps {
  label: string;
  children: React.ReactNode;
  borderColor?: BorderColor;
  className?: string;
}

export const InfoBox = ({ label, children, borderColor = "slate", className = "" }: InfoBoxProps) => (
  <div className={`rounded-lg bg-slate-800/50 p-3 border-l-2 ${borderColors[borderColor]} ${className}`}>
    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</p>
    <div className="text-slate-100">{children}</div>
  </div>
);

// Plain container without border accent
export const InfoPanel = ({ label, children, className = "" }: Omit<InfoBoxProps, "borderColor">) => (
  <div className={`rounded-lg bg-slate-800/50 p-3 ${className}`}>
    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</p>
    <div className="text-slate-200">{children}</div>
  </div>
);

// Section label (just the label, no container)
export const SectionLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-xs uppercase tracking-wider text-slate-500 mb-2 ${className}`}>{children}</p>
);

