/**
 * verify-apple-sign-in.ts -- lib/apple-sign-in.ts with fakes (no Apple, no Supabase).
 * Run: npx tsx scripts/verify-apple-sign-in.ts
 */
import { composeName, isCancel, signInWithAppleNative, type AppleSignInDeps } from '../lib/apple-sign-in';

let passed = 0; const failures: string[] = [];
const check = (label: string, cond: boolean, detail = '') => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${label}${detail && !cond ? ` -- ${detail}` : ''}`);
  if (cond) passed++; else failures.push(label);
};

function deps(over: Partial<AppleSignInDeps> & { cred?: any; throwApple?: any; sbError?: string | null; saveThrows?: boolean } = {}) {
  const log: any = { saved: null, sbArgs: null, appleNonce: null };
  const d: AppleSignInDeps = {
    randomHex: () => 'raw-nonce-abc',
    sha256: async (s) => 'sha256(' + s + ')',
    appleSignIn: async (h) => { log.appleNonce = h; if (over.throwApple) throw over.throwApple; return over.cred ?? { identityToken: 'tok', fullName: { givenName: 'Freddy', familyName: 'Baaklini' } }; },
    supabaseSignInWithIdToken: async (t, n) => { log.sbArgs = [t, n]; return { error: over.sbError ?? null }; },
    supabaseSaveName: async (m) => { if (over.saveThrows) throw new Error('x'); log.saved = m; },
  };
  return { d, log };
}

async function main() {
  check('name composed from both parts', composeName({ givenName: 'Freddy', familyName: 'Baaklini' })?.full === 'Freddy Baaklini');
  check('given name only is still a name', composeName({ givenName: 'Freddy', familyName: null })?.full === 'Freddy');
  check('no name (every sign-in after the first) -> null', composeName(null) === null && composeName({ givenName: ' ', familyName: '' }) === null);
  check('cancel codes recognised', isCancel({ code: 'ERR_REQUEST_CANCELED' }) && isCancel({ code: 'ERR_CANCELED' }) && !isCancel(new Error('boom')));

  let { d, log } = deps();
  let r = await signInWithAppleNative(d);
  check('Apple gets the HASHED nonce', log.appleNonce === 'sha256(raw-nonce-abc)');
  check('Supabase gets the token and the RAW nonce', log.sbArgs?.[0] === 'tok' && log.sbArgs?.[1] === 'raw-nonce-abc');
  check('first sign-in saves the name Apple sends once', r.ok && log.saved?.full_name === 'Freddy Baaklini');

  ({ d, log } = deps({ cred: { identityToken: 'tok', fullName: null } }));
  r = await signInWithAppleNative(d);
  check('later sign-in: no name, nothing overwritten', r.ok && log.saved === null);

  ({ d, log } = deps({ throwApple: { code: 'ERR_REQUEST_CANCELED' } }));
  r = await signInWithAppleNative(d);
  check('user cancels -> cancelled, Supabase never called', !r.ok && r.cancelled && log.sbArgs === null);

  ({ d, log } = deps({ throwApple: new Error('network') }));
  r = await signInWithAppleNative(d);
  check('Apple error -> failure, not cancel', !r.ok && !r.cancelled && log.sbArgs === null);

  ({ d, log } = deps({ cred: { identityToken: null } }));
  r = await signInWithAppleNative(d);
  check('no identity token -> failure, Supabase never called', !r.ok && log.sbArgs === null);

  ({ d, log } = deps({ sbError: 'Provider apple is not enabled' }));
  r = await signInWithAppleNative(d);
  check('Supabase refuses -> failure, name NOT saved', !r.ok && log.saved === null);

  ({ d, log } = deps({ saveThrows: true }));
  r = await signInWithAppleNative(d);
  check('name save fails -> still signed in, reported', r.ok && r.savedName === null);

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length) process.exit(1);
}
main();
