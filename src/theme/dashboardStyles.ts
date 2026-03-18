import { StyleSheet } from 'react-native';
import { darkTheme } from './colors';
import { fontSizes, spacing, fonts } from '../../global-class';

const FONT_INTER = 'Inter-VariableFont_opsz,wght';
const FONT_PRESS = 'PressStart2P-Regular';

const dashboardStyles = StyleSheet.create({
  // -- Screen --
  screen: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // -- Glow blobs --
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

  // -- Header --
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontFamily: FONT_INTER,
    fontSize: 15,
    color: darkTheme.textMuted,
    fontWeight: '500',
  },
  username: {
    fontFamily: FONT_INTER,
    fontSize: 24,
    color: darkTheme.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: darkTheme.purple,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: darkTheme.purple,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // -- Glass Card --
  glassCard: {
    backgroundColor: darkTheme.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: darkTheme.border,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
  },
  heroCard: {
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.12)',
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
  },

  // -- Section title --
  sectionTitle: {
    fontFamily: FONT_INTER,
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.textPrimary,
    marginBottom: 14,
  },

  // -- Stats Grid --
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginHorizontal: 20,
    marginTop: 20,
  },

  // -- CTA Button --
  ctaButton: {
    height: 56,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  ctaButtonFallback: {
    backgroundColor: darkTheme.purple,
  },
  ctaText: {
    fontFamily: FONT_INTER,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // -- Tip Banner --
  tipBanner: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontFamily: FONT_INTER,
    fontSize: 13,
    color: darkTheme.textSecondary,
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '700',
    color: darkTheme.textPrimary,
  },
  tipAction: {
    backgroundColor: darkTheme.purple,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tipActionText: {
    fontFamily: FONT_INTER,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // -- Empty State (no games) --
  emptyStateCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: FONT_INTER,
    fontSize: 15,
    color: darkTheme.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: darkTheme.purple,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  emptyStateButtonText: {
    fontFamily: FONT_INTER,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default dashboardStyles;
