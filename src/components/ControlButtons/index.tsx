import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { useTimerStore } from '../../store/useTimerStore';

const ControlButtons = () => {
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimerStore();

  return (
    <View style={styles.container}>
      {isRunning ? (
        <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={pauseTimer}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startTimer}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginHorizontal: 10,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: COLORS.primary,
  },
  pauseButton: {
    backgroundColor: COLORS.secondary,
  },
  resetButton: {
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: COLORS.inactive,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ControlButtons;