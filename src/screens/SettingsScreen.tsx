import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import BreathGraphEditor from '../components/BreathGraphEditor';
import PhaseTimeEditor from '../components/PhaseTimeEditor';
import PresetSelector from '../components/PresetSelector';
import StepperInput from '../components/StepperInput';
import { useTimerStore } from '../store/useTimerStore';

const ConfigurationScreen = () => {
  const { pattern, cycles, sets, relaxTime, updateSettings, updatePattern } = useTimerStore();
  const [inputMode, setInputMode] = useState<'graph' | 'numbers'>('graph');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Configure Breath Session</Text>
      <PresetSelector onSelect={updatePattern} />
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, inputMode === 'graph' && styles.toggleActive]}
          onPress={() => setInputMode('graph')}
        >
          <Text style={[styles.toggleText, inputMode === 'graph' && styles.toggleTextActive]}>Graph</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, inputMode === 'numbers' && styles.toggleActive]}
          onPress={() => setInputMode('numbers')}
        >
          <Text style={[styles.toggleText, inputMode === 'numbers' && styles.toggleTextActive]}>Configure Phases</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.editorCard}>
        {inputMode === 'graph' ? (
          <BreathGraphEditor />
        ) : (
          <PhaseTimeEditor />
        )}
      </View>
      <View style={styles.sessionConfigCard}>
        <StepperInput
          label="Cycles per set"
          value={cycles}
          min={1}
          max={50}
          onChange={(value) => updateSettings({ cycles: value })}
        />
        <StepperInput
          label="Number of sets"
          value={sets}
          min={1}
          max={10}
          onChange={(value) => updateSettings({ sets: value })}
        />
        <StepperInput
          label="Relax time (sec)"
          value={relaxTime}
          min={0}
          max={300}
          step={5}
          onChange={(value) => updateSettings({ relaxTime: value })}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 24,
    marginBottom: 16,
    alignSelf: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: COLORS.inactive,
    marginHorizontal: 8,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.text,
    fontSize: 16,
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editorCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionConfigCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default ConfigurationScreen;