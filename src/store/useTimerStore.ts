import { create } from 'zustand';

interface Phase {
  name: string;
  duration: number;
}

interface TimerState {
  isRunning: boolean;
  pattern: Phase[];
  currentPhaseIndex: number;
  timeRemaining: number;
  cycles: number;
  sets: number;
  relaxTime: number;
  currentCycle: number;
  currentSet: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updatePattern: (newPattern: Phase[]) => void;
  updateSettings: (settings: {
    cycles?: number;
    sets?: number;
    relaxTime?: number;
  }) => void;
  editingMode: 'graph' | 'numbers';
  setEditingMode: (mode: 'graph' | 'numbers') => void;
  updatePhaseDuration: (phaseIndex: number, duration: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  isRunning: false,
  pattern: [
    { name: 'Inhale', duration: 4 },
    { name: 'Hold', duration: 4 },
    { name: 'Exhale', duration: 4 },
  ],
  currentPhaseIndex: 0,
  timeRemaining: 4,
  cycles: 5,
  sets: 1,
  relaxTime: 30,
  currentCycle: 1,
  currentSet: 1,
  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => set({
    isRunning: false,
    currentPhaseIndex: 0,
    timeRemaining: 4,
    currentCycle: 1,
    currentSet: 1,
  }),
  updatePattern: (newPattern) => set({ 
    pattern: newPattern,
    currentPhaseIndex: 0,
    timeRemaining: newPattern[0].duration,
  }),
  updateSettings: (settings) => set(settings),
  editingMode: 'graph',
  setEditingMode: (mode) => set({ editingMode: mode }),
  updatePhaseDuration: (phaseIndex, duration) =>
    set((state) => ({
      pattern: state.pattern.map((phase, idx) =>
        idx === phaseIndex ? { ...phase, duration } : phase
      ),
      // Reset timer if we're modifying the current phase
      timeRemaining: phaseIndex === state.currentPhaseIndex ? duration : state.timeRemaining
    })),
}));