import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
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

  // PanResponder for minutes
  const minPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (running) return;
        if (gestureState.dy < -10) setMinutes((m) => Math.min(99, m + 1)); // swipe up
        if (gestureState.dy > 10) setMinutes((m) => Math.max(0, m - 1)); // swipe down
      },
    })
  ).current;

  // PanResponder for seconds
  const secPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (running) return;
        if (gestureState.dy < -10) setSeconds((s) => Math.min(59, s + 1)); // swipe up
        if (gestureState.dy > 10) setSeconds((s) => Math.max(0, s - 1)); // swipe down
      },
    })
  ).current;

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
          <View style={styles.stepperGroup} {...minPanResponder.panHandlers}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setMinutes((m) => Math.min(99, m + 1))} disabled={running}>
              <Icon name="add-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputNum}>{minutes}</Text>            
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setMinutes((m) => Math.max(0, m - 1))} disabled={running}>
              <Icon name="remove-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>minutes</Text>
          </View>
          <View style={styles.stepperGroup} {...secPanResponder.panHandlers}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setSeconds((s) => Math.min(59, s + 1))} disabled={running}>
              <Icon name="add-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputNum}>{seconds}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setSeconds((s) => Math.max(0, s - 1))} disabled={running}>
              <Icon name="remove-circle-outline" size={32} color="#7C4DFF" />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>seconds</Text>
          </View>
        </View>
        <View style={styles.timeDisplayContainer}>
          <View style={styles.displayCard}>
            <Text style={styles.displayTime}>{mm}:{ss}</Text>
          </View>
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
    paddingTop: 36,
    paddingHorizontal: 16,
    minHeight: 52,
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
    marginTop: 90,
    marginBottom: 70,
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
  timeDisplayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  displayCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(124,77,255,0.25)',
    paddingVertical: 32,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 300,
    minHeight: 120,
  },
  displayTime: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3a5fc8',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
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