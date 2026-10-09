import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { getUserLevel, getLevelProgress, LEVELS } from '../../utils/levels';
import { usePulseGlow, useProgressBar } from '../../utils/animations';
import { darkTheme } from '../../theme/colors';

type LevelRingProps = {
  score: number;
};

const RING_SIZE = 110;
const RING_RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const LevelRing: React.FC<LevelRingProps> = ({ score }) => {
  const level = getUserLevel(score);
  const progress = getLevelProgress(score);
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  const nextLevel = LEVELS.find(l => l.level === level.level + 1);
  const isMaxLevel = !nextLevel;
  const remaining = nextLevel ? nextLevel.minScore - score : 0;

  const glowOpacity = usePulseGlow(0.2, 0.5, 2500);
  const barProgress = useProgressBar(progress);

  const barWidth = barProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Ring section */}
      <View style={styles.ringWrapper}>
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: level.color,
              opacity: glowOpacity,
            },
          ]}
        />
        <Svg viewBox="0 0 100 100" width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <Circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke={level.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
          <SvgText
            x="50"
            y="50"
            textAnchor="middle"
            alignmentBaseline="central"
            fontSize="28"
            fontWeight="700"
            fill={level.color}
            fontFamily="PressStart2P-Regular"
          >
            {level.level}
          </SvgText>
        </Svg>
      </View>

      {/* Info section */}
      <View style={styles.infoSection}>
        <Text style={[styles.levelName, { color: level.color }]}>
          {level.name}
        </Text>

        {/* XP progress bar */}
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: barWidth,
                backgroundColor: level.color,
              },
            ]}
          />
        </View>

        {/* XP count */}
        <Text style={styles.xpText}>
          {isMaxLevel
            ? `${score.toLocaleString()} XP`
            : `${score.toLocaleString()} / ${nextLevel.minScore.toLocaleString()} XP`}
        </Text>

        {/* XP remaining or max level label */}
        <Text style={styles.xpRemaining}>
          {isMaxLevel
            ? 'Nivel m\u00e1ximo'
            : `${remaining.toLocaleString()} XP para ${nextLevel.name}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
  },
  infoSection: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  levelName: {
    fontSize: 20,
    fontFamily: 'PressStart2P-Regular',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 13,
    color: darkTheme.textMuted,
    marginBottom: 2,
  },
  xpRemaining: {
    fontSize: 11,
    color: darkTheme.textMuted,
  },
});

export default LevelRing;
