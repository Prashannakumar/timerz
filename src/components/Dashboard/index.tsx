import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FEATURES = [
  {
    key: 'yoga-breath-timer',
    label: 'Yoga Breath Timer',
    icon: 'leaf-outline',
    color: '#4CAF50',
  },
  {
    key: 'stopwatch',
    label: 'Stopwatch',
    icon: 'timer-outline',
    color: '#2196F3',
  },
];

export default function Dashboard({ onSelectFeature }: { onSelectFeature: (feature: string) => void }) {
  return (
    <View style={styles.container}>
      {FEATURES.map((feature) => (
        <TouchableOpacity
          key={feature.key}
          style={[styles.card, { backgroundColor: feature.color }]}
          onPress={() => onSelectFeature(feature.key)}
        >
          <Icon name={feature.icon} size={40} color="#fff" style={styles.icon} />
          <Text style={styles.label}>{feature.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: 250,
    height: 120,
    borderRadius: 16,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginBottom: 12,
  },
  label: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 