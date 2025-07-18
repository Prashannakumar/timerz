import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { COLORS } from '../../constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BreathVisualizer = ({ currentPhase, progress }: { currentPhase: string, progress: number }) => {
  const radius = useSharedValue(40 * progress);

  const animatedProps = useAnimatedProps(() => {
    return {
      r: withTiming(radius.value, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      }),
    };
  });

  React.useEffect(() => {
    radius.value = 40 * progress;
  }, [progress]);

  return (
    <View style={styles.container}>
      <Svg width={200} height={200} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={40} fill={COLORS.primary} opacity={0.2} />
        <AnimatedCircle 
          cx={50} 
          cy={50} 
          animatedProps={animatedProps}
          fill={COLORS.primary} 
        />
      </Svg>
      <Text style={styles.phaseText}>{currentPhase}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  phaseText: {
    fontSize: 24,
    color: COLORS.text,
    marginTop: 16,
    fontWeight: '600',
  },
});

export default BreathVisualizer;