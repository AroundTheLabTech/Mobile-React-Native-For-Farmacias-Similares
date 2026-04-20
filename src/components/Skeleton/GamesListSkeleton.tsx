import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 10;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

const GamesListSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={180} height={28} borderRadius={6} style={styles.title} />
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          borderRadius={16}
          style={styles.card}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 24,
  },
  title: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    marginBottom: CARD_GAP,
  },
});

export default GamesListSkeleton;
