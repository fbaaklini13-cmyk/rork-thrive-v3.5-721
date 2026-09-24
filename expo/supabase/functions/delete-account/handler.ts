/**
 * delete-account -- the server half of in-app account deletion
 * (App Review guideline 5.1.1(v): an app that lets people create an account must let
 * them delete it from inside the app, not just deactivate it).
 *
 * Pure: no Supabase or Deno imports, so it is testable under Node
 * (scripts/verify-delete-account.ts). index.ts wires in the real admin client.
 *
 * What deletion removes: the auth.users row. Every table that holds a user's data
 * (device_connections, daily_health_metrics, profiles, workouts, workout_sets via
 * workouts, sleep_sessions, daily_metrics, permissions_log, muscle_volume_cache,
 * oauth_tokens) references auth.users ON DELETE CASCADE, so those rows go with it.
 * Most of the app's data is on the phone (AsyncStorage); the client clears that.
 *
 * NOT here yet: revoking a Sign in with Apple token. Only needed if Apple sign-in is
 * turned on (decision Obj 2, option i); it needs a .p8 key as a function secret and
 * the Apple refresh token captured at sign-in.
 */

export interface DeleteAccountDeps {
  /** Resolve the caller's access token to a user, or null if it is not valid. */
  getUserFromToken(token: string): Promise<{ id: string } | null>;
  /** Delete the auth user (and, by cascade, their rows). */
  deleteUser(id: string): Promise<{ error: string | null }>;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

export function bearerToken(header: string | null): string | null {
  if (!header) return null;
  const m = /^Bearer\s+(\S+)\s*$/i.exec(header);
  return m ? m[1] : null;
}

export async function handleDeleteAccount(req: Request, deps: DeleteAccountDeps): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' });

  const token = bearerToken(req.headers.get('Authorization'));
  if (!token) return json(401, { error: 'not signed in' });

  let user: { id: string } | null;
  try {
    user = await deps.getUserFromToken(token);
  } catch {
    user = null;
  }
  // The only user this function can ever delete is the one whose token called it.
  // No request body is read, so no user id can be supplied by the client.
  if (!user) return json(401, { error: 'not signed in' });

  let result: { error: string | null };
  try {
    result = await deps.deleteUser(user.id);
  } catch (e) {
    result = { error: e instanceof Error ? e.message : String(e) };
  }
  if (result.error) {
    console.error('delete-account failed', user.id, result.error);
    return json(500, { error: 'could not delete the account; nothing was removed' });
  }
  return json(200, { deleted: true });
}
