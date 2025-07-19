import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { useTimerStore } from '../../store/useTimerStore';
import Icon from 'react-native-vector-icons/Ionicons';

const ControlButtons = ({ sessionComplete = false }: { sessionComplete?: boolean }) => {
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimerStore();

  return (
    <View style={styles.container}>
      {sessionComplete ? (
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startTimer}>
          <Icon name="play" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      ) : isRunning ? (
        <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={pauseTimer}>
          <Icon name="pause" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startTimer}>
          <Icon name="play" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
      {!sessionComplete && (
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
          <Icon name="refresh" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, styles.resetButtonText]}>Reset</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 10,
    minWidth: 110,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#4BB543', // green
  },
  pauseButton: {
    backgroundColor: '#FFA500', // orange
  },
  resetButton: {
    backgroundColor: '#6c757d',
    borderWidth: 0,
    borderColor: COLORS.primary,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ControlButtons;