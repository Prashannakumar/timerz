import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { playSound } from '../../utils/soundManager';

export default function Stopwatch({ onBack }: { onBack: () => void }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animated icon pulse
  const iconScale = useSharedValue(1);
  React.useEffect(() => {
    if (running) {
      iconScale.value = withRepeat(withSequence(
        withTiming(1.18, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ), -1, true);
    } else {
      iconScale.value = withTiming(1, { duration: 300 });
    }
  }, [running]);
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const start = () => {
    if (!running) {
      setRunning(true);
      playSound('phaseStart');
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 10);
      }, 10);
    }
  };

  const stop = () => {
    setRunning(false);
    playSound('phaseComplete');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setElapsed(0);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
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

  return (
    <LinearGradient colors={['#e0c3fc', '#8ec5fc']} style={{ flex: 1 }}>
      {/* Header Row with Home Icon and Title */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerHomeIcon} onPress={onBack}>
          <Icon name="home" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stopwatch</Text>
      </View>
      {/* Animated Stopwatch Icon */}
      <View style={styles.iconContainer}>
        <Animated.View style={iconAnimatedStyle}>
          <Icon name="timer-outline" size={60} color="#3a5fc8" />
        </Animated.View>
      </View>
      {/* Stopwatch Display */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(elapsed)}</Text>
      </View>
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlButton, running && styles.disabledButton]} onPress={start} disabled={running}>
          <Text style={styles.controlText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, !running && styles.disabledButton]} onPress={stop} disabled={!running}>
          <Text style={styles.controlText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={reset}>
          <Text style={styles.controlText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    marginBottom: 4,
    position: 'relative',
    minHeight: 48,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a5fc8',
    marginRight: 40, // to visually center the text when icon is present
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  container: {
    flex: 1,
  },
  timeContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  time: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#222',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 40,
    marginTop: 12,
  },
  controlButton: {
    backgroundColor: '#3a5fc8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#b3c6ff',
  },
  controlText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 