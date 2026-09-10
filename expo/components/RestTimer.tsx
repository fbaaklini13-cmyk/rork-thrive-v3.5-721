import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Vibration } from 'react-native';
import { X, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Audio } from 'expo-av';

interface RestTimerProps {
  visible: boolean;
  onClose: () => void;
  initialSeconds?: number;
}

export default function RestTimer({
  visible,
  onClose,
  initialSeconds = 90,
}: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  useEffect(() => {
    if (visible) {
      setSeconds(initialSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [visible, initialSeconds]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    if (Platform.OS !== 'web') {
      Vibration.vibrate([0, 500, 200, 500]);
    }

    console.log('Timer complete! Rest time is over.');
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(totalSeconds);
  };

  const adjustTime = (delta: number) => {
    setSeconds(prev => Math.max(0, prev + delta));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (totalSeconds - seconds) / totalSeconds : 0;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Rest Timer</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Colors.darkGrey} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.timerContainer}>
              <View style={styles.progressRing}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      transform: [{ 
                        rotate: `${progress * 360}deg` 
                      }] 
                    },
                  ]}
                />
                <View style={styles.innerCircle}>
                  <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                  <Text style={styles.timerLabel}>
                    {seconds === 0 ? 'Time\'s up!' : 'remaining'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => adjustTime(-15)}
              >
                <Minus color={Colors.darkGrey} size={24} />
                <Text style={styles.controlLabel}>15s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mainButton,
                  isRunning && styles.mainButtonPause,
                ]}
                onPress={toggleTimer}
              >
                {isRunning ? (
                  <Pause color={Colors.white} size={32} />
                ) : (
                  <Play color={Colors.white} size={32} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => adjustTime(15)}
              >
                <Plus color={Colors.darkGrey} size={24} />
                <Text style={styles.controlLabel}>15s</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
              <RotateCcw color={Colors.primary} size={20} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>

            <View style={styles.presets}>
              <Text style={styles.presetsLabel}>Quick Set:</Text>
              <View style={styles.presetsButtons}>
                {[30, 60, 90, 120, 180].map(preset => (
                  <TouchableOpacity
                    key={preset}
                    style={styles.presetButton}
                    onPress={() => {
                      setSeconds(preset);
                      setIsRunning(false);
                    }}
                  >
                    <Text style={styles.presetText}>{preset}s</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGrey,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  progressRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  timerLabel: {
    fontSize: 14,
    color: Colors.mediumGrey,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 24,
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
  },
  controlLabel: {
    fontSize: 12,
    color: Colors.mediumGrey,
  },
  mainButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainButtonPause: {
    backgroundColor: Colors.warning,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
    marginBottom: 24,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  presets: {
    gap: 12,
  },
  presetsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumGrey,
  },
  presetsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGrey,
  },
});
