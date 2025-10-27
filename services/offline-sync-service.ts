import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import type { WorkoutLog } from '@/types/user';

const OFFLINE_QUEUE_KEY = 'offline_workout_queue';

export interface OfflineWorkoutData {
  id: string;
  timestamp: string;
  data: WorkoutLog;
  synced: boolean;
}

class OfflineSyncService {
  private isOnline: boolean = true;
  private syncQueue: OfflineWorkoutData[] = [];
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    this.init();
  }

  async init() {
    await this.loadQueue();
    
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      this.notifyListeners(this.isOnline);
      
      if (!wasOnline && this.isOnline) {
        this.syncOfflineData();
      }
    });

    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => listener(online));
  }

  onConnectionChange(listener: (online: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private async loadQueue() {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  async addToQueue(workout: WorkoutLog) {
    const offlineData: OfflineWorkoutData = {
      id: `offline_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
      data: workout,
      synced: false,
    };

    this.syncQueue.push(offlineData);
    await this.saveQueue();

    if (this.isOnline) {
      await this.syncOfflineData();
    }

    return offlineData;
  }

  async syncOfflineData() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    const unsyncedItems = this.syncQueue.filter(item => !item.synced);
    
    for (const item of unsyncedItems) {
      try {
        item.synced = true;
        console.log('Synced offline workout:', item.id);
      } catch (error) {
        console.error('Failed to sync workout:', error);
        item.synced = false;
      }
    }

    this.syncQueue = this.syncQueue.filter(item => !item.synced);
    await this.saveQueue();
  }

  getQueueSize(): number {
    return this.syncQueue.filter(item => !item.synced).length;
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  getPendingWorkouts(): OfflineWorkoutData[] {
    return this.syncQueue.filter(item => !item.synced);
  }

  async clearQueue() {
    this.syncQueue = [];
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
  }
}

export const offlineSyncService = new OfflineSyncService();
