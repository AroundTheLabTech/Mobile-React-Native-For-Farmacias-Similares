// src/components/SimiLoader/SimiLoader.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SIMI_LOADING_MESSAGES } from './messages';

const DOT_COLORS = ['#7C3AED', '#9333EA', '#06B6D4'] as const;
const SIMI_IMG = require('../../../img/personajes/doctor-simi-invade.png');

type SimiLoaderProps = {
  message?: string;
  visible?: boolean;
  fullScreen?: boolean;
  style?: ViewStyle;
};

function useLoop(config: { toValue: number; duration: number; delay?: number }) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: config.toValue,
          duration: config.duration / 2,
          delay: config.delay ?? 0,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: config.duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [config.toValue, config.duration, config.delay, value]);
  return value;
}

const SimiLoader: React.FC<SimiLoaderProps> = ({
  message,
  visible = true,
  fullScreen = true,
  style,
}) => {
  const [displayMessage, setDisplayMessage] = useState<string>(
    message ?? SIMI_LOADING_MESSAGES[0],
  );

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      return;
    }
    const start = Math.floor(Math.random() * SIMI_LOADING_MESSAGES.length);
    setDisplayMessage(SIMI_LOADING_MESSAGES[start]);
    const interval = setInterval(() => {
      setDisplayMessage((prev) => {
        const idx = SIMI_LOADING_MESSAGES.indexOf(prev);
        const next = (idx + 1) % SIMI_LOADING_MESSAGES.length;
        return SIMI_LOADING_MESSAGES[next];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [message]);

  const bounce = useLoop({ toValue: 1, duration: 1000 });
  const shadow = useLoop({ toValue: 1, duration: 1000 });
  const glow = useLoop({ toValue: 1, duration: 1200 });
  const dot0 = useLoop({ toValue: 1, duration: 1400, delay: 0 });
  const dot1 = useLoop({ toValue: 1, duration: 1400, delay: 200 });
  const dot2 = useLoop({ toValue: 1, duration: 1400, delay: 400 });

  const simiTranslate = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const simiScale = bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const shadowScale = shadow.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] });
  const shadowOpacity = shadow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.15] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.35] });
  const dotTranslates = useMemo(
    () => [dot0, dot1, dot2].map((v) => v.interpolate({ inputRange: [0, 1], outputRange: [0, -8] })),
    [dot0, dot1, dot2],
  );

  if (!visible) return null;

  return (
    <View
      style={[
        fullScreen ? styles.fullScreen : styles.inline,
        style,
      ]}
      pointerEvents="none"
    >
      {fullScreen && (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <RadialGradient id="purple" cx="50%" cy="50%" r="60%">
              <Stop offset="0%" stopColor="#7C3AED" stopOpacity={0.15} />
              <Stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="cyan" cx="50%" cy="100%" r="50%">
              <Stop offset="0%" stopColor="#06B6D4" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#purple)" />
          <Rect width="100%" height="100%" fill="url(#cyan)" />
        </Svg>
      )}

      <View style={styles.center}>
        <View style={styles.simiWrapper}>
          <Animated.View
            style={[
              styles.glow,
              { opacity: glowOpacity },
            ]}
          />
          <Animated.View
            style={[
              styles.floorShadow,
              { transform: [{ scaleX: shadowScale }], opacity: shadowOpacity },
            ]}
          />
          <Animated.Image
            source={SIMI_IMG}
            style={[
              styles.simi,
              { transform: [{ translateY: simiTranslate }, { scale: simiScale }] },
            ]}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {displayMessage}
        </Text>

        <View style={styles.dots}>
          {dotTranslates.map((t, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: DOT_COLORS[i], transform: [{ translateY: t }] },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  inline: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  center: {
    alignItems: 'center',
    gap: 32,
  },
  simiWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: '#7C3AED',
  },
  floorShadow: {
    position: 'absolute',
    bottom: -16,
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  simi: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  message: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    minHeight: 28,
    paddingHorizontal: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default SimiLoader;
