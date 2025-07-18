import { create } from 'zustand';

interface SettingsState {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  volume: number;
  updateSettings: (settings: Partial<SettingsState>) => void;
}

const useSettingsStore = create<SettingsState>((set) => ({
  soundEnabled: true,
  vibrationEnabled: true,
  volume: 0.7,
  updateSettings: (settings) => set(settings),
}));

export default useSettingsStore;