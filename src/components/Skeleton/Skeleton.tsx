import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

let LinearGradient: any = null;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch {
  // module not linked — skeleton degrades to plain box
}

type Props = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

const Skeleton: React.FC<Props> = ({ width, height, borderRadius = 8, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 400],
  });

  return (
    <View
      style={[
        styles.base,
        { width: width as any, height, borderRadius },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX }] },
        ]}
      >
        {LinearGradient ? (
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.fallbackHighlight]} />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  fallbackHighlight: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    width: 80,
  },
});

export default Skeleton;
