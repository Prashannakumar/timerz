import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PhaseTimeEditor from '../PhaseTimeEditor';
import StepperInput from '../StepperInput';
import { useTimerStore } from '../../store/useTimerStore';
import PresetSelector from '../PresetSelector';
import { COLORS } from '../../constants';

const ConfigurationPanel = () => {
  const { cycles, sets, relaxTime, updateSettings } = useTimerStore();

  return (
    <ScrollView style={styles.container}>
      <PhaseTimeEditor />
      
      <PresetSelector />
      
      <View style={styles.settingsContainer}>
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
    marginTop: 20,
  },
  settingsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default ConfigurationPanel;