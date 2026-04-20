import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const GameDetailsSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width="100%" height={240} borderRadius={20} />
    <Skeleton width="70%" height={28} />
    <Skeleton width="100%" height={14} />
    <Skeleton width="95%" height={14} />
    <Skeleton width="80%" height={14} />
    <Skeleton width="100%" height={52} borderRadius={26} style={styles.cta} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    padding: 20,
    gap: 12,
  },
  cta: {
    marginTop: 24,
  },
});

export default GameDetailsSkeleton;
