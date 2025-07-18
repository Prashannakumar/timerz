import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BreathVisualizer from '../components/BreathVisualizer';
import TimerDisplay from '../components/TimerDisplay';
import ControlButtons from '../components/ControlButtons';
import ConfigurationPanel from '../components/ConfigurationPanel';
import { useTimerStore } from '../store/useTimerStore';
import { COLORS } from '../constants';
import { playSound } from '../utils/soundManager';

// ... imports ...

const HomeScreen = () => {
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
          } else {
            // Regular phase transition
            playSound('phaseComplete');
            useTimerStore.setState({
              currentPhaseIndex: nextPhaseIndex,
              timeRemaining: nextPhase.duration,
            });
          }
        } else {
          // Regular countdown
          useTimerStore.setState({ timeRemaining: newTime });
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentPhaseIndex, pattern, currentCycle, currentSet]);
  
  // ... rest of the component ...
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'space-around',
  },
});

export default HomeScreen;