import type {
  TechLevel,
  ProblemCategory,
  DeviceType,
  TroubleshootingStep,
  AgentPhase,
} from '../types';
import { deviceLabel, categoryLabel } from './utils';

// ─── Helper ────────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Greeting ─────────────────────────────────────────────────────────────────

export function greetingResponse(): string {
  return pick([
    "Hey there! 👋 I'm TechBridge — your technology helper. What's going on with your device today?",
    "Hi! I'm TechBridge 👋 Tell me what's not working and we'll sort it out together.",
    "Hello! 👋 I'm here to help you fix any tech problem. What seems to be the issue today?",
  ]);
}

// ─── Asking for the device ─────────────────────────────────────────────────────

export function askForDevice(category: ProblemCategory): string {
  const cat = categoryLabel(category);
  return pick([
    `Let's fix that ${cat} issue together. First — which device are you having trouble with? Is it a phone, laptop, tablet, or something else?`,
    `Happy to help with that! Are you having this ${cat} problem on your phone, laptop, or another device?`,
    `Got it! To give you the right steps, can you tell me — are you using a phone, laptop, TV, or something else?`,
  ]);
}

// ─── Asking for more detail ────────────────────────────────────────────────────

export function askForMoreDetail(): string {
  return pick([
    "Can you tell me a little more about what's happening? For example, what do you see on the screen right now?",
    "I want to make sure I help you correctly. Can you describe what you see or what happened just before this started?",
    "To help you best — what exactly is the problem you're seeing? Any error message or unusual behaviour?",
  ]);
}

// ─── Clarifying question: category ─────────────────────────────────────────────

export function clarifyingQuestion(device: DeviceType): string {
  const d = deviceLabel(device);
  return pick([
    `What exactly is happening with your ${d}? Is it not turning on, running slow, not connecting, or something else?`,
    `What's the main problem with your ${d} right now?`,
    `Can you describe what your ${d} is doing (or not doing)?`,
  ]);
}

// ─── Presenting a step ────────────────────────────────────────────────────────

export function presentStep(
  step: TroubleshootingStep,
  stepNumber: number,
  totalSteps: number,
  techLevel: TechLevel,
): string {
  const prefix =
    techLevel === 'beginner'
      ? `Okay, let's try this together. Here's Step ${stepNumber} of ${totalSteps}:`
      : techLevel === 'intermediate'
        ? `Step ${stepNumber} of ${totalSteps}:`
        : `Step ${stepNumber}/${totalSteps}:`;

  const body =
    techLevel === 'beginner'
      ? `**${step.title}**\n\n${step.instruction}\n\nTake your time — there's no rush. 😊`
      : `**${step.title}**\n\n${step.instruction}`;

  const followUp = step.followUp
    ? `\n\n${step.followUp}`
    : '\n\nLet me know when you\'ve done this, or if you need help with any part of it.';

  return `${prefix}\n\n${body}${followUp}`;
}

// ─── Step feedback responses ──────────────────────────────────────────────────

export function stepWorkedResponse(isLastStep: boolean): string {
  if (isLastStep) {
    return pick([
      "That's all the steps! 🎉 Let me know if the problem is fully solved.",
      "You made it through all the steps! 🙌 Is everything working now?",
    ]);
  }
  return pick([
    "Great, that step worked! Let's continue with the next one. 👍",
    "Excellent! Moving on to the next step.",
    "Perfect! Keep going — one more step.",
  ]);
}

export function stepFailedResponse(hasMoreSolutions: boolean): string {
  if (hasMoreSolutions) {
    return pick([
      "No problem — that happens sometimes. Let's try a different approach.",
      "That's okay. Let me try another method that might work better for your situation.",
      "Don't worry! I have another solution we can try.",
    ]);
  }
  return escalationResponse('unknown', 'unknown');
}

// ─── Solution found ───────────────────────────────────────────────────────────

export function solutionIntroResponse(
  category: ProblemCategory,
  device: DeviceType,
  techLevel: TechLevel,
): string {
  const d = deviceLabel(device);
  const c = categoryLabel(category);

  if (techLevel === 'beginner') {
    return pick([
      `No worries at all — ${c} issues are very common. I'm going to walk you through this step by step. You've got this! 💪`,
      `I can help you fix the ${c} problem on your ${d}! We'll go through it together, one small step at a time. Ready?`,
    ]);
  }

  if (techLevel === 'intermediate') {
    return `Got it. Let's troubleshoot the ${c} issue on your ${d}. I'll take you through the most likely fixes.`;
  }

  return `Understood. Here's the troubleshooting sequence for ${c} on ${d}.`;
}

// ─── Image analysis ───────────────────────────────────────────────────────────

export function imageAnalysisResponse(hasImage: boolean): string {
  if (!hasImage) return '';
  return pick([
    "I can see the screenshot you shared. Let me look at what's on the screen...",
    "Thanks for the screenshot — that really helps! Looking at it now...",
    "I've got your screenshot. Let me analyse what's shown...",
  ]);
}

export function imageDescriptionResponse(): string {
  return pick([
    "From your screenshot I can see an error or settings screen. Can you tell me what you were trying to do when this appeared?",
    "I can see the screen in your image. Can you describe in your own words what problem you're experiencing?",
    "I've looked at your screenshot. To give you accurate steps, can you tell me what you were doing when this showed up?",
  ]);
}

// ─── Escalation ───────────────────────────────────────────────────────────────

export function escalationResponse(
  _category: ProblemCategory | string,
  _device: DeviceType | string,
): string {
  return `I've done my best to help, but this problem may need a specialist to look at it properly.\n\n**Here's what I recommend:**\n- If it's under warranty, contact the manufacturer's support.\n- Visit a local tech repair shop.\n- For internet problems, call your internet provider's helpline.\n\nPlease don't attempt anything you're not comfortable with — it's always safer to ask an expert when in doubt. 🙏`;
}

// ─── Safety warning ───────────────────────────────────────────────────────────

export function safetyWarning(): string {
  return "⚠️ For your safety: never share your passwords, OTPs, or banking details with anyone — including tech support staff who call you unexpectedly. If someone is asking for this, it may be a scam.";
}

// ─── Resolution ───────────────────────────────────────────────────────────────

export function resolutionResponse(techLevel: TechLevel): string {
  if (techLevel === 'beginner') {
    return pick([
      "Brilliant! You did it! 🎉 I'm so glad we sorted that out together. Your device should be working fine now.",
      "Amazing — problem solved! 🎊 You handled that perfectly. Don't hesitate to come back if anything else comes up.",
      "Wonderful! 🙌 The problem is fixed! You did a great job following the steps.",
    ]);
  }
  return pick([
    "Problem resolved! ✅ Glad that worked. Let me know if anything else comes up.",
    "All fixed! ✅ Nice work.",
    "Sorted! ✅ Feel free to start another session if needed.",
  ]);
}

// ─── Phase: Identifying device ────────────────────────────────────────────────

export function identifyingDeviceMessage(category: ProblemCategory): string {
  return askForDevice(category);
}

// ─── Phase transitions ─────────────────────────────────────────────────────────

export function phaseMessage(
  phase: AgentPhase,
  context: {
    category?: ProblemCategory;
    device?: DeviceType;
    techLevel?: TechLevel;
  },
): string {
  switch (phase) {
    case 'greeting':
      return greetingResponse();
    case 'identifying':
      return askForDevice(context.category ?? 'unknown');
    case 'clarifying':
      return context.device
        ? clarifyingQuestion(context.device)
        : askForMoreDetail();
    case 'escalating':
      return escalationResponse(context.category ?? 'unknown', context.device ?? 'unknown');
    default:
      return '';
  }
}
