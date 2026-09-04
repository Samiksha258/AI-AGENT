import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import ProgressBar from '../components/chat/ProgressBar';
import DeviceSelector from '../components/chat/DeviceSelector';
import FeedbackButtons from '../components/chat/FeedbackButtons';
import ChatInput from '../components/chat/ChatInput';

import { agentStep, createSession, getInitialGreeting } from '../agent/engine';
import type { TroubleshootingSession, DeviceType, ProblemCategory } from '../types';
import { CATEGORIES } from '../constants/categories';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssistantPageProps {
  initialCategory?: ProblemCategory;
  onResolved: (session: TroubleshootingSession) => void;
  onBack: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simulated typing delay — makes the agent feel natural */
function typingDelay(text: string): number {
  const words = text.split(' ').length;
  return Math.min(2400, Math.max(700, words * 60));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssistantPage({ initialCategory, onResolved, onBack }: AssistantPageProps) {
  const [session, setSession] = useState<TroubleshootingSession>(() => {
    const s = createSession();
    if (initialCategory) s.category = initialCategory;
    return s;
  });

  const [messages, setMessages] = useState(() => [getInitialGreeting()]);
  const [isTyping, setIsTyping] = useState(false);

  // If a category was pre-selected, append a follow-up after the greeting
  const [didPreload, setDidPreload] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Pre-load a category clarification after mount if we came from the landing page
  useEffect(() => {
    if (!initialCategory || didPreload) return;
    setDidPreload(true);

    const catMeta = CATEGORIES.find((c) => c.id === initialCategory);
    if (!catMeta) return;

    setIsTyping(true);
    const delay = setTimeout(() => {
      const preloadMsg = {
        id: `pre-${Date.now()}`,
        role: 'assistant' as const,
        content: `I see you're having a **${catMeta.label}** problem. Tell me more — what exactly is happening?`,
        timestamp: new Date(),
        status: 'delivered' as const,
        agentMeta: { phase: 'clarifying' as const, category: initialCategory },
      };
      setMessages((prev) => [...prev, preloadMsg]);
      setSession((prev) => ({ ...prev, phase: 'clarifying', category: initialCategory }));
      setIsTyping(false);
    }, 900);

    return () => clearTimeout(delay);
  }, [initialCategory, didPreload]);

  // ── Send handler ────────────────────────────────────────────────────────────

  const handleSend = useCallback(
    (text: string, imageData?: string) => {
      if (!text.trim() && !imageData) return;

      // Optimistically add user message to UI
      const tempUserMsg = {
        id: `user-${Date.now()}`,
        role: 'user' as const,
        content: text,
        timestamp: new Date(),
        status: 'delivered' as const,
        imageData,
      };
      setMessages((prev) => [...prev, tempUserMsg]);
      setIsTyping(true);

      // Run agent step after simulated typing delay
      const delay = typingDelay(text);
      setTimeout(() => {
        const result = agentStep({ session, userText: text, imageData });
        // result.session.messages already has both user + assistant messages
        // We manage our own messages list separately so the UI stays responsive
        const assistantMsg = result.assistantMessage;

        setMessages((prev) => [...prev, assistantMsg]);
        setSession(result.session);
        setIsTyping(false);

        // Navigate to resolution if resolved
        if (result.session.phase === 'resolved') {
          setTimeout(() => onResolved(result.session), 1800);
        }
      }, delay);
    },
    [session, onResolved],
  );

  // ── Quick feedback handlers ─────────────────────────────────────────────────

  const handleWorked = useCallback(() => handleSend('Yes, it worked!'), [handleSend]);
  const handleNotWorked = useCallback(() => handleSend('No, it still isn\'t working.'), [handleSend]);

  // ── Device change ────────────────────────────────────────────────────────────

  const handleDeviceChange = useCallback(
    (device: DeviceType) => {
      if (session.phase !== 'greeting' && session.phase !== 'identifying') return;
      handleSend(`I'm using a ${device}.`);
    },
    [session.phase, handleSend],
  );

  // ── Restart ──────────────────────────────────────────────────────────────────

  function handleRestart() {
    const newSession = createSession();
    setSession(newSession);
    setMessages([getInitialGreeting()]);
    setDidPreload(false);
    setIsTyping(false);
  }

  // ── Derived state ─────────────────────────────────────────────────────────────

  const currentStep = session.stepIndex;
  const totalSteps = (() => {
    if (!session.activeSolutionId) return 0;
    // Lazy import to avoid circular dep — count steps via session meta
    return messages
      .filter((m) => m.agentMeta?.totalSteps)
      .slice(-1)[0]?.agentMeta?.totalSteps ?? 4;
  })();

  const isResolved = session.phase === 'resolved';
  const isEscalating = session.phase === 'escalating';
  const showFeedback = !isTyping && (session.phase === 'guiding' || session.phase === 'awaiting-feedback');

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            aria-label="Back to home"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold leading-none">T</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800 text-sm">TechBridge</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400">AI Assistant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isResolved && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
              <CheckCircle2 size={12} />
              Solved!
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRestart}
            aria-label="Start new session"
            title="Start a new session"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
          </motion.button>
        </div>
      </header>

      {/* ── Progress bar ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <ProgressBar
          phase={session.phase}
          currentStep={currentStep}
          totalSteps={totalSteps || 4}
        />
      </div>

      {/* ── Device selector ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <DeviceSelector
          selected={session.device}
          onChange={handleDeviceChange}
          disabled={session.phase !== 'greeting' && session.phase !== 'identifying' && session.phase !== 'clarifying'}
        />
      </div>

      {/* ── Messages ──────────────────────────────────────────────────────────── */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto py-4 flex flex-col gap-3"
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resolution card */}
        <AnimatePresence>
          {isResolved && !isTyping && (
            <motion.div
              key="resolved-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center gap-2 text-center"
            >
              <CheckCircle2 size={32} className="text-emerald-500" />
              <p className="font-semibold text-emerald-800 text-sm">
                Great — problem solved!
              </p>
              <p className="text-xs text-emerald-600">
                Loading your solution summary…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Escalation reminder */}
        {isEscalating && !isTyping && (
          <div className="mx-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-700 text-center">
            💡 Tip: When contacting support, describe the steps you've already tried — it helps them assist you faster.
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Feedback buttons ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <AnimatePresence>
          {showFeedback && (
            <FeedbackButtons
              phase={session.phase}
              onWorked={handleWorked}
              onNotWorked={handleNotWorked}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat input ────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <ChatInput
          onSend={handleSend}
          phase={session.phase}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}
