/**
 * TechBridge Agent Engine
 *
 * This module implements the full agentic loop:
 *   Understand → Identify → Clarify → Strategise → Guide → Observe → Adapt → Verify
 *
 * It is a pure function: given the current session state + user input,
 * it returns the next session state + the assistant's response text.
 */

import type {
  TroubleshootingSession,
  ChatMessage,
} from '../types';

import {
  uid,
  detectCategory,
  detectDevice,
  estimateTechLevel,
  isAffirmative,
  isNegative,
  needsEscalation,
} from './utils';

import {
  greetingResponse,
  askForDevice,
  askForMoreDetail,
  clarifyingQuestion,
  presentStep,
  stepFailedResponse,
  solutionIntroResponse,
  imageAnalysisResponse,
  imageDescriptionResponse,
  escalationResponse,
  resolutionResponse,
} from './responses';

import { findSolutions, getSolutionById } from '../constants/solutions';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgentInput {
  session: TroubleshootingSession;
  userText: string;
  imageData?: string; // Base64 or object-URL
}

export interface AgentOutput {
  session: TroubleshootingSession;
  assistantMessage: ChatMessage;
}

// ─── Session Factory ──────────────────────────────────────────────────────────

export function createSession(): TroubleshootingSession {
  return {
    id: uid(),
    startedAt: new Date(),
    problem: '',
    device: 'unknown',
    category: 'unknown',
    techLevel: 'beginner',
    messages: [],
    phase: 'greeting',
    attemptedSolutionIds: [],
    stepIndex: 0,
  };
}

// ─── Build assistant message ──────────────────────────────────────────────────

function assistantMsg(content: string, session: TroubleshootingSession): ChatMessage {
  return {
    id: uid(),
    role: 'assistant',
    content,
    timestamp: new Date(),
    status: 'delivered',
    agentMeta: {
      phase: session.phase,
      category: session.category,
      device: session.device,
      techLevel: session.techLevel,
      currentStepIndex: session.stepIndex,
      activeSolutionId: session.activeSolutionId,
    },
  };
}

// ─── Main agent loop ──────────────────────────────────────────────────────────

export function agentStep(input: AgentInput): AgentOutput {
  // Deep-clone session so we never mutate the original
  let session: TroubleshootingSession = {
    ...input.session,
    messages: [...input.session.messages],
    attemptedSolutionIds: [...input.session.attemptedSolutionIds],
  };

  const userText = input.userText.trim();
  const hasImage = Boolean(input.imageData);

  // ── Append user message ────────────────────────────────────────────────────
  const userMsg: ChatMessage = {
    id: uid(),
    role: 'user',
    content: userText,
    timestamp: new Date(),
    status: 'delivered',
    imageData: input.imageData,
  };
  session.messages = [...session.messages, userMsg];

  // ── Safety check first ─────────────────────────────────────────────────────
  if (needsEscalation(userText)) {
    session.phase = 'escalating';
    const msg = assistantMsg(escalationResponse(session.category, session.device), session);
    session.messages = [...session.messages, msg];
    return { session, assistantMessage: msg };
  }

  let responseText = '';

  switch (session.phase) {

    // ── GREETING: First message from user ─────────────────────────────────────
    case 'greeting': {
      session.problem = userText;
      session.techLevel = estimateTechLevel(userText);
      session.category = detectCategory(userText);
      session.device = detectDevice(userText);

      // If we have an image, address it first
      if (hasImage) {
        responseText = imageAnalysisResponse(true) + '\n\n' + imageDescriptionResponse();
        session.phase = 'clarifying';
        break;
      }

      // We identified category but not device → ask for device
      if (session.category !== 'unknown' && session.device === 'unknown') {
        responseText = askForDevice(session.category);
        session.phase = 'identifying';
        break;
      }

      // We identified category AND device → go straight to strategising
      if (session.category !== 'unknown' && session.device !== 'unknown') {
        session.phase = 'strategising';
        responseText = strategise(session);
        break;
      }

      // We didn't understand much → ask for more detail
      responseText = askForMoreDetail();
      session.phase = 'clarifying';
      break;
    }

    // ── IDENTIFYING: We asked for the device, waiting for the answer ──────────
    case 'identifying': {
      const detectedDevice = detectDevice(userText);
      if (detectedDevice !== 'unknown') {
        session.device = detectedDevice;
      } else {
        // Still unknown — make a reasonable guess from context or ask again
        responseText = "I didn't quite catch the device. Could you tell me — is it a phone, laptop, tablet, TV, or printer?";
        break;
      }

      // Also try to refine category from this message
      const detectedCat = detectCategory(userText);
      if (detectedCat !== 'unknown') session.category = detectedCat;

      // If category is still unknown, clarify
      if (session.category === 'unknown') {
        session.phase = 'clarifying';
        responseText = clarifyingQuestion(session.device);
        break;
      }

      session.phase = 'strategising';
      responseText = strategise(session);
      break;
    }

    // ── CLARIFYING: Waiting for more context ──────────────────────────────────
    case 'clarifying': {
      // Try to extract category and device from clarification
      const cat = detectCategory(userText);
      const dev = detectDevice(userText);
      if (cat !== 'unknown') session.category = cat;
      if (dev !== 'unknown') session.device = dev;

      // If still missing device, ask one more time
      if (session.device === 'unknown') {
        responseText = "Just to confirm — which device are you using? (Phone, laptop, tablet, printer, TV, etc.)";
        break;
      }

      // If still missing category, ask what specifically is wrong
      if (session.category === 'unknown') {
        session.problem += ' ' + userText;
        session.category = detectCategory(session.problem);
      }

      if (session.category === 'unknown') {
        responseText = "Can you describe what's not working? For example: Wi-Fi, a frozen screen, an app, or something else?";
        break;
      }

      session.phase = 'strategising';
      responseText = strategise(session);
      break;
    }

    // ── GUIDING: We're walking through steps ──────────────────────────────────
    case 'guiding':
    case 'awaiting-feedback': {
      if (isAffirmative(userText)) {
        return handleStepSuccess(session);
      }

      if (isNegative(userText)) {
        return handleStepFailure(session);
      }

      // Neutral / unclear → re-present the current step or ask for confirmation
      const sol = session.activeSolutionId
        ? getSolutionById(session.activeSolutionId)
        : null;

      if (sol && session.stepIndex < sol.steps.length) {
        const currentStep = sol.steps[session.stepIndex];
        responseText = `No worries! Let me clarify Step ${session.stepIndex + 1}:\n\n**${currentStep.title}**\n\n${currentStep.instruction}\n\nJust let me know when you've tried this, or if you need help with any part.`;
        session.phase = 'awaiting-feedback';
      } else {
        responseText = "Let me know if the issue is resolved or if you're still having trouble.";
      }
      break;
    }

    // ── RETRYING: Starting a new solution path ────────────────────────────────
    case 'retrying': {
      session.phase = 'strategising';
      responseText = strategise(session);
      break;
    }

    // ── ESCALATING / RESOLVED: Session is over ────────────────────────────────
    case 'escalating':
    case 'resolved': {
      responseText = "Is there anything else I can help you with? Feel free to start a new session.";
      break;
    }

    default: {
      responseText = greetingResponse();
      break;
    }
  }

  const msg = assistantMsg(responseText, session);
  session.messages = [...session.messages, msg];
  return { session, assistantMessage: msg };
}

// ─── Strategise ────────────────────────────────────────────────────────────────

function strategise(session: TroubleshootingSession): string {
  const solutions = findSolutions(session.category, session.device).filter(
    (s) => !session.attemptedSolutionIds.includes(s.id),
  );

  if (solutions.length === 0) {
    session.phase = 'escalating';
    return escalationResponse(session.category, session.device);
  }

  const chosen = solutions[0];
  session.activeSolutionId = chosen.id;
  session.stepIndex = 0;
  session.phase = 'guiding';

  const intro = solutionIntroResponse(session.category, session.device, session.techLevel);
  const firstStep = presentStep(chosen.steps[0], 1, chosen.steps.length, session.techLevel);

  return `${intro}\n\n${firstStep}`;
}

// ─── Step success ──────────────────────────────────────────────────────────────

function handleStepSuccess(session: TroubleshootingSession): AgentOutput {
  const sol = session.activeSolutionId
    ? getSolutionById(session.activeSolutionId)
    : null;

  if (!sol) {
    session.phase = 'resolved';
    const text = resolutionResponse(session.techLevel);
    session.solutionSummary = buildSummary(session);
    const msg = assistantMsg(text, session);
    session.messages = [...session.messages, msg];
    return { session, assistantMessage: msg };
  }

  const nextIndex = session.stepIndex + 1;

  // All steps done → resolved
  if (nextIndex >= sol.steps.length) {
    session.phase = 'resolved';
    session.resolvedAt = new Date();
    session.solutionSummary = buildSummary(session);
    const text = resolutionResponse(session.techLevel);
    const msg = assistantMsg(text, session);
    session.messages = [...session.messages, msg];
    return { session, assistantMessage: msg };
  }

  // Advance to next step
  session.stepIndex = nextIndex;
  session.phase = 'awaiting-feedback';
  const nextStep = sol.steps[nextIndex];
  const text = presentStep(nextStep, nextIndex + 1, sol.steps.length, session.techLevel);
  const msg = assistantMsg(text, session);
  session.messages = [...session.messages, msg];
  return { session, assistantMessage: msg };
}

// ─── Step failure ──────────────────────────────────────────────────────────────

function handleStepFailure(session: TroubleshootingSession): AgentOutput {
  const sol = session.activeSolutionId
    ? getSolutionById(session.activeSolutionId)
    : null;

  if (!sol) {
    session.phase = 'escalating';
    const text = escalationResponse(session.category, session.device);
    const msg = assistantMsg(text, session);
    session.messages = [...session.messages, msg];
    return { session, assistantMessage: msg };
  }

  const nextStepIndex = session.stepIndex + 1;

  // Try next step in current solution
  if (nextStepIndex < sol.steps.length) {
    session.stepIndex = nextStepIndex;
    session.phase = 'awaiting-feedback';
    const nextStep = sol.steps[nextStepIndex];
    const text =
      `That's okay — let's try something slightly different.\n\n` +
      presentStep(nextStep, nextStepIndex + 1, sol.steps.length, session.techLevel);
    const msg = assistantMsg(text, session);
    session.messages = [...session.messages, msg];
    return { session, assistantMessage: msg };
  }

  // Current solution exhausted — mark attempted and try another
  session.attemptedSolutionIds = [...session.attemptedSolutionIds, sol.id];

  const alternatives = findSolutions(session.category, session.device).filter(
    (s) => !session.attemptedSolutionIds.includes(s.id),
  );

  if (alternatives.length > 0) {
    session.phase = 'retrying';
    const text = stepFailedResponse(true);
    const msg = assistantMsg(text, session);
    session.messages = [...session.messages, msg];
    // Immediately pick next solution
    const next = strategise(session);
    const msg2 = assistantMsg(next, session);
    session.messages = [...session.messages, msg2];
    return { session, assistantMessage: msg2 };
  }

  // No more solutions
  session.phase = 'escalating';
  const text = escalationResponse(session.category, session.device);
  const msg = assistantMsg(text, session);
  session.messages = [...session.messages, msg];
  return { session, assistantMessage: msg };
}

// ─── Build solution summary ────────────────────────────────────────────────────

function buildSummary(session: TroubleshootingSession): string {
  const sol = session.activeSolutionId
    ? getSolutionById(session.activeSolutionId)
    : null;

  if (!sol) return `Fixed: ${session.problem}`;

  const stepsDone = sol.steps
    .slice(0, session.stepIndex + 1)
    .map((s, i) => `${i + 1}. ${s.title}`)
    .join('\n');

  return `**Problem:** ${session.problem}\n\n**Solution:** ${sol.title}\n\n**Steps that resolved it:**\n${stepsDone}`;
}

// ─── Initial greeting ──────────────────────────────────────────────────────────

export function getInitialGreeting(): ChatMessage {
  return {
    id: uid(),
    role: 'assistant',
    content: greetingResponse(),
    timestamp: new Date(),
    status: 'delivered',
    agentMeta: { phase: 'greeting' },
  };
}
