import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const LeaderboardSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={200} height={28} borderRadius={6} />
    <Skeleton width="100%" height={40} borderRadius={12} />
    {Array.from({ length: 10 }).map((_, i) => (
      <View key={i} style={styles.row}>
        <Skeleton width={32} height={14} />
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.rowText}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="40%" height={12} />
        </View>
        <Skeleton width={60} height={18} borderRadius={6} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowText: {
    flex: 1,
    gap: 6,
  },
});

export default LeaderboardSkeleton;
