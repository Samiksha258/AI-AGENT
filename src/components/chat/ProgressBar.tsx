import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import type { AgentPhase } from '../../types';

interface ProgressBarProps {
  phase: AgentPhase;
  currentStep: number;
  totalSteps: number;
}

const phaseOrder: AgentPhase[] = [
  'greeting',
  'identifying',
  'clarifying',
  'strategising',
  'guiding',
  'resolved',
];

const phaseLabels: Partial<Record<AgentPhase, string>> = {
  greeting:      'Started',
  identifying:   'Device',
  clarifying:    'Details',
  strategising:  'Planning',
  guiding:       'Fixing',
  resolved:      'Done',
};

export default function ProgressBar({ phase, currentStep, totalSteps }: ProgressBarProps) {
  const isSpecialPhase = phase === 'escalating';

  if (isSpecialPhase) {
    return (
      <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-xs text-red-600 font-medium text-center">
        ⚠️ This issue needs professional support
      </div>
    );
  }

  const currentPhaseIndex = phaseOrder.indexOf(
    (['awaiting-feedback', 'retrying'].includes(phase) ? 'guiding' : phase) as AgentPhase,
  );
  const progressPercent = Math.min(100, (currentPhaseIndex / (phaseOrder.length - 1)) * 100);

  return (
    <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100">
      {/* Step counter */}
      {phase === 'guiding' || phase === 'awaiting-feedback' ? (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-xs text-slate-400">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
          </span>
        </div>
      ) : null}

      {/* Phase track */}
      <div className="flex items-center gap-1">
        {phaseOrder.map((p, idx) => {
          const label = phaseLabels[p];
          const done = idx < currentPhaseIndex;
          const active = idx === currentPhaseIndex;
          return (
            <div key={p} className="flex items-center gap-1 flex-1 min-w-0">
              <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                {done ? (
                  <CheckCircle size={14} className="text-blue-500" />
                ) : active ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Circle size={14} className="text-blue-500 fill-blue-500" />
                  </motion.div>
                ) : (
                  <Circle size={14} className="text-slate-200" />
                )}
                <span
                  className={`text-[9px] font-medium hidden sm:block ${
                    done || active ? 'text-blue-500' : 'text-slate-300'
                  }`}
                >
                  {label}
                </span>
              </div>
              {/* Connector line */}
              {idx < phaseOrder.length - 1 && (
                <div className="flex-1 h-0.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
