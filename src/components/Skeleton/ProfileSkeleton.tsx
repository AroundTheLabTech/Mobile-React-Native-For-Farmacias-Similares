import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const ProfileSkeleton: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Skeleton width={96} height={96} borderRadius={48} />
      <View style={styles.headerText}>
        <Skeleton width={160} height={20} />
        <Skeleton width={120} height={14} />
      </View>
    </View>
    <Skeleton width={180} height={180} borderRadius={90} style={styles.ring} />
    <View style={styles.statsRow}>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} width="22%" height={80} borderRadius={12} />
      ))}
    </View>
    <Skeleton width="100%" height={160} borderRadius={16} style={styles.block} />
    <Skeleton width="100%" height={120} borderRadius={16} style={styles.block} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    gap: 8,
  },
  ring: {
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  block: {
    marginTop: 4,
  },
});

export default ProfileSkeleton;
