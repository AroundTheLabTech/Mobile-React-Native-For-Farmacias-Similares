import React, { useMemo } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { darkTheme } from '../../theme/colors';
import { useBounceIn } from '../../utils/animations';

const TROPHY_INFO = [
  { key: 'medal1', name: 'Primera sesion', description: 'Jugaste tu primer juego', icon: '\uD83C\uDFAE' },
  { key: 'medal2', name: '3 dias seguidos', description: 'Racha de 3 dias', icon: '\uD83D\uDD25' },
  { key: 'medal3', name: 'Primera competencia', description: 'Entraste a una competencia', icon: '\u2694\uFE0F' },
  { key: 'medal4', name: '10 partidas', description: 'Jugaste 10 veces', icon: '\uD83C\uDFAF' },
  { key: 'medal5', name: 'Top 10', description: 'Entraste al top 10', icon: '\uD83D\uDC51' },
  { key: 'medal6', name: '100 partidas', description: '100 sesiones jugadas', icon: '\uD83D\uDC8E' },
];

type TrophyGridProps = {
  badges: string[];
  totalGames: number;
  ranking: number | null;
  streak: number;
};

type TrophyItemProps = {
  trophy: typeof TROPHY_INFO[number];
  unlocked: boolean;
  index: number;
};

const TrophyItem: React.FC<TrophyItemProps> = ({ trophy, unlocked, index }) => {
  const anim = useBounceIn(index * 100);
  return (
    <Animated.View
      style={[
        styles.trophyItem,
        unlocked ? styles.trophyUnlocked : styles.trophyLocked,
        { opacity: anim.opacity, transform: anim.transform },
      ]}
    >
      <View style={[styles.iconCircle, unlocked ? styles.iconCircleUnlocked : styles.iconCircleLocked]}>
        <Text style={[styles.trophyIcon, !unlocked && styles.trophyIconLocked]}>
          {trophy.icon}
        </Text>
      </View>
      <View style={styles.trophyTextWrapper}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.trophyName, !unlocked && styles.trophyNameLocked]}
            numberOfLines={1}
          >
            {trophy.name}
          </Text>
          <Text style={styles.statusIcon}>{unlocked ? '\u2705' : '\uD83D\uDD12'}</Text>
        </View>
        <Text
          style={[styles.trophyDesc, !unlocked && styles.trophyDescLocked]}
          numberOfLines={1}
        >
          {trophy.description}
        </Text>
      </View>
    </Animated.View>
  );
};

const TrophyGrid: React.FC<TrophyGridProps> = ({ badges, totalGames, ranking, streak }) => {
  const unlockedKeys = useMemo(() => {
    const keys = new Set<string>(badges);

    // Auto-unlock logic
    if (totalGames >= 1) keys.add('medal1');
    if (streak >= 3) keys.add('medal2');
    if (totalGames >= 10) keys.add('medal4');
    if (ranking != null && ranking > 0 && ranking <= 10) keys.add('medal5');
    if (totalGames >= 100) keys.add('medal6');

    return keys;
  }, [badges, totalGames, ranking, streak]);

  const unlockedCount = TROPHY_INFO.filter(t => unlockedKeys.has(t.key)).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{'\uD83C\uDFC6'}</Text>
          <Text style={styles.headerTitle}>Tus Logros</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{unlockedCount}/6</Text>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {TROPHY_INFO.map((trophy, idx) => (
          <TrophyItem
            key={trophy.key}
            trophy={trophy}
            unlocked={unlockedKeys.has(trophy.key)}
            index={idx}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: darkTheme.textPrimary,
  },
  countPill: {
    backgroundColor: darkTheme.purple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // Trophy item
  trophyItem: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  trophyUnlocked: {
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderColor: 'rgba(124,58,237,0.15)',
  },
  trophyLocked: {
    backgroundColor: darkTheme.bgCard,
    borderColor: darkTheme.border,
  },

  // Icon circle
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleUnlocked: {
    backgroundColor: 'rgba(124,58,237,0.12)',
  },
  iconCircleLocked: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  trophyIcon: {
    fontSize: 20,
  },
  trophyIconLocked: {
    opacity: 0.3,
  },

  // Text
  trophyTextWrapper: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  trophyName: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    fontWeight: '700',
    color: darkTheme.textPrimary,
    flex: 1,
  },
  trophyNameLocked: {
    color: darkTheme.textMuted,
  },
  statusIcon: {
    fontSize: 12,
  },
  trophyDesc: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 11,
    fontWeight: '500',
    color: darkTheme.textSecondary,
    lineHeight: 15,
  },
  trophyDescLocked: {
    color: darkTheme.textMuted,
  },
});

export default TrophyGrid;
