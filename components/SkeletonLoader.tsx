import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width || '100%',
          height: height || 20,
          borderRadius,
          backgroundColor: theme === 'dark' ? '#1E293B' : '#E2E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonLoader width={150} height={24} style={{ marginBottom: 10 }} />
      <SkeletonLoader width={100} height={16} style={{ marginBottom: 30 }} />
      
      <SkeletonLoader height={120} borderRadius={24} style={{ marginBottom: 30 }} />
      
      <View style={{ gap: 12 }}>
        <SkeletonLoader height={70} borderRadius={16} />
        <SkeletonLoader height={70} borderRadius={16} />
        <SkeletonLoader height={70} borderRadius={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
  },
});
