import { useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, ImagePlus, Mic, X } from 'lucide-react';
import type { AgentPhase } from '../../types';

interface ChatInputProps {
  onSend: (text: string, imageData?: string) => void;
  phase: AgentPhase;
  disabled?: boolean;
}

export default function ChatInput({ onSend, phase, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLocked = disabled || phase === 'resolved' || phase === 'escalating';

  const placeholders: Partial<Record<AgentPhase, string>> = {
    greeting:         'Describe your tech problem…',
    identifying:      'Tell me which device you\'re using…',
    clarifying:       'Give me a bit more detail…',
    guiding:          'Ask a question or tell me how it went…',
    'awaiting-feedback': 'Tell me if the step worked…',
    resolved:         'Problem solved 🎉',
    escalating:       'Please contact support for this one.',
  };

  const placeholder = placeholders[phase] ?? 'Type a message…';

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed && !imageData) return;
    onSend(trimmed || (imageData ? '(screenshot attached)' : ''), imageData ?? undefined);
    setText('');
    setImageData(null);
    setImageFileName('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    // Auto-grow textarea up to 6 lines
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  }

  return (
    <div className="bg-white border-t border-slate-100 px-3 py-3">

      {/* Image preview */}
      {imageData && (
        <div className="mb-2 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
          <img src={imageData} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-xs text-slate-600 truncate flex-1">{imageFileName}</span>
          <button
            onClick={() => { setImageData(null); setImageFileName(''); }}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Image upload */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileRef.current?.click()}
          disabled={isLocked}
          aria-label="Upload screenshot"
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 border border-slate-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ImagePlus size={17} />
        </motion.button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload screenshot file"
        />

        {/* Mic placeholder */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled
          aria-label="Voice input (coming soon)"
          title="Voice input — coming soon"
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
        >
          <Mic size={17} />
        </motion.button>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={isLocked}
          placeholder={placeholder}
          rows={1}
          aria-label="Message input"
          className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
          style={{ minHeight: '40px', maxHeight: '144px' }}
        />

        {/* Send */}
        <motion.button
          whileHover={!isLocked && (text.trim() || imageData) ? { scale: 1.08 } : {}}
          whileTap={!isLocked && (text.trim() || imageData) ? { scale: 0.92 } : {}}
          onClick={handleSend}
          disabled={isLocked || (!text.trim() && !imageData)}
          aria-label="Send message"
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </motion.button>
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-2">
        Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">Enter</kbd> to send · Shift+Enter for new line · Upload a screenshot anytime
      </p>
    </div>
  );
}
