# Supabase Setup Instructions

## Current Issue
You're seeing "Error loading devices: [object Object]" because the database tables haven't been created in your Supabase project yet.

## How to Fix

### Step 1: Access Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project for this app

### Step 2: Run the Schema SQL
1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of the `supabase/schema.sql` file from this project
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl/Cmd + Enter)

This will create all the necessary tables:
- `device_connections` - Stores connected health devices
- `daily_health_metrics` - Daily aggregated health data
- `workout_sessions` - Workout records
- `heart_rate_samples` - Detailed heart rate data
- `sleep_sessions` - Sleep tracking data

### Step 3: Verify Tables Were Created
1. Click on **Table Editor** in the left sidebar
2. You should see all the tables listed above

### Step 4: Check Your Environment Variables
Make sure your `.env` file has the correct Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key

### Step 5: Restart Your App
After setting up the database:
1. Stop your development server
2. Restart it with `bun start` or `npm start`
3. Try accessing the Devices page again

## Troubleshooting

### Still seeing errors?
Check the error message displayed on the Devices screen. The new error handling will show you the specific database error.

Common issues:
- **"relation does not exist"**: Tables weren't created - go back to Step 2
- **"Invalid API key"**: Check your `.env` file - go back to Step 4
- **Authentication errors**: Make sure you're signed in to the app

### Enable Email Confirmation
If you're seeing "Email not confirmed" errors:
1. Go to **Authentication** → **Settings** in Supabase
2. Under **Email Auth**, toggle **Enable email confirmations** to OFF (for development)
3. Or check your email and click the confirmation link

### Need Help?
The error message on the Devices screen will now show the exact database error, which will help identify the specific issue.
