import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, PRESET_PATTERNS } from '../../constants';
import { useTimerStore } from '../../store/useTimerStore';

const PresetSelector = () => {
  const { updatePattern } = useTimerStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preset Patterns:</Text>
      <View style={styles.presetsContainer}>
        {PRESET_PATTERNS.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.presetButton}
            onPress={() => updatePattern(preset.phases)}
          >
            <Text style={styles.presetText}>{preset.name}</Text>
          </TouchableOpacity>
        ))}
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  presetText: {
    color: 'white',
  },
});

export default PresetSelector;