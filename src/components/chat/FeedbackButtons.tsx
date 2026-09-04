import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { AgentPhase } from '../../types';

interface FeedbackButtonsProps {
  phase: AgentPhase;
  onWorked: () => void;
  onNotWorked: () => void;
}

const showFeedbackPhases: AgentPhase[] = ['guiding', 'awaiting-feedback', 'retrying'];

export default function FeedbackButtons({ phase, onWorked, onNotWorked }: FeedbackButtonsProps) {
  if (!showFeedbackPhases.includes(phase)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 px-4 pb-2 justify-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onWorked}
        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
      >
        <ThumbsUp size={15} />
        It worked!
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNotWorked}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <ThumbsDown size={15} />
        Still not working
      </motion.button>
    </motion.div>
  );
}
