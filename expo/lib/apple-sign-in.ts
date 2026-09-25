/**
 * Native Sign in with Apple -> Supabase (option (i) of the 24 Sep decisions memo).
 * NOT MERGED: lives on branch prep/apple-sign-in until Freddy picks (i).
 *
 * Native only (iOS). Supabase's native flow (auth.signInWithIdToken) needs no Services
 * ID and no six-month client secret -- only the bundle ID listed under
 * Authentication -> Providers -> Apple -> Client IDs on the Supabase project the app uses.
 *
 * The nonce: Apple receives the SHA-256 of a random string; Supabase receives the raw
 * string and checks that Apple's token carries its hash. That binds this token to this
 * request, so a token lifted from elsewhere can't be replayed.
 *
 * Apple sends the user's name ONLY on the first authorisation, ever. If we don't save it
 * then, it is gone (the user would have to revoke the app in Settings to get it again).
 *
 * Pure and injectable; checked by scripts/verify-apple-sign-in.ts.
 */

export interface AppleCredential {
  identityToken: string | null;
  fullName?: { givenName?: string | null; familyName?: string | null } | null;
}

export interface AppleSignInDeps {
  randomHex(bytes: number): string;
  sha256(input: string): Promise<string>;
  appleSignIn(hashedNonce: string): Promise<AppleCredential>;          // throws on cancel
  supabaseSignInWithIdToken(token: string, rawNonce: string): Promise<{ error: string | null }>;
  supabaseSaveName(meta: { full_name: string; given_name: string; family_name: string }): Promise<void>;
}

export type AppleSignInResult =
  | { ok: true; savedName: string | null }
  | { ok: false; cancelled: boolean; reason: string };

export function composeName(fullName: AppleCredential["fullName"]): { full: string; given: string; family: string } | null {
  const given = (fullName?.givenName ?? "").trim();
  const family = (fullName?.familyName ?? "").trim();
  const full = [given, family].filter(Boolean).join(" ");
  return full ? { full, given, family } : null;
}

export function isCancel(e: unknown): boolean {
  const code = (e as { code?: string } | null)?.code ?? "";
  return code === "ERR_REQUEST_CANCELED" || code === "ERR_CANCELED";
}

export async function signInWithAppleNative(deps: AppleSignInDeps): Promise<AppleSignInResult> {
  const rawNonce = deps.randomHex(32);
  const hashedNonce = await deps.sha256(rawNonce);

  let cred: AppleCredential;
  try {
    cred = await deps.appleSignIn(hashedNonce);
  } catch (e) {
    if (isCancel(e)) return { ok: false, cancelled: true, reason: "cancelled" };
    return { ok: false, cancelled: false, reason: "Sign in with Apple failed. Please try again." };
  }
  if (!cred.identityToken) {
    return { ok: false, cancelled: false, reason: "Apple did not return a sign-in token. Please try again." };
  }

  const { error } = await deps.supabaseSignInWithIdToken(cred.identityToken, rawNonce);
  if (error) {
    return { ok: false, cancelled: false, reason: "Signed in with Apple, but the account could not be opened. Please try again." };
  }

  const name = composeName(cred.fullName);
  if (name) {
    try {
      await deps.supabaseSaveName({ full_name: name.full, given_name: name.given, family_name: name.family });
    } catch (e) {
      // Signed in either way; losing the name is bad but not a failed sign-in.
      console.error("apple-sign-in: could not save the name Apple sent", e);
      return { ok: true, savedName: null };
    }
  }
  return { ok: true, savedName: name ? name.full : null };
}
