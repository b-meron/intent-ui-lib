import React from "react";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

export const Section = ({ title, subtitle, children, badge }: SectionProps) => (
  <section className="card space-y-3">
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          {badge}
        </div>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
      </div>
    </div>
    <div>{children}</div>
  </section>
);

