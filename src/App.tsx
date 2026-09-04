import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import LandingPage from './pages/LandingPage';
import AssistantPage from './pages/AssistantPage';
import ResolutionPage from './pages/ResolutionPage';

import type { AppPage, TroubleshootingSession, ProblemCategory } from './types';
import { pageVariants } from './lib/motion';

export default function App() {
  const [page, setPage] = useState<AppPage>('landing');
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory | undefined>();
  const [resolvedSession, setResolvedSession] = useState<TroubleshootingSession | null>(null);

  function handleStart(category?: ProblemCategory) {
    setSelectedCategory(category);
    setResolvedSession(null);
    setPage('assistant');
  }

  function handleResolved(session: TroubleshootingSession) {
    setResolvedSession(session);
    setPage('resolution');
  }

  function handleStartAnother() {
    setSelectedCategory(undefined);
    setResolvedSession(null);
    setPage('landing');
  }

  return (
    <AnimatePresence mode="wait">
      {page === 'landing' && (
        <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <LandingPage onStart={handleStart} />
        </motion.div>
      )}

      {page === 'assistant' && (
        <motion.div key="assistant" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-screen">
          <AssistantPage
            initialCategory={selectedCategory}
            onResolved={handleResolved}
            onBack={handleStartAnother}
          />
        </motion.div>
      )}

      {page === 'resolution' && resolvedSession && (
        <motion.div key="resolution" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <ResolutionPage
            session={resolvedSession}
            onStartAnother={handleStartAnother}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
