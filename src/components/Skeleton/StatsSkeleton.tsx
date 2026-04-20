import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const StatsSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width="100%" height={44} borderRadius={12} />
    <Skeleton width="100%" height={220} borderRadius={16} />
    <View style={styles.row}>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} width="30%" height={70} borderRadius={12} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default StatsSkeleton;
