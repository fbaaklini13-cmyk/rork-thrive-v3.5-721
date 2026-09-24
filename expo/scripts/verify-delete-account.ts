/**
 * verify-delete-account.ts -- in-app account deletion (guideline 5.1.1(v)), both halves,
 * with fakes: no Supabase, no device. Run: npx tsx scripts/verify-delete-account.ts
 */
import { bearerToken, handleDeleteAccount, type DeleteAccountDeps } from '../supabase/functions/delete-account/handler';
import { deleteAccount, keysOwnedBy, type DeleteAccountClientDeps } from '../lib/delete-account';

let passed = 0; const failures: string[] = [];
const check = (label: string, cond: boolean, detail = '') => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${label}${detail && !cond ? ` -- ${detail}` : ''}`);
  if (cond) passed++; else failures.push(label);
};

function server(opts: { valid?: Record<string, string>; failDelete?: boolean; throwGet?: boolean } = {}) {
  const deleted: string[] = [];
  const deps: DeleteAccountDeps = {
    async getUserFromToken(t) { if (opts.throwGet) throw new Error('boom'); const id = (opts.valid ?? { tok: 'u1' })[t]; return id ? { id } : null; },
    async deleteUser(id) { if (opts.failDelete) return { error: 'db down' }; deleted.push(id); return { error: null }; },
  };
  return { deps, deleted };
}
const req = (method: string, auth?: string, body?: string) =>
  new Request('https://x/functions/v1/delete-account', { method, headers: auth ? { Authorization: auth } : {}, body });

async function main() {
  console.log('server: handler.ts');
  check('bearer parsed', bearerToken('Bearer abc') === 'abc');
  check('bearer: case-insensitive scheme', bearerToken('bearer abc') === 'abc');
  check('bearer: missing -> null', bearerToken(null) === null && bearerToken('') === null);
  check('bearer: wrong scheme -> null', bearerToken('Basic abc') === null);

  let s = server();
  let r = await handleDeleteAccount(req('OPTIONS'), s.deps);
  check('OPTIONS preflight 204, deletes nothing', r.status === 204 && s.deleted.length === 0);
  r = await handleDeleteAccount(req('GET', 'Bearer tok'), s.deps);
  check('GET refused 405, deletes nothing', r.status === 405 && s.deleted.length === 0);
  r = await handleDeleteAccount(req('POST'), s.deps);
  check('no token -> 401, deletes nothing', r.status === 401 && s.deleted.length === 0);
  r = await handleDeleteAccount(req('POST', 'Bearer forged'), s.deps);
  check('invalid token -> 401, deletes nothing', r.status === 401 && s.deleted.length === 0);
  s = server({ throwGet: true });
  r = await handleDeleteAccount(req('POST', 'Bearer tok'), s.deps);
  check('auth lookup throws -> 401, deletes nothing', r.status === 401 && s.deleted.length === 0);

  s = server({ valid: { tok: 'u1', tok2: 'u2' } });
  r = await handleDeleteAccount(req('POST', 'Bearer tok', JSON.stringify({ userId: 'u2' })), s.deps);
  check('deletes the CALLER, ignores a user id in the body', r.status === 200 && s.deleted.join() === 'u1', s.deleted.join());
  check('success body says deleted', (await r.json()).deleted === true);

  s = server({ failDelete: true });
  r = await handleDeleteAccount(req('POST', 'Bearer tok'), s.deps);
  const b = await r.json();
  check('delete fails -> 500 and says nothing was removed', r.status === 500 && /nothing was removed/.test(b.error));
  check('500 body does not leak the internal error', !JSON.stringify(b).includes('db down'));

  console.log('client: lib/delete-account.ts');
  const keys = ['u1_user_profile', 'u1_workout_logs', 'u2_user_profile', 'offline_workout_queue', 'sb-x-auth-token', 'u10_user_profile'];
  const own = keysOwnedBy('u1', keys);
  check("keeps only this user's keys + the shared queue", own.sort().join() === ['offline_workout_queue', 'u1_user_profile', 'u1_workout_logs'].join(), own.join());
  check("another user's keys untouched (u2_, and u10_ is not u1_)", !own.includes('u2_user_profile') && !own.includes('u10_user_profile'));
  check('empty user id owns nothing', keysOwnedBy('', keys).length === 0);

  function client(opts: { serverError?: string | null; throwInvoke?: boolean; failRemove?: boolean } = {}) {
    const calls: string[] = []; let removed: string[] = [];
    const deps: DeleteAccountClientDeps = {
      async invokeServerDelete() { calls.push('server'); if (opts.throwInvoke) throw new Error('offline'); return { error: opts.serverError ?? null }; },
      async getAllKeys() { calls.push('keys'); return keys; },
      async multiRemove(k) { calls.push('remove'); if (opts.failRemove) throw new Error('disk'); removed = k; },
      async signOutLocal() { calls.push('signout'); },
    };
    return { deps, calls, removed: () => removed };
  }
  let c = client();
  let res = await deleteAccount('u1', c.deps);
  check('success: server first, then local wipe, then sign-out', res.ok && c.calls.join() === 'server,keys,remove,signout', c.calls.join());
  check('success: removes 3 keys', res.ok && res.removedKeys === 3 && c.removed().length === 3);

  c = client({ serverError: 'FunctionsHttpError' });
  res = await deleteAccount('u1', c.deps);
  check('server refuses: nothing local touched, still signed in', !res.ok && c.calls.join() === 'server', c.calls.join());
  c = client({ throwInvoke: true });
  res = await deleteAccount('u1', c.deps);
  check('network throws: nothing local touched', !res.ok && c.calls.join() === 'server');
  check('failure message tells the user nothing was removed', !res.ok && /Nothing was removed/.test(res.reason));

  c = client({ failRemove: true });
  res = await deleteAccount('u1', c.deps);
  check('account gone but local wipe fails: still reported as deleted, still signs out', res.ok && c.calls.at(-1) === 'signout');
  c = client();
  res = await deleteAccount(null, c.deps);
  check('not signed in: no server call', !res.ok && c.calls.length === 0);

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length) process.exit(1);
}
main();
