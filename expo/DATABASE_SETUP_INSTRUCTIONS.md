# Database Setup Instructions

## ⚠️ IMPORTANT: Database Tables Need to Be Created

If you're seeing these errors:
- ❌ "Error loading devices: Database error: Could not find the table 'public.device_connections' in the schema cache"
- ❌ "Error saving device connection: Database error: Could not find the table..."
- ❌ "Error connecting device"

This means the database tables haven't been created yet. **You must complete the setup below before the health device features will work.**

## Setting Up Health Data Tables in Supabase

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar (it has a `<>` icon)

### Step 2: Run the Schema SQL

1. Click **New Query** button
2. Copy the entire contents of the `supabase/schema.sql` file from your project
3. Paste it into the SQL editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 3: Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should now see these tables:
   - `device_connections`
   - `daily_health_metrics`
   - `workout_sessions`
   - `heart_rate_samples`
   - `sleep_sessions`

### Step 4: Verify RLS Policies

1. Go to **Authentication** > **Policies** in the left sidebar
2. Each table should have policies enabled:
   - `device_connections`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
   - `daily_health_metrics`: 3 policies (SELECT, INSERT, UPDATE)
   - `workout_sessions`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
   - `heart_rate_samples`: 2 policies (SELECT, INSERT)
   - `sleep_sessions`: 4 policies (SELECT, INSERT, UPDATE, DELETE)

### Step 5: Test the Connection

1. In your app, try connecting a device again
2. The error should now show a more detailed message if there's still an issue
3. If successful, you should see the device appear in your devices list

### Troubleshooting

If you still get errors after running the schema:

#### Error: "relation already exists"
- Some tables were partially created. You can either:
  - Drop the existing tables and rerun the schema
  - Or check which tables are missing and only create those

#### Error: "permission denied"
- Your RLS policies might not be set up correctly
- Make sure you're signed in as an authenticated user
- Check that your user's auth.uid() matches the user_id in the policies

#### Error: "User not authenticated"
- Make sure you're logged in to the app
- Check that your Supabase credentials in `.env` are correct
- Verify your auth session is valid

#### To Drop All Tables (if needed):
```sql
DROP TABLE IF EXISTS heart_rate_samples CASCADE;
DROP TABLE IF EXISTS sleep_sessions CASCADE;
DROP TABLE IF EXISTS workout_sessions CASCADE;
DROP TABLE IF EXISTS daily_health_metrics CASCADE;
DROP TABLE IF EXISTS device_connections CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

Then run the schema.sql again.

### Next Steps

Once the database is set up:
1. You can connect devices through the app
2. Device connections will be saved to `device_connections` table
3. Health data will be synced to `daily_health_metrics` table
4. Each user will have their own isolated data (enforced by RLS policies)
