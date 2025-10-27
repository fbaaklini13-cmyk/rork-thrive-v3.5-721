export type DeviceType = 'apple_watch' | 'health_connect' | 'whoop' | 'garmin' | 'strava' | 'oura' | 'fitbit';

export interface DeviceConnection {
  id: string;
  user_id: string;
  device_type: DeviceType;
  device_name?: string;
  is_connected: boolean;
  last_sync_at?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DailyHealthMetrics {
  id: string;
  user_id: string;
  date: string;
  
  steps?: number;
  distance?: number;
  floors_climbed?: number;
  active_calories?: number;
  total_calories?: number;
  
  resting_heart_rate?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  hrv?: number;
  
  sleep_duration?: number;
  sleep_score?: number;
  deep_sleep?: number;
  rem_sleep?: number;
  light_sleep?: number;
  awake_time?: number;
  
  strain?: number;
  recovery_score?: number;
  
  stress_level?: number;
  body_battery?: number;
  
  data_sources?: Record<string, string[]>;
  
  created_at: string;
  updated_at: string;
}

export type WorkoutSource = 'apple_watch' | 'health_connect' | 'whoop' | 'garmin' | 'strava' | 'oura' | 'fitbit' | 'manual';

export interface WorkoutSession {
  id: string;
  user_id: string;
  
  start_time: string;
  end_time: string;
  duration: number;
  
  workout_type: string;
  source: WorkoutSource;
  
  calories_burned?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  distance?: number;
  
  strain?: number;
  training_effect?: number;
  
  route?: { latitude: number; longitude: number; timestamp: string }[];
  notes?: string;
  metadata?: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface HeartRateSample {
  id: string;
  user_id: string;
  workout_session_id?: string;
  
  timestamp: string;
  heart_rate: number;
  source: string;
  
  created_at: string;
}

export interface SleepSession {
  id: string;
  user_id: string;
  
  start_time: string;
  end_time: string;
  duration: number;
  
  deep_sleep?: number;
  rem_sleep?: number;
  light_sleep?: number;
  awake_time?: number;
  
  sleep_score?: number;
  efficiency?: number;
  interruptions?: number;
  
  source: DeviceType;
  
  metadata?: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface HealthKitData {
  steps?: number;
  distance?: number;
  floorsClimbed?: number;
  activeCalories?: number;
  totalCalories?: number;
  restingHeartRate?: number;
  hrv?: number;
  sleepAnalysis?: {
    inBed: number;
    asleep: number;
    awake: number;
  };
}

export interface HealthConnectData {
  steps?: number;
  distance?: number;
  floorsClimbed?: number;
  calories?: number;
  heartRate?: number;
  sleepData?: {
    totalMinutes: number;
    stages?: {
      deep?: number;
      light?: number;
      rem?: number;
      awake?: number;
    };
  };
}

export interface WHOOPRecovery {
  recovery_score: number;
  resting_heart_rate: number;
  hrv_rmssd: number;
  spo2_percentage?: number;
  skin_temp_celsius?: number;
}

export interface WHOOPSleep {
  sleep_duration_minutes: number;
  sleep_efficiency: number;
  light_sleep_minutes: number;
  slow_wave_sleep_minutes: number;
  rem_sleep_minutes: number;
  awake_minutes: number;
  score: number;
}

export interface WHOOPStrain {
  strain: number;
  kilojoules: number;
  average_heart_rate: number;
  max_heart_rate: number;
}

export interface WHOOPWorkout {
  id: string;
  sport_name: string;
  start_time: string;
  end_time: string;
  strain: number;
  average_heart_rate: number;
  max_heart_rate: number;
  kilojoules: number;
}

export interface GarminDailySummary {
  calendarDate: string;
  steps: number;
  distanceInMeters: number;
  activeKilocalories: number;
  floorsClimbed?: number;
  restingHeartRate?: number;
  maxHeartRate?: number;
  averageStressLevel?: number;
  bodyBatteryMostRecentValue?: number;
}

export interface GarminSleepData {
  calendarDate: string;
  sleepTimeSeconds: number;
  deepSleepSeconds: number;
  lightSleepSeconds: number;
  remSleepSeconds: number;
  awakeSleepSeconds: number;
  overallSleepScore?: number;
}

export interface GarminActivity {
  activityId: string;
  activityName: string;
  activityType: string;
  startTimeGMT: string;
  duration: number;
  distance?: number;
  calories?: number;
  averageHR?: number;
  maxHR?: number;
}

export interface SyncResult {
  success: boolean;
  device: DeviceType;
  dataType: string;
  recordsCount: number;
  error?: string;
}
