import React, { useEffect, useRef } from 'react';
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
import { COLORS, PRESET_PATTERNS } from '../constants';
import { playSound } from '../utils/soundManager';
import LinearGradient from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// ... imports ...

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Make navigation optional
const HomeScreen = ({ navigation, onConfigureSession, onHome }: { navigation?: HomeScreenNavigationProp, onConfigureSession?: () => void, onHome?: () => void }) => {
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
    sessionComplete,
  } = useTimerStore();

  const prevIsRunning = useRef(isRunning);

  // Play phaseStart sound when timer is started
  useEffect(() => {
    if (!prevIsRunning.current && isRunning) {
      playSound('phaseStart');
    }
    prevIsRunning.current = isRunning;
  }, [isRunning]);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        // If in relax time
        if (currentPhaseIndex === -1) {
          const newRelaxTime = timeRemaining - 1;
          if (newRelaxTime <= 0) {
            // Relax time finished, start next set or end session
            if (currentSet < sets) {
              // Start next set
              useTimerStore.setState({
                currentSet: currentSet + 1,
                currentCycle: 1,
                currentPhaseIndex: 0,
                timeRemaining: pattern[0].duration,
              });
              playSound('phaseStart');
            } else {
              // All sets complete
              clearInterval(interval);
              playSound('sessionComplete');
              useTimerStore.setState({ sessionComplete: true });
              useTimerStore.setState({
                isRunning: false,
                currentPhaseIndex: 0,
                timeRemaining: pattern[0].duration,
                currentCycle: 1,
                currentSet: 1,
              });
            }
          } else {
            useTimerStore.setState({ timeRemaining: newRelaxTime });
          }
          return;
        }

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
              // If not the last set, start relax time
              if (currentSet < sets) {
                playSound('setComplete');
                useTimerStore.setState({
                  currentPhaseIndex: -1, // Special state for relax time
                  timeRemaining: relaxTime,
                });
              } else {
                // All sets complete
                clearInterval(interval);
                playSound('sessionComplete');
                useTimerStore.setState({ sessionComplete: true });
                useTimerStore.setState({
                  isRunning: false,
                  currentPhaseIndex: 0,
                  timeRemaining: pattern[0].duration,
                  currentCycle: 1,
                  currentSet: 1,
                });
              }
              return;
            }

            // Only play cycleComplete if not also setComplete
            if (nextCycle <= cycles) {
              playSound('cycleComplete');
            }
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
        } else {
          // Regular countdown
          useTimerStore.setState({ timeRemaining: newTime });
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentPhaseIndex, pattern, currentCycle, currentSet, sets, cycles, relaxTime]);
  
  // Determine current phase name and progress for BreathVisualizer
  let currentPhase = pattern[currentPhaseIndex]?.name || 'Inhale';
  let phaseDuration = pattern[currentPhaseIndex]?.duration || 1;
  let progress = phaseDuration > 0 ? (phaseDuration - timeRemaining) / phaseDuration : 0;

  // If in relax time (currentPhaseIndex === -1), show 'Relax' and use relaxTime
  if (currentPhaseIndex === -1) {
    currentPhase = 'Relax';
    phaseDuration = relaxTime;
    progress = relaxTime > 0 ? (relaxTime - timeRemaining) / relaxTime : 0;
  }

  // Find the chosen preset name by matching the pattern
  const chosenPreset = PRESET_PATTERNS.find(preset =>
    preset.phases.length === pattern.length &&
    preset.phases.every((phase, i) => phase.name === pattern[i].name)
  );
  const presetName = chosenPreset ? chosenPreset.name : 'Custom';

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3']} style={{ flex: 1 }}>
      {/* Floating Home Icon */}
      {onHome && (
        <TouchableOpacity style={styles.floatingHomeIcon} onPress={onHome}>
          <Icon name="home" size={28} color="#333" />
        </TouchableOpacity>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Breath Cycle</Text>
        <Text style={styles.presetLabel}>{presetName}</Text>
        <View style={styles.visualCard}>
          {sessionComplete ? (
            <>
              <Text style={styles.successMessage}>You did it! 🎉</Text>
              <Text style={styles.successSubtext}>Session Complete</Text>
            </>
          ) : (
            <>
              <BreathVisualizer currentPhase={currentPhase} progress={progress} />
              {/* <Text style={styles.phaseLabel}>{currentPhase}</Text> */}
              <TimerDisplay timeRemaining={timeRemaining} />
            </>
          )}
        </View>
        <ProgressIndicators />
        <ControlButtons sessionComplete={sessionComplete} />
        <TouchableOpacity
          style={styles.configButton}
          onPress={() => {
            if (onConfigureSession) onConfigureSession();
            else if (navigation) navigation.navigate('Settings');
          }}
        >
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
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5f4b8b',
    marginTop: 12,
    marginBottom: 2,
    letterSpacing: 1.2,
  },
  presetLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3a5fc8', // deep blue for visibility and theme
    opacity: 1,
    marginBottom: 12,
  },
  visualCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 18,
    color: '#5f4b8b',
    marginTop: 4,
    fontWeight: '600',
    marginBottom: 8,
  },
  configButton: {
    backgroundColor: '#5f4b8b',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  configButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  successMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4BB543',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 8,
  },
  floatingHomeIcon: {
    position: 'absolute',
    top: 30,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default HomeScreen;