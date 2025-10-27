import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { supabase } from '@/lib/supabase';
import { DeviceConnection, DeviceType } from '@/types/health';
import { healthKitService } from '@/services/healthkit-service';
import { healthConnectService } from '@/services/health-connect-service';
import { whoopService } from '@/services/whoop-service';
import { garminService } from '@/services/garmin-service';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

export const [HealthDevicesProvider, useHealthDevices] = createContextHook(() => {
  const [devices, setDevices] = useState<DeviceConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setDevices([]);
        return;
      }

      const { data, error: dbError } = await supabase
        .from('device_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) {
        const errorMsg = `Database error: ${dbError.message || JSON.stringify(dbError)}`;
        console.error('Error loading devices:', errorMsg);
        setError(errorMsg);
        return;
      }

      setDevices(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('Error loading devices:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const connectDevice = useCallback(async (deviceType: DeviceType): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let success = false;
      let deviceName = '';

      switch (deviceType) {
        case 'apple_watch':
          if (Platform.OS !== 'ios') {
            throw new Error('Apple Watch is only available on iOS');
          }
          success = await healthKitService.requestPermissions();
          deviceName = 'Apple Watch';
          break;

        case 'health_connect':
          if (Platform.OS !== 'android') {
            throw new Error('Health Connect is only available on Android');
          }
          success = await healthConnectService.requestPermissions();
          deviceName = 'Health Connect';
          break;

        case 'whoop':
          success = await whoopService.authorize();
          deviceName = 'WHOOP';
          break;

        case 'garmin':
          success = await garminService.authorize();
          deviceName = 'Garmin';
          break;

        case 'strava':
          deviceName = 'Strava';
          await Linking.openURL(
            `https://www.strava.com/oauth/authorize?client_id=${encodeURIComponent(process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID ?? '')}&response_type=code&redirect_uri=${encodeURIComponent(Linking.createURL('strava-callback'))}&approval_prompt=auto&scope=read,activity:read_all`
          );
          success = true;
          break;
        case 'oura':
          deviceName = 'Oura';
          await Linking.openURL(
            `https://cloud.ouraring.com/oauth/authorize?client_id=${encodeURIComponent(process.env.EXPO_PUBLIC_OURA_CLIENT_ID ?? '')}&response_type=code&redirect_uri=${encodeURIComponent(Linking.createURL('oura-callback'))}&scope=personal%20daily%20heartrate%20workout%20tag%20session%20offline_access`
          );
          success = true;
          break;
        case 'fitbit':
          deviceName = 'Fitbit';
          await Linking.openURL(
            `https://www.fitbit.com/oauth2/authorize?client_id=${encodeURIComponent(process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID ?? '')}&response_type=code&redirect_uri=${encodeURIComponent(Linking.createURL('fitbit-callback'))}&scope=activity%20heartrate%20location%20nutrition%20sleep%20weight%20profile`
          );
          success = true;
          break;
      }

      if (success) {
        const { error: dbError } = await supabase
          .from('device_connections')
          .upsert({
            user_id: user.id,
            device_type: deviceType,
            device_name: deviceName,
            is_connected: true,
            last_sync_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,device_type'
          });

        if (dbError) {
          const errorMsg = dbError.message || JSON.stringify(dbError);
          console.error('Error saving device connection:', errorMsg);
          throw new Error(`Failed to save device connection: ${errorMsg}`);
        }

        await loadDevices();
        return true;
      }

      return false;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error connecting device:', errorMsg);
      throw error;
    }
  }, [loadDevices]);

  const disconnectDevice = useCallback(async (deviceType: DeviceType): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      switch (deviceType) {
        case 'apple_watch':
          await healthKitService.disconnect();
          break;
        case 'health_connect':
          await healthConnectService.disconnect();
          break;
        case 'whoop':
          await whoopService.disconnect();
          break;
        case 'garmin':
          await garminService.disconnect();
          break;
      }

      const { error } = await supabase
        .from('device_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('device_type', deviceType);

      if (error) {
        const errorMsg = error.message || JSON.stringify(error);
        console.error('Error disconnecting device:', errorMsg);
        return false;
      }

      await loadDevices();
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error disconnecting device:', errorMsg);
      return false;
    }
  }, [loadDevices]);

  const syncDevice = useCallback(async (deviceType: DeviceType): Promise<boolean> => {
    try {
      setSyncing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log(`Syncing ${deviceType}...`);

      const today = new Date();
      let healthData: any = {};

      switch (deviceType) {
        case 'apple_watch':
          const appleData = await healthKitService.getTodayData();
          healthData = {
            steps: appleData.steps,
            distance: appleData.distance,
            floors_climbed: appleData.floorsClimbed,
            active_calories: appleData.activeCalories,
            total_calories: appleData.totalCalories,
            resting_heart_rate: appleData.restingHeartRate,
            hrv: appleData.hrv,
            sleep_duration: appleData.sleepAnalysis?.asleep,
          };
          break;

        case 'health_connect':
          const androidData = await healthConnectService.getTodayData();
          healthData = {
            steps: androidData.steps,
            distance: androidData.distance,
            floors_climbed: androidData.floorsClimbed,
            total_calories: androidData.calories,
            resting_heart_rate: androidData.heartRate,
            sleep_duration: androidData.sleepData?.totalMinutes,
            deep_sleep: androidData.sleepData?.stages?.deep,
            rem_sleep: androidData.sleepData?.stages?.rem,
            light_sleep: androidData.sleepData?.stages?.light,
          };
          break;

        case 'whoop':
          const [recovery, sleep, strain] = await Promise.all([
            whoopService.getRecovery(),
            whoopService.getSleep(),
            whoopService.getStrain(),
          ]);
          
          healthData = {
            resting_heart_rate: recovery.resting_heart_rate,
            hrv: recovery.hrv_rmssd,
            recovery_score: recovery.recovery_score,
            sleep_duration: sleep.sleep_duration_minutes,
            sleep_score: sleep.score,
            deep_sleep: sleep.slow_wave_sleep_minutes,
            rem_sleep: sleep.rem_sleep_minutes,
            light_sleep: sleep.light_sleep_minutes,
            awake_time: sleep.awake_minutes,
            strain: strain.strain,
            avg_heart_rate: strain.average_heart_rate,
            max_heart_rate: strain.max_heart_rate,
          };
          break;

        case 'garmin':
          const [dailySummary, sleepData] = await Promise.all([
            garminService.getDailySummary(today),
            garminService.getSleepData(today),
          ]);
          
          healthData = {
            steps: dailySummary.steps,
            distance: dailySummary.distanceInMeters,
            floors_climbed: dailySummary.floorsClimbed,
            active_calories: dailySummary.activeKilocalories,
            resting_heart_rate: dailySummary.restingHeartRate,
            max_heart_rate: dailySummary.maxHeartRate,
            stress_level: dailySummary.averageStressLevel,
            body_battery: dailySummary.bodyBatteryMostRecentValue,
            sleep_duration: Math.floor(sleepData.sleepTimeSeconds / 60),
            sleep_score: sleepData.overallSleepScore,
            deep_sleep: Math.floor(sleepData.deepSleepSeconds / 60),
            rem_sleep: Math.floor(sleepData.remSleepSeconds / 60),
            light_sleep: Math.floor(sleepData.lightSleepSeconds / 60),
            awake_time: Math.floor(sleepData.awakeSleepSeconds / 60),
          };
          break;
      }

      const dateStr = today.toISOString().split('T')[0];

      const { error: metricsError } = await supabase
        .from('daily_health_metrics')
        .upsert({
          user_id: user.id,
          date: dateStr,
          ...healthData,
          data_sources: {
            [deviceType]: Object.keys(healthData),
          },
        }, {
          onConflict: 'user_id,date'
        });

      if (metricsError) {
        const errorMsg = metricsError.message || JSON.stringify(metricsError);
        console.error('Error saving health metrics:', errorMsg);
        return false;
      }

      const { error: syncError } = await supabase
        .from('device_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('device_type', deviceType);

      if (syncError) {
        const errorMsg = syncError.message || JSON.stringify(syncError);
        console.error('Error updating sync time:', errorMsg);
      }

      await loadDevices();
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error syncing device:', errorMsg);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [loadDevices]);

  const syncAllDevices = useCallback(async (): Promise<void> => {
    for (const device of devices) {
      if (device.is_connected) {
        await syncDevice(device.device_type);
      }
    }
  }, [devices, syncDevice]);

  const isDeviceConnected = useCallback((deviceType: DeviceType): boolean => {
    return devices.some(d => d.device_type === deviceType && d.is_connected);
  }, [devices]);

  const getDevice = useCallback((deviceType: DeviceType): DeviceConnection | undefined => {
    return devices.find(d => d.device_type === deviceType);
  }, [devices]);

  return useMemo(() => ({
    devices,
    loading,
    syncing,
    error,
    loadDevices,
    connectDevice,
    disconnectDevice,
    syncDevice,
    syncAllDevices,
    isDeviceConnected,
    getDevice,
  }), [devices, loading, syncing, error, loadDevices, connectDevice, disconnectDevice, syncDevice, syncAllDevices, isDeviceConnected, getDevice]);
});
