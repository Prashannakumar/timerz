import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTimerStore } from '../../store/useTimerStore';
import { COLORS } from '../../constants';

const ProgressIndicators = () => {
  const { currentCycle, cycles, currentSet, sets } = useTimerStore();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.progressContainer}>
          <Text style={styles.label}>Cycle: {currentCycle}/{cycles}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentCycle / cycles) * 100}%` }
              ]} 
            />
          </View>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.label}>Set: {currentSet}/{sets}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentSet / sets) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    // alignItems: 'flex-start',
  },
  progressContainer: {
    // flex: 1,
    // marginHorizontal: 4,
  },
  label: {
    color: COLORS.text,
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.inactive,
    borderRadius: 5,
    overflow: 'hidden',
    width: '150%',
    alignSelf: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
});

export default ProgressIndicators;