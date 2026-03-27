# Device Integration Setup Instructions

## Database Setup

The error you're seeing means the database tables haven't been created yet. Follow these steps:

### 1. Create Database Tables

1. Open your Supabase project at [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the ENTIRE contents of `supabase/schema.sql` from your project
6. Paste it into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

You should see a success message. This creates all necessary tables:
- `device_connections` - stores connected devices
- `daily_health_metrics` - stores daily health data
- `workout_sessions` - stores workout data
- `heart_rate_samples` - stores HR data
- `sleep_sessions` - stores sleep data

### 2. Verify Tables Were Created

1. In Supabase, go to **Table Editor** in the left sidebar
2. You should see all 5 tables listed
3. Check that `device_connections` table exists

### 3. Test the App

After running the SQL:
1. Restart your app
2. Go to Profile → Devices
3. The error should be gone
4. You should see available devices to connect

## Troubleshooting

**Still seeing the error?**
- Make sure you're logged in with a confirmed email
- Check that the SQL ran without errors in Supabase
- Try logging out and back in

**Can't run SQL?**
- Make sure you have owner/admin access to the Supabase project
- Check if you're in the correct project

## Available Devices

- **Apple Watch** (iOS only) - HealthKit integration
- **Google Health Connect** (Android only) - Wear OS integration  
- **WHOOP** (All platforms) - OAuth integration
- **Garmin** (All platforms) - OAuth integration

## Notes

- Each user has their own isolated data (enforced by Row Level Security)
- Device connections are per-user
- Health data is never shared between accounts
