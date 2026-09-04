import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

/** Very simple markdown renderer — handles **bold** and newlines only */
function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Render newlines as <br>
    const lines = part.split('\n');
    return lines.map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < lines.length - 1 && <br />}
      </span>
    ));
  });
}

const phaseLabels: Record<string, { label: string; color: string }> = {
  greeting:         { label: 'Starting up',        color: 'text-blue-500' },
  identifying:      { label: 'Identifying device',  color: 'text-indigo-500' },
  clarifying:       { label: 'Gathering details',   color: 'text-violet-500' },
  strategising:     { label: 'Finding a solution',  color: 'text-amber-500' },
  guiding:          { label: 'Step-by-step guide',  color: 'text-green-600' },
  'awaiting-feedback': { label: 'Awaiting your feedback', color: 'text-teal-600' },
  retrying:         { label: 'Trying another way',  color: 'text-orange-500' },
  escalating:       { label: 'Recommending support', color: 'text-red-500' },
  resolved:         { label: 'Problem solved!',     color: 'text-emerald-600' },
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const meta = message.agentMeta;
  const phase = meta?.phase;
  const phaseInfo = phase ? phaseLabels[phase] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} px-4`}
    >
      <div className={`flex flex-col gap-1 max-w-[82%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Phase badge — only on assistant messages */}
        {!isUser && phaseInfo && phase !== 'greeting' && (
          <div className={`flex items-center gap-1 text-xs font-medium ${phaseInfo.color}`}>
            {phase === 'resolved' && <CheckCircle size={12} />}
            {phase === 'escalating' && <AlertTriangle size={12} />}
            <span>{phaseInfo.label}</span>
          </div>
        )}

        {/* Image attachment (user uploads) */}
        {message.imageData && (
          <div className={`mb-1 rounded-xl overflow-hidden border border-slate-200 ${isUser ? 'self-end' : 'self-start'}`}>
            <img
              src={message.imageData}
              alt="Uploaded screenshot"
              className="max-w-[220px] max-h-[220px] object-cover block"
            />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-sm shadow-blue-100'
              : 'bg-white text-slate-800 rounded-2xl rounded-bl-sm border border-slate-100 shadow-sm'
            }
          `}
        >
          {renderContent(message.content)}
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-slate-400 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
