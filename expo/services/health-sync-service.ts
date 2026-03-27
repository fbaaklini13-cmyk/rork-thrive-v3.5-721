import { supabase } from '@/lib/supabase';
import { DailyHealthMetrics, DeviceType } from '@/types/health';

export class HealthSyncService {
  private static instance: HealthSyncService;

  private constructor() {}

  static getInstance(): HealthSyncService {
    if (!HealthSyncService.instance) {
      HealthSyncService.instance = new HealthSyncService();
    }
    return HealthSyncService.instance;
  }

  async getDailyMetrics(date: Date): Promise<DailyHealthMetrics | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const dateStr = date.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .single();

      if (error) {
        const errorMsg = error.message || JSON.stringify(error);
        console.error('Error fetching daily metrics:', errorMsg);
        return null;
      }

      return data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error getting daily metrics:', errorMsg);
      return null;
    }
  }

  async getMetricsRange(startDate: Date, endDate: Date): Promise<DailyHealthMetrics[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date', { ascending: true });

      if (error) {
        const errorMsg = error.message || JSON.stringify(error);
        console.error('Error fetching metrics range:', errorMsg);
        return [];
      }

      return data || [];
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error getting metrics range:', errorMsg);
      return [];
    }
  }

  async getWeeklyAverage(): Promise<{
    steps: number;
    activeCalories: number;
    sleepDuration: number;
    restingHeartRate: number;
  }> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const metrics = await this.getMetricsRange(startDate, endDate);

      if (metrics.length === 0) {
        return {
          steps: 0,
          activeCalories: 0,
          sleepDuration: 0,
          restingHeartRate: 0,
        };
      }

      const totals = metrics.reduce(
        (acc, m) => ({
          steps: acc.steps + (m.steps || 0),
          activeCalories: acc.activeCalories + (m.active_calories || 0),
          sleepDuration: acc.sleepDuration + (m.sleep_duration || 0),
          restingHeartRate: acc.restingHeartRate + (m.resting_heart_rate || 0),
          count: acc.count + 1,
        }),
        { steps: 0, activeCalories: 0, sleepDuration: 0, restingHeartRate: 0, count: 0 }
      );

      return {
        steps: Math.round(totals.steps / totals.count),
        activeCalories: Math.round(totals.activeCalories / totals.count),
        sleepDuration: Math.round(totals.sleepDuration / totals.count),
        restingHeartRate: Math.round(totals.restingHeartRate / totals.count),
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error calculating weekly average:', errorMsg);
      return {
        steps: 0,
        activeCalories: 0,
        sleepDuration: 0,
        restingHeartRate: 0,
      };
    }
  }

  async getTodayMetrics(): Promise<DailyHealthMetrics | null> {
    return this.getDailyMetrics(new Date());
  }

  async getYesterdayMetrics(): Promise<DailyHealthMetrics | null> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getDailyMetrics(yesterday);
  }

  async getConnectedDevices(): Promise<DeviceType[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('device_connections')
        .select('device_type')
        .eq('user_id', user.id)
        .eq('is_connected', true);

      if (error) {
        const errorMsg = error.message || JSON.stringify(error);
        console.error('Error fetching connected devices:', errorMsg);
        return [];
      }

      return (data?.map((d: { device_type: DeviceType }) => d.device_type) ?? []);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error getting connected devices:', errorMsg);
      return [];
    }
  }

  async deleteMetrics(startDate: Date, endDate: Date): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const { error } = await supabase
        .from('daily_health_metrics')
        .delete()
        .eq('user_id', user.id)
        .gte('date', startStr)
        .lte('date', endStr);

      if (error) {
        const errorMsg = error.message || JSON.stringify(error);
        console.error('Error deleting metrics:', errorMsg);
        return false;
      }

      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error deleting metrics:', errorMsg);
      return false;
    }
  }
}

export const healthSyncService = HealthSyncService.getInstance();
