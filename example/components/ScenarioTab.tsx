import { Scenario } from "../scenarios";

interface ScenarioTabProps {
  scenario: Scenario;
  active: boolean;
  onClick: () => void;
}

export const ScenarioTab = ({ scenario, active, onClick }: ScenarioTabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-left transition-all ${
      active 
        ? "bg-emerald-900/30 border border-emerald-700/50 text-emerald-300" 
        : "bg-slate-900/50 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
    }`}
  >
    <span className="text-xl">{scenario.icon}</span>
    <div>
      <p className="font-medium text-sm">{scenario.title}</p>
      <p className="text-xs opacity-70 hidden sm:block">{scenario.description}</p>
    </div>
  </button>
);

