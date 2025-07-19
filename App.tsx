import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Dashboard from './src/components/Dashboard';
import HomeScreen from './src/screens/HomeScreen';
import Stopwatch from './src/components/Stopwatch';
import SettingsScreen from './src/screens/SettingsScreen';
import CountdownTimer from './src/components/CountdownTimer';

export default function App() {
  const [screen, setScreen] = useState<'dashboard' | 'yoga-breath-timer' | 'stopwatch' | 'yoga-breath-settings' | 'countdown-timer'>('dashboard');

  // Handler for Dashboard card selection
  const handleSelectFeature = (feature: string) => {
    if (feature === 'yoga-breath-timer') setScreen('yoga-breath-timer');
    else if (feature === 'stopwatch') setScreen('stopwatch');
    else if (feature === 'countdown-timer') setScreen('countdown-timer');
  };

  // Handler to go back to dashboard
  const goHome = () => setScreen('dashboard');

  // Handler for Yoga Breath Timer settings
  const goToYogaSettings = () => setScreen('yoga-breath-settings');

  // Handler to go back to Yoga Breath Timer from settings
  const goBackToYoga = () => setScreen('yoga-breath-timer');

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      {screen === 'dashboard' && <Dashboard onSelectFeature={handleSelectFeature} />}
      {screen === 'yoga-breath-timer' && (
        <HomeScreen onConfigureSession={goToYogaSettings} onHome={goHome} />
      )}
      {screen === 'yoga-breath-settings' && (
        <SettingsScreen onBack={goBackToYoga} />
      )}
      {screen === 'stopwatch' && <Stopwatch onBack={goHome} />}
      {screen === 'countdown-timer' && <CountdownTimer onHome={goHome} />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
});