import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS } from '../../constants';
import { useTimerStore } from '../../store/useTimerStore';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 40;
const GRAPH_HEIGHT = 200;
const POINT_RADIUS = 12;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BreathGraphEditor = () => {
  const { pattern, updatePhaseDuration } = useTimerStore();
  
  // Convert pattern to graph points
  const points = pattern.reduce((acc, phase, index) => {
    const x = (index / (pattern.length - 1)) * GRAPH_WIDTH;
    const y = GRAPH_HEIGHT - (phase.duration / 30) * GRAPH_HEIGHT;
    return [...acc, { x, y, duration: phase.duration }];
  }, [] as {x: number, y: number, duration: number}[]);

  const onPointDrag = (index: number) => {
    return useAnimatedGestureHandler({
      onActive: (event) => {
        const newY = Math.max(0, Math.min(GRAPH_HEIGHT, event.y));
        const newDuration = Math.round(30 - (newY / GRAPH_HEIGHT) * 30);
        updatePhaseDuration(index, newDuration);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
        {/* X and Y axes */}
        <Path
          d={`M0 ${GRAPH_HEIGHT} H${GRAPH_WIDTH}`}
          stroke={COLORS.text}
          strokeWidth="2"
        />
        <Path
          d={`M0 ${GRAPH_HEIGHT} V0`}
          stroke={COLORS.text}
          strokeWidth="2"
        />
        
        {/* Graph line */}
        <Path
          d={`M${points.map(p => `${p.x} ${p.y}`).join(' L')}`}
          stroke={COLORS.primary}
          strokeWidth="3"
          fill="none"
        />
        
        {/* Control points */}
        {points.map((point, index) => (
          <PanGestureHandler key={index} onGestureEvent={onPointDrag(index)}>
            <AnimatedCircle
              cx={point.x}
              cy={point.y}
              r={POINT_RADIUS}
              fill={COLORS.secondary}
            />
          </PanGestureHandler>
        ))}
        
        {/* Labels */}
        <G>
          {[0, 5, 10, 15, 20, 25, 30].map((sec) => (
            <SvgText
              key={sec}
              x={-20}
              y={GRAPH_HEIGHT - (sec / 30) * GRAPH_HEIGHT + 5}
              fill={COLORS.text}
              fontSize={12}
            >
              {sec}s
            </SvgText>
          ))}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});

export default BreathGraphEditor;