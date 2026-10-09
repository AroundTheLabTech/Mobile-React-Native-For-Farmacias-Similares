import { StyleSheet } from 'react-native';
import { darkTheme } from '../../../theme/colors';

const LeaderBoardCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: 'transparent',
    gap: 10,
  },
  currentUserContainer: {
    backgroundColor: 'rgba(124,58,237,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.20)',
  },
  containerPosition: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  position: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    fontWeight: '700',
    color: darkTheme.textMuted,
    textAlign: 'center',
  },
  medal: {
    fontSize: 20,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: darkTheme.border,
  },
  flagPicture: {
    width: 18,
    height: 18,
    borderRadius: 9,
    position: 'absolute',
    bottom: -4,
    right: -6,
  },
  name: {
    flex: 1,
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.textSecondary,
  },
  nameHighlight: {
    color: darkTheme.textPrimary,
    fontWeight: '600',
  },
  points: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: darkTheme.textMuted,
  },
  pointsHighlight: {
    color: darkTheme.purple,
  },
});

export default LeaderBoardCardStyles;
