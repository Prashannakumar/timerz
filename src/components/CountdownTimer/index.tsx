import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { playSound } from '../../utils/soundManager';

export default function CountdownTimer({ onHome }: { onHome?: () => void }) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = minutes * 60 + seconds;

  const start = () => {
    if (!running && totalSeconds > 0) {
      setRunning(true);
      setRemaining(totalSeconds);
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            playSound('sessionComplete');
            Vibration.vibrate(500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pause = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(0);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const displayTime = remaining > 0 ? remaining : totalSeconds;
  const mm = Math.floor(displayTime / 60).toString().padStart(2, '0');
  const ss = (displayTime % 60).toString().padStart(2, '0');

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={{ flex: 1 }}>
      {/* Header Row at the very top */}
      <View style={styles.headerRow}>
        {onHome && (
          <TouchableOpacity style={styles.headerHomeIcon} onPress={onHome}>
            <Icon name="home" size={28} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Countdown Timer</Text>
      </View>
      {/* Main content with top margin to avoid overlap */}
      <View style={styles.mainContent}>
        <View style={styles.timeInputRow}>
          <View style={styles.stepperGroup}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setMinutes((m) => Math.max(0, m - 1))} disabled={running}>
              <Icon name="remove-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputNum}>{minutes}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setMinutes((m) => Math.min(99, m + 1))} disabled={running}>
              <Icon name="add-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>min</Text>
          </View>
          <View style={styles.stepperGroup}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setSeconds((s) => Math.max(0, s - 1))} disabled={running}>
              <Icon name="remove-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputNum}>{seconds}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setSeconds((s) => Math.min(59, s + 1))} disabled={running}>
              <Icon name="add-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>sec</Text>
          </View>
        </View>
        <View style={styles.displayCard}>
          <Text style={styles.displayTime}>{mm}:{ss}</Text>
        </View>
        <View style={styles.controls}>
          {!running ? (
            <TouchableOpacity style={styles.controlButton} onPress={start}>
              <Text style={styles.controlText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.controlButton} onPress={pause}>
              <Text style={styles.controlText}>Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.controlButton} onPress={reset}>
            <Text style={styles.controlText}>Reset</Text>
          </TouchableOpacity>
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
    paddingTop: 30,
    paddingHorizontal: 16,
    minHeight: 48,
    backgroundColor: 'transparent',
  },
  headerHomeIcon: {
    marginRight: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a5fc8',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginRight: 40,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 78, // enough to clear the header
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  stepperGroup: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  stepperBtn: {
    marginVertical: 2,
  },
  inputNum: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C4DFF',
    marginVertical: 2,
  },
  inputLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  displayCard: {
    marginVertical: 18,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(124,77,255,0.18)',
    paddingVertical: 28,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  displayTime: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#3a5fc8',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  controlButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 16,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  controlText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
}); 