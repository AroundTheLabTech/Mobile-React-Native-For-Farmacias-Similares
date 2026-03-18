import { StyleSheet } from 'react-native';
import { darkTheme } from '../../../theme/colors';

const FONT_INTER = 'Inter-VariableFont_opsz,wght';

const profileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Glow blobs
  glowPurple: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: darkTheme.glowPurple,
    opacity: 0.55,
  },
  glowCyan: {
    position: 'absolute',
    bottom: 120,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: darkTheme.glowCyan,
    opacity: 0.35,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: darkTheme.bgCard,
    borderWidth: 1,
    borderColor: darkTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  avatarGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(124,58,237,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: darkTheme.purple,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  userName: {
    fontFamily: FONT_INTER,
    fontSize: 22,
    fontWeight: '700',
    color: darkTheme.textPrimary,
    marginTop: 12,
  },
  userEmail: {
    fontFamily: FONT_INTER,
    fontSize: 13,
    color: darkTheme.textMuted,
    marginTop: 4,
  },

  // Level Card — Full width
  levelCard: {
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.12)',
    padding: 20,
    marginHorizontal: 20,
  },

  // Stats Row — 2 cards
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: darkTheme.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: darkTheme.border,
    padding: 18,
    alignItems: 'center',
    gap: 6,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    fontWeight: '800',
    color: darkTheme.textPrimary,
  },
  statLabel: {
    fontFamily: FONT_INTER,
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Tabs
  tabContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: darkTheme.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: darkTheme.border,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: darkTheme.purple,
  },
  tabText: {
    fontFamily: FONT_INTER,
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.textMuted,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // Content
  contentContainer: {
    marginHorizontal: 20,
  },
});

export default profileStyles;
