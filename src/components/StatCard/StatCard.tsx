import React from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { darkTheme } from '../../theme/colors';
import { useFadeInUp } from '../../utils/animations';

type StatCardProps = {
  icon: IconDefinition;
  value: string;
  label: string;
  accentColor: string;
  delay?: number;
};

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accentColor, delay = 0 }) => {
  const animStyle = useFadeInUp(delay);

  return (
    <Animated.View style={[styles.card, { opacity: animStyle.opacity, transform: animStyle.transform }]}>
      <View style={[styles.iconWrapper, { backgroundColor: accentColor + '20' }]}>
        <FontAwesomeIcon icon={icon} size={20} color={accentColor} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: darkTheme.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: darkTheme.border,
    padding: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '800',
    color: darkTheme.textPrimary,
  },
  label: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 11,
    fontWeight: '600',
    color: darkTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatCard;
