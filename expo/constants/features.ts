/**
 * Feature switches.
 *
 * SHOW_DEVICES -- the Devices screen (Profile -> Connected Devices). Off because none
 * of its integrations is real: "Connect" always succeeds, "Sync" writes mock or
 * Math.random() steps / heart rate / HRV / sleep into daily_health_metrics as the
 * user's own data, and Strava/Oura/Fitbit open OAuth with an empty client ID
 * (TestFlight audit, 23 Sep). Turn it back on when at least one integration is real.
 */
export const SHOW_DEVICES = false;

/**
 * PREMIUM_PURCHASES -- whether Premium can actually be bought. Off because there is no
 * StoreKit / in-app purchase yet: the sheet said "$4.99/month, Cancel anytime" and
 * "Continue" ended in a "Coming soon" alert, which App Review rejects under 2.1, 2.3.1
 * ("promoting a false price") and 3.1.1 (self-audit, 26 Sep). While off, nothing in
 * the app offers or prices Premium; the four Premium screens stay unreachable, as
 * they already were for everyone without isPremium. Turn it on in the same commit
 * that adds a real App Store subscription.
 */
export const PREMIUM_PURCHASES = false;
