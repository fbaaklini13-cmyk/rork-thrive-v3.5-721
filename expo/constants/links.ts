/**
 * Public links the app shows. PRIVACY_POLICY_URL is empty until the policy is hosted
 * (draft: outputs/thrive/testflight-prep/PRIVACY_POLICY_DRAFT_2026-09-26.md). App Review
 * 5.1.1(i) needs it inside the app AND in App Store Connect; scripts/check-release.ts
 * fails while it is empty, so a build can't quietly ship without it.
 */
export const PRIVACY_POLICY_URL = '';
export const SUPPORT_URL = '';
