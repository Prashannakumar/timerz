import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import BreathGraphEditor from '../components/BreathGraphEditor';
import PhaseTimeEditor from '../components/PhaseTimeEditor';
import PresetSelector from '../components/PresetSelector';
import StepperInput from '../components/StepperInput';
import { useTimerStore } from '../store/useTimerStore';
import Icon from 'react-native-vector-icons/Ionicons';

const ConfigurationScreen = ({ onBack }: { onBack?: () => void }) => {
  const { pattern, cycles, sets, relaxTime, updateSettings, updatePattern } = useTimerStore();
  const [inputMode, setInputMode] = useState<'graph' | 'numbers'>('graph');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Row with Back Icon and Title */}
      <View style={styles.headerRow}>
        {onBack && (
          <TouchableOpacity style={styles.headerBackIcon} onPress={onBack}>
            <Icon name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Configure Breath Session</Text>
      </View>
      <PresetSelector onSelect={updatePattern} />
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, inputMode === 'graph' && styles.toggleActive]}
          onPress={() => setInputMode('graph')}
        >
          <Icon name="stats-chart" size={18} color={inputMode === 'graph' ? '#fff' : '#1a237e'} style={{ marginRight: 8 }} />
          <Text style={[styles.toggleText, inputMode === 'graph' && styles.toggleTextActive]}>Graph</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, inputMode === 'numbers' && styles.toggleActive]}
          onPress={() => setInputMode('numbers')}
        >
          <Icon name="create" size={18} color={inputMode === 'numbers' ? '#fff' : '#1a237e'} style={{ marginRight: 8 }} />
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
    // padding: 20,
    paddingVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5f4b8b',
    // color: COLORS.primary,
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
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#b3c6ff', // light blue
    marginHorizontal: 8,
  },
  toggleActive: {
    backgroundColor: '#3a5fc8', // deep blue
  },
  toggleText: {
    color: '#1a237e',
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
  backButton: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 0,
    alignSelf: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    marginBottom: 4,
    position: 'relative',
    minHeight: 48,
  },
  headerBackIcon: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5f4b8b',
    marginRight: 40, // to visually center the text when icon is present
  },
});

export default ConfigurationScreen;
export { ConfigurationScreen as SettingsScreen };