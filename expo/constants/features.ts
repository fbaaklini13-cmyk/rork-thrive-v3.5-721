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
