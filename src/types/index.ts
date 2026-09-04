// ─── Message & Chat ───────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'delivered' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
  /** Base64 or object-URL of an attached screenshot */
  imageData?: string;
  /** Structured agent reasoning attached to an assistant message */
  agentMeta?: AgentMeta;
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export type TechLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProblemCategory =
  | 'wifi'
  | 'smartphone'
  | 'laptop'
  | 'printer'
  | 'smart-tv'
  | 'app'
  | 'storage'
  | 'account'
  | 'unknown';

export type DeviceType =
  | 'phone'
  | 'laptop'
  | 'tablet'
  | 'printer'
  | 'smart-tv'
  | 'router'
  | 'desktop'
  | 'other'
  | 'unknown';

export type AgentPhase =
  | 'greeting'          // Initial welcome, waiting for problem description
  | 'identifying'       // Identifying device & category
  | 'clarifying'        // Asking clarifying questions
  | 'strategising'      // Internally deciding which solution path to take
  | 'guiding'           // Presenting step-by-step instructions
  | 'awaiting-feedback' // Waiting for "worked / didn't work"
  | 'retrying'          // Trying an alternative solution
  | 'escalating'        // Problem is too risky/complex — recommend support
  | 'resolved';         // Problem confirmed solved

export interface TroubleshootingStep {
  id: string;
  title: string;
  instruction: string;
  /** Optional follow-up question to ask after this step */
  followUp?: string;
}

export interface SolutionPath {
  id: string;
  category: ProblemCategory;
  device: DeviceType;
  title: string;
  steps: TroubleshootingStep[];
}

export interface AgentMeta {
  phase: AgentPhase;
  /** Category the agent has identified */
  category?: ProblemCategory;
  device?: DeviceType;
  techLevel?: TechLevel;
  currentStepIndex?: number;
  totalSteps?: number;
  activeSolutionId?: string;
  attemptedSolutionIds?: string[];
  reasoning?: string; // Internal chain-of-thought (not shown to user)
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface TroubleshootingSession {
  id: string;
  startedAt: Date;
  resolvedAt?: Date;
  problem: string;
  device: DeviceType;
  category: ProblemCategory;
  techLevel: TechLevel;
  messages: ChatMessage[];
  phase: AgentPhase;
  activeSolutionId?: string;
  attemptedSolutionIds: string[];
  stepIndex: number;
  /** Final solution summary text, set on resolution */
  solutionSummary?: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type AppPage = 'landing' | 'assistant' | 'resolution';

export interface AppState {
  page: AppPage;
  session: TroubleshootingSession | null;
}
