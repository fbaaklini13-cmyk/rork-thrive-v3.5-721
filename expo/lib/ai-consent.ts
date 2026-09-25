/**
 * Consent to send data to the outside AI service -- one flag, checked everywhere.
 *
 * Found 25 Sep (App Privacy draft): the "AI Assistant" switch never said where data goes,
 * and three of six AI features (workout plans, body scanner, supplements, recipes) did not
 * check it at all. App Review guideline 5.1.2(i): "You must clearly disclose where personal
 * data will be shared with third parties, including with third-party AI, and obtain
 * explicit permission before doing so."
 *
 * Two layers:
 *  - UI: AIConsentProvider.requestAIConsent() shows the disclosure the first time an AI
 *    feature is used and records the answer (profile.aiConsent, versioned).
 *  - Backstop: every function in services/ai-service.ts calls requireAIConsent() first,
 *    so a caller that forgets the UI step throws instead of sending data.
 * scripts/verify-ai-consent.ts checks both, including a scan of the source for AI calls
 * that bypass the gate.
 */
import type { UserProfile } from '@/types/user';

// Bump when the disclosure text changes materially: everyone is asked again.
export const AI_CONSENT_VERSION = 1;

export const AI_SERVICE = {
  name: "Rork's AI service",
  host: 'toolkit.rork.com',
};

/** What each AI feature sends. The consent screen shows exactly this list. */
export const AI_DATA_USES: { feature: string; sends: string }[] = [
  { feature: 'Workout plans', sends: 'the goals and equipment you type, days per week, and your activity level' },
  { feature: 'Meal analysis', sends: 'the meal you describe or photograph, your calorie target, dietary preferences, allergies, target weight and weekly goal' },
  { feature: 'Exercise swaps', sends: 'the exercise name, its muscle groups, your equipment and activity level' },
  { feature: 'Body scanner (Premium)', sends: 'the body photo you choose' },
  { feature: 'Supplement plan (Premium)', sends: 'your age, height, weight, goal, activity level and dietary preferences' },
  { feature: 'Recipes (Premium)', sends: 'the recipe preferences you choose' },
];

type ConsentFields = Pick<UserProfile, 'aiEnabled' | 'aiConsent'>;

export function hasAIConsent(p: Partial<ConsentFields> | null | undefined): boolean {
  return !!p && p.aiEnabled === true && p.aiConsent?.version === AI_CONSENT_VERSION;
}

export function consentGrant(now: Date = new Date()): Pick<UserProfile, 'aiEnabled' | 'aiConsent'> {
  return { aiEnabled: true, aiConsent: { version: AI_CONSENT_VERSION, grantedAt: now.toISOString() } };
}

export function consentRevoke(): Pick<UserProfile, 'aiEnabled' | 'aiConsent'> {
  return { aiEnabled: false, aiConsent: undefined };
}

// ---- service-layer backstop -------------------------------------------------------
let granted = false;
export function setAIConsentGate(value: boolean): void { granted = value; }

export class AIConsentRequiredError extends Error {
  constructor() {
    super('AI features are off until you allow them (Profile -> AI Assistant).');
    this.name = 'AIConsentRequiredError';
  }
}

export function requireAIConsent(): void {
  if (!granted) throw new AIConsentRequiredError();
}
