import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { GarminDailySummary, GarminSleepData, GarminActivity } from '@/types/health';

const GARMIN_CONSUMER_KEY = process.env.EXPO_PUBLIC_GARMIN_CONSUMER_KEY || '';
const GARMIN_CONSUMER_SECRET = process.env.EXPO_PUBLIC_GARMIN_CONSUMER_SECRET || '';
const GARMIN_REDIRECT_URI = Linking.createURL('garmin-callback');

const GARMIN_API_URL = 'https://apis.garmin.com';

export class GarminService {
  private static instance: GarminService;
  private accessToken: string | null = null;
  private accessTokenSecret: string | null = null;

  private constructor() {
    this.loadTokens();
  }

  static getInstance(): GarminService {
    if (!GarminService.instance) {
      GarminService.instance = new GarminService();
    }
    return GarminService.instance;
  }

  private async loadTokens(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        this.accessToken = await SecureStore.getItemAsync('garmin_access_token');
        this.accessTokenSecret = await SecureStore.getItemAsync('garmin_access_token_secret');
      } else {
        this.accessToken = localStorage.getItem('garmin_access_token');
        this.accessTokenSecret = localStorage.getItem('garmin_access_token_secret');
      }
    } catch (error) {
      console.error('Error loading Garmin tokens:', error);
    }
  }

  private async saveTokens(accessToken: string, accessTokenSecret: string): Promise<void> {
    try {
      this.accessToken = accessToken;
      this.accessTokenSecret = accessTokenSecret;

      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('garmin_access_token', accessToken);
        await SecureStore.setItemAsync('garmin_access_token_secret', accessTokenSecret);
      } else {
        localStorage.setItem('garmin_access_token', accessToken);
        localStorage.setItem('garmin_access_token_secret', accessTokenSecret);
      }
    } catch (error) {
      console.error('Error saving Garmin tokens:', error);
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      this.accessToken = null;
      this.accessTokenSecret = null;

      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync('garmin_access_token');
        await SecureStore.deleteItemAsync('garmin_access_token_secret');
      } else {
        localStorage.removeItem('garmin_access_token');
        localStorage.removeItem('garmin_access_token_secret');
      }
    } catch (error) {
      console.error('Error clearing Garmin tokens:', error);
    }
  }

  async authorize(): Promise<boolean> {
    try {
      console.log('Garmin: Starting OAuth flow...');
      
      console.log('Garmin: Opening authorization URL...');

      return true;
    } catch (error) {
      console.error('Garmin authorization error:', error);
      return false;
    }
  }

  async handleCallback(oauthToken: string, oauthVerifier: string): Promise<boolean> {
    try {
      console.log('Garmin: Exchanging tokens...');

      const mockAccessToken = 'mock_garmin_access_token';
      const mockAccessTokenSecret = 'mock_garmin_access_token_secret';

      await this.saveTokens(mockAccessToken, mockAccessTokenSecret);
      console.log('Garmin: Tokens saved successfully');
      return true;
    } catch (error) {
      console.error('Garmin callback error:', error);
      return false;
    }
  }

  private async apiRequest(endpoint: string): Promise<any> {
    if (!this.accessToken || !this.accessTokenSecret) {
      throw new Error('Not authorized with Garmin');
    }

    console.log(`Garmin: Making API request to ${endpoint}`);
    
    return {};
  }

  async isAuthorized(): Promise<boolean> {
    return this.accessToken !== null && this.accessTokenSecret !== null;
  }

  async getDailySummary(date: Date): Promise<GarminDailySummary> {
    console.log('Garmin: Fetching daily summary...');

    const mockData: GarminDailySummary = {
      calendarDate: date.toISOString().split('T')[0],
      steps: Math.floor(Math.random() * 10000) + 6000,
      distanceInMeters: Math.floor(Math.random() * 7000) + 4500,
      activeKilocalories: Math.floor(Math.random() * 500) + 400,
      floorsClimbed: Math.floor(Math.random() * 15) + 8,
      restingHeartRate: Math.floor(Math.random() * 10) + 58,
      maxHeartRate: Math.floor(Math.random() * 30) + 155,
      averageStressLevel: Math.floor(Math.random() * 40) + 30,
      bodyBatteryMostRecentValue: Math.floor(Math.random() * 50) + 50,
    };

    return mockData;
  }

  async getSleepData(date: Date): Promise<GarminSleepData> {
    console.log('Garmin: Fetching sleep data...');

    const mockData: GarminSleepData = {
      calendarDate: date.toISOString().split('T')[0],
      sleepTimeSeconds: (Math.floor(Math.random() * 60) + 420) * 60,
      deepSleepSeconds: (Math.floor(Math.random() * 40) + 85) * 60,
      lightSleepSeconds: (Math.floor(Math.random() * 60) + 210) * 60,
      remSleepSeconds: (Math.floor(Math.random() * 30) + 75) * 60,
      awakeSleepSeconds: (Math.floor(Math.random() * 20) + 20) * 60,
      overallSleepScore: Math.floor(Math.random() * 30) + 70,
    };

    return mockData;
  }

  async getActivities(startDate: Date, endDate: Date): Promise<GarminActivity[]> {
    console.log('Garmin: Fetching activities...');

    const mockActivities: GarminActivity[] = [
      {
        activityId: '1',
        activityName: 'Morning Run',
        activityType: 'running',
        startTimeGMT: new Date(Date.now() - 86400000).toISOString(),
        duration: 3600,
        distance: 8000,
        calories: 550,
        averageHR: 148,
        maxHR: 172,
      },
      {
        activityId: '2',
        activityName: 'Cycling',
        activityType: 'cycling',
        startTimeGMT: new Date(Date.now() - 172800000).toISOString(),
        duration: 5400,
        distance: 25000,
        calories: 680,
        averageHR: 135,
        maxHR: 165,
      },
    ];

    return mockActivities;
  }

  async getHeartRateData(date: Date): Promise<{ timestamp: string; heartRate: number }[]> {
    console.log('Garmin: Fetching heart rate data...');

    const samples: { timestamp: string; heartRate: number }[] = [];
    const baseTime = date.getTime();

    for (let i = 0; i < 24; i++) {
      samples.push({
        timestamp: new Date(baseTime + i * 3600000).toISOString(),
        heartRate: Math.floor(Math.random() * 40) + 60,
      });
    }

    return samples;
  }

  async disconnect(): Promise<void> {
    console.log('Garmin: Disconnecting...');
    await this.clearTokens();
  }
}

export const garminService = GarminService.getInstance();
