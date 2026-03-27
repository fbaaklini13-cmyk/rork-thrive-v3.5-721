import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { WHOOPRecovery, WHOOPSleep, WHOOPStrain, WHOOPWorkout } from '@/types/health';

const WHOOP_CLIENT_ID = process.env.EXPO_PUBLIC_WHOOP_CLIENT_ID || '';
const WHOOP_CLIENT_SECRET = process.env.EXPO_PUBLIC_WHOOP_CLIENT_SECRET || '';
const WHOOP_REDIRECT_URI = Linking.createURL('whoop-callback');

const WHOOP_AUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const WHOOP_TOKEN_URL = 'https://api.prod.whoop.com/oauth/oauth2/token';
const WHOOP_API_URL = 'https://api.prod.whoop.com/developer/v1';

export class WHOOPService {
  private static instance: WHOOPService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.loadTokens();
  }

  static getInstance(): WHOOPService {
    if (!WHOOPService.instance) {
      WHOOPService.instance = new WHOOPService();
    }
    return WHOOPService.instance;
  }

  private async loadTokens(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        this.accessToken = await SecureStore.getItemAsync('whoop_access_token');
        this.refreshToken = await SecureStore.getItemAsync('whoop_refresh_token');
      } else {
        this.accessToken = localStorage.getItem('whoop_access_token');
        this.refreshToken = localStorage.getItem('whoop_refresh_token');
      }
    } catch (error) {
      console.error('Error loading WHOOP tokens:', error);
    }
  }

  private async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('whoop_access_token', accessToken);
        await SecureStore.setItemAsync('whoop_refresh_token', refreshToken);
      } else {
        localStorage.setItem('whoop_access_token', accessToken);
        localStorage.setItem('whoop_refresh_token', refreshToken);
      }
    } catch (error) {
      console.error('Error saving WHOOP tokens:', error);
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      this.accessToken = null;
      this.refreshToken = null;

      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync('whoop_access_token');
        await SecureStore.deleteItemAsync('whoop_refresh_token');
      } else {
        localStorage.removeItem('whoop_access_token');
        localStorage.removeItem('whoop_refresh_token');
      }
    } catch (error) {
      console.error('Error clearing WHOOP tokens:', error);
    }
  }

  async authorize(): Promise<boolean> {
    try {
      const authUrl = `${WHOOP_AUTH_URL}?client_id=${WHOOP_CLIENT_ID}&redirect_uri=${encodeURIComponent(WHOOP_REDIRECT_URI)}&response_type=code&scope=read:recovery read:cycles read:workout read:sleep`;

      console.log('WHOOP: Opening authorization URL...');
      
      const result = await Linking.openURL(authUrl);
      
      console.log('WHOOP: Authorization result:', result);

      return true;
    } catch (error) {
      console.error('WHOOP authorization error:', error);
      return false;
    }
  }

  async handleCallback(code: string): Promise<boolean> {
    try {
      console.log('WHOOP: Exchanging code for tokens...');

      const response = await fetch(WHOOP_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: WHOOP_REDIRECT_URI,
          client_id: WHOOP_CLIENT_ID,
          client_secret: WHOOP_CLIENT_SECRET,
        }).toString(),
      });

      const data = await response.json();

      if (data.access_token && data.refresh_token) {
        await this.saveTokens(data.access_token, data.refresh_token);
        console.log('WHOOP: Tokens saved successfully');
        return true;
      }

      console.error('WHOOP: Failed to get tokens', data);
      return false;
    } catch (error) {
      console.error('WHOOP callback error:', error);
      return false;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      console.log('WHOOP: Refreshing access token...');

      const response = await fetch(WHOOP_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: WHOOP_CLIENT_ID,
          client_secret: WHOOP_CLIENT_SECRET,
        }).toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        await this.saveTokens(data.access_token, data.refresh_token || this.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('WHOOP token refresh error:', error);
      return false;
    }
  }

  private async apiRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authorized with WHOOP');
    }

    try {
      const response = await fetch(`${WHOOP_API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.apiRequest(endpoint);
        }
        throw new Error('WHOOP authorization expired');
      }

      return await response.json();
    } catch (error) {
      console.error('WHOOP API request error:', error);
      throw error;
    }
  }

  async isAuthorized(): Promise<boolean> {
    return this.accessToken !== null;
  }

  async getRecovery(date?: Date): Promise<WHOOPRecovery> {
    console.log('WHOOP: Fetching recovery data...');

    const mockData: WHOOPRecovery = {
      recovery_score: Math.floor(Math.random() * 40) + 60,
      resting_heart_rate: Math.floor(Math.random() * 10) + 55,
      hrv_rmssd: Math.floor(Math.random() * 30) + 50,
      spo2_percentage: Math.floor(Math.random() * 2) + 97,
      skin_temp_celsius: 33.5 + Math.random() * 1.5,
    };

    return mockData;
  }

  async getSleep(date?: Date): Promise<WHOOPSleep> {
    console.log('WHOOP: Fetching sleep data...');

    const mockData: WHOOPSleep = {
      sleep_duration_minutes: Math.floor(Math.random() * 60) + 420,
      sleep_efficiency: 0.85 + Math.random() * 0.1,
      light_sleep_minutes: Math.floor(Math.random() * 60) + 180,
      slow_wave_sleep_minutes: Math.floor(Math.random() * 40) + 80,
      rem_sleep_minutes: Math.floor(Math.random() * 30) + 70,
      awake_minutes: Math.floor(Math.random() * 20) + 20,
      score: Math.floor(Math.random() * 30) + 70,
    };

    return mockData;
  }

  async getStrain(date?: Date): Promise<WHOOPStrain> {
    console.log('WHOOP: Fetching strain data...');

    const mockData: WHOOPStrain = {
      strain: Math.random() * 10 + 8,
      kilojoules: Math.floor(Math.random() * 5000) + 8000,
      average_heart_rate: Math.floor(Math.random() * 20) + 75,
      max_heart_rate: Math.floor(Math.random() * 30) + 150,
    };

    return mockData;
  }

  async getWorkouts(startDate: Date, endDate: Date): Promise<WHOOPWorkout[]> {
    console.log('WHOOP: Fetching workouts...');

    const mockWorkouts: WHOOPWorkout[] = [
      {
        id: '1',
        sport_name: 'Running',
        start_time: new Date(Date.now() - 86400000).toISOString(),
        end_time: new Date(Date.now() - 82800000).toISOString(),
        strain: 12.5,
        average_heart_rate: 145,
        max_heart_rate: 175,
        kilojoules: 2500,
      },
      {
        id: '2',
        sport_name: 'Strength Training',
        start_time: new Date(Date.now() - 172800000).toISOString(),
        end_time: new Date(Date.now() - 169200000).toISOString(),
        strain: 10.2,
        average_heart_rate: 125,
        max_heart_rate: 160,
        kilojoules: 1800,
      },
    ];

    return mockWorkouts;
  }

  async disconnect(): Promise<void> {
    console.log('WHOOP: Disconnecting...');
    await this.clearTokens();
  }
}

export const whoopService = WHOOPService.getInstance();
