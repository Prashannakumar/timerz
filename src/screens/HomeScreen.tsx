import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import BreathGraphEditor from '../components/BreathGraphEditor';
import ConfigurationPanel from '../components/ConfigurationPanel';
import ControlButtons from '../components/ControlButtons';
import PhaseTimeEditor from '../components/PhaseTimeEditor';
import PresetSelector from '../components/PresetSelector';
import ProgressIndicators from '../components/ProgressIndicators';
import StepperInput from '../components/StepperInput';
import TimerDisplay from '../components/TimerDisplay';
import BreathVisualizer from '../components/BreathVisualizer';
import HeaderSettingsButton from '../components/HeaderSettingsButton';
import { useTimerStore } from '../store/useTimerStore';
import { COLORS } from '../constants';
import { playSound } from '../utils/soundManager';
import LinearGradient from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';

// ... imports ...

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const {
    isRunning,
    pattern,
    currentPhaseIndex,
    timeRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    currentCycle,
    currentSet,
    cycles,
    sets,
    relaxTime,
    updatePhaseDuration,
  } = useTimerStore();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        const newTime = timeRemaining - 1;
        
        if (newTime <= 0) {
          // Phase complete
          const nextPhaseIndex = (currentPhaseIndex + 1) % pattern.length;
          const nextPhase = pattern[nextPhaseIndex];
          
          // Check if we're completing a full cycle
          if (nextPhaseIndex === 0) {
            const nextCycle = currentCycle + 1;
            
            // Check if we're completing a full set
            if (nextCycle > cycles) {
              const nextSet = currentSet + 1;
              
              if (nextSet > sets) {
                // Session complete
                clearInterval(interval);
                playSound('sessionComplete');
                return;
              } else {
                // Set complete, start relax time if needed
                if (relaxTime > 0) {
                  playSound('setComplete');
                  useTimerStore.setState({
                    currentSet: nextSet,
                    currentCycle: 1,
                    currentPhaseIndex: -1, // Special state for relax time
                    timeRemaining: relaxTime,
                  });
                  return;
                }
              }
            }
            
            // Cycle complete
            playSound('cycleComplete');
            useTimerStore.setState({
              currentCycle: nextCycle,
              currentPhaseIndex: nextPhaseIndex,
              timeRemaining: nextPhase.duration,
            });
            playSound('phaseStart');
          } else {
            // Regular phase transition
            playSound('phaseComplete');
            useTimerStore.setState({
              currentPhaseIndex: nextPhaseIndex,
              timeRemaining: nextPhase.duration,
            });
            playSound('phaseStart');
          }
        } else if (timeRemaining === relaxTime && currentPhaseIndex === -1) {
          // Relax time just finished, start next phase
          playSound('phaseStart');
        } else {
          // Regular countdown
          useTimerStore.setState({ timeRemaining: newTime });
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentPhaseIndex, pattern, currentCycle, currentSet]);
  
  // Determine current phase name and progress for BreathVisualizer
  const currentPhase = pattern[currentPhaseIndex]?.name || 'Inhale';
  const phaseDuration = pattern[currentPhaseIndex]?.duration || 1;
  const progress = phaseDuration > 0 ? (phaseDuration - timeRemaining) / phaseDuration : 0;

  return (
    <LinearGradient colors={['#e0c3fc', '#8ec5fc']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>  
        <Text style={styles.header}>Yoga Breath Timer</Text>
        <View style={styles.card}>
          <BreathVisualizer currentPhase={currentPhase} progress={progress} />
          <Text style={styles.phaseLabel}>{currentPhase}</Text>
        </View>
        <ProgressIndicators />
        <View style={styles.card}>
          <TimerDisplay timeRemaining={timeRemaining} />
        </View>
        <View style={styles.controlsRow}>
          <ControlButtons />
        </View>
        <TouchableOpacity style={styles.configButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.configButtonText}>Configure Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5f4b8b',
    marginTop: 32,
    marginBottom: 16,
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 24,
    marginVertical: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  phaseLabel: {
    fontSize: 20,
    color: '#5f4b8b',
    marginTop: 8,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
    width: '100%',
  },
  configButton: {
    backgroundColor: '#5f4b8b',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  configButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
});

export default HomeScreen;