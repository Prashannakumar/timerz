import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, PRESET_PATTERNS } from '../../constants';
import { useTimerStore } from '../../store/useTimerStore';
import type { Phase } from '../../store/useTimerStore';
import Icon from 'react-native-vector-icons/Ionicons';

interface PresetSelectorProps {
  onSelect?: (phases: Phase[]) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelect }) => {
  const { updatePattern, pattern } = useTimerStore();

  // Find the currently selected preset by matching pattern
  const selectedPresetId = PRESET_PATTERNS.find(preset =>
    preset.phases.length === pattern.length &&
    preset.phases.every((phase, i) => phase.name === pattern[i].name)
  )?.id;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preset Patterns:</Text>
      <View style={styles.presetsContainer}>
        {PRESET_PATTERNS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <TouchableOpacity
              key={preset.id}
              style={[styles.presetButton, isSelected ? styles.selectedButton : styles.unselectedButton]}
              onPress={() => onSelect ? onSelect(preset.phases) : updatePattern(preset.phases)}
            >
              <Text style={[styles.presetText, isSelected && styles.selectedText]}>{preset.name}</Text>
              {isSelected && <Icon name="checkmark-circle" size={18} color={styles.selectedText.color} style={{ marginLeft: 6 }} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  unselectedButton: {
    backgroundColor: '#c3bafc', // soft purple/blue to match theme
  },
  presetText: {
    color: '#3a2c6c', // deep purple for contrast
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
});

export default PresetSelector;