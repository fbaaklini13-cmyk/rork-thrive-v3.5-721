# OAuth Setup Instructions

## Error: "Unsupported provider: provider is not enabled"

This error occurs when trying to use OAuth providers (Google, Apple) that haven't been enabled in your Supabase project.

## Setup Steps

### 1. Enable OAuth Providers in Supabase Dashboard

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Enable the providers you want to use:

#### For Google OAuth:
- Toggle **Google** to enabled
- You'll need to create a Google Cloud project and get OAuth credentials:
  - Go to [Google Cloud Console](https://console.cloud.google.com)
  - Create a new project or select existing
  - Enable Google+ API
  - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
  - For **Application type**, select **Web application**
  - Add authorized redirect URIs:
    - `https://<your-project-ref>.supabase.co/auth/v1/callback`
  - Copy the **Client ID** and **Client Secret**
  - Paste them into Supabase Dashboard under Google provider settings

#### For Apple OAuth:
- Toggle **Apple** to enabled
- You'll need an Apple Developer account:
  - Go to [Apple Developer Portal](https://developer.apple.com)
  - Create a **Services ID**
  - Enable **Sign in with Apple**
  - Configure domains and redirect URLs
  - Generate a **Client Secret** (requires a private key)
  - Copy the **Services ID** and **Client Secret**
  - Paste them into Supabase Dashboard under Apple provider settings

### 2. Configure Redirect URLs in Supabase

In **Authentication** → **URL Configuration**:

Add these redirect URLs:
- For Web: `http://localhost:8081/auth/callback` (development)
- For Web: `https://your-production-domain.com/auth/callback` (production)
- For Mobile: `your-app-scheme://auth/callback`

### 3. Update Your App Scheme (Mobile)

The app needs a custom URL scheme for OAuth redirects on mobile.

Check your `app.json` and ensure you have a scheme defined:

```json
{
  "expo": {
    "scheme": "yourappname"
  }
}
```

### 4. Test OAuth Flow

After enabling providers:
1. Restart your development server
2. Try signing in with Google or Apple
3. You should be redirected to the provider's login page
4. After successful authentication, you'll be redirected back to your app

## Troubleshooting

### "Provider is not enabled" error persists
- Make sure you saved the provider settings in Supabase Dashboard
- Wait a few minutes for changes to propagate
- Clear your app cache and restart

### OAuth redirect doesn't work on mobile
- Check that your app scheme is correctly configured
- Ensure the redirect URL in Supabase matches your app scheme
- Check that you've added the scheme to your app.json

### OAuth works on web but not mobile
- Mobile OAuth requires additional setup with deep linking
- Make sure your app.json has the correct scheme
- Check that the redirect URL uses your app scheme

## Optional: Disable OAuth Buttons

If you don't want to set up OAuth, you can remove the OAuth buttons from your sign-in/sign-up screens by commenting out or removing the OAuth button sections in:
- `app/(auth)/sign-in.tsx`
- `app/(auth)/sign-up.tsx`
