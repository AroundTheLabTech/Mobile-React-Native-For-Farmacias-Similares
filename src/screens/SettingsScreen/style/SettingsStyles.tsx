import { StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '../../../../global-class';

const SettingsStyles = StyleSheet.create({
  // ─── 1. Container & Header ────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: colors.darkPurpleBg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
    marginLeft: 12,
  },

  // ─── 2. Profile Hero Section ──────────────────────────────────────────
  profileHero: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.cyan,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
  },
  userName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  levelBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 8,
  },

  // ─── 3. Game Card (credit card design) ────────────────────────────────
  gameCardOuter: {
    marginBottom: spacing.lg,
  },
  gameCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#2D1B69',
    minHeight: 180,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  gameCardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  gameCardLabel: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: fonts.bold,
  },
  gameCardChipContainer: {
    marginVertical: 12,
  },
  gameCardName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.primary,
  },
  gameCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  gameCardNumber: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
  },
  gameCardScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  gameCardScore: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#FFD700',
  },

  // ─── 4. Section Cards ─────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  sectionIcon: {
    fontSize: 18,
  },

  // ─── 5. Info Grid (personal info) ─────────────────────────────────────
  infoGrid: {
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
    fontFamily: fonts.bold,
  },
  infoValue: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.inter,
  },
  infoInput: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.inter,
    borderBottomWidth: 1,
    borderBottomColor: colors.cyan,
    paddingVertical: 4,
  },
  editButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── 6. Avatar Grid ───────────────────────────────────────────────────
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  avatarOption: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  avatarOptionSelected: {
    borderColor: colors.cyan,
    elevation: 4,
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  selectedCheck: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.cyan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  saveAvatarButton: {
    backgroundColor: colors.cyan,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveAvatarButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primary,
  },

  // ─── 7. Settings List (account section) ───────────────────────────────
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingName: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.inter,
  },
  settingDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadgeText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
  },

  // ─── 8. Logout ────────────────────────────────────────────────────────
  logoutButton: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#EF4444',
  },
});

export default SettingsStyles;
