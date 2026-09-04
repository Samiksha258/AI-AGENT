import type { ProblemCategory, DeviceType, TechLevel } from '../types';
import { CATEGORIES, DEVICES } from '../constants/categories';

/** Generate a unique ID */
export function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Normalise text for matching: lowercase + remove punctuation */
function normalise(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
}

/** Detect the problem category from free-form text */
export function detectCategory(text: string): ProblemCategory {
  const n = normalise(text);
  let best: ProblemCategory = 'unknown';
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    const score = cat.keywords.reduce(
      (acc, kw) => acc + (n.includes(kw) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = cat.id;
    }
  }
  return best;
}

/** Detect the device type from free-form text */
export function detectDevice(text: string): DeviceType {
  const n = normalise(text);
  let best: DeviceType = 'unknown';
  let bestScore = 0;

  for (const dev of DEVICES) {
    const score = dev.keywords.reduce(
      (acc, kw) => acc + (n.includes(kw) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = dev.id;
    }
  }
  return best;
}

/** Estimate user technical level from the way they describe their problem */
export function estimateTechLevel(text: string): TechLevel {
  const advanced = ['terminal', 'cmd', 'command prompt', 'ipconfig', 'dns', 'ping', 'driver', 'registry', 'bios', 'ssh', 'ip address', 'subnet', 'gateway', 'flush', 'firewall', 'port'];
  const intermediate = ['settings', 'restart', 'update', 'install', 'uninstall', 'wifi password', 'network', 'cache', 'task manager'];

  const n = normalise(text);
  const advScore = advanced.filter((kw) => n.includes(kw)).length;
  const intScore = intermediate.filter((kw) => n.includes(kw)).length;

  if (advScore >= 2) return 'advanced';
  if (advScore >= 1 || intScore >= 2) return 'intermediate';
  return 'beginner';
}

/** Detect whether the user is saying yes / it worked */
export function isAffirmative(text: string): boolean {
  const n = normalise(text);
  const yes = ['yes', 'yeah', 'yep', 'yup', 'it worked', 'worked', 'fixed', 'it fixed', 'solved', 'done', 'connected', 'ok ', 'okay', 'great', 'perfect', 'it works', 'working now', 'thank', 'success', '👍', 'sure', 'correct', 'right', 'it did'];
  return yes.some((w) => n.includes(w));
}

/** Detect whether the user is saying no / it didn't work */
export function isNegative(text: string): boolean {
  const n = normalise(text);
  const no = ['no', 'nope', 'nah', 'didn\'t work', 'did not work', 'not working', 'still', 'same', 'nothing', 'nothing happened', 'doesn\'t work', 'does not work', 'failed', 'not fixed', 'not connected', 'still broken', '👎', 'no change', 'no luck'];
  return no.some((w) => n.includes(w));
}

/** Detect whether the user needs an escalation / is mentioning hardware damage */
export function needsEscalation(text: string): boolean {
  const n = normalise(text);
  const triggers = ['smoke', 'burning', 'sparks', 'cracked', 'shattered', 'dropped', 'water damage', 'wet', 'flood', 'broken screen', 'physically', 'hardware'];
  return triggers.some((t) => n.includes(t));
}

/** Device-friendly label */
export function deviceLabel(device: DeviceType): string {
  return DEVICES.find((d) => d.id === device)?.label ?? 'device';
}

/** Category-friendly label */
export function categoryLabel(cat: ProblemCategory): string {
  return CATEGORIES.find((c) => c.id === cat)?.label ?? 'problem';
}
