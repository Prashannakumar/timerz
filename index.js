/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initSounds } from './src/utils/soundManager';

initSounds();

AppRegistry.registerComponent(appName, () => App);
