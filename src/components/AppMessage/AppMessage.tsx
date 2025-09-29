import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const AppMessage = ({ type = 'info', message, onHide, duration = 3000 }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const opacity = new Animated.Value(0);

  useEffect(() => {
    // Animación de fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto ocultar después del tiempo definido
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide?.());
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onHide, opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        styles[type],
        { opacity },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    left: 20,
    right: 20,
    elevation: 10, // Android
    zIndex: 9999,  // iOS y Android
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  success: {
    backgroundColor: '#4caf50',
  },
  error: {
    backgroundColor: '#f44336',
  },
  info: {
    backgroundColor: '#2196f3',
  },
});

export default AppMessage;
