import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants';

interface TimerDisplayProps {
  timeRemaining: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 48, fontWeight: 'bold', color: COLORS.text }}>
        {formatTime(timeRemaining)}
      </Text>
    </View>
  );
};

export default TimerDisplay;