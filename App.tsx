import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BreathVisualizer from './src/components/BreathVisualizer'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Ionicons from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from './src/constants';
import React from 'react';
import { StyleSheet } from 'react-native';

import HeaderSettingsButton from './src/components/HeaderSettingsButton.tsx';
// import BreathGraphEditor from './src/components/BreathGraphEditor';
// import ConfigurationPanel from './src/components/ConfigurationPanel';
// import ControlButtons from './src/components/ControlButtons';
// import PhaseTimeEditor from './src/components/PhaseTimeEditor';
// import PresetSelector from './src/components/PresetSelector';
// import ProgressIndicators from './src/components/ProgressIndicators';
// import StepperInput from './src/components/StepperInput';
// import TimerDisplay from './src/components/TimerDisplay';
import ConfigurationScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

const SettingsButton = ({ navigation }: { navigation: any }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Settings')}
    style={styles.settingsButton}
  >
    <Icon name="settings" size={24} color={COLORS.text} />
  </TouchableOpacity>
);

const renderHeaderRight = (navigation: any) => (
  <HeaderSettingsButton onPress={() => navigation.navigate('Settings')} />
);

// Wrapper for BreathVisualizer
const BreathVisualizerScreen = ({ route }: { route: any }) => {
  const { currentPhase, progress } = route.params || { currentPhase: 'Inhale', progress: 1 };
  return <BreathVisualizer currentPhase={currentPhase} progress={progress} />;
};

// Wrapper for HeaderSettingsButton
const HeaderSettingsButtonScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { onPress } = route.params || {};
  return <HeaderSettingsButton onPress={onPress || (() => navigation.navigate('Settings'))} />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerRight: () => renderHeaderRight(navigation),
            })}
          />
          <Stack.Screen
            name="Settings"
            component={ConfigurationScreen}
            options={{ title: 'Configure Session' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  settingsButton: {
    marginRight: 15,
  },
});