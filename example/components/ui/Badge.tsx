import React from "react";

// Common badge color schemes
export const badgeColors = {
  // Status colors
  emerald: "bg-emerald-900/30 text-emerald-300",
  red: "bg-red-900/30 text-red-300",
  amber: "bg-amber-900/30 text-amber-300",
  blue: "bg-blue-900/30 text-blue-300",
  purple: "bg-purple-900/30 text-purple-300",
  cyan: "bg-cyan-900/30 text-cyan-300",
  pink: "bg-pink-900/30 text-pink-300",
  slate: "bg-slate-800 text-slate-300",
  // Semantic
  success: "bg-emerald-900/30 text-emerald-400",
  error: "bg-red-900/30 text-red-400",
  warning: "bg-amber-900/30 text-amber-300",
  info: "bg-blue-900/30 text-blue-300",
  neutral: "bg-slate-800 text-slate-400",
} as const;

export type BadgeColor = keyof typeof badgeColors;

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge = ({ children, color = "slate", className = "", icon }: BadgeProps) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${badgeColors[color]} ${className}`}>
    {icon && <span>{icon}</span>}
    {children}
  </span>
);

// Smaller badge variant for tags
export const Tag = ({ children, color = "slate", className = "" }: Omit<BadgeProps, "icon">) => (
  <span className={`rounded-full px-2 py-0.5 text-xs ${badgeColors[color]} ${className}`}>
    {children}
  </span>
);

