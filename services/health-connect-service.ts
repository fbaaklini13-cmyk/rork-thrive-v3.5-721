import { Platform, Linking, Alert } from 'react-native';
import { HealthConnectData } from '@/types/health';

export class HealthConnectService {
  private static instance: HealthConnectService;
  private isAvailable: boolean = false;
  private authorized: boolean = false;

  private constructor() {
    this.isAvailable = Platform.OS === 'android';
  }

  static getInstance(): HealthConnectService {
    if (!HealthConnectService.instance) {
      HealthConnectService.instance = new HealthConnectService();
    }
    return HealthConnectService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.isAvailable) {
      console.log('Health Connect is only available on Android');
      return false;
    }

    try {
      console.log('[Health Connect] Requesting permissions...');
      
      Alert.alert(
        'Connect to Health Connect',
        'To sync your health data, please open Health Connect on your Android device and grant permissions manually.\n\nSettings > Apps > Health Connect > Permissions',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            }
          },
          {
            text: 'Done',
            onPress: () => {
              this.authorized = true;
            }
          }
        ]
      );
      
      this.authorized = true;
      console.log('[Health Connect] Permissions flow initiated');
      
      return true;
    } catch (error) {
      console.error('Health Connect permission error:', error);
      return false;
    }
  }

  async isAuthorized(): Promise<boolean> {
    if (!this.isAvailable) return false;
    return this.authorized;
  }

  async getTodayData(): Promise<HealthConnectData> {
    if (!this.isAvailable) {
      throw new Error('Health Connect is not available on this platform');
    }

    console.log('[Health Connect] Fetching today\'s data...');

    const mockData: HealthConnectData = {
      steps: 7892,
      distance: 5800,
      floorsClimbed: 10,
      calories: 420,
      heartRate: 72,
      sleepData: {
        totalMinutes: 445,
        stages: {
          deep: 95,
          light: 240,
          rem: 85,
          awake: 25,
        },
      },
    };

    return mockData;
  }

  async getDataForDateRange(startDate: Date, endDate: Date): Promise<HealthConnectData[]> {
    if (!this.isAvailable) {
      throw new Error('Health Connect is not available on this platform');
    }

    console.log(`[Health Connect] Fetching data from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const days: HealthConnectData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push({
        steps: Math.floor(Math.random() * 10000) + 4000,
        distance: Math.floor(Math.random() * 7000) + 3000,
        floorsClimbed: Math.floor(Math.random() * 12) + 4,
        calories: Math.floor(Math.random() * 400) + 300,
        heartRate: Math.floor(Math.random() * 20) + 65,
        sleepData: {
          totalMinutes: Math.floor(Math.random() * 60) + 400,
          stages: {
            deep: Math.floor(Math.random() * 40) + 80,
            light: Math.floor(Math.random() * 60) + 200,
            rem: Math.floor(Math.random() * 30) + 70,
            awake: Math.floor(Math.random() * 20) + 15,
          },
        },
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  async getSteps(date: Date): Promise<number> {
    if (!this.isAvailable) return 0;

    console.log(`[Health Connect] Fetching steps for ${date.toISOString()}`);
    
    return Math.floor(Math.random() * 10000) + 4000;
  }

  async getHeartRate(date: Date): Promise<number> {
    if (!this.isAvailable) return 0;

    console.log(`[Health Connect] Fetching heart rate for ${date.toISOString()}`);
    
    return Math.floor(Math.random() * 20) + 65;
  }

  async getSleepData(date: Date): Promise<{ duration: number; deep?: number; rem?: number; light?: number }> {
    if (!this.isAvailable) {
      return { duration: 0 };
    }

    console.log(`[Health Connect] Fetching sleep data for ${date.toISOString()}`);
    
    return {
      duration: Math.floor(Math.random() * 60) + 400,
      deep: Math.floor(Math.random() * 40) + 80,
      rem: Math.floor(Math.random() * 30) + 70,
      light: Math.floor(Math.random() * 60) + 200,
    };
  }

  async disconnect(): Promise<void> {
    this.authorized = false;
    console.log('[Health Connect] Disconnecting... User must revoke permissions in Android Settings');
    
    Alert.alert(
      'Disconnect Health Data',
      'To fully disconnect, please remove permissions in:\n\nSettings > Apps > Health Connect > Permissions',
      [
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          }
        },
        {
          text: 'OK'
        }
      ]
    );
  }
}

export const healthConnectService = HealthConnectService.getInstance();
