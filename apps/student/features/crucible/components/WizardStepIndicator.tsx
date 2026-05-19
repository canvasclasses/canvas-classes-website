"use client";

interface WizardStepIndicatorProps {
  currentStep: number;
  mode: 'browse' | 'test' | null;
}

const STEPS = [
  { num: 1, label: 'Mode', fullLabel: 'Choose Your Mode' },
  { num: 2, label: 'Chapters', fullLabel: 'Select Chapters' },
  { num: 3, label: 'Launch', fullLabel: 'Review & Launch' },
];

export default function WizardStepIndicator({ currentStep, mode }: WizardStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2.5 mb-4 animate-[fadeUp_0.5s_ease-out_0.1s_backwards]">
      {STEPS.map((step, i) => {
        const isActive = step.num === currentStep;
        const isCompleted = step.num < currentStep;
        const label = step.num === 3 && mode ? (mode === 'test' ? 'Configure' : 'Launch') : step.label;

        return (
          <div key={step.num} className="flex items-center gap-2.5">
            <div className={`h-10 px-3.5 pl-3 rounded-[10px] border backdrop-blur-[10px] flex items-center gap-2 transition-all duration-200 box-border min-w-[110px] justify-start ${
              isActive
                ? 'bg-blue-500/12 border-blue-500/35'
                : isCompleted
                  ? 'bg-white/[0.03] border-white/[0.06]'
                  : 'bg-white/[0.02] border-white/[0.06]'
            }`}>
              <div className={`w-6 h-6 rounded-[7px] border flex items-center justify-center text-xs font-bold ${
                isActive
                  ? 'bg-blue-500/15 border-blue-500/25 text-blue-400'
                  : isCompleted
                    ? 'bg-emerald-500/[0.14] border-emerald-500/25 text-emerald-500'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400/60'
              }`}>
                {isCompleted ? (
                  <svg width="16" height="12" viewBox="0 0 16 13" fill="none">
                    <path d="M1.5 6.5L6 11L14.5 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.num}
              </div>

              <span className={`text-xs whitespace-nowrap tracking-tight ${
                isActive
                  ? 'font-bold text-slate-300/[0.98]'
                  : isCompleted
                    ? 'font-semibold text-slate-400/90'
                    : 'font-semibold text-slate-400/65'
              }`}>
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className={`w-2 h-px ${
                isCompleted ? 'bg-blue-500/25' : 'bg-white/[0.06]'
              }`} />
            )}
          </div>
        );
      })}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 4px rgba(167,139,250,0.15), 0 8px 16px -4px rgba(124,58,237,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(167,139,250,0.1), 0 8px 20px -4px rgba(124,58,237,0.4); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
