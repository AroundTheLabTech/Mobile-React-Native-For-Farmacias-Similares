import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import BackGround from '../../../img/iconos/notch-background.svg';
import BackGroundLandscape from '../../../img/iconos/notch-background-landscape.svg';


const NotchBackground = () => {

  const [orientation, setOrientation] = useState('portrait');
  const [screenWidth, setScreenWidth] = useState<number>();

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
      setScreenWidth(width);
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, [screenWidth, orientation]);

  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <Svg height="70" width={screenWidth}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(12, 9, 42, 0.5)" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" stopOpacity="0.1s" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={screenWidth} height="80" fill="url(#grad)" />
      </Svg>
      {/* SVG que representa el notch */}
      {
        orientation === 'landscape' ?
          <BackGroundLandscape style={styles.backgroundLandscape} width={'500%'} />
          :
          <BackGround style={styles.backgroundSvg} height={'240%'} width={'110%'} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
  },
  backgroundSvg: {
    position: 'absolute',
    bottom: -50,
  },
  backgroundLandscape: {
    position: 'absolute',
    bottom: -150,
  },
});

export default NotchBackground;
