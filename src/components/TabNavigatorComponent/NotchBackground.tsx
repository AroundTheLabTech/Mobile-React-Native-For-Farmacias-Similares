import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import BackGround from '../../../img/iconos/notch-background.svg';

const { width } = Dimensions.get('window');

const NotchBackground = () => (
  <View style={styles.container}>
    {/* Fondo degradado */}
    <Svg height="70" width={width}>
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="rgba(12, 9, 42, 0.5)" stopOpacity="0.1" />
          <Stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" stopOpacity="0.1s" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height="80" fill="url(#grad)" />
    </Svg>
    {/* SVG que representa el notch */}
    <BackGround style={styles.backgroundSvg} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
  },
  backgroundSvg: {
    position: 'absolute',
    bottom: -125,
  },
});

export default NotchBackground;
