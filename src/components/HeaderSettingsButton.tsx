import React from 'react';
import { TouchableOpacity } from 'react-native';
// import Ionicons from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

const HeaderSettingsButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{ marginRight: 15 }}
  >
    <Icon name="settings" size={24} color={COLORS.text} />
  </TouchableOpacity>
);

export default HeaderSettingsButton;