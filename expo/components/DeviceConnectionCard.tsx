import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Watch, Smartphone, Activity, Heart, Bike, Moon, ActivitySquare } from 'lucide-react-native';
import { DeviceType } from '@/types/health';
import { Palette } from '@/constants/theme';

interface DeviceConnectionCardProps {
  deviceType: DeviceType;
  deviceName: string;
  isConnected: boolean;
  lastSyncAt?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  loading?: boolean;
  syncing?: boolean;
}

const deviceIcons: Record<DeviceType, any> = {
  apple_watch: Watch,
  health_connect: Smartphone,
  whoop: Activity,
  garmin: Heart,
  strava: Bike,
  oura: Moon,
  fitbit: ActivitySquare,
};

const deviceDescriptions: Record<DeviceType, string> = {
  apple_watch: 'Track steps, heart rate, workouts, and sleep from your Apple Watch',
  health_connect: 'Sync fitness data from Android devices and compatible apps',
  whoop: 'Access recovery, strain, sleep, and HRV data from your WHOOP strap',
  garmin: 'Import activities, sleep, and health metrics from Garmin devices',
  strava: 'Sync runs, rides, and activities from your Strava account',
  oura: 'Import sleep, readiness, and activity from your Oura Ring',
  fitbit: 'Sync steps, sleep, and heart rate from your Fitbit',
};

export function DeviceConnectionCard({
  deviceType,
  deviceName,
  isConnected,
  lastSyncAt,
  onConnect,
  onDisconnect,
  onSync,
  loading,
  syncing,
}: DeviceConnectionCardProps) {
  const Icon = deviceIcons[deviceType];
  
  const formatLastSync = (date?: string) => {
    if (!date) return 'Never synced';
    
    const now = new Date();
    const syncDate = new Date(date);
    const diffMs = now.getTime() - syncDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon size={28} color={isConnected ? Palette.accent : Palette.inkMuted} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{deviceName}</Text>
        <Text style={styles.description}>{deviceDescriptions[deviceType]}</Text>
        
        {isConnected && (
          <Text style={styles.lastSync}>
            Last synced: {formatLastSync(lastSyncAt)}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {isConnected ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.syncButton]}
              onPress={onSync}
              disabled={syncing || loading}
            >
              {syncing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.syncButtonText}>Sync</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.disconnectButton]}
              onPress={onDisconnect}
              disabled={loading || syncing}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.connectButton]}
            onPress={onConnect}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.connectButtonText}>Connect</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.canvasRaised,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.line,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Palette.ink,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Palette.inkMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
  lastSync: {
    fontSize: 12,
    color: Palette.inkMuted,
    marginTop: 4,
  },
  actions: {
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: Palette.accent,
  },
  connectButtonText: {
    color: Palette.canvas,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  syncButton: {
    backgroundColor: Palette.accent,
  },
  syncButtonText: {
    color: Palette.canvas,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  disconnectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Palette.lineStrong,
  },
  disconnectButtonText: {
    color: Palette.inkMuted,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
