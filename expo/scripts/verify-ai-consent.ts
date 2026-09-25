/**
 * verify-ai-consent.ts -- nothing goes to the outside AI service without recorded consent.
 * Run: npx tsx scripts/verify-ai-consent.ts
 *
 * Part 1: the consent rules (lib/ai-consent.ts).
 * Part 2: a scan of the source, so a NEW AI call that skips the gate fails this check
 *         instead of shipping. (How the 25 Sep gap happened: the switch existed, and three
 *         of six features simply never looked at it.)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  AI_CONSENT_VERSION, AIConsentRequiredError, consentGrant, consentRevoke, hasAIConsent,
  requireAIConsent, setAIConsentGate,
} from '../lib/ai-consent';

let passed = 0; const failures: string[] = [];
const check = (label: string, cond: boolean, detail = '') => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${label}${detail && !cond ? ` -- ${detail}` : ''}`);
  if (cond) passed++; else failures.push(label);
};

console.log('consent rules');
check('fresh profile: no consent', !hasAIConsent({ aiEnabled: false }));
check('switch on but never shown the disclosure (every user before this change): NO consent',
  !hasAIConsent({ aiEnabled: true }));
check('granted at the current version: consent', hasAIConsent(consentGrant(new Date('2026-09-26T00:00:00Z'))));
check('granted at an older version: asked again',
  !hasAIConsent({ aiEnabled: true, aiConsent: { version: AI_CONSENT_VERSION - 1, grantedAt: 'x' } }));
check('switched off after granting: no consent (and the record is withdrawn)',
  !hasAIConsent({ ...consentGrant(), ...consentRevoke() }) && consentRevoke().aiConsent === undefined);
check('null profile: no consent', !hasAIConsent(null));

setAIConsentGate(false);
let threw = false; try { requireAIConsent(); } catch (e) { threw = e instanceof AIConsentRequiredError; }
check('backstop throws while the gate is closed', threw);
setAIConsentGate(true);
threw = false; try { requireAIConsent(); } catch { threw = true; }
check('backstop passes once consent is recorded', !threw);
setAIConsentGate(false);

console.log('\nsource scan');
const ROOT = join(__dirname, '..');
const files: string[] = [];
const walk = (d: string) => {
  for (const f of readdirSync(d)) {
    if (['node_modules', 'dist', '.expo', 'ios', 'android', 'scripts', 'backend', 'supabase'].includes(f)) continue;
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f)) files.push(p);
  }
};
walk(ROOT);
const rel = (p: string) => p.slice(ROOT.length + 1);
const src = (p: string) => readFileSync(p, 'utf8');

const svc = src(join(ROOT, 'services/ai-service.ts'));
const fnRe = /(static async (\w+)\(|export async function (\w+)\()[\s\S]*?\{\n(\s*)([^\n]*)/g;
let m: RegExpExecArray | null; const names: string[] = []; const ungated: string[] = [];
while ((m = fnRe.exec(svc))) {
  const name = m[2] || m[3]; names.push(name);
  if (!m[5].startsWith('requireAIConsent()')) ungated.push(name);
}
check(`every AI service function checks consent first (${names.length} found)`, names.length >= 8 && ungated.length === 0, ungated.join(', '));

const sdkImporters = files.filter((f) => /@rork-ai\/toolkit-sdk/.test(src(f))).map(rel);
check('only services/ai-service.ts talks to the AI SDK', sdkImporters.length === 1 && sdkImporters[0] === 'services/ai-service.ts', sdkImporters.join(', '));

const direct = files.filter((f) => /toolkit\.rork\.com/.test(src(f)));
const directUngated = direct.filter((f) => !/requireAIConsent\(\)/.test(src(f))).map(rel);
check(`direct calls to the AI host are gated (${direct.length} file(s))`, directUngated.length === 0, directUngated.join(', '));

const callers = files.filter((f) => /from '@\/services\/ai-service'/.test(src(f)) && !f.endsWith('services/ai-service.ts'));
const unchecked = callers.filter((f) => !/useAIConsent\(\)|hasAIConsent\(/.test(src(f))).map(rel);
check(`every screen that calls AI asks for or checks consent (${callers.length} callers)`, callers.length >= 6 && unchecked.length === 0, unchecked.join(', '));

const bareSwitch = files.filter((f) => /if \(!?profile\??\.aiEnabled\)/.test(src(f))).map(rel);
check('no AI decision rests on the bare switch any more', bareSwitch.length === 0, bareSwitch.join(', '));

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
