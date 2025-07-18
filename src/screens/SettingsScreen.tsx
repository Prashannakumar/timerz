import React from 'react';
import { View, Switch, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants';
import { setVolume } from '../utils/soundManager';
import useSettingsStore from '../store/useSettingsStore';
import Slider from '@react-native-community/slider';

const SettingsScreen = () => {
  const { soundEnabled, vibrationEnabled, volume, updateSettings } = useSettingsStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Sounds</Text>
        <Switch
          value={soundEnabled}
          onValueChange={(value) => {
            updateSettings({ soundEnabled: value });
            setVolume(value ? volume : 0);
          }}
          trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Vibration</Text>
        <Switch
          value={vibrationEnabled}
          onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
          trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
        />
      </View>

      {soundEnabled && (
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Volume: {Math.round(volume * 100)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={volume}
            onValueChange={(value) => {
              updateSettings({ volume: value });
              setVolume(value);
            }}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.inactive}
            thumbTintColor={COLORS.secondary}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  settingText: {
    fontSize: 16,
    color: COLORS.text,
  },
  slider: {
    width: '100%',
    marginTop: 10,
  },
});

export default SettingsScreen;