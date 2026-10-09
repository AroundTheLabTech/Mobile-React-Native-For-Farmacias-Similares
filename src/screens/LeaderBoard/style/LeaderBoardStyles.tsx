import { StyleSheet } from 'react-native';
import { darkTheme } from '../../../theme/colors';

const LeaderBoardStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
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
  containerScroll: {
    flex: 1,
  },
  containerFull: {
    flex: 1,
    flexDirection: 'row',
  },
  userLeaderboard: {
    flex: 1,
    height: 700,
  },
  containerTitle: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 14,
    backgroundColor: darkTheme.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: darkTheme.border,
    padding: 3,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 11,
  },
  filterButtonActive: {
    backgroundColor: darkTheme.purple,
  },
  filterText: {
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 13,
    fontWeight: '500',
    color: darkTheme.textMuted,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  containerPosition: {
    backgroundColor: darkTheme.bgCard,
    borderWidth: 1,
    borderColor: darkTheme.border,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionNumber: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: darkTheme.purple,
    borderRadius: 12,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginRight: 12,
    textAlign: 'center',
    overflow: 'hidden',
  },
  positionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.textSecondary,
    flex: 1,
    fontFamily: 'Inter-VariableFont_opsz,wght',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: darkTheme.textMuted,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Inter-VariableFont_opsz,wght',
  },
  playersSection: {
    backgroundColor: darkTheme.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: darkTheme.border,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  containerPlayersList: {
    flex: 1,
    height: 700,
  },
  containerPlayersList9Inches: {
    flex: 1,
    height: 1250,
  },
  playersList: {
    backgroundColor: darkTheme.bgCard,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: darkTheme.border,
    height: '100%',
  },
  space: {
    height: 40,
  },
  leaderBoardContainer: {
    paddingBottom: 20,
  },
});

export default LeaderBoardStyles;
