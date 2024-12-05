import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Dimensions, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../../../../global-class';

const MountainGripSVG = () => {
  return (
    <View style={styles.container}>
      <Svg height="40" width="15%">
        <Path
          d="M0,31 L10,31 32,18 10,31 L25,31"
          fill="none"
          stroke={colors.background7}
          strokeWidth="5"
        />
        <Path
          d="M31,18 L31,20 31,20 50,31 L60,31"
          fill="none"
          stroke={colors.background7}
          strokeWidth="5"
        />
        <Path
          d="
            M 30, 20
            A 7, 7 0 1, 0 31, 20
          "
          fill="none"
          stroke={colors.background7}
          strokeWidth="7"
        />
        <Path
          d="M0,35 L10,35 Q30,0 55,35 L60,35"
          fill="none"
          stroke="none"
          strokeWidth="5"
        />
      </Svg>
    </View>
  );
};

const { height: screenHeight } = Dimensions.get('window');
const INITIAL_POSITION = screenHeight * 0.65;
const MAX_DRAG_POSITION = screenHeight * 0.15;
const MIN_DRAG_POSITION = screenHeight * 0.68;
const GRIP_HEIGHT = 40; // Altura de la sección superior para activar el arrastre

interface DraggableMenuProps {
  children: ReactNode;
}

const DraggableMenu: React.FC<DraggableMenuProps> = ({ children }) => {
  const panY = useRef(new Animated.Value(INITIAL_POSITION)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const [move, setMove] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e) => {
      return e.nativeEvent.pageY < MAX_DRAG_POSITION + GRIP_HEIGHT && scrollEnabled;
    },
    onMoveShouldSetPanResponder: (e, gestureState) => {
      // Asegura que solo el movimiento vertical activa el PanResponder
      if (e.nativeEvent.pageY > INITIAL_POSITION - GRIP_HEIGHT && e.nativeEvent.pageY < INITIAL_POSITION + GRIP_HEIGHT) {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      } else {
        return false;
      }
    },
    onPanResponderMove: (e, gestureState) => {
      // Mueve el menú verticalmente solo si está en el área permitida
      if (e.nativeEvent.pageY >= MAX_DRAG_POSITION - 20) {
        setMove(true);
        const newY = Math.min(Math.max(MAX_DRAG_POSITION, INITIAL_POSITION + gestureState.dy), MIN_DRAG_POSITION);
        panY.setValue(newY);
      } else {
        setMove(false);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      // Verifica la posición final del menú
      if (move) {
        const finalPosition = gestureState.moveY < screenHeight * 0.65 ? MAX_DRAG_POSITION : INITIAL_POSITION;
        setScrollEnabled(finalPosition === MAX_DRAG_POSITION); // Habilita el scroll solo cuando está en MAX_DRAG_POSITION
        Animated.spring(panY, {
          toValue: finalPosition,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  useEffect(() => {
    if (!scrollEnabled) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [scrollEnabled]);

  return (
    <Animated.View
      style={[
        styles.draggableContainer,
        { transform: [{ translateY: panY }] },
      ]}
      {...panResponder.panHandlers}
    >
      <MountainGripSVG />
      <ScrollView
        style={styles.scrollViewStyle}
        scrollEnabled={scrollEnabled} // Controla si el scroll está habilitado
        nestedScrollEnabled={true}
        ref={scrollViewRef}
      >
        <View style={{ marginTop: spacing.sm, marginBottom: spacing.sm }}>
          {children}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    width: '90%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    top: -11,
    height: 5,
  },
  draggableContainer: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.background7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: '95%',
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
});

export default DraggableMenu;
