import React from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { darkTheme } from '../../theme/colors';
import { usePressScale } from '../../utils/animations';

type TipBannerProps = {
  onAction: () => void;
};

const TIPS = [
  'Juega todos los dias para mantener tu racha y ganar bonificaciones extra.',
  'Compite con tus amigos para subir en el ranking mundial.',
  'Cada nivel desbloquea nuevos logros. Sigue jugando!',
  'Intenta todos los juegos para maximizar tu puntaje total.',
];

const TipBanner: React.FC<TipBannerProps> = ({ onAction }) => {
  const today = new Date().getDate();
  const tip = TIPS[today % TIPS.length];
  const btnPress = usePressScale();

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>{'💡'}</Text>
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.bold}>Consejo: </Text>
          {tip}
        </Text>
      </View>
      <TouchableWithoutFeedback
        onPress={onAction}
        onPressIn={btnPress.onPressIn}
        onPressOut={btnPress.onPressOut}
      >
        <Animated.View style={[styles.action, { transform: [{ scale: btnPress.scale }] }]}>
          <Text style={styles.actionText}>Vamos!</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(6,182,212,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 10,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  text: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 13,
    color: darkTheme.textSecondary,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: darkTheme.textPrimary,
  },
  action: {
    backgroundColor: 'rgba(6,182,212,0.20)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionText: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.cyan,
  },
});

export default TipBanner;
