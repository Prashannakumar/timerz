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
                styles.progressFillCycle, 
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
                styles.progressFillSet, 
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
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    overflow: 'hidden',
    width: '150%',
    alignSelf: 'center',
  },
  progressFillCycle: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 7,
  },
  progressFillSet: {
    height: '100%',
    backgroundColor: '#7C4DFF',
    borderRadius: 7,
  },
});

export default ProgressIndicators;