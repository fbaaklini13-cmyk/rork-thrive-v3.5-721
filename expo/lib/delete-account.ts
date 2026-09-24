/**
 * Client half of in-app account deletion (guideline 5.1.1(v)). Pure, injectable,
 * checked by scripts/verify-delete-account.ts.
 *
 * Order matters: the server deletion runs FIRST. If it fails, nothing on the phone is
 * touched and the user stays signed in -- a failed delete must never look like a
 * successful one. Only after the server confirms are the local copies removed.
 */

/** Keys this app writes per user are `${userId}_<name>` (hooks/user-profile-store.ts). */
export const SHARED_KEYS_TO_CLEAR = ['offline_workout_queue'] as const;

export function keysOwnedBy(userId: string, keys: readonly string[]): string[] {
  if (!userId) return [];
  const prefix = `${userId}_`;
  return keys.filter((k) => k.startsWith(prefix) || (SHARED_KEYS_TO_CLEAR as readonly string[]).includes(k));
}

export interface DeleteAccountClientDeps {
  /** Call the delete-account function as the signed-in user. */
  invokeServerDelete(): Promise<{ error: string | null }>;
  getAllKeys(): Promise<readonly string[]>;
  multiRemove(keys: string[]): Promise<void>;
  /** Drop the (now invalid) local session. */
  signOutLocal(): Promise<void>;
}

export type DeleteAccountResult = { ok: true; removedKeys: number } | { ok: false; reason: string };

export async function deleteAccount(userId: string | null, deps: DeleteAccountClientDeps): Promise<DeleteAccountResult> {
  if (!userId) return { ok: false, reason: 'You are not signed in.' };

  let server: { error: string | null };
  try {
    server = await deps.invokeServerDelete();
  } catch (e) {
    server = { error: e instanceof Error ? e.message : String(e) };
  }
  if (server.error) {
    return { ok: false, reason: 'Your account could not be deleted. Nothing was removed. Check your connection and try again.' };
  }

  // The account is gone. Local clean-up failures are logged, not surfaced as a failed
  // delete: the user must not be told "try again" for an account that no longer exists.
  let removed: string[] = [];
  try {
    removed = keysOwnedBy(userId, await deps.getAllKeys());
    if (removed.length) await deps.multiRemove(removed);
  } catch (e) {
    console.error('delete-account: local clean-up failed', e);
  }
  try {
    await deps.signOutLocal();
  } catch (e) {
    console.error('delete-account: local sign-out failed', e);
  }
  return { ok: true, removedKeys: removed.length };
}
