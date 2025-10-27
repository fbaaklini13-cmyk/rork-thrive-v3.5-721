import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import { useHealthDevices } from '@/hooks/use-health-devices';
import { DeviceConnectionCard } from '@/components/DeviceConnectionCard';
import { DeviceType } from '@/types/health';
import { Colors } from '@/constants/colors';

export default function DevicesScreen() {
  const {
    devices,
    syncing,
    error,
    loadDevices,
    connectDevice,
    disconnectDevice,
    syncDevice,
    syncAllDevices,
    isDeviceConnected,
    getDevice,
  } = useHealthDevices();

  const [connectingDevice, setConnectingDevice] = useState<DeviceType | null>(null);

  const availableDevices: { type: DeviceType; name: string; available: boolean }[] = [
    { type: 'apple_watch', name: 'Apple Watch', available: Platform.OS === 'ios' },
    { type: 'health_connect', name: 'Health Connect', available: Platform.OS === 'android' },
    { type: 'whoop', name: 'WHOOP', available: true },
    { type: 'garmin', name: 'Garmin', available: true },
    { type: 'strava', name: 'Strava', available: true },
    { type: 'oura', name: 'Oura', available: true },
    { type: 'fitbit', name: 'Fitbit', available: true },
  ];

  const handleConnect = async (deviceType: DeviceType) => {
    setConnectingDevice(deviceType);
    try {
      const success = await connectDevice(deviceType);
      if (success) {
        Alert.alert('Success', `Successfully connected to ${getDeviceName(deviceType)}`);
      } else {
        Alert.alert('Error', `Failed to connect to ${getDeviceName(deviceType)}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred while connecting';
      console.error('Connection error:', errorMsg, error);
      Alert.alert('Connection Error', errorMsg);
    } finally {
      setConnectingDevice(null);
    }
  };

  const handleDisconnect = async (deviceType: DeviceType) => {
    Alert.alert(
      'Disconnect Device',
      `Are you sure you want to disconnect ${getDeviceName(deviceType)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            const success = await disconnectDevice(deviceType);
            if (success) {
              Alert.alert('Success', `Disconnected from ${getDeviceName(deviceType)}`);
            } else {
              Alert.alert('Error', `Failed to disconnect from ${getDeviceName(deviceType)}`);
            }
          },
        },
      ]
    );
  };

  const handleSync = async (deviceType: DeviceType) => {
    const success = await syncDevice(deviceType);
    if (success) {
      Alert.alert('Success', `Successfully synced ${getDeviceName(deviceType)}`);
    } else {
      Alert.alert('Error', `Failed to sync ${getDeviceName(deviceType)}`);
    }
  };

  const handleSyncAll = async () => {
    await syncAllDevices();
    Alert.alert('Success', 'All devices synced successfully');
  };

  const getDeviceName = (deviceType: DeviceType): string => {
    const device = availableDevices.find(d => d.type === deviceType);
    return device?.name || deviceType;
  };

  const connectedDevicesCount = devices.filter(d => d.is_connected).length;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Connected Devices',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.darkGrey,
          headerShadowVisible: false,
          headerRight: () =>
            connectedDevicesCount > 0 ? (
              <TouchableOpacity onPress={handleSyncAll} disabled={syncing}>
                <RefreshCw
                  size={22}
                  color={syncing ? Colors.mediumGrey : Colors.primary}
                />
              </TouchableOpacity>
            ) : null,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Error Loading Devices</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadDevices}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.header}>
            <Text style={styles.title}>Health Data Sources</Text>
            <Text style={styles.subtitle}>
              Connect your devices and apps to sync your health and fitness data automatically.
            </Text>
            {connectedDevicesCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {connectedDevicesCount} {connectedDevicesCount === 1 ? 'device' : 'devices'} connected
                </Text>
              </View>
            )}
          </View>

          <View style={styles.devicesList}>
            {availableDevices
              .filter(d => d.available)
              .map(device => {
                const connection = getDevice(device.type);
                const isConnected = isDeviceConnected(device.type);
                const isConnecting = connectingDevice === device.type;

                return (
                  <DeviceConnectionCard
                    key={device.type}
                    deviceType={device.type}
                    deviceName={device.name}
                    isConnected={isConnected}
                    lastSyncAt={connection?.last_sync_at}
                    onConnect={() => handleConnect(device.type)}
                    onDisconnect={() => handleDisconnect(device.type)}
                    onSync={() => handleSync(device.type)}
                    loading={isConnecting}
                    syncing={syncing}
                  />
                );
              })}
          </View>

          <View style={styles.info}>
            <Text style={styles.infoTitle}>About Data Syncing</Text>
            <Text style={styles.infoText}>
              • Data is synced automatically in the background{'\n'}
              • You can manually sync anytime by tapping the Sync button{'\n'}
              • Your health data is encrypted and securely stored{'\n'}
              • You can disconnect any device at any time
            </Text>
          </View>

          {Platform.OS === 'ios' && !isDeviceConnected('apple_watch') && (
            <View style={styles.platformInfo}>
              <Text style={styles.platformInfoText}>
                💡 On iOS, connect your Apple Watch to track steps, heart rate, workouts, and sleep automatically.
              </Text>
            </View>
          )}

          {Platform.OS === 'android' && !isDeviceConnected('health_connect') && (
            <View style={styles.platformInfo}>
              <Text style={styles.platformInfoText}>
                💡 On Android, connect Health Connect to sync data from compatible fitness apps and devices.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGrey,
    lineHeight: 22,
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  devicesList: {
    marginBottom: 24,
  },
  info: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.darkGrey,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.mediumGrey,
    lineHeight: 22,
  },
  platformInfo: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  platformInfoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#C62828',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
