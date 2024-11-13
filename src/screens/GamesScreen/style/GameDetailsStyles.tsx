import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const GameDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  containerMax: {
    backgroundColor: colors.background2,
  },
  containerGameDetails: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    height: '100%',
  },
  containerGoBack: {
    marginTop: spacing.md,
    marginLeft: spacing.lg,
    width: '100%',
    marginBottom: spacing.sm,
  },
  containerCoverImage: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  containerGameInformation: {
    alignItems: 'flex-start',
    width: '100%',
    borderRadius: 50,
    backgroundColor: colors.background3,
    height: '100%',
    alignContent: 'center',
    padding: spacing.md,
  },
  gameTile: {
    color: colors.secondary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'left',
    width: '90%',
    marginBottom: spacing.md,
    marginLeft: spacing.md,
  },
  containerCurrentGameDetails: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  currentGameDetails: {
    flexDirection: 'row',
    width: '85%',
    borderWidth: 1,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: colors.background7,
    borderRadius: 15,
    height: spacing.xxl,
    paddingVertical: spacing.sm,
  },
  currentGameText: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.secondary,
  },
  line: {
    height: '100%',
    backgroundColor: '#ccc',
    width: 1,
  },
  gameDescription: {
    color: colors.secondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
  },
  playGameButton: {
    borderWidth: 1,
    borderColor: colors.background2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    marginTop: spacing.sm,
  },
  playGameButtonText: {
    color: colors.third,
    fontSize: fontSizes.sm,
  },
});

export default GameDetailsStyles;
