-- Health Data Schema for Thrive App
-- Supports: Apple HealthKit, Google Health Connect, WHOOP, Garmin

-- Device Connections Table
CREATE TABLE IF NOT EXISTS device_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL CHECK (device_type IN ('apple_watch', 'health_connect', 'whoop', 'garmin')),
  device_name TEXT,
  is_connected BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- OAuth tokens (encrypted at rest)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Device-specific metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, device_type)
);

-- Daily Health Metrics (Aggregated)
CREATE TABLE IF NOT EXISTS daily_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Activity Metrics
  steps INTEGER,
  distance FLOAT, -- in meters
  floors_climbed INTEGER,
  active_calories INTEGER,
  total_calories INTEGER,
  
  -- Heart Rate
  resting_heart_rate INTEGER,
  avg_heart_rate INTEGER,
  max_heart_rate INTEGER,
  hrv FLOAT, -- Heart Rate Variability in ms
  
  -- Sleep
  sleep_duration INTEGER, -- in minutes
  sleep_score INTEGER, -- 0-100
  deep_sleep INTEGER, -- in minutes
  rem_sleep INTEGER, -- in minutes
  light_sleep INTEGER, -- in minutes
  awake_time INTEGER, -- in minutes
  
  -- WHOOP Specific
  strain FLOAT, -- 0-21 scale
  recovery_score INTEGER, -- 0-100
  
  -- Garmin Specific
  stress_level INTEGER, -- 0-100
  body_battery INTEGER, -- 0-100
  
  -- Data Sources
  data_sources JSONB DEFAULT '{}', -- tracks which device contributed which data
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, date)
);

-- Workout Sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  
  -- Workout Type
  workout_type TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('apple_watch', 'health_connect', 'whoop', 'garmin', 'manual')),
  
  -- Metrics
  calories_burned INTEGER,
  avg_heart_rate INTEGER,
  max_heart_rate INTEGER,
  distance FLOAT, -- in meters (for cardio)
  
  -- WHOOP/Garmin Specific
  strain FLOAT,
  training_effect FLOAT,
  
  -- Additional Data
  route JSONB, -- GPS coordinates for outdoor activities
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Heart Rate Samples (for detailed analysis)
CREATE TABLE IF NOT EXISTS heart_rate_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  heart_rate INTEGER NOT NULL,
  source TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sleep Sessions (Detailed Sleep Tracking)
CREATE TABLE IF NOT EXISTS sleep_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  
  -- Sleep Stages
  deep_sleep INTEGER, -- minutes
  rem_sleep INTEGER, -- minutes
  light_sleep INTEGER, -- minutes
  awake_time INTEGER, -- minutes
  
  -- Quality Metrics
  sleep_score INTEGER, -- 0-100
  efficiency FLOAT, -- percentage
  interruptions INTEGER,
  
  source TEXT NOT NULL CHECK (source IN ('apple_watch', 'health_connect', 'whoop', 'garmin')),
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_device_connections_user_id ON device_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_user_date ON daily_health_metrics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_time ON workout_sessions(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_heart_rate_samples_user_time ON heart_rate_samples(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_sessions_user_time ON sleep_sessions(user_id, start_time DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE device_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE heart_rate_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_sessions ENABLE ROW LEVEL SECURITY;

-- Device Connections Policies
CREATE POLICY "Users can view their own device connections"
  ON device_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own device connections"
  ON device_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own device connections"
  ON device_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own device connections"
  ON device_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Health Metrics Policies
CREATE POLICY "Users can view their own health metrics"
  ON daily_health_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics"
  ON daily_health_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics"
  ON daily_health_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- Workout Sessions Policies
CREATE POLICY "Users can view their own workouts"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
  ON workout_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Heart Rate Samples Policies
CREATE POLICY "Users can view their own heart rate data"
  ON heart_rate_samples FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own heart rate data"
  ON heart_rate_samples FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Sleep Sessions Policies
CREATE POLICY "Users can view their own sleep data"
  ON sleep_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep data"
  ON sleep_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep data"
  ON sleep_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep data"
  ON sleep_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_device_connections_updated_at BEFORE UPDATE ON device_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_health_metrics_updated_at BEFORE UPDATE ON daily_health_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sleep_sessions_updated_at BEFORE UPDATE ON sleep_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
