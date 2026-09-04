import { motion } from 'framer-motion';
import {
  Wifi, Smartphone, Laptop, Printer, Tv, AppWindow, HardDrive, KeyRound,
  ArrowRight, Shield, Zap, Heart,
} from 'lucide-react';
import type { ProblemCategory } from '../types';
import { containerVariants, fadeUpVariants } from '../lib/motion';

interface LandingPageProps {
  onStart: (category?: ProblemCategory) => void;
}

const categories = [
  { id: 'wifi'       as ProblemCategory, label: 'Wi-Fi / Internet',  icon: Wifi,       color: 'bg-blue-50   text-blue-600   border-blue-100' },
  { id: 'smartphone' as ProblemCategory, label: 'Smartphone',        icon: Smartphone, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 'laptop'     as ProblemCategory, label: 'Laptop / Computer', icon: Laptop,     color: 'bg-slate-50  text-slate-600  border-slate-100' },
  { id: 'printer'    as ProblemCategory, label: 'Printer',           icon: Printer,    color: 'bg-amber-50  text-amber-600  border-amber-100' },
  { id: 'smart-tv'   as ProblemCategory, label: 'Smart TV',          icon: Tv,         color: 'bg-rose-50   text-rose-600   border-rose-100' },
  { id: 'app'        as ProblemCategory, label: 'App Problems',      icon: AppWindow,  color: 'bg-green-50  text-green-600  border-green-100' },
  { id: 'storage'    as ProblemCategory, label: 'Storage Full',      icon: HardDrive,  color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { id: 'account'    as ProblemCategory, label: 'Account / Login',   icon: KeyRound,   color: 'bg-teal-50   text-teal-600   border-teal-100' },
];

const features = [
  { icon: Zap,    title: 'Step-by-step guidance', description: 'One clear action at a time — no walls of text, no confusing jargon.' },
  { icon: Heart,  title: 'Patient & friendly',    description: 'Like having a tech-savvy family member right beside you.' },
  { icon: Shield, title: 'Safe advice only',      description: "We never ask for passwords, and always recommend professionals for risky tasks." },
];

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg font-bold leading-none">T</span>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">TechBridge</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => onStart()}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Get Help Now <ArrowRight size={16} />
        </motion.button>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <motion.main
        className="flex-1 flex flex-col items-center px-4 pt-10 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUpVariants}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
            AI-powered tech support for everyone
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUpVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 text-center leading-tight max-w-3xl"
        >
          Technology help,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            explained simply.
          </span>
        </motion.h1>

        <motion.p variants={fadeUpVariants}
          className="mt-5 text-lg sm:text-xl text-slate-500 text-center max-w-xl leading-relaxed"
        >
          Describe your tech problem in plain language. TechBridge walks you
          through a fix — step by step, at your own pace.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUpVariants} className="mt-8 flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => onStart()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-base font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Start solving my problem <ArrowRight size={18} />
          </motion.button>
          <a
            href="#categories"
            className="flex items-center justify-center px-8 py-4 bg-white text-slate-700 rounded-2xl text-base font-semibold border border-slate-200 hover:border-blue-200 hover:text-blue-600 transition-colors shadow-sm"
          >
            Browse categories
          </a>
        </motion.div>

        {/* Features */}
        <motion.div variants={containerVariants} className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl w-full">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUpVariants}
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <f.icon size={22} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Category grid ──────────────────────────────────────────────────── */}
        <motion.section id="categories" variants={containerVariants} className="mt-20 w-full max-w-4xl">
          <motion.div variants={fadeUpVariants} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">What can TechBridge help with?</h2>
            <p className="text-slate-500 mt-2">Choose a category below to jump straight to it, or just describe your problem.</p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                variants={fadeUpVariants}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onStart(cat.id)}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${cat.color} hover:shadow-md`}
              >
                <cat.icon size={28} />
                <span className="text-sm font-semibold text-center leading-tight">{cat.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Example interaction ─────────────────────────────────────────────── */}
        <motion.section variants={containerVariants} className="mt-20 w-full max-w-2xl">
          <motion.div variants={fadeUpVariants} className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">See it in action</h2>
            <p className="text-slate-500 mt-1 text-sm">A real example of how TechBridge guides you.</p>
          </motion.div>

          <motion.div variants={containerVariants} className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col gap-3">
            {[
              { role: 'user',      text: "My internet isn't working." },
              { role: 'assistant', text: "Let's fix it together! First — are you using Wi-Fi on a phone, laptop, or another device? 😊" },
              { role: 'user',      text: "On my phone." },
              { role: 'assistant', text: "Step 1 of 4: Toggle Wi-Fi off and on\n\nOpen your Settings, tap Wi-Fi, turn it OFF, wait 5 seconds, then turn it back ON.\n\nDid your phone reconnect?" },
              { role: 'user',      text: "Yes it did!" },
              { role: 'assistant', text: "Fantastic! 🎉 Problem solved! Your Wi-Fi is back up and running." },
            ].map((msg, i) => (
              <motion.div key={i} variants={fadeUpVariants} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUpVariants} className="mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Ready to fix your problem?</h2>
          <p className="text-slate-500 mb-6">No sign-up needed. Just describe what's wrong.</p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => onStart()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-base font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Get help now <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </motion.main>

      <footer className="text-center py-6 text-xs text-slate-400">
        TechBridge — Technology help for everyone · Built with ❤️
      </footer>
    </div>
  );
}
