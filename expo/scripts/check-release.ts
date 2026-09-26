/**
 * check-release.ts -- things that must be true before a build goes to App Review.
 * Each line is a finding from the 26 Sep guideline self-audit or the 23 Sep TestFlight
 * audit. Exits 1 while any blocker remains, naming it. Run: npx tsx scripts/check-release.ts
 */
import fs from 'fs';
import path from 'path';
import { PRIVACY_POLICY_URL } from '../constants/links';
import { PREMIUM_PURCHASES, SHOW_DEVICES } from '../constants/features';

const root = path.resolve(__dirname, '..');
const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const blockers: string[] = []; const warnings: string[] = []; const ok: string[] = [];
const check = (cond: boolean, pass: string, fail: string, blocker = true) =>
  cond ? ok.push(pass) : (blocker ? blockers : warnings).push(fail);

check(/^https:\/\//.test(PRIVACY_POLICY_URL), 'privacy policy URL set',
  'constants/links.ts PRIVACY_POLICY_URL is empty: host the policy and set it (5.1.1(i))');
const bid: string = app.ios?.bundleIdentifier || '';
check(!!bid && !bid.startsWith('app.rork.'), `bundle id ${bid}`,
  `ios.bundleIdentifier is still Rork's (${bid.slice(0, 40)}...): choose your own`);
const hasIAP = ['react-native-iap', 'expo-iap', 'react-native-purchases'].some((d) => d in deps);
check(!PREMIUM_PURCHASES || hasIAP, PREMIUM_PURCHASES ? 'Premium on, with an IAP library' : 'Premium hidden (no IAP yet)',
  'PREMIUM_PURCHASES is on but no in-app purchase library is installed (3.1.1)');
check(!SHOW_DEVICES, 'Devices hidden', 'SHOW_DEVICES is on: its data is simulated (5.1.3)');
check(fs.existsSync(path.join(root, 'eas.json')), 'eas.json present', 'no eas.json in the repo');
const icon = path.join(root, app.icon || './assets/images/icon.png');
check(fs.existsSync(icon) && fs.statSync(icon).size > 1000, 'icon present', `icon ${app.icon} missing or empty`);
for (const f of ['.env', '.env.production', '.env.local']) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) {
    const t = fs.readFileSync(p, 'utf8');
    check(!/EXPO_PUBLIC_(PROJECT|TEAM)_ID\s*=\s*\S/.test(t), `${f}: Rork analytics ids unset`,
      `${f} sets EXPO_PUBLIC_PROJECT_ID/TEAM_ID, which switches on Rork's PostHog analytics (privacy label says none)`);
    check(!/example\.supabase\.co|your-supabase-url/.test(t), `${f}: real Supabase URL`,
      `${f} still points at a placeholder Supabase URL`, false);
  }
}
check(!('expo-location' in deps), 'expo-location not a direct dependency',
  'expo-location is installed but unused (upload scan may flag missing purpose strings). It is pinned because @rork-ai/toolkit-sdk depends on @teovilla/react-native-web-maps, which depends on expo-location; it goes when the AI calls move off the Rork SDK', false);
check(app.ios?.supportsTablet === false, 'iPhone only', 'supportsTablet is on but the app was never tested on iPad', false);

console.log(ok.map((s) => `  ok      ${s}`).join('\n'));
if (warnings.length) console.log(warnings.map((s) => `  warn    ${s}`).join('\n'));
if (blockers.length) console.log(blockers.map((s) => `  BLOCKER ${s}`).join('\n'));
console.log(`\n${blockers.length} blocker(s), ${warnings.length} warning(s)`);
process.exit(blockers.length ? 1 : 0);
