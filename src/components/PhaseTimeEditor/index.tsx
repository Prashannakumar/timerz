import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';
import { useTimerStore } from '../../store/useTimerStore';
import Slider from '@react-native-community/slider';
import BreathGraphEditor from '../BreathGraphEditor';

const PhaseTimeEditor = () => {
  const { pattern, updatePhaseDuration } = useTimerStore();

  return (
    <View style={styles.container}>
      <View style={styles.numericContainer}>
        {pattern.map((phase, index) => (
          <View key={index} style={styles.phaseRow}>
            <Text style={styles.phaseName}>{phase.name}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={phase.duration}
              onValueChange={(value) => updatePhaseDuration(index, value)}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.inactive}
              thumbTintColor={COLORS.primary}
            />
            <Text style={styles.durationText}>{phase.duration}s</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.text,
  },
  numericContainer: {
    paddingHorizontal: 20,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  phaseName: {
    width: 80,
    color: COLORS.text,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  durationText: {
    width: 40,
    textAlign: 'right',
    color: COLORS.text,
  },
});

export default PhaseTimeEditor;