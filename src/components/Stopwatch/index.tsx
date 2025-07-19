import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { playSound } from '../../utils/soundManager';

export default function Stopwatch({ onBack }: { onBack: () => void }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestamp = useRef<number | null>(null);
  const previousElapsed = useRef(0);

  // Animated icon pulse
  const iconScale = useSharedValue(1);
  const iconGlow = useSharedValue(0.4);

  React.useEffect(() => {
    if (running) {
      iconScale.value = withRepeat(withSequence(
        withTiming(1.18, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ), -1, true);
      iconGlow.value = withRepeat(withSequence(
        withTiming(0.8, { duration: 400 }),
        withTiming(0.4, { duration: 400 })
      ), -1, true);
    } else {
      iconScale.value = withTiming(1, { duration: 300 });
      iconGlow.value = withTiming(0.4, { duration: 300 });
    }
  }, [running]);
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    shadowOpacity: iconGlow.value,
  }));

  const start = () => {
    if (!running) {
      setRunning(true);
      playSound('phaseStart');
      startTimestamp.current = Date.now();
      intervalRef.current = setInterval(() => {
        if (startTimestamp.current !== null) {
          setElapsed(Date.now() - startTimestamp.current + previousElapsed.current);
        }
      }, 30);
    }
  };

  const stop = () => {
    setRunning(false);
    playSound('phaseComplete');
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (startTimestamp.current !== null) {
      previousElapsed.current += Date.now() - startTimestamp.current;
      startTimestamp.current = null;
    }
  };

  const reset = () => {
    setElapsed(0);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimestamp.current = null;
    previousElapsed.current = 0;
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Gradient for buttons
  const buttonGradient = ['#7C4DFF', '#3a5fc8'];

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={{ flex: 1 }}>
      {/* Header Row at the very top */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerHomeIcon} onPress={onBack}>
          <Icon name="home" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stopwatch</Text>
      </View>
      {/* Main content with top margin to avoid overlap */}
      <View style={styles.mainContent}>
        {/* Animated Stopwatch Icon */}
        <View style={styles.iconContainer}>
          <Animated.View style={[iconAnimatedStyle, styles.iconGlow]}>
            <Icon name="timer-outline" size={60} color="#3a5fc8" />
          </Animated.View>
        </View>
        {/* Glassmorphism Card for Stopwatch Display */}
        <View style={styles.displayCard}>
          <Animated.Text style={[styles.time]}>{formatTime(elapsed)}</Animated.Text>
        </View>
        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [styles.controlButton, running && styles.disabledButton, pressed && styles.buttonPressed]}
            onPress={start}
            disabled={running}
          >
            <Text style={styles.controlText}>Start</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.controlButton, !running && styles.disabledButton, pressed && styles.buttonPressed]}
            onPress={stop}
            disabled={!running}
          >
            <Text style={styles.controlText}>Stop</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.controlButton, pressed && styles.buttonPressed]}
            onPress={reset}
          >
            <Text style={styles.controlText}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 36,
    paddingHorizontal: 16,
    minHeight: 52,
    backgroundColor: 'transparent',
  },
  headerHomeIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3a5fc8',
    marginRight: 40,
    letterSpacing: 1.1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 90, // enough to clear the header
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  iconGlow: {
    shadowColor: '#3a5fc8',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    shadowOpacity: 0.7,
    elevation: 12,
    borderRadius: 40,
    backgroundColor: 'rgba(124,77,255,0.08)',
    padding: 12,
  },
  displayCard: {
    marginVertical: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(124,77,255,0.18)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 220,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3a5fc8',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  controlButton: {
    backgroundColor: '#3a5fc8',
    borderRadius: 14,
    marginHorizontal: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  disabledButton: {
    opacity: 0.5,
  },
  controlText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
}); 