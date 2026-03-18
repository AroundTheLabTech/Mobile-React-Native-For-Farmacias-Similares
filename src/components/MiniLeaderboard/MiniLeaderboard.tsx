import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { darkTheme } from '../../theme/colors';
import { TTopTwenty } from '../../types/user';
import { getAvatarSource } from '../../utils/avatars';
import { useFadeInUp, usePressScale } from '../../utils/animations';

type MiniLeaderboardProps = {
  users: TTopTwenty[];
  currentUid?: string;
  onViewMore: () => void;
};

const MEDAL_CONFIG: Record<number, { emoji: string; color: string; glowColor: string }> = {
  1: { emoji: '\u{1F947}', color: darkTheme.gold, glowColor: 'rgba(255,215,0,0.15)' },
  2: { emoji: '\u{1F948}', color: darkTheme.silver, glowColor: 'rgba(192,192,192,0.12)' },
  3: { emoji: '\u{1F949}', color: darkTheme.bronze, glowColor: 'rgba(205,127,50,0.12)' },
};

type AnimatedRowProps = {
  user: TTopTwenty;
  index: number;
  currentUid?: string;
};

const AnimatedRow: React.FC<AnimatedRowProps> = ({ user, index, currentUid }) => {
  const anim = useFadeInUp(index * 80);
  const position = index + 1;
  const isMe = user.uid === currentUid;
  const medal = MEDAL_CONFIG[position];
  const isTop3 = position <= 3;
  const avatarSize = isTop3 ? 44 : 38;

  return (
    <Animated.View
      style={[
        styles.row,
        isMe && styles.rowHighlight,
        isTop3 && { backgroundColor: medal.glowColor },
        { opacity: anim.opacity, transform: anim.transform },
      ]}
    >
      {isTop3 ? (
        <View style={[styles.medalCircle, { borderColor: medal.color }]}>
          <Text style={styles.medalEmoji}>{medal.emoji}</Text>
        </View>
      ) : (
        <View style={styles.rankCircle}>
          <Text style={styles.rankNumber}>{position}</Text>
        </View>
      )}

      <View
        style={[
          styles.avatarWrapper,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            borderColor: isTop3 ? medal.color : 'transparent',
            borderWidth: isTop3 ? 2 : 0,
          },
        ]}
      >
        <Image
          source={getAvatarSource(user.profile_mini_pictures_url)}
          style={{
            width: avatarSize - (isTop3 ? 4 : 0),
            height: avatarSize - (isTop3 ? 4 : 0),
            borderRadius: avatarSize / 2,
          }}
          resizeMode="cover"
        />
      </View>

      <View style={styles.nameSection}>
        <Text
          style={[styles.username, isMe && styles.usernameHighlight]}
          numberOfLines={1}
        >
          {user.username || 'Jugador'}
        </Text>
        {isMe && (
          <View style={styles.youBadge}>
            <Text style={styles.youBadgeText}>T\u00fa</Text>
          </View>
        )}
      </View>

      <Text style={[styles.score, isTop3 && { color: medal.color }]}>
        {(user.total_score || 0).toLocaleString()}
      </Text>
    </Animated.View>
  );
};

const MiniLeaderboard: React.FC<MiniLeaderboardProps> = ({ users, currentUid, onViewMore }) => {
  const top5 = users.slice(0, 5);
  const btnPress = usePressScale();

  if (top5.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🏆</Text>
        <Text style={styles.emptyText}>Aun no hay jugadores en el ranking</Text>
        <Text style={styles.emptySubtext}>¡Juega para ser el primero!</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Rows */}
      <View style={styles.listContainer}>
        {top5.map((user, idx) => (
          <AnimatedRow
            key={user.uid || `pos-${idx}`}
            user={user}
            index={idx}
            currentUid={currentUid}
          />
        ))}
      </View>

      {/* View more */}
      <TouchableWithoutFeedback
        onPress={onViewMore}
        onPressIn={btnPress.onPressIn}
        onPressOut={btnPress.onPressOut}
      >
        <Animated.View style={[styles.viewMore, { transform: [{ scale: btnPress.scale }] }]}>
          <Text style={styles.viewMoreText}>Ver ranking completo</Text>
          <FontAwesomeIcon icon={faChevronRight} size={12} color={darkTheme.cyan} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.textSecondary,
  },
  emptySubtext: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 12,
    color: darkTheme.textMuted,
  },
  listContainer: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 12,
  },
  rowHighlight: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
  },

  /* Position indicators */
  medalCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  medalEmoji: {
    fontSize: 16,
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  rankNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: darkTheme.textMuted,
  },

  /* Avatar */
  avatarWrapper: {
    overflow: 'hidden',
    backgroundColor: darkTheme.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Name */
  nameSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.textSecondary,
    flexShrink: 1,
  },
  usernameHighlight: {
    color: darkTheme.textPrimary,
    fontWeight: '700',
  },
  youBadge: {
    backgroundColor: 'rgba(124,58,237,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  youBadgeText: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 10,
    fontWeight: '700',
    color: darkTheme.purple,
  },

  /* Score */
  score: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    fontWeight: '800',
    color: darkTheme.textMuted,
    minWidth: 50,
    textAlign: 'right',
  },

  /* Footer */
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
  },
  viewMoreText: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.cyan,
  },
});

export default MiniLeaderboard;
