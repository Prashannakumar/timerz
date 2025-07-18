import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Ionicons from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from './src/constants';
import React from 'react';
import { StyleSheet } from 'react-native';

import HeaderSettingsButton from './src/components/HeaderSettingsButton.tsx';

const Stack = createStackNavigator();

const SettingsButton = ({ navigation }: { navigation: any }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Settings')}
    style={styles.settingsButton}
  >
    <Icon name="settings" size={24} color={COLORS.text} />
  </TouchableOpacity>
);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <HeaderSettingsButton onPress={() => navigation.navigate('Settings')} />
              ),
            })}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'App Settings' }}
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