import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { COLORS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BreathVisualizer = ({ currentPhase, progress }: { currentPhase: string, progress: number }) => {
  const radius = useSharedValue(40 * progress);
  const iconScale = useSharedValue(0.8 + 0.4 * progress); // scale from 0.8 to 1.2

  const animatedProps = useAnimatedProps(() => {
    return {
      r: withTiming(radius.value, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      }),
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(iconScale.value, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        }),
      },
    ],
  }));

  React.useEffect(() => {
    radius.value = 40 * progress;
    iconScale.value = 0.8 + 0.4 * progress;
  }, [progress]);

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width={200} height={200} viewBox="0 0 100 100">
          <Circle cx={50} cy={50} r={40} fill={COLORS.primary} opacity={0.2} />
          <AnimatedCircle 
            cx={50} 
            cy={50} 
            animatedProps={animatedProps}
            fill={COLORS.primary} 
          />
        </Svg>
        {/* Animated Feather Icon */}
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]} pointerEvents="none">
          <Ionicons name="leaf-outline" size={54} color="#4CAF50" />
        </Animated.View>
      </View>
      <Text style={styles.phaseText}>{currentPhase}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  svgContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 24,
    color: COLORS.text,
    marginTop: 16,
    fontWeight: '600',
  },
});

export default BreathVisualizer;