import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Safe easing functions that work on all RN versions + Hermes
const easeOut = Easing.out(Easing.ease);
const easeInOut = Easing.inOut(Easing.ease);

/**
 * Fade-in from below with configurable delay. Used for staggered section entry.
 * @param delay  ms before animation starts
 * @param enabled  when false, values stay at 0/hidden; animation fires when flipped to true
 */
export function useFadeInUp(delay = 0, enabled = true) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (!enabled) return;

    // Reset in case enabled toggles after initial mount
    opacity.setValue(0);
    translateY.setValue(24);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        easing: easeOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, [enabled, delay, opacity, translateY]);

  return { opacity, transform: [{ translateY }] };
}

/**
 * Looping pulse glow (opacity oscillation). Used for level ring glow & trophy icons.
 */
export function usePulseGlow(min = 0.3, max = 0.7, duration = 2500) {
  const value = useRef(new Animated.Value(min)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: max,
          duration: duration / 2,
          easing: easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: min,
          duration: duration / 2,
          easing: easeInOut,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, min, max, duration]);

  return value;
}

/**
 * Animated progress bar width. Animates from 0 to targetPercent on mount.
 * Returns a value 0-100 that can be interpolated to width%.
 * NOTE: width animation cannot use native driver, so we use JS driver.
 */
export function useProgressBar(targetPercent: number, duration = 800, delay = 300) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: targetPercent,
      duration,
      delay,
      easing: easeOut,
      useNativeDriver: false, // width animation
    }).start();
  }, [value, targetPercent, duration, delay]);

  return value;
}

/**
 * Press scale animation for buttons. Returns scale value + pressIn/pressOut handlers.
 */
export function usePressScale(pressedScale = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: pressedScale,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return { scale, onPressIn, onPressOut };
}

/**
 * Bouncy pop-in from scale 0 → 1 with spring physics.
 * Great for cards, badges, trophies appearing on screen.
 */
export function useBounceIn(delay = 0, enabled = true) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    scale.setValue(0);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        delay,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        speed: 12,
        bounciness: 14,
      }),
    ]).start();
  }, [enabled, delay, scale, opacity]);

  return { opacity, transform: [{ scale }] };
}

/**
 * Wiggle/shake animation — plays once. Good for error states or attention grabbers.
 */
export function useWiggle() {
  const rotate = useRef(new Animated.Value(0)).current;

  const wiggle = () => {
    rotate.setValue(0);
    Animated.sequence([
      Animated.timing(rotate, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const interpolated = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  return { transform: [{ rotate: interpolated }], wiggle };
}
