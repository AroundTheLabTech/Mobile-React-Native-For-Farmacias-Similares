import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoaderProps {
  message?: string; // Mensaje opcional
  visible: boolean; // Controlar si se muestra o no el loader
  size?: 'small' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ message = 'Cargando...', visible, size = "large" }) => {
  if (!visible) {return null;}

  return (
    <View style={styles.container}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size={size} color="#6200EE" />
        <Text style={styles.loaderText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  loaderBox: {
    padding: 20,
    // backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default Loader;
