import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

interface StepperInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const StepperInput: React.FC<StepperInputProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange 
}) => {
  const handleIncrement = () => {
    if (value < max) onChange(value + step);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - step);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepper}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleDecrement}
          disabled={value <= min}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleIncrement}
          disabled={value >= max}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  value: {
    marginHorizontal: 15,
    fontSize: 18,
    color: COLORS.text,
  },
});

export default StepperInput;